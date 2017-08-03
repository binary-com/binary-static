const jpClient         = require('./country_base').jpClient;
const getLanguage      = require('../base/language').get;
const getPropertyValue = require('../base/utility').getPropertyValue;

let currencies_config = {};

const formatMoney = (currency_value, amount, exclude_currency) => {
    const is_crypto = isCryptocurrency(currency_value);
    const is_jp = jpClient();
    const decimal_places = getDecimalPlaces(currency_value);
    let money;
    if (amount) amount = String(amount).replace(/,/g, '');
    if (typeof Intl !== 'undefined' && currency_value && !is_crypto && typeof amount !== 'undefined') {
        const options = { minimumFractionDigits: decimal_places, maximumFractionDigits: decimal_places };
        money = (exclude_currency ? '' : formatCurrency(currency_value)) +
            new Intl.NumberFormat(getLanguage().toLowerCase().replace('_', '-'), options).format(amount);
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
            const symbol = formatCurrency(currency_value);
            money = symbol ? sign + symbol + updated_amount : `${currency_value} ${updated_amount}`;
        }
    }
    return money;
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
