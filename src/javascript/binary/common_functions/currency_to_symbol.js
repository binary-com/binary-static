function format_money(currency, amount) {
    var p = format_money.map[currency];
    if (!p) {
        return currency + ' ' + amount;
    }
    return p + amount;
}

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
format_money.map = {
    "USD": "$",
    "GBP": "£",
    "AUD": "A$",
    "EUR": "€",
};

if (typeof module !== 'undefined') {
    module.exports = {
        format_money: format_money,
    };
}
