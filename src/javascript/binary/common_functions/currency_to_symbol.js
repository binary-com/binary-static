const japanese_client = require('./country_base').japanese_client;
const addComma        = require('./string_util').addComma;
const Language        = require('../base/language');

function format_money(currencyValue, amount) {
    let money;
    if (amount) amount = String(amount).replace(/,/g, '');
    if (typeof Intl !== 'undefined' && currencyValue && currencyValue !== '' && amount && amount !== '') {
        const options = { style: 'currency', currency: currencyValue },
            language = typeof window !== 'undefined' ? Language.get().toLowerCase() : 'en';
        money = new Intl.NumberFormat(language.replace('_', '-'), options).format(amount);
    } else {
        let updatedAmount,
            sign = '';
        if (japanese_client()) {
            updatedAmount = parseInt(amount);
            if (Number(updatedAmount) < 0) {
                sign = '-';
            }
        } else {
            updatedAmount = parseFloat(amount).toFixed(2);
        }
        updatedAmount = addComma(updatedAmount);
        const symbol = format_money.map[currencyValue];
        if (symbol === undefined) {
            money = currencyValue + ' ' + updatedAmount;
        } else {
            money = sign + symbol + updatedAmount;
        }
    }
    return money;
}

function format_currency(currency) {
    return format_money.map[currency];
}

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
format_money.map = {
    USD: '$',
    GBP: '£',
    AUD: 'A$',
    EUR: '€',
    JPY: '¥',
};

module.exports = {
    format_money   : format_money,
    format_currency: format_currency,
};
