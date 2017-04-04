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

const padLeft = (text, len, char) => {
    text = String(text || '');
    return text.length >= len ? text : `${Array((len - text.length) + 1).join(char)}${text}`;
};

const compareBigUnsignedInt = (a, b) => {
    a = numberToString(a);
    b = numberToString(b);
    const max_length = Math.max(a.length, b.length);
    a = padLeft(a, max_length, '0');
    b = padLeft(b, max_length, '0');
    return a > b ? 1 : (a < b ? -1 : 0); // lexicographical comparison
};

const numberToString = n => (typeof n === 'number' ? String(n) : n);

module.exports = {
    toISOFormat     : toISOFormat,
    toReadableFormat: toReadableFormat,
    toTitleCase     : toTitleCase,
    addComma        : addComma,
    padLeft         : padLeft,

    compareBigUnsignedInt: compareBigUnsignedInt,
};
