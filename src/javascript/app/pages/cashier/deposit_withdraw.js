const BinaryPjax             = require('../../base/binary_pjax');
const Client                 = require('../../base/client');
const BinarySocket           = require('../../base/socket');
const Header                 = require('../../base/header');
const Dialog                 = require('../../common/attach_dom/dialog');
const Currency               = require('../../common/currency');
const FormManager            = require('../../common/form_manager');
const validEmailToken        = require('../../common/form_validation').validEmailToken;
const handleVerifyCode       = require('../../common/verification_code').handleVerifyCode;
const getCurrencies          = require('../../../_common/base/currency_base').getCurrencies;
const localize               = require('../../../_common/localize').localize;
const State                  = require('../../../_common/storage').State;
const Url                    = require('../../../_common/url');
const template               = require('../../../_common/utility').template;
const getPropertyValue       = require('../../../_common/utility').getPropertyValue;
const isEmptyObject          = require('../../../_common/utility').isEmptyObject;
const getCurrentBinaryDomain = require('../../../config').getCurrentBinaryDomain;
const isBinaryApp            = require('../../../config').isBinaryApp;

const DepositWithdraw = (() => {
    const default_iframe_height = 700;

    let response_withdrawal = {};

    let cashier_type,
        has_no_balance,
        token,
        $iframe,
        $loading;

    const container = '#deposit_withdraw';

    const init = () => {
        if (cashier_type === 'deposit') {
            token = '';
            getCashierURL();
        } else if (cashier_type === 'withdraw') {
            checkToken();
        }
    };

    const sendWithdrawalEmail = (onResponse) => {
        if (isEmptyObject(response_withdrawal)) {
            BinarySocket.send({
                verify_email: Client.get('email'),
                type        : 'payment_withdraw',
            }).then((response) => {
                response_withdrawal = response;
                if (typeof onResponse === 'function') {
                    onResponse();
                }
            });
        } else if (typeof onResponse === 'function') {
            onResponse();
        }
    };

    const checkToken = () => {
        token = Url.getHashValue('token');
        if (isBinaryApp()) {
            sendWithdrawalEmail();
            $loading.remove();
            handleVerifyCode(() => {
                token = $('#txt_verification_code').val();
                getCashierURL();
            });
        } else if (!token) {
            sendWithdrawalEmail(handleWithdrawalResponse);
        } else if (!validEmailToken(token)) {
            showError('token_error');
        } else {
            getCashierURL();
        }
    };

    const handleWithdrawalResponse = () => {
        if ('error' in response_withdrawal) {
            showError('custom_error', response_withdrawal.error.message);
        } else {
            showMessage('check_email_message');
        }
    };

    const getCashierType = () => {
        const $heading = $(container).find('#heading');
        const action   = Url.param('action');
        if (/^(withdraw|deposit)$/.test(action)) {
            cashier_type = action;
            const currency = Client.get('currency') || '';
            $heading.text(`${action === 'withdraw' ? localize('Withdraw') : localize('Deposit')} ${Currency.getCurrencyDisplayCode(currency)}`);
        }
    };

    const populateReq = () => {
        const req = { cashier: cashier_type };
        if (token) {
            req.verification_code = token;
        }
        if (/epg/.test(window.location.pathname)) req.provider = 'epg';

        return req;
    };

    const getCashierURL = () => {
        BinarySocket.send(populateReq()).then(response => handleCashierResponse(response));
    };

    const hideAll = (option) => {
        $('#verification_code_wrapper, #frm_withdraw, #frm_ukgc, #errors').setVisibility(0);
        if (option) {
            $(option).setVisibility(0);
        }
    };

    const showError = (id, error) => {
        hideAll();
        showMessage(id, error, 'errors');
    };

    const showMessage = (id, message, parent = 'messages') => {
        const $element = $(`#${id}`);
        if (message) {
            $element.text(message);
        }
        $element.siblings().setVisibility(0).end()
            .setVisibility(1);
        $loading.remove();
        $(container).find(`#${parent}`).setVisibility(1);
    };

    const showPersonalDetailsError = (details) => {
        const msg_id = 'personal_details_message';
        let error_fields,
            details_fields;
        if (details && details.fields) {
            error_fields = {
                address_city    : localize('Town/City'),
                address_line_1  : localize('First line of home address'),
                address_postcode: localize('Postal Code/ZIP'),
                address_state   : localize('State/Province'),
                email           : localize('Email address'),
                phone           : localize('Telephone'),
                residence       : localize('Country of Residence'),
            };
            details_fields = details.fields.map(field => (error_fields[field] || field));
        }
        const $el     = $(`#${msg_id}`);
        const err_msg = template($el.html(), [details_fields ? details_fields.join(', ') : localize('details')]);
        $el.html(err_msg);
        showMessage(msg_id);
    };

    const ukgcResponseHandler = (response) => {
        if ('error' in response) {
            showError('custom_error', response.error.message);
        } else {
            getCashierURL();
        }
    };

    const initUKGC = () => {
        const ukgc_form_id = '#frm_ukgc';
        $loading.remove();
        $(ukgc_form_id).setVisibility(1);
        FormManager.init(ukgc_form_id, [
            { request_field: 'ukgc_funds_protection', value: 1 },
            { request_field: 'tnc_approval',          value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : ukgc_form_id,
            fnc_response_handler: ukgcResponseHandler,
        });
    };

    const handleCashierResponse = (response) => {
        hideAll('#messages');
        const error = response.error;
        if (error) {
            switch (error.code) {
                case 'ASK_EMAIL_VERIFY':
                    checkToken();
                    break;
                case 'ASK_TNC_APPROVAL':
                    showError('tnc_error');
                    break;
                case 'ASK_FIX_DETAILS':
                    showPersonalDetailsError(error.details);
                    break;
                case 'ASK_UK_FUNDS_PROTECTION':
                    initUKGC();
                    break;
                case 'ASK_AUTHENTICATE':
                    showMessage('not_authenticated_message');
                    break;
                case 'ASK_FINANCIAL_RISK_APPROVAL':
                    showError('financial_risk_error');
                    break;
                case 'ASK_AGE_VERIFICATION':
                    showError('age_error');
                    break;
                case 'ASK_SELF_EXCLUSION_MAX_TURNOVER_SET':
                    showError('limits_error');
                    break;
                default:
                    showError('custom_error', error.message);
            }
        } else {
            const client_currency = Client.get('currency');
            if (cashier_type === 'deposit' && has_no_balance && Client.canChangeCurrency(State.getResponse('statement'), State.getResponse('mt5_login_list'))) {
                Dialog.confirm({
                    id                : 'deposit_currency_change_popup_container',
                    ok_text           : localize('Yes I\'m sure'),
                    cancel_text       : localize('Cancel'),
                    localized_title   : localize('Are you sure you want to deposit in [_1]?', [client_currency]),
                    localized_message : localize('You will not be able to change your fiat account\'s currency after making this deposit. Are you sure you want to proceed?'),
                    localized_footnote: localize('[_1]No, change my fiat account\'s currency now[_2]', [`<a href=${Url.urlFor('user/accounts')}>`, '</a>']),
                    onAbort           : () => BinaryPjax.load(Url.urlFor('cashier')),
                });
            }

            $iframe = $(container).find('#cashier_iframe');

            if (Currency.isCryptocurrency(client_currency)) {
                $iframe.height(default_iframe_height);
            } else {
                // Automatically adjust iframe height based on contents
                window.addEventListener('message', setFrameHeight, false);
            }

            $iframe.attr('src', response.cashier).parent().setVisibility(1);

            setTimeout(() => { // wait for iframe contents to load before removing loading bar
                $loading.remove();
            }, 1000);
        }
    };

    const setFrameHeight = (e) => {
        if (!new RegExp(`www\\.${getCurrentBinaryDomain()}`, 'i').test(e.origin)) {
            $iframe.height(+e.data || default_iframe_height);
        }
    };

    const onLoad = async () => {
        $loading = $('#loading_cashier');
        getCashierType();

        if (!Client.get('currency')) {
            BinaryPjax.load(`${Url.urlFor('user/set-currency')}#redirect_${cashier_type}`);
            return;
        }

        has_no_balance = +Client.get('balance') === 0;
        if (cashier_type === 'withdraw' && has_no_balance) {
            showError('no_balance_error');
            return;
        }

        await BinarySocket.send({ get_account_status: 1 });

        // cannot use State.getResponse because we want to check error which is outside of response[msg_type]
        const response_get_account_status = State.get(['response', 'get_account_status']);
        if (!response_get_account_status.error) {
            if (/cashier_locked/.test(response_get_account_status.get_account_status.status)) {
                if (/ASK_UK_FUNDS_PROTECTION/.test(response_get_account_status.get_account_status.cashier_validation)) {
                    initUKGC();
                    return;
                }
                if (/ASK_SELF_EXCLUSION_MAX_TURNOVER_SET/.test(response_get_account_status.get_account_status.cashier_validation)) {
                    showError('limits_error');
                    return;
                }
                    
                showError('custom_error', localize('Your cashier is locked.')); // Locked from BO
                return;
            }
            const account_currency_config = getPropertyValue(response_get_account_status.get_account_status, ['currency_config', Client.get('currency')]) || {};
            if ((cashier_type === 'deposit' && account_currency_config.is_deposit_suspended) ||
                (cashier_type === 'withdraw' && account_currency_config.is_withdrawal_suspended)) {
                // Experimental currency is suspended
                showError('custom_error', localize('Please note that the selected currency is allowed for limited accounts only.'));
                return;
            }
        }

        await BinarySocket.wait('website_status');
        const currency_config = getPropertyValue(getCurrencies(), [Client.get('currency')]) || {};
        if (cashier_type === 'deposit') {
            if (currency_config.is_deposit_suspended) {
                // Currency deposit is suspended
                showError('custom_error', localize('Sorry, deposits for this currency are currently disabled.'));
                return;
            }
        } else if (currency_config.is_withdrawal_suspended) { // type is withdrawal
            // Currency withdrawal is suspended
            showError('custom_error', localize('Sorry, withdrawals for this currency are currently disabled.'));
            return;
        }

        const promises = [];
        if (cashier_type === 'deposit') {
            // to speed up page load
            // if client has balance then no need to check their transactions or mt5 accounts
            if (has_no_balance) {
                promises.push(BinarySocket.send({ statement: 1, limit: 1 }));
                promises.push(BinarySocket.send({ mt5_login_list: 1 }));
            }
        } else {
            promises.push(BinarySocket.send({ get_limits: 1 }));
        }

        Promise.all(promises).then(() => {
            if (cashier_type === 'withdraw') {
                const limit = State.getResponse('get_limits.remainder');
                if (typeof limit !== 'undefined' && +limit < Currency.getMinWithdrawal(Client.get('currency'))) {
                    showError('custom_error', localize('You have reached the withdrawal limit. Please upload your proof of identity and address to lift your withdrawal limit and proceed with your withdrawal.'));
                    BinarySocket.send({ get_account_status: 1 }).then(() => Header.displayAccountStatus());
                    return;
                }
            }
            BinarySocket.wait('get_settings').then(() => {
                init();
            });
        });
    };

    const onUnload = () => {
        window.removeEventListener('message', setFrameHeight);
        response_withdrawal = {};
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = DepositWithdraw;
