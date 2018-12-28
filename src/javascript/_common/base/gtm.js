const Cookies          = require('js-cookie');
const moment           = require('moment');
const ClientBase       = require('./client_base');
const Login            = require('./login');
const ServerTime       = require('./server_time');
const BinarySocket     = require('./socket_base');
const getElementById   = require('../common_functions').getElementById;
const isVisible        = require('../common_functions').isVisible;
const getLanguage      = require('../language').get;
const State            = require('../storage').State;
const getPropertyValue = require('../utility').getPropertyValue;
const getAppId         = require('../../config').getAppId;

const GTM = (() => {
    const isGtmApplicable = () => (/^(1|1098|14473|15284)$/.test(getAppId()));

    const getCommonVariables = () => ({
        language : getLanguage(),
        pageTitle: pageTitle(),
        pjax     : State.get('is_loaded_by_pjax'),
        url      : document.URL,
        ...ClientBase.isLoggedIn() && {
            visitorId: ClientBase.get('loginid'),
            bom_email: ClientBase.get('email'),
        },
    });

    const pushDataLayer = (data) => {
        if (isGtmApplicable() && !Login.isLoginPages()) {
            dataLayer.push({
                ...getCommonVariables(),
                ...data,
            });
        }
    };

    const pageTitle = () => {
        const t = /^.+[:-]\s*(.+)$/.exec(document.title);
        return t && t[1] ? t[1] : document.title;
    };

    const eventHandler = (get_settings) => {
        if (!isGtmApplicable()) return;
        const login_event       = localStorage.getItem('GTM_login');
        const is_new_account    = localStorage.getItem('GTM_new_account') === '1';

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_new_account');

        const affiliate_token = Cookies.getJSON('affiliate_tracking');
        if (affiliate_token) {
            pushDataLayer({ bom_affiliate_token: affiliate_token.t });
        }

        const data = {
            visitorId         : ClientBase.get('loginid'),
            bom_account_type  : ClientBase.getAccountType(),
            bom_currency      : ClientBase.get('currency'),
            bom_country       : get_settings.country,
            bom_country_abbrev: get_settings.country_code,
            bom_email         : get_settings.email,
            url               : window.location.href,
            bom_today         : Math.floor(Date.now() / 1000),
        };

        if (is_new_account) {
            data.event = 'new_account';
            data.bom_date_joined = data.bom_today;
        }

        if (!ClientBase.get('is_virtual')) {
            data.bom_age       = parseInt((moment().utc().unix() - get_settings.date_of_birth) / 31557600);
            data.bom_firstname = get_settings.first_name;
            data.bom_lastname  = get_settings.last_name;
            data.bom_phone     = get_settings.phone;
        }

        if (login_event) {
            data.event = login_event;
            BinarySocket.wait('mt5_login_list').then((response) => {
                (response.mt5_login_list || []).forEach((obj) => {
                    const acc_type = (ClientBase.getMT5AccountType(obj.group) || '')
                        .replace('real_vanuatu', 'financial').replace('vanuatu_', '').replace('costarica', 'gaming'); // i.e. financial_cent, demo_cent, demo_gaming, real_gaming
                    if (acc_type) {
                        data[`mt5_${acc_type}_id`] = obj.login;
                    }
                });
                pushDataLayer(data);
            });
        } else {
            pushDataLayer(data);
        }

        // check if there are any transactions in the last 30 days for UX interview selection
        BinarySocket.send({ statement: 1, limit: 1 }).then((response) => {
            const last_transaction_timestamp = getPropertyValue(response, ['statement', 'transactions', '0', 'transaction_time']);
            pushDataLayer({
                bom_transaction_in_last_30d: !!last_transaction_timestamp && moment(last_transaction_timestamp * 1000).isAfter(ServerTime.get().subtract(30, 'days')),
            });
        });
    };

    const pushPurchaseData = (response) => {
        if (!isGtmApplicable() || ClientBase.get('is_virtual')) return;
        const buy = response.buy;
        if (!buy) return;
        const req  = response.echo_req.passthrough;
        const data = {
            event             : 'buy_contract',
            bom_ui            : 'legacy',
            bom_symbol        : req.symbol,
            bom_market        : getElementById('contract_markets').value,
            bom_currency      : req.currency,
            bom_contract_type : req.contract_type,
            bom_contract_id   : buy.contract_id,
            bom_transaction_id: buy.transaction_id,
            bom_buy_price     : buy.buy_price,
            bom_payout        : buy.payout,
        };
        Object.assign(data, {
            bom_amount     : req.amount,
            bom_basis      : req.basis,
            bom_expiry_type: getElementById('expiry_type').value,
        });
        if (data.bom_expiry_type === 'duration') {
            Object.assign(data, {
                bom_duration     : req.duration,
                bom_duration_unit: req.duration_unit,
            });
        }
        if (isVisible(getElementById('barrier'))) {
            data.bom_barrier = req.barrier;
        } else if (isVisible(getElementById('barrier_high'))) {
            data.bom_barrier_high = req.barrier;
            data.bom_barrier_low  = req.barrier2;
        }
        if (isVisible(getElementById('prediction'))) {
            data.bom_prediction = req.barrier;
        }

        pushDataLayer(data);
    };

    const mt5NewAccount = (response) => {
        const acc_type = response.mt5_new_account.mt5_account_type ?
            `${response.mt5_new_account.account_type}_${response.mt5_new_account.mt5_account_type}` : // financial_cent, demo_cent, ...
            `${response.mt5_new_account.account_type === 'demo' ? 'demo' : 'real'}_gaming`;           // demo_gaming, real_gaming

        const gtm_data = {
            event          : 'mt5_new_account',
            bom_email      : ClientBase.get('email'),
            bom_country    : State.getResponse('get_settings.country'),
            mt5_last_signup: acc_type,
        };

        gtm_data[`mt5_${acc_type}_id`] = response.mt5_new_account.login;

        if (/demo/.test(acc_type) && !ClientBase.get('is_virtual')) {
            gtm_data.visitorId = ClientBase.getAccountOfType('virtual').loginid;
        }

        pushDataLayer(gtm_data);
    };

    const pushTransactionData = (response, extra_data = {}) => {
        if (!isGtmApplicable() || ClientBase.get('is_virtual')) return;
        if (!response.transaction || !response.transaction.action) return;

        const today = moment();
        const storage_key = 'GTM_transactions';
        const gtm_transactions = JSON.parse(localStorage.getItem(storage_key)) || {};
        
        // Remove values from prev days so localStorage doesn't grow to infinity
        if (Object.prototype.hasOwnProperty.call(gtm_transactions, 'timestamp')) {
            if (today.isAfter(moment(gtm_transactions.timestamp), 'day')) {
                localStorage.removeItem(storage_key);
            }
        }
        const transactions_arr = gtm_transactions.transactions || [];
        if (!transactions_arr.includes(response.transaction.transaction_id)) {
            const data = {
                event             : 'transaction',
                bom_account_type  : ClientBase.getAccountType(),
                bom_age           : parseInt((moment().utc().unix() - State.getResponse('get_settings.date_of_birth')) / 31557600),
                bom_email_consent : State.getResponse('get_settings.email_consent'),
                bom_country       : State.getResponse('get_settings.country'),
                bom_country_abbrev: State.getResponse('get_settings.country_code'),
                bom_salutation    : State.getResponse('get_settings.salutation'),
                bom_firstname     : State.getResponse('get_settings.first_name'),
                bom_lastname      : State.getResponse('get_settings.last_name'),
                bom_today         : moment().utc().unix(),
                transaction       : {
                    id      : response.transaction.transaction_id,
                    type    : response.transaction.action,
                    time    : response.transaction.transaction_time,
                    amount  : response.transaction.amount,
                    balance : response.transaction.balance,
                    currency: response.transaction.currency,
                    symbol  : response.transaction.symbol,
                },
            };
            Object.assign(data, extra_data);
            if (['buy', 'sell'].includes(response.transaction.action)) {
                Object.assign(data, {
                    contract: {
                        id           : response.transaction.contract_id,
                        date_expiry  : response.transaction.date_expiry,
                        purchase_time: (response.transaction.action === 'buy' ? response.transaction.transaction_time : response.transaction.purchase_time),
                    },
                });
            }
            pushDataLayer(data);

            transactions_arr.push(response.transaction.transaction_id);

            gtm_transactions.timestamp = today.format();
            gtm_transactions.transactions = transactions_arr;

            localStorage.setItem(storage_key, JSON.stringify(gtm_transactions));
        }
    };

    return {
        pushDataLayer,
        eventHandler,
        pushPurchaseData,
        pushTransactionData,
        mt5NewAccount,
        setLoginFlag: (event_name) => { if (isGtmApplicable()) localStorage.setItem('GTM_login', event_name); },
    };
})();

module.exports = GTM;
