const moment               = require('moment');
const SetCurrency          = require('./set_currency');
const BinaryPjax           = require('../../base/binary_pjax');
const Client               = require('../../base/client');
const BinarySocket         = require('../../base/socket');
const showPopup            = require('../../common/attach_dom/popup');
const Currency             = require('../../common/currency');
const localize             = require('../../../_common/localize').localize;
const State                = require('../../../_common/storage').State;
const urlFor               = require('../../../_common/url').urlFor;

const Accounts = (() => {
    let landing_company;
    const form_id = '#new_accounts';

    const TableHeaders = (() => {
        let table_headers;

        const initTableHeaders = () => ({
            account          : localize('Account'),
            available_markets: localize('Available Markets'),
            type             : localize('Type'),
            currency         : localize('Currency'),
        });

        return {
            get: () => {
                if (!table_headers) {
                    table_headers = initTableHeaders();
                }
                return table_headers;
            },
        };
    })();

    const onLoad = () => {
        if (!Client.get('residence')) {
            // ask client to set residence first since cannot wait landing_company otherwise
            BinaryPjax.load(urlFor('user/settings/detailsws'));
        }
        SetCurrency.cleanupPopup();
        BinarySocket.send({ statement: 1, limit: 1 });
        BinarySocket.wait('landing_company', 'get_settings', 'statement', 'mt5_login_list').then(() => {
            landing_company           = State.getResponse('landing_company');
            const can_change_currency = Client.canChangeCurrency(State.getResponse('statement'), State.getResponse('mt5_login_list'));

            populateExistingAccounts();

            let element_to_show = '#no_new_accounts_wrapper';
            const upgrade_info  = Client.getUpgradeInfo();
            if (upgrade_info.can_upgrade) {
                populateNewAccounts(upgrade_info);
                element_to_show = '#new_accounts_wrapper';
            }

            if (upgrade_info.can_open_multi) {
                populateMultiAccount();
            } else if (!can_change_currency) {
                doneLoading(element_to_show);
            }

            if (can_change_currency) {
                addChangeCurrencyOption();
                element_to_show = '#new_accounts_wrapper';
                if (!upgrade_info.can_open_multi) {
                    doneLoading(element_to_show);
                }
            }
        });
    };

    const doneLoading = (element_to_show) => {
        $(element_to_show).setVisibility(1);
        $('#accounts_loading').remove();
        $('#accounts_wrapper').setVisibility(1);
    };

    const getCompanyName = account => Client.getLandingCompanyValue(account, landing_company, 'name');

    const getCompanyCountry = account => Client.getLandingCompanyValue(account, landing_company, 'country');

    const populateNewAccounts = (upgrade_info) => {
        const table_headers = TableHeaders.get();
        const new_account   = upgrade_info;
        const account       = {
            real     : new_account.type === 'real',
            financial: new_account.type === 'financial',
        };
        const new_account_title    = new_account.type === 'financial' ? localize('Financial Account') : localize('Real Account');
        $(form_id).find('tbody')
            .append($('<tr/>')
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text                 : new_account_title,
                    'data-balloon'       : `${localize('Counterparty')}: ${getCompanyName(account)}, ${localize('Jurisdiction')}: ${getCompanyCountry(account)}`,
                    'data-balloon-length': 'large',
                })))
                .append($('<td/>', { text: getAvailableMarkets(account), datath: table_headers.available_markets }))
                .append($('<td/>')
                    .html($('<a/>', { class: 'button', href: urlFor(new_account.upgrade_link) })
                        .html($('<span/>', { text: localize('Create account') })))));
    };

    const addChangeCurrencyOption = () => {
        const table_headers = TableHeaders.get();
        const loginid       = Client.get('loginid');

        // Set the table row
        $(form_id).find('tbody')
            .append($('<tr/>', { id: 'change_account_currency' })
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text: loginid,
                })))
                .append($('<td/>', { text: getAvailableMarkets(loginid), datath: table_headers.available_markets }))
                .append($('<td/>', { id: 'change_currency_action' })
                    .html($('<button/>', { id: 'change_currency_btn', class: 'button no-margin', type: 'button', text: localize('Change currency') }).click(() => showCurrencyPopUp('change')))));

        // Replace note to reflect ability to change currency
        $('#note > .hint').text(`${localize('Note: You are limited to one fiat currency account. The currency of your fiat account can be changed before you deposit into your fiat account for the first time or create an MT5 account. You may also open one account for each supported cryptocurrency.')}`);
    };

    const action_map = {
        create: 'multi_account',
        set   : 'set_currency',
        change: 'change_currency',
    };

    const showCurrencyPopUp = (action) => {
        showPopup({
            url               : urlFor('user/set-currency'),
            content_id        : '#set_currency',
            form_id           : 'frm_set_currency',
            additionalFunction: () => {
                localStorage.setItem('popup_action', action_map[action]);
                SetCurrency.onLoad();
            },
        });
    };

    const populateExistingAccounts = () => {
        const all_login_ids = Client.getAllLoginids();
        // Populate active loginids first.
        all_login_ids
            .filter(loginid => !Client.get('is_disabled', loginid) && !Client.get('excluded_until', loginid))
            .sort((a, b) => a > b)
            .forEach((loginid) => {
                appendExistingAccounts(loginid);
            });

        // Populate disabled or self excluded loginids.
        all_login_ids
            .filter(loginid => Client.get('is_disabled', loginid) || Client.get('excluded_until', loginid))
            .sort((a, b) => a > b)
            .forEach((loginid) => {
                appendExistingAccounts(loginid);
            });
    };

    const appendExistingAccounts = (loginid) => {
        const table_headers     = TableHeaders.get();
        const account_currency  = Client.get('currency', loginid);
        const account_type_prop = { text: Client.getAccountTitle(loginid) };

        if (!Client.isAccountOfType('virtual', loginid)) {
            const company_name    = getCompanyName(loginid);
            const company_country = getCompanyCountry(loginid);
            account_type_prop['data-balloon'] = `${localize('Counterparty')}: ${company_name}, ${localize('Jurisdiction')}: ${company_country}`;
            account_type_prop['data-balloon-length'] = 'large';
        }

        const is_disabled    = Client.get('is_disabled', loginid);
        const excluded_until = Client.get('excluded_until', loginid);
        let txt_markets = '';
        if (is_disabled) {
            txt_markets = localize('This account is disabled');
        } else if (excluded_until) {
            txt_markets = localize('This account is excluded until [_1]', moment(+excluded_until * 1000).format('YYYY-MM-DD HH:mm:ss Z'));
        } else {
            txt_markets = getAvailableMarkets(loginid);
        }

        $('#existing_accounts').find('tbody')
            .append($('<tr/>', { id: loginid, class: ((is_disabled || excluded_until) ? 'color-dark-white' : '') })
                .append($('<td/>', { text: loginid, datath: table_headers.account }))
                .append($('<td/>', { datath: table_headers.type }).html($('<span/>', account_type_prop)))
                .append($('<td/>', { text: txt_markets, datath: table_headers.available_markets }))
                .append($('<td/>', { datath: table_headers.currency })
                    .html(!account_currency && loginid === Client.get('loginid') ? $('<button/>', { text: localize('Set currency'), type: 'button' }).click(() => showCurrencyPopUp('set')) : (Currency.getCurrencyFullName(account_currency) || '-'))));

        if (is_disabled || excluded_until) {
            $('#note_support').setVisibility(1);
        }
    };

    const getAvailableMarkets = (loginid) => {
        let legal_allowed_markets = Client.getLandingCompanyValue(loginid, landing_company, 'legal_allowed_markets') || '';
        if (Array.isArray(legal_allowed_markets) && legal_allowed_markets.length) {
            legal_allowed_markets =
                legal_allowed_markets
                    .map(market => getMarketName(market))
                    .filter((value, index, self) => value && self.indexOf(value) === index)
                    .join(', ');
        }
        return legal_allowed_markets;
    };

    const MarketsConfig = (() => {
        let markets_config;

        const initMarketsConfig = () => ({
            commodities    : localize('Commodities'),
            forex          : localize('Forex'),
            indices        : localize('Stock Indices'),
            stocks         : localize('Stocks'),
            synthetic_index: localize('Synthetic Indices'),
        });

        return {
            get: () => {
                if (!markets_config) {
                    markets_config = initMarketsConfig();
                }
                return markets_config;
            },
        };
    })();

    const getMarketName = market => MarketsConfig.get()[market] || '';

    const populateMultiAccount = () => {
        const table_headers = TableHeaders.get();
        const account       = { real: 1 };
        $(form_id).find('tbody')
            .append($('<tr/>', { id: 'new_account_opening' })
                .append($('<td/>', { datath: table_headers.account }).html($('<span/>', {
                    text                 : localize('Real Account'),
                    'data-balloon'       : `${localize('Counterparty')}: ${getCompanyName(account)}, ${localize('Jurisdiction')}: ${getCompanyCountry(account)}`,
                    'data-balloon-length': 'large',
                })))
                .append($('<td/>', { text: getAvailableMarkets({ real: 1 }), datath: table_headers.available_markets }))
                .append($('<td/>').html($('<button/>', { text: localize('Create account'), type: 'button' }).click(() => showCurrencyPopUp('create')))));

        $('#note').setVisibility(1);

        doneLoading('#new_accounts_wrapper');
    };

    return {
        onLoad,
    };
})();

module.exports = Accounts;
