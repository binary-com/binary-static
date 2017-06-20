const jpClient    = require('./country_base').jpClient;
const getLanguage = require('../base/language').get;

const cryptocurrencies = ['BTC'];

const formatMoney = (currency_value, amount, exclude_currency) => {
    const is_crypto = isCryptocurrency(currency_value);
    const is_jp = jpClient();
    const decimal_places = getDecimalPlaces(currency_value, amount);
    let money;
    if (amount) amount = String(amount).replace(/,/g, '');
    if (typeof Intl !== 'undefined' && currency_value && !is_crypto && amount) {
        const options = exclude_currency ? { minimumFractionDigits: decimal_places, maximumFractionDigits: decimal_places } : { style: 'currency', currency: currency_value };
        const language = getLanguage().toLowerCase();
        money = new Intl.NumberFormat(language.replace('_', '-'), options).format(amount);
    } else {
        let updated_amount = amount,
            sign = '';
        if (is_jp) {
            updated_amount = parseInt(amount);
            if (Number(updated_amount) < 0) {
                sign = '-';
            }
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

const addComma = (num, decimal_points, is_crypto) => {
    let number = (String(num || 0).replace(/,/g, '') * 1).toFixed(decimal_points || 2);
    if (is_crypto) {
        number = parseFloat(number);
    }

    return number.toString().replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => (
        $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
    ));
};

const getDecimalPlaces = (currency, amount) => {
    const is_crypto = isCryptocurrency(currency);
    const is_jp = jpClient();
    let decimal_places = 2;
    if (is_crypto) {
        decimal_places = Math.min((parseFloat(amount).toString().split('.')[1] || '').length || 0, 8);
    } else if (is_jp) {
        decimal_places = 0;
    }
    return decimal_places;
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
    BTC: '₿',
};

const isCryptocurrency = currency => (
    currency ? (new RegExp(currency, 'i')).test(cryptocurrencies) : false
);

module.exports = {
    formatMoney     : formatMoney,
    formatCurrency  : currency => map_currency[currency],
    isCryptocurrency: isCryptocurrency,
    getDecimalPlaces: getDecimalPlaces,
};
