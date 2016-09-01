function format_money(currency, amount) {
    if(currency === 'JPY') { // remove decimal points for JPY and add comma.
        amount = amount.replace(/\.\d+$/, '');
        amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var symbol = format_money.map[currency];
    if (symbol === undefined) {
        return currency + ' ' + amount;
    }
    return symbol + amount;
}

function format_number(jp_client, amount) {
    if(jp_client) { // remove decimal points and add comma.
        amount = amount.replace(/\.\d+$/, '');
        amount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return amount;
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

if (typeof module !== 'undefined') {
    module.exports = {
        format_money: format_money,
        format_number : format_number,
    };
}
