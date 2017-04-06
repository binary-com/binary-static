const jpClient    = require('./country_base').jpClient;
const addComma    = require('./string_util').addComma;
const getLanguage = require('../base/language').get;

const formatMoney = (currency_value, amount) => {
    let money;
    if (amount) amount = String(amount).replace(/,/g, '');
    if (typeof Intl !== 'undefined' && currency_value && amount) {
        const options = { style: 'currency', currency: currency_value };
        const language = typeof window !== 'undefined' ? getLanguage().toLowerCase() : 'en';
        money = new Intl.NumberFormat(language.replace('_', '-'), options).format(amount);
    } else {
        let updatedAmount,
            sign = '';
        if (jpClient()) {
            updatedAmount = parseInt(amount);
            if (Number(updatedAmount) < 0) {
                sign = '-';
            }
        } else {
            updatedAmount = parseFloat(amount).toFixed(2);
        }
        updatedAmount = addComma(updatedAmount);
        const symbol = mapCurrency[currency_value];

        money = symbol ? sign + symbol + updatedAmount : `${currency_value} ${updatedAmount}`;
    }
    return money;
};

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
const mapCurrency = {
    USD: '$',
    GBP: '£',
    AUD: 'A$',
    EUR: '€',
    JPY: '¥',
};

module.exports = {
    formatMoney   : formatMoney,
    formatCurrency: currency => mapCurrency[currency],
};
