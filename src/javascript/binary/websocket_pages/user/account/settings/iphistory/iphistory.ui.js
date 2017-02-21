const showLocalTimeOnHover = require('../../../../../base/clock').Clock.showLocalTimeOnHover;
const FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const moment      = require('moment');
const localize    = require('../../../../../base/localize').localize;

const IPHistoryUI = (function() {
    'use strict';

    const containerSelector = '#login_history-ws-container';
    const no_messages_error = 'Your account has no Login/Logout activity.';
    let flexTable;

    const init = function() {
        const $title = $('#login_history-title').children().first();
        $title.text(localize($title.text()));
    };

    const formatRow = function(data) {
        const timestamp = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        const status = localize(data.success ? 'Successful' : 'Failed');
        const browser = data.browser;
        let browserString = browser ?
            browser.name + ' v' + browser.version :
            'Unknown';
        const patt = /^(opera|chrome|safari|firefox|IE|Edge|SeaMonkey|Chromium) v[0-9.]+$/i;
        if (!patt.test(browserString) && browserString !== 'Unknown') {
            browserString = 'Error';
        }
        return [
            timestamp,
            data.action,
            browserString,
            data.ip_addr,
            status,
        ];
    };

    const update = function(history) {
        if (flexTable) {
            return flexTable.replace(history);
        }
        const headers = ['Date and Time', 'Action', 'Browser', 'IP Address', 'Status'];
        const columns = ['timestamp', 'action', 'browser', 'ip', 'status'];
        flexTable = new FlexTableUI({
            id       : 'login-history-table',
            container: containerSelector,
            header   : headers.map(function(s) { return localize(s); }),
            cols     : columns,
            data     : history,
            formatter: formatRow,
            style    : function($row) {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return flexTable.displayError(localize(no_messages_error), 6);
        }
        return showLocalTimeOnHover('td.timestamp');
    };

    const clean = function() {
        $(containerSelector + ' .error-msg').text('');
        flexTable.clear();
        flexTable = null;
    };

    const displayError = function(error) {
        $('#err').text(error);
    };

    return {
        init        : init,
        clean       : clean,
        update      : update,
        displayError: displayError,
    };
})();

module.exports = IPHistoryUI;
