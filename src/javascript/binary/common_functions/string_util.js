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

module.exports = {
    toTitleCase: toTitleCase,
    addComma   : addComma,
};
