function format_money(currencyValue, amount) {
    var options = { style: 'currency', currency: currencyValue },
        language = typeof window !== 'undefined' && page.language().toLowerCase() ? page.language().toLowerCase() : 'en';
    return (new Intl.NumberFormat(language, options).format(amount));
}

function format_currency(currency) {
    return format_money.map[currency];
}

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
format_money.map = {
    "USD": "$",
    "GBP": "£",
    "AUD": "A$",
    "EUR": "€",
    "JPY": "¥",
};

module.exports = {
    format_money: format_money,
    format_currency: format_currency
};
