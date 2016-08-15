function currency_to_symbol(currency) {
    return currency_to_symbol.map[currency] || currency;
}

// Taken with modifications from:
//    https://github.com/bengourley/currency-symbol-map/blob/master/map.js
// When we need to handle more currencies please look there.
currency_to_symbol.map = {
    "USD": "$",
    "GBP": "£",
    "AUD": "A$",
    "EUR": "€",
};

if (typeof module !== 'undefined') {
    module.exports = currency_to_symbol;
}
