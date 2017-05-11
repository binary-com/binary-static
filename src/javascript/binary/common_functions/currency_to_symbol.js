const jpClient    = require('./country_base').jpClient;
const getLanguage = require('../base/language').get;

const formatMoney = (currency_value, amount, exclude_currency) => {
    const is_bitcoin = /xbt/i.test(currency_value);
    const decimal_places = is_bitcoin ? 6 : 2;
    let money;
    if (amount) amount = String(amount).replace(/,/g, '');
    if (typeof Intl !== 'undefined' && currency_value && !is_bitcoin && amount) {
        const options = exclude_currency ? { minimumFractionDigits: decimal_places, maximumFractionDigits: decimal_places } : { style: 'currency', currency: currency_value };
        const language = getLanguage().toLowerCase();
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
            updated_amount = parseFloat(amount).toFixed(decimal_places);
        }
        updated_amount = addComma(updated_amount, decimal_places);
        if (exclude_currency) {
            money = updated_amount;
        } else {
            const symbol = map_currency[currency_value];
            money = symbol ? sign + symbol + updated_amount : `${currency_value} ${updated_amount}`;
        }
    }
    return money;
};

const addComma = (num, decimal_points) => {
    const number = String(num || 0).replace(/,/g, '') * 1;
    return number.toFixed(decimal_points || 2).toString().replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => (
        $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
    ));
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
    XBT: '₿',
};

module.exports = {
    formatMoney   : formatMoney,
    formatCurrency: currency => map_currency[currency],
};
