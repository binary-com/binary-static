var japanese_client = require('../common_functions/country_base').japanese_client;
var selectorExists  = require('../common_functions/common_functions').selectorExists;
var moment          = require('moment');

/**
 * Write loading image to a container for ajax request
 *
 * @param container: a jQuery object
 */
function showLoadingImage(container) {
    container.empty().append('<div class="barspinner dark"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
}

/**
 * Returns the highest z-index in the page.
 * Accepts a jquery style selector to only check those elements,
 * uses all container tags by default
 * If no element found, returns null.
 *
 * @param selector: a jquery style selector for target elements
 * @return int|null
 */
function get_highest_zindex(selector) {
    if (!selector) {
        selector = 'div,p,area,nav,section,header,canvas,aside,span';
    }
    var all = [];
    var _store_zindex = function () {
        if ($(this).is(':visible')) {
            var z = $(this).css('z-index');
            if (!isNaN(z)) {
                all.push(z);
            }
        }
    };
    $(selector).each(_store_zindex);

    return all.length ? Math.max(...all) : null;
}

function showLocalTimeOnHover(s) {
    if (japanese_client()) return;
    $(s || '.date').each(function(idx, ele) {
        if (selectorExists(ele)) {
            var gmtTimeStr = ele.textContent.replace('\n', ' ');
            var localTime  = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss').local();
            if (!localTime.isValid()) {
                return;
            }
            var localTimeStr = localTime.format('YYYY-MM-DD HH:mm:ss Z');
            $(ele).attr('data-balloon', localTimeStr);
        }
    });
}

function toJapanTimeIfNeeded(gmtTimeStr, showTimeZone, longcode, hideSeconds) {
    var match;
    if (longcode && longcode !== '') {
        match = longcode.match(/((?:\d{4}-\d{2}-\d{2})\s?(\d{2}:\d{2}:\d{2})?(?:\sGMT)?)/);
        if (!match) return longcode;
    }

    var jp_client = japanese_client(),
        timeStr = gmtTimeStr,
        time;

    if (typeof gmtTimeStr === 'number') {
        time = moment.utc(gmtTimeStr * 1000);
    } else if (gmtTimeStr) {
        time = moment.utc(gmtTimeStr, 'YYYY-MM-DD HH:mm:ss');
    } else {
        time = moment.utc(match[0], 'YYYY-MM-DD HH:mm:ss');
    }

    if (!time.isValid()) {
        return null;
    }

    timeStr = time.utcOffset(jp_client ? '+09:00' : '+00:00').format((hideSeconds ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm:ss') + (showTimeZone && showTimeZone !== '' ? jp_client ? ' zZ' : ' Z' : ''));

    return (longcode ? longcode.replace(match[0], timeStr) : timeStr);
}

function downloadCSV(csvContents, filename) {
    filename = filename || 'data.csv';
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(new Blob([csvContents], { type: 'text/csv;charset=utf-8;' }), filename);
    } else { // Other browsers
        var csv = 'data:text/csv;charset=utf-8,' + csvContents;
        var downloadLink = document.createElement('a');
        downloadLink.href = encodeURI(csv);
        downloadLink.download = filename;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

function template(string, content) {
    return string.replace(/\[_(\d+)\]/g, function(s, index) {
        return content[(+index) - 1];
    });
}

function objectNotEmpty(obj) {
    var isEmpty = true;
    if (obj && obj instanceof Object) {
        Object.keys(obj).forEach(function(key) {
            if (obj.hasOwnProperty(key)) isEmpty = false;
        });
    }
    return !isEmpty;
}

function parseLoginIDList(string) {
    if (!string) return [];
    return string.split('+').sort().map(function(str) {
        var items = str.split(':');
        var id = items[0];
        return {
            id           : id,
            real         : items[1] === 'R',
            disabled     : items[2] === 'D',
            financial    : /^MF/.test(id),
            non_financial: /^MLT/.test(id),
        };
    });
}

module.exports = {
    showLoadingImage    : showLoadingImage,
    get_highest_zindex  : get_highest_zindex,
    showLocalTimeOnHover: showLocalTimeOnHover,
    toJapanTimeIfNeeded : toJapanTimeIfNeeded,
    downloadCSV         : downloadCSV,
    template            : template,
    objectNotEmpty      : objectNotEmpty,
    parseLoginIDList    : parseLoginIDList,
};
