function format_money(currency, amount) {
    var updatedAmount = amount;
    if(currency === 'JPY') { // remove decimal points for JPY and add comma.
        updatedAmount = updatedAmount.replace(/\.\d+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var symbol = format_money.map[currency];
    if (symbol === undefined) {
        return currency + ' ' + updatedAmount;
    }
    return symbol + updatedAmount;
}

function format_money_jp(currency, amount) {
    var sign = '';
    var updatedAmount = amount;
    if(currency === 'JPY') { // remove decimal points and add comma.
        if (Number(amount) < 0 ) {
           sign = '-';
        }

        updatedAmount = updatedAmount.replace(/\.\d+$/, '').replace('-','').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var symbol = format_money.map[currency];
    if (symbol === undefined) {
        return currency + ' ' + updatedAmount;
    }
    return sign + symbol + updatedAmount;
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
        format_money_jp : format_money_jp,
    };
}
