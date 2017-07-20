const SubAccount   = require('./sub_account');
const BinarySocket = require('../socket');
const Client       = require('../../base/client');
const localize     = require('../../base/localize').localize;
const urlFor       = require('../../base/url').urlFor;
const State        = require('../../base/storage').State;
const toTitleCase  = require('../../common_functions/string_util').toTitleCase;

const Accounts = (() => {
    'use strict';

    let landing_company;

    const onLoad = () => {
        BinarySocket.wait('landing_company').then((response) => {
            landing_company = response.landing_company;
            const accounts = Client.get('tokens');
            const accounts_obj = accounts && accounts.length > 0 ? JSON.parse(accounts) : {};

            populateExistingAccounts(accounts_obj);

            let element_to_show = '#no_new_accounts_wrapper';
            if (Client.canUpgrade(landing_company)) {
                populateNewAccounts(accounts_obj);
                element_to_show = '#new_accounts_wrapper';
            }

            const authorize = State.get(['response', 'authorize', 'authorize']);
            // only clients with omnibus flag set are allowed to create sub accounts
            if (authorize && authorize.allow_omnibus) {
                handleSubAccount(authorize);
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

    const populateNewAccounts = () => {
        const type = getNewAccountType();
        const $new_accounts = $('#new_accounts');
        const $tbody_new_accounts = $new_accounts.find('tbody');
        const current_account = {
            real     : type === 'real',
            financial: type === 'financial',
        };
        const market_text = getAvailableMarkets(current_account);
        const currencies = Client.getLandingCompanyValue(current_account, landing_company, 'legal_allowed_currencies').join(', ');

        $tbody_new_accounts
            .append($('<tr/>')
                .append($('<td/>', { text: localize(`${toTitleCase(type)} Account`) }))
                .append($('<td/>', { text: market_text }))
                .append($('<td/>', { text: currencies }))
                .append($('<td/>').html($('<a/>', { class: 'button' }).html($('<span/>', { text: localize('Create') })))));

        const showUpgrade = (url) => {
            $new_accounts.find('a.button').attr('href', urlFor(url));
        };

        if (Client.get('is_virtual')) {
            if (Client.canUpgradeVirtualToFinancial(landing_company)) {
                showUpgrade('new_account/maltainvestws');
            } else if (Client.canUpgradeVirtualToJapan(landing_company)) {
                showUpgrade('new_account/japanws');
            } else {
                showUpgrade('new_account/realws');
            }
        } else {
            showUpgrade('new_account/maltainvestws');
        }
    };

    const getNewAccountType = () => {
        let type = 'real';
        if (Client.get('is_virtual')) {
            if (Client.canUpgradeVirtualToFinancial(landing_company)) {
                type = 'financial';
            }
        } else if (Client.canUpgradeGamingToFinancial(landing_company)) {
            type = 'financial';
        }
        return type;
    };

    const populateExistingAccounts = (accounts_obj) => {
        const $tbody_existing_accounts = $('#existing_accounts').find('tbody');
        const loginid_array = Client.get('loginid_array');

        Object.keys(accounts_obj)
            .sort((a, b) => a > b)
            .forEach((account) => {
                const current_account = loginid_array.find(login => account === login.id);
                const market_text = getAvailableMarkets(current_account);
                const account_currency = accounts_obj[account].currency;

                $tbody_existing_accounts
                    .append($('<tr/>', { id: account })
                        .append($('<td/>', { text: account }))
                        .append($('<td/>', { text: localize(current_account.real ? 'Real' : current_account.financial ? 'Financial' : current_account.non_financial ? 'Gaming' : 'Virtual') }))
                        .append($('<td/>', { text: market_text }))
                        .append($('<td/>', { text: account_currency || '-', class: 'account-currency' })));

                // only show set currency for current loginid
                if (!account_currency && account === Client.get('loginid')) {
                    $(`#${account}`).find('.account-currency').html($('<a/>', { class: 'button', href: urlFor('user/set-currency') }).html($('<span/>', { text: localize('Set Currency') })));
                }
            });
    };

    const getAvailableMarkets = (current_account) => {
        let legal_allowed_markets = Client.getLandingCompanyValue(current_account, landing_company, 'legal_allowed_markets') || '';
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

    const handleSubAccount = (authorize) => {
        const currencies = SubAccount.getCurrencies(authorize.sub_accounts, landing_company);
        if (!currencies.length) {
            doneLoading('#no_new_accounts_wrapper');
            return;
        }

        const $new_accounts = $('#new_accounts');
        const $tbody_new_accounts = $new_accounts.find('tbody');
        const market_text = getAvailableMarkets({ real: 1 });

        $tbody_new_accounts
            .append($('<tr/>', { id: 'create_sub_account' })
                .append($('<td/>', { text: localize('Real Account') }))
                .append($('<td/>', { text: market_text }))
                .append($('<td/>', { class: 'account-currency' }))
                .append($('<td/>').html($('<button/>', { text: localize('Create') }))));

        $('#note').setVisibility(1);

        const $create_sub_account = $('#create_sub_account');
        if (currencies.length > 1) {
            const $currencies = $('<div/>');
            $currencies.append($('<option/>', { value: '', text: localize('Please select') }));
            currencies.forEach((c) => {
                $currencies.append($('<option/>', { value: c, text: c }));
            });
            $create_sub_account.find('.account-currency').html($('<select/>', { id: 'sub_account_currency' }).html($currencies.html()));
        } else {
            $create_sub_account.find('.account-currency').html($('<span/>', { id: 'sub_account_currency', value: currencies, text: currencies }));
        }

        $create_sub_account.find('button').on('click', () => {
            if (!getSelectedCurrency()) {
                showError('Please choose a currency');
            } else {
                BinarySocket.send({ new_sub_account: 1 }).then((response) => {
                    if (response.error) {
                        showError(response.error.message);
                    } else {
                        handleNewAccount(response);
                    }
                });
            }
        });

        doneLoading('#new_accounts_wrapper');
    };

    const getSelectedCurrency = () => {
        const sub_account_currency = document.getElementById('sub_account_currency');
        return sub_account_currency.value || sub_account_currency.getAttribute('value');
    };

    const handleNewAccount = (response) => {
        const new_account = response.new_sub_account;
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
                                redirect_url: urlFor('user/accounts'),
                            });
                        }
                    });
            }
            State.remove('ignoreResponse');
        });
    };

    const showError = (message) => {
        $('#create_sub_account').find('button').parent().append($('<p/>', { class: 'error-msg', text: localize(message) }));
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Accounts;
