var checkInput = require('./common_functions').checkInput;

var toTitleCase = function(str) {
    return str.replace(/\w[^\s\/\\]*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

var addComma = function(num, decimal_points) {
    num = String(num || 0).replace(/,/g, '') * 1;
    return num.toFixed(decimal_points || 2).toString().replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
    });
};

var toISOFormat = function(date) {
    return date.format('YYYY-MM-DD');
};

var toReadableFormat = function(date) {
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
