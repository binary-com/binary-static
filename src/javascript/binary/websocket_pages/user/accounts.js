const BinarySocket      = require('../socket');
const Client            = require('../../base/client');
const localize          = require('../../base/localize').localize;
const urlFor            = require('../../base/url').urlFor;
const toTitleCase       = require('../../common_functions/string_util').toTitleCase;

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

            $(element_to_show).setVisibility(1);
            $('#accounts_loading').remove();
            $('#accounts_wrapper').setVisibility(1);
        });
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
        const landing_company_object = Client.getLandingCompanyObject(current_account, landing_company);
        const currencies = landing_company_object.legal_allowed_currencies.join(', ');

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

        Object.keys(accounts_obj).forEach((account) => {
            const current_account = loginid_array.find(login => account === login.id);
            const market_text = getAvailableMarkets(current_account);

            $tbody_existing_accounts
                .append($('<tr/>')
                    .append($('<td/>', { text: account, id: account }))
                    .append($('<td/>', { text: market_text }))
                    .append($('<td/>', { text: accounts_obj[account].currency })));
        });
    };

    const getAvailableMarkets = (current_account) => {
        const landing_company_object = Client.getLandingCompanyObject(current_account, landing_company);
        let market_array = landing_company_object.legal_allowed_markets || '';
        if (typeof market_array === 'object' && market_array.length) {
            market_array = market_array.map(market => getMarketName(market)).filter((value, index, self) => value && self.indexOf(value) === index).join(', ');
        }
        return market_array;
    };

    const markets = {
        commodities: 'Commodities',
        forex      : 'Forex',
        indices    : 'Indices',
        stocks     : 'Stocks',
        volidx     : 'Volatility Indices',
    };

    const getMarketName = (market) => {
        const market_name = markets[market];
        return market_name ? localize(markets[market]) : '';
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = Accounts;
