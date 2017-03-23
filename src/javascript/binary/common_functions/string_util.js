const checkInput = require('./common_functions').checkInput;

const toTitleCase = str => (
    str.replace(/\w[^\s\/\\]*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
);

const addComma = (num, decimal_points) => {
    const number = String(num || 0).replace(/,/g, '') * 1;
    return number.toFixed(decimal_points || 2).toString().replace(/(^|[^\w.])(\d{4,})/g, ($0, $1, $2) => (
        $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,')
    ));
};

const toISOFormat = date => date.format('YYYY-MM-DD');

const toReadableFormat = (date) => {
    if ($(window).width() < 770 && checkInput('date', 'not-a-date')) {
        return toISOFormat(date);
    }
    return date.format('DD MMM, YYYY');
};

module.exports = {
    toISOFormat     : toISOFormat,
    toReadableFormat: toReadableFormat,
    toTitleCase     : toTitleCase,
    addComma        : addComma,
};
