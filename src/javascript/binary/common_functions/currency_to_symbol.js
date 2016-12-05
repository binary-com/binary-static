var japanese_client = require('./country_base').japanese_client;
var addComma        = require('./string_util').addComma;

function format_money(currencyValue, amount) {
    var money;
    if (typeof Intl !== 'undefined' && currencyValue && currencyValue !== '' && amount && amount !== '') {
        var options = { style: 'currency', currency: currencyValue },
            language = typeof window !== 'undefined' && page.language().toLowerCase() ? page.language().toLowerCase() : 'en';
        money = new Intl.NumberFormat(language.replace('_', '-'), options).format(amount);
    } else {
        var updatedAmount,
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
        var symbol = format_money.map[currencyValue];
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
