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
        let updated_amount,
            sign = '';
        if (jpClient()) {
            updated_amount = parseInt(amount);
            if (Number(updated_amount) < 0) {
                sign = '-';
            }
        } else {
            updated_amount = parseFloat(amount).toFixed(2);
        }
        updated_amount = addComma(updated_amount);
        const symbol = map_currency[currency_value];

        money = symbol ? sign + symbol + updated_amount : `${currency_value} ${updated_amount}`;
    }
    return money;
};

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
const map_currency = {
    USD: '$',
    GBP: '£',
    AUD: 'A$',
    EUR: '€',
    JPY: '¥',
};

module.exports = {
    formatMoney   : formatMoney,
    formatCurrency: currency => map_currency[currency],
};
