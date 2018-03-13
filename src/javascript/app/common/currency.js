const jpClient         = require('./country_base').jpClient;
const getLanguage      = require('../../_common/language').get;
const localize         = require('../../_common/localize').localize;
const getPropertyValue = require('../../_common/utility').getPropertyValue;

let currencies_config = {};

const formatMoney = (currency_value, amount, exclude_currency, decimals = 0, minimumFractionDigits = 0) => {
    let money = amount;
    if (money) money = String(money).replace(/,/g, '');
    const sign           = money && Number(money) < 0 ? '-' : '';
    const decimal_places = decimals || getDecimalPlaces(currency_value);

    money = isNaN(money) ? 0 : Math.abs(money);
    if (typeof Intl !== 'undefined') {
        const options = {
            minimumFractionDigits: minimumFractionDigits || decimal_places,
            maximumFractionDigits: decimal_places,
        };
        money = new Intl.NumberFormat(getLanguage().toLowerCase().replace('_', '-'), options).format(money);
    } else {
        money = addComma(money, decimal_places);
    }

    return sign + (exclude_currency ? '' : formatCurrency(currency_value)) + money;
};

const formatCurrency = currency => `<span class="symbols ${(currency || '').toLowerCase()}"></span>`; // defined in binary-style

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

const getFiatDecimalPlaces = () => jpClient() ? 0 : 2;

const calcDecimalPlaces = (currency) => isCryptocurrency(currency) ? 8 : getFiatDecimalPlaces();

const getDecimalPlaces = (currency) => (
    // need to check currencies_config[currency] exists instead of || in case of 0 value
    currencies_config[currency] ? getPropertyValue(currencies_config, [currency, 'fractional_digits']) : calcDecimalPlaces(currency)
);

const setCurrencies = (website_status) => {
    currencies_config = website_status.currencies_config;
};

const isCryptocurrency = currency => /crypto/i.test(getPropertyValue(currencies_config, [currency, 'type']));

const crypto_config = {
    BTC: { name: 'Bitcoin',       min_withdrawal: 0.002 },
    BCH: { name: 'Bitcoin Cash',  min_withdrawal: 0.002 },
    ETH: { name: 'Ether',         min_withdrawal: 0.002 },
    ETC: { name: 'Ether Classic', min_withdrawal: 0.002 },
    LTC: { name: 'Litecoin',      min_withdrawal: 0.002 },
};

const getMinWithdrawal = currency => (isCryptocurrency(currency) ? getPropertyValue(crypto_config, [currency, 'min_withdrawal']) || 0.002 : 1);

const getCurrencyName = currency => localize(getPropertyValue(crypto_config, [currency, 'name']) || '');

const getFiatPayout = () => jpClient() ? 1 : 10;

const getMinPayout = currency => (
    isCryptocurrency(currency) ? getPropertyValue(currencies_config, [currency, 'stake_default']) : getFiatPayout()
);

const getCurrencyList = (currencies) => {
    const $currencies       = $('<select/>');
    const $fiat_currencies  = $('<optgroup/>', { label: localize('Fiat Currency') });
    const $cryptocurrencies = $('<optgroup/>', { label: localize('Cryptocurrency') });

    currencies.forEach((currency) => {
        (isCryptocurrency(currency) ? $cryptocurrencies : $fiat_currencies)
            .append($('<option/>', { value: currency, text: currency }));
    });

    return $currencies.append($fiat_currencies.children().length ? $fiat_currencies : '').append($cryptocurrencies.children().length ? $cryptocurrencies : '');
};

module.exports = {
    formatMoney,
    formatCurrency,
    addComma,
    getDecimalPlaces,
    setCurrencies,
    isCryptocurrency,
    getCurrencyName,
    getMinWithdrawal,
    getMinPayout,
    getCurrencyList,
    getCurrencies: () => currencies_config,
};
