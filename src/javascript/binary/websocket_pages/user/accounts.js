const moment             = require('moment');
const setIsForNewAccount = require('./account/settings/personal_details').setIsForNewAccount;
const getCurrencies      = require('./get_currency').getCurrencies;
const BinarySocket       = require('../socket');
const BinaryPjax         = require('../../base/binary_pjax');
const Client             = require('../../base/client');
const localize           = require('../../base/localize').localize;
const State              = require('../../base/storage').State;
const urlFor             = require('../../base/url').urlFor;
const getPropertyValue   = require('../../base/utility').getPropertyValue;
const getCurrencyList    = require('../../common_functions/currency').getCurrencyList;
const FormManager        = require('../../common_functions/form_manager');
const toTitleCase        = require('../../common_functions/string_util').toTitleCase;

const Accounts = (() => {
    let landing_company;
    const form_id = '#new_accounts';

    const onLoad = () => {
        if (!Client.get('residence')) {
            // ask client to set residence first since cannot wait landing_company otherwise
            BinaryPjax.load(urlFor('user/settings/detailsws'));
        }
        BinarySocket.wait('landing_company', 'get_settings', 'get_account_status').then(() => {
            landing_company = State.getResponse('landing_company');

            populateExistingAccounts();

            let element_to_show  = '#no_new_accounts_wrapper';
            const account_type_ico = Client.get('is_ico_only');
            const upgrade_info   = Client.getUpgradeInfo(landing_company, undefined, account_type_ico);
            if (upgrade_info.can_upgrade) {
                populateNewAccounts(upgrade_info);
                element_to_show = '#new_accounts_wrapper';
            }

            const status     = State.getResponse('get_account_status.status');
            const currencies = getCurrencies(landing_company);
            // only allow opening of multi account to costarica clients with remaining currency
            if (!/ico_only/.test(status) && Client.get('landing_company_shortcode') === 'costarica' && currencies.length) {
                populateMultiAccount(currencies);
            } else {
                doneLoading(element_to_show);
            }
        });
    };

    const doneLoading = (element_to_show) => {
        $(element_to_show).setVisibility(1);
        $('#accounts_loading').remove();
        $('#accounts_wrapper').setVisibility(1);
    };

    const getCompanyName = account => Client.getLandingCompanyValue(account, landing_company, 'name');

    const populateNewAccounts = (upgrade_info) => {
        const new_account = upgrade_info;
        const account     = {
            real     : new_account.type === 'real',
            financial: new_account.type === 'financial',
        };

        $(form_id).find('tbody')
            .append($('<tr/>')
                .append($('<td/>').html($('<span/>', { text: localize(`${toTitleCase(new_account.type)} Account`), 'data-balloon': `${localize('Counterparty')}: ${getCompanyName(account)}` })))
                .append($('<td/>', { text: getAvailableMarkets(account) }))
                .append($('<td/>', { text: Client.getLandingCompanyValue(account, landing_company, 'legal_allowed_currencies').join(', ') }))
                .append($('<td/>')
                    .html($('<a/>', { class: 'button', href: urlFor(new_account.upgrade_link) })
                        .html($('<span/>', { text: localize('Create') })))));
    };

    const populateExistingAccounts = () => {
        Client.getAllLoginids()
            .sort((a, b) => a > b)
            .forEach((loginid) => {
                const account_currency  = Client.get('currency', loginid);
                const account_type_prop = { text: localize(Client.getAccountTitle(loginid)) };

                if (!Client.isAccountOfType('virtual', loginid)) {
                    const company_name = getCompanyName(loginid);
                    account_type_prop['data-balloon'] = `${localize('Counterparty')}: ${company_name}`;
                }
                $('#existing_accounts').find('tbody')
                    .append($('<tr/>', { id: loginid })
                        .append($('<td/>', { text: loginid }))
                        .append($('<td/>').html($('<span/>', account_type_prop)))
                        .append($('<td/>', { text: getAvailableMarkets(loginid) }))
                        .append($('<td/>')
                            .html(!account_currency && loginid === Client.get('loginid') ? $('<a/>', { class: 'button', href: urlFor('user/set-currency') }).html($('<span/>', { text: localize('Set Currency') })) : account_currency || '-')));
            });
    };

    const getAvailableMarkets = (loginid) => {
        if (Client.get('is_ico_only', loginid)) {
            return [localize('None')];
        }
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

    const markets = {
        commodities: 'Commodities',
        forex      : 'Forex',
        indices    : 'Indices',
        stocks     : 'Stocks',
        volidx     : 'Volatility Indices',
    };

    const getMarketName = market => localize(markets[market] || '');

    const populateMultiAccount = (currencies) => {
        $(form_id).find('tbody')
            .append($('<tr/>', { id: 'new_account_opening' })
                .append($('<td/>').html($('<span/>', { text: localize('Real Account'), 'data-balloon': `${localize('Counterparty')}: ${getCompanyName({ real: 1 })}` })))
                .append($('<td/>', { text: getAvailableMarkets({ real: 1 }) }))
                .append($('<td/>', { class: 'account-currency' }))
                .append($('<td/>').html($('<button/>', { text: localize('Create'), type: 'submit' }))));

        $('#note').setVisibility(1);

        const $new_account_opening = $('#new_account_opening');
        if (currencies.length > 1) {
            const $currencies = $('<div/>');
            $currencies.append(getCurrencyList(currencies).html());
            $new_account_opening.find('.account-currency').html($('<select/>', { id: 'new_account_currency' }).html($currencies.html()));
        } else {
            $new_account_opening.find('.account-currency').html($('<label/>', { id: 'new_account_currency', 'data-value': currencies, text: currencies }));
        }

        // need to make it visible before adding the form manager event on it
        doneLoading('#new_accounts_wrapper');

        const el_select_currency = /select/i.test(document.getElementById('new_account_currency').nodeName);
        FormManager.init(form_id, [{ selector: '#new_account_currency', request_field: 'currency', validations: [el_select_currency ? 'req' : ''], hide_asterisk: true }].concat(populateReq()));

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: newAccountResponse,
        });
    };

    const newAccountResponse = (response) => {
        if (response.error) {
            const account_opening_reason = State.getResponse('get_settings.account_opening_reason');
            if (!account_opening_reason && getPropertyValue(response, ['error', 'details', 'account_opening_reason']) &&
                /InsufficientAccountDetails|InputValidationFailed/.test(response.error.code)) {
                setIsForNewAccount(true);
                // ask client to set account opening reason
                BinaryPjax.load(urlFor('user/settings/detailsws'));
            } else {
                showError(response.error.message);
            }
        } else {
            const new_account = response.new_account_real;
            localStorage.setItem('is_new_account', 1);
            Client.processNewAccount({
                email       : Client.get('email'),
                loginid     : new_account.client_id,
                token       : new_account.oauth_token,
                redirect_url: urlFor('user/set-currency'),
            });
        }
    };

    const showError = (message) => {
        $('#new_account_error').remove();
        $('#new_account_opening').find('button').parent().append($('<p/>', { class: 'error-msg', id: 'new_account_error', text: localize(message) }));
    };

    const populateReq = () => {
        const get_settings = State.getResponse('get_settings');
        const dob          = moment(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD');
        const req          = [
            { request_field: 'new_account_real',       value: 1 },
            { request_field: 'date_of_birth',          value: dob },
            { request_field: 'salutation',             value: get_settings.salutation },
            { request_field: 'first_name',             value: get_settings.first_name },
            { request_field: 'last_name',              value: get_settings.last_name },
            { request_field: 'address_line_1',         value: get_settings.address_line_1 },
            { request_field: 'address_line_2',         value: get_settings.address_line_2 },
            { request_field: 'address_city',           value: get_settings.address_city },
            { request_field: 'address_state',          value: get_settings.address_state },
            { request_field: 'address_postcode',       value: get_settings.address_postcode },
            { request_field: 'phone',                  value: get_settings.phone },
            { request_field: 'account_opening_reason', value: get_settings.account_opening_reason },
            { request_field: 'residence',              value: Client.get('residence') },
        ];
        if (get_settings.tax_identification_number) {
            req.push({ request_field: 'tax_identification_number', value: get_settings.tax_identification_number });
        }
        if (get_settings.tax_residence) {
            req.push({ request_field: 'tax_residence', value: get_settings.tax_residence });
        }
        return req;
    };

    return {
        onLoad,
    };
})();

module.exports = Accounts;
