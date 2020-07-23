const Client   = require('../../base/client');
const Currency = require('../../common/currency');

const GetCurrency = (() => {
    const getCurrenciesOfOtherAccounts = (is_different_company = false) => {
        const all_loginids     = Client.getAllLoginids();
        const other_currencies = [];
        // console.log(Client.get('landing_company_shortcode'))
        const current_landing_company_shortcode = Client.get('landing_company_shortcode');
        // console.log(Client.get('loginid'))
        // console.log(all_loginids)
        all_loginids.forEach((loginid) => {
            // if it's not current client or under a different landing company, consider the currency
            if (is_different_company) {
                if (Client.get('loginid') !== loginid) {
                    const currency = Client.get('currency', loginid);
                    if (!Client.get('is_virtual', loginid) && currency) {
                        other_currencies.push(currency);
                    }
                }
            } else {
                // eslint-disable-next-line
                if (Client.get('loginid') !== loginid && current_landing_company_shortcode === Client.get('landing_company_shortcode', loginid)) {
                    const currency = Client.get('currency', loginid);
                    if (currency) {
                        other_currencies.push(currency);
                    }
                }
            }

        });
        return other_currencies;
    };

    const getCurrencyValues = () => {
        const currencies       = Currency.getCurrencies();
        const fiat_currencies  = [];
        const cryptocurrencies = [];
        Object.keys(currencies).forEach((currency) => {
            if (currencies[currency].type === 'fiat') {
                fiat_currencies.push(currency);
            } else {
                cryptocurrencies.push(currency);
            }
        });
        const other_currencies = getCurrenciesOfOtherAccounts();

        return {
            cryptocurrencies,
            other_currencies,

            has_fiat: other_currencies.some(currency => fiat_currencies.indexOf(currency) > -1),
        };
    };

    const getCurrencies = (landing_company, all_fiat) => {
        const client_currency = Client.get('currency');
        const is_crypto       = Currency.isCryptocurrency(client_currency);
        const currency_values = getCurrencyValues();

        const allowed_currencies =
              Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');

        const available_crypto =
              currency_values.cryptocurrencies.filter(c =>
                  currency_values.other_currencies.concat(is_crypto ? client_currency : []).indexOf(c) < 0 &&
                  allowed_currencies.indexOf(c) > -1);
        const can_open_crypto  = available_crypto.length;

        let currencies_to_show = [];

        // only allow client to open more sub accounts if the last currency is not to be reserved for master account
        if ((client_currency && (can_open_crypto || !currency_values.has_fiat)) ||
            (!client_currency && (available_crypto.length > 1 || (can_open_crypto && !currency_values.has_fiat)))) {
            // if have sub account with fiat currency, or master account is fiat currency, only show cryptocurrencies
            // else show all
            const is_virtual = Client.get('is_virtual');

            currencies_to_show =
                !all_fiat && (currency_values.has_fiat || (!is_crypto && client_currency && !is_virtual)) ?
                    available_crypto : allowed_currencies;
            // remove client's currency and sub account currencies from list of currencies to show
            const currencies_to_compare = is_virtual ?
                currency_values.other_currencies : currency_values.other_currencies.concat(client_currency);
            currencies_to_show = currencies_to_show.filter(c => currencies_to_compare.indexOf(c) < 0);
        }

        return currencies_to_show;
    };

    const getAllCurrencies = (landing_company) => {
        const allowed_currencies =
              Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');
        const currency_values = getCurrencyValues();
        const client_currency = Client.get('currency');
        const is_virtual = Client.get('is_virtual');
        const currencies_to_compare = is_virtual ?
            currency_values.other_currencies : currency_values.other_currencies.concat(client_currency);

        return allowed_currencies.filter(c => currencies_to_compare.indexOf(c) < 0);
    };

    return {
        getAllCurrencies,
        getCurrenciesOfOtherAccounts,
        getCurrencies,
    };
})();

module.exports = GetCurrency;
