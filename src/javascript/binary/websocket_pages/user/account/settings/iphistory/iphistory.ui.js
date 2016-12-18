var showLocalTimeOnHover = require('../../../../../base/utility').showLocalTimeOnHover;
var FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
var moment = require('moment');

var IPHistoryUI = (function() {
    'use strict';

    var containerSelector = '#login_history-ws-container';
    var no_messages_error = 'Your account has no Login/Logout activity.';
    var flexTable;

    function init() {
        var $title = $('#login_history-title').children().first();
        $title.text(page.text.localize($title.text()));
    }

    function update(history) {
        if (flexTable) {
            return flexTable.replace(history);
        }
        var headers = ['Date and Time', 'Action', 'Browser', 'IP Address', 'Status'];
        var columns = ['timestamp', 'action', 'browser', 'ip', 'status'];
        flexTable = new FlexTableUI({
            id       : 'login-history-table',
            container: containerSelector,
            header   : headers.map(function(s) { return page.text.localize(s); }),
            cols     : columns,
            data     : history,
            formatter: formatRow,
            style    : function($row) {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return flexTable.displayError(page.text.localize(no_messages_error), 6);
        }
        return showLocalTimeOnHover('td.timestamp');
    }

    function formatRow(data) {
        var timestamp = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        var status = page.text.localize(data.success ? 'Successful' : 'Failed');
        var browser = data.browser;
        var browserString = browser ?
            browser.name + ' v' + browser.version :
            'Unknown';
        var patt = (/(opera|chrome|safari|firefox|IE|Edge|SeaMonkey|Chromium) v[0-9.]+/gi);
        if((patt.test(browserString)) === false) {
            if(browserString !== 'Unknown'){
            browserString = 'error';
            }
        }
        return [
            timestamp,
            data.action,
            browserString,
            data.ip_addr,
            status
        ];
    }

    function clean() {
        $(containerSelector + ' .error-msg').text('');
        flexTable.clear();
        flexTable = null;
    }

    function displayError(error) {
        $('#err').text(error);
    }

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = {
    IPHistoryUI: IPHistoryUI,
};
