const moment        = require('moment');
const getCurrencies = require('./get_currency').getCurrencies;
const BinarySocket  = require('../socket');
const BinaryPjax    = require('../../base/binary_pjax');
const Client        = require('../../base/client');
const localize      = require('../../base/localize').localize;
const urlFor        = require('../../base/url').urlFor;
const State         = require('../../base/storage').State;
const toTitleCase   = require('../../common_functions/string_util').toTitleCase;

const Accounts = (() => {
    'use strict';

    let landing_company;

    const onLoad = () => {
        if (!Client.get('residence')) {
            // ask client to set residence first since cannot wait landing_company otherwise
            BinaryPjax.load(urlFor('user/settings/detailsws'));
        }
        BinarySocket.wait('landing_company', 'get_settings').then(() => {
            landing_company = State.getResponse('landing_company');

            populateExistingAccounts();

            let element_to_show = '#no_new_accounts_wrapper';
            const upgrade_info = Client.getUpgradeInfo(landing_company);
            if (upgrade_info.can_upgrade) {
                populateNewAccounts(upgrade_info);
                element_to_show = '#new_accounts_wrapper';
            }

            const currencies = getCurrencies(landing_company);
            // only allow opening of multi account to costarica clients with remaining currency
            if (Client.get('landing_company_shortcode') === 'costarica' && currencies.length) {
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

    const populateNewAccounts = (upgrade_info) => {
        const new_account = upgrade_info;
        const account = {
            real     : new_account.type === 'real',
            financial: new_account.type === 'financial',
        };

        $('#new_accounts').find('tbody')
            .append($('<tr/>')
                .append($('<td/>', { text: localize(`${toTitleCase(new_account.type)} Account`) }))
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
                const account_currency = Client.get('currency', loginid);

                $('#existing_accounts').find('tbody')
                    .append($('<tr/>', { id: loginid })
                        .append($('<td/>', { text: loginid }))
                        .append($('<td/>', { text: localize(Client.getAccountTitle(loginid)) }))
                        .append($('<td/>', { text: getAvailableMarkets(loginid) }))
                        .append($('<td/>')
                            .html(!account_currency && loginid === Client.get('loginid') ? $('<a/>', { class: 'button', href: urlFor('user/set-currency') }).html($('<span/>', { text: localize('Set Currency') })) : account_currency || '-')));
            });
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

    const markets = {
        commodities: 'Commodities',
        forex      : 'Forex',
        indices    : 'Indices',
        stocks     : 'Stocks',
        volidx     : 'Volatility Indices',
    };

    const getMarketName = market => localize(markets[market] || '');

    const populateMultiAccount = (currencies) => {
        $('#new_accounts').find('tbody')
            .append($('<tr/>', { id: 'new_account_opening' })
                .append($('<td/>', { text: localize('Real Account') }))
                .append($('<td/>', { text: getAvailableMarkets({ real: 1 }) }))
                .append($('<td/>', { class: 'account-currency' }))
                .append($('<td/>').html($('<button/>', { text: localize('Create') }))));

        $('#note').setVisibility(1);

        const $new_account_opening = $('#new_account_opening');
        if (currencies.length > 1) {
            const $currencies = $('<div/>');
            $currencies.append($('<option/>', { value: '', text: localize('Please select') }));
            currencies.forEach((c) => {
                $currencies.append($('<option/>', { value: c, text: c }));
            });
            $new_account_opening.find('.account-currency').html($('<select/>', { id: 'new_account_currency' }).html($currencies.html()));
        } else {
            $new_account_opening.find('.account-currency').html($('<span/>', { id: 'new_account_currency', value: currencies, text: currencies }));
        }

        $new_account_opening.find('button').on('click', () => {
            if (!getSelectedCurrency()) {
                showError('Please choose a currency');
            } else {
                const req = populateReq();
                BinarySocket.send(req).then((response) => {
                    if (response.error) {
                        const account_opening_reason = State.getResponse('get_settings.account_opening_reason');
                        if (!account_opening_reason && response.error.details.hasOwnProperty('account_opening_reason') &&
                            (response.error.code === 'InsufficientAccountDetails' ||
                            response.error.code === 'InputValidationFailed')) {
                            // ask client to set account opening reason
                            BinaryPjax.load(`${urlFor('user/settings/detailsws')}#new-account`);
                        } else {
                            showError(response.error.message);
                        }
                    } else {
                        handleNewAccount(response);
                    }
                });
            }
        });

        doneLoading('#new_accounts_wrapper');
    };

    const getSelectedCurrency = () => {
        const new_account_currency = document.getElementById('new_account_currency');
        return new_account_currency.value || new_account_currency.getAttribute('value');
    };

    const handleNewAccount = (response) => {
        const new_account = response.new_account_real;
        State.set('ignoreResponse', 'authorize');
        BinarySocket.send({ authorize: new_account.oauth_token }, { forced: true }).then((response_authorize) => {
            if (response_authorize.error) {
                showError(response_authorize.error.message);
            } else {
                BinarySocket
                    .send({ set_account_currency: getSelectedCurrency() })
                    .then((response_set_account_currency) => {
                        if (response_set_account_currency.error) {
                            showError(response_set_account_currency.error.message);
                        } else {
                            Client.processNewAccount({
                                email       : Client.get('email'),
                                loginid     : new_account.client_id,
                                token       : new_account.oauth_token,
                                redirect_url: `${urlFor('user/set-currency')}#new_account`,
                            });
                        }
                    });
            }
            State.remove('ignoreResponse');
        });
    };

    const showError = (message) => {
        $('#new_account_error').remove();
        $('#new_account_opening').find('button').parent().append($('<p/>', { class: 'error-msg', id: 'new_account_error', text: localize(message) }));
    };

    const populateReq = () => {
        const get_settings = State.getResponse('get_settings');
        const date_of_birth = moment(+get_settings.date_of_birth * 1000).format('YYYY-MM-DD');
        const req = {
            new_account_real      : 1,
            salutation            : get_settings.salutation,
            first_name            : get_settings.first_name,
            last_name             : get_settings.last_name,
            date_of_birth         : date_of_birth,
            address_line_1        : get_settings.address_line_1,
            address_line_2        : get_settings.address_line_2,
            address_city          : get_settings.address_city,
            address_state         : get_settings.address_state,
            address_postcode      : get_settings.address_postcode,
            phone                 : get_settings.phone,
            account_opening_reason: get_settings.account_opening_reason,
            residence             : Client.get('residence'),
        };
        if (get_settings.tax_identification_number) {
            req.tax_identification_number = get_settings.tax_identification_number;
        }
        if (get_settings.tax_residence) {
            req.tax_residence = get_settings.tax_residence;
        }
        return req;
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Accounts;
