const CurrencyBase = require('../../_common/base/currency_base');
const localize     = require('../../_common/localize').localize;

const getCurrencyList = (currencies) => {
    const $currencies       = $('<select/>');
    const $fiat_currencies  = $('<optgroup/>', { label: localize('Fiat') });
    const $cryptocurrencies = $('<optgroup/>', { label: localize('Crypto') });

    currencies.forEach((currency) => {
        (CurrencyBase.isCryptocurrency(currency) ? $cryptocurrencies : $fiat_currencies)
            .append($('<option/>', { value: currency, text: currency }));
    });

    return $currencies.append($fiat_currencies.children().length ? $fiat_currencies : '').append($cryptocurrencies.children().length ? $cryptocurrencies : '');
};

module.exports = Object.assign({
    getCurrencyList,
}, CurrencyBase);
