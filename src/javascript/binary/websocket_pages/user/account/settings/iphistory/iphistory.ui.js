const showLocalTimeOnHover = require('../../../../../base/clock').showLocalTimeOnHover;
const FlexTableUI = require('../../../../../common_functions/attach_dom/flextable').FlexTableUI;
const moment      = require('moment');
const localize    = require('../../../../../base/localize').localize;

const IPHistoryUI = (() => {
    'use strict';

    const container_selector = '#login_history-ws-container';
    const no_messages_error  = 'Your account has no Login/Logout activity.';
    let flex_table;

    const init = () => {
        const $title = $('#login_history-title').children().first();
        $title.text(localize($title.text()));
    };

    const formatRow = (data) => {
        const timestamp = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        const status    = localize(data.success ? 'Successful' : 'Failed');
        const action    = localize(data.action);
        const browser   = data.browser;
        let browser_string = browser ?
            browser.name + ' v' + browser.version :
            'Unknown';
        const patt = /^(opera|chrome|safari|firefox|IE|Edge|SeaMonkey|Chromium) v[0-9.]+$/i;
        if (!patt.test(browser_string) && browser_string !== 'Unknown') {
            browser_string = 'Error';
        }
        return [
            timestamp,
            action,
            browser_string,
            data.ip_addr,
            status,
        ];
    };

    const update = (history) => {
        if (flex_table) {
            return flex_table.replace(history);
        }
        const headers = ['Date and Time', 'Action', 'Browser', 'IP Address', 'Status'];
        const columns = ['timestamp', 'action', 'browser', 'ip', 'status'];
        flex_table = new FlexTableUI({
            id       : 'login-history-table',
            container: container_selector,
            header   : headers.map(function(s) { return localize(s); }),
            cols     : columns,
            data     : history,
            formatter: formatRow,
            style    : function($row) {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return flex_table.displayError(localize(no_messages_error), 6);
        }
        return showLocalTimeOnHover('td.timestamp');
    };

    const clean = () => {
        $(container_selector + ' .error-msg').text('');
        if (flex_table) {
            flex_table.clear();
            flex_table = null;
        }
    };

    const displayError = (error) => {
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
