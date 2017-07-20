const Client   = require('../../base/client');
const Currency = require('../../common_functions/currency');

const SubAccounts = (() => {
    'use strict';

    const getCurrencyValues = (sub_accounts, landing_company) => {
        const fiat_currencies  = Currency.getFiatCurrencies();
        // TODO: update this when back-end sends cryptocurrencies in website_status and landing_company
        // const currencies = Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');
        // const cryptocurrencies = currencies.filter(c => fiat_currencies.indexOf(c) < 0);
        const cryptocurrencies = ['BTC', 'ETH', 'LTC'];
        const currencies       = Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies').concat(cryptocurrencies);
        const sub_currencies   = sub_accounts.length ? sub_accounts.map(a => a.currency) : [];

        const has_fiat_sub = sub_accounts.length ? sub_currencies.some(currency => currency && new RegExp(currency, 'i').test(fiat_currencies)) : false;

        return {
            fiat_currencies : fiat_currencies,
            cryptocurrencies: cryptocurrencies,
            currencies      : currencies,
            sub_currencies  : sub_currencies,
            has_fiat_sub    : has_fiat_sub,
        };
    };

    const getCurrencies = (sub_accounts, landing_company) => {
        const client_currency  = Client.get('currency');
        const is_crypto        = Currency.isCryptocurrency(client_currency);
        const currency_values  = getCurrencyValues(sub_accounts, landing_company);
        const cryptocurrencies = currency_values.cryptocurrencies;
        const currencies       = currency_values.currencies;
        const sub_currencies   = currency_values.sub_currencies;

        const has_fiat_sub = currency_values.has_fiat_sub;
        const available_crypto =
            cryptocurrencies.filter(c => sub_currencies.concat(is_crypto ? client_currency : []).indexOf(c) < 0);
        const can_open_crypto = available_crypto.length;

        let currencies_to_show = [];
        // only allow client to open more sub accounts if the last currency is not to be reserved for master account
        if ((client_currency && (can_open_crypto || !has_fiat_sub)) ||
            (!client_currency && (available_crypto.length > 1 || (can_open_crypto && !has_fiat_sub)))) {
            // if have sub account with fiat currency, or master account is fiat currency, only show cryptocurrencies
            // else show all
            currencies_to_show =
                has_fiat_sub || (!is_crypto && client_currency) ?
                    cryptocurrencies : currencies;
            // remove client's currency and sub account currencies from list of currencies to show
            currencies_to_show = currencies_to_show.filter(c => sub_currencies.concat(client_currency).indexOf(c) < 0);
        }

        return currencies_to_show;
    };

    return {
        getCurrencies    : getCurrencies,
        getCurrencyValues: getCurrencyValues,
    };
})();

module.exports = SubAccounts;
