const jpClient         = require('./country_base').jpClient;
const getLanguage      = require('../base/language').get;
const getPropertyValue = require('../base/utility').getPropertyValue;

let currencies_config = {};

const formatMoney = (currency_value, amount, exclude_currency) => {
    if (amount) amount = String(amount).replace(/,/g, '');
    const sign = amount && Number(amount) < 0 ? '-' : '';
    const decimal_places = getDecimalPlaces(currency_value);
    let money;

    amount = isNaN(amount) ? 0 : Math.abs(amount);
    if (typeof Intl !== 'undefined') {
        const options = { minimumFractionDigits: decimal_places, maximumFractionDigits: decimal_places };
        money = new Intl.NumberFormat(getLanguage().toLowerCase().replace('_', '-'), options).format(amount);
    } else {
        money = addComma(amount, decimal_places);
    }

    return sign + (exclude_currency ? '' : formatCurrency(currency_value)) + money;
};

const formatCurrency = currency => `<span class="symbols ${currency.toLowerCase()}"></span>`; // defined in binary-style

const addComma = (num, decimal_points, is_crypto) => {
    let number = String(num || 0).replace(/,/g, '');
    if (typeof decimal_points !== 'undefined') {
        number = (+number).toFixed(decimal_points);
    }
    if (is_crypto) {
        number = parseFloat(+number);
    }

    return number.toString().replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => (
        $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
    ));
};

const getDecimalPlaces = currency => (
    currencies_config[currency] ? getPropertyValue(currencies_config, [currency, 'fractional_digits']) : (isCryptocurrency(currency) ? 8 : (jpClient() ? 0 : 2))
);

const setCurrencies = (website_status) => {
    currencies_config = website_status.currencies_config;
};

const isCryptocurrency = currency => /crypto/i.test(getPropertyValue(currencies_config, [currency, 'type']));

module.exports = {
    formatMoney     : formatMoney,
    formatCurrency  : formatCurrency,
    isCryptocurrency: isCryptocurrency,
    addComma        : addComma,
    getDecimalPlaces: getDecimalPlaces,
    setCurrencies   : setCurrencies,
    getCurrencies   : () => currencies_config,
};
