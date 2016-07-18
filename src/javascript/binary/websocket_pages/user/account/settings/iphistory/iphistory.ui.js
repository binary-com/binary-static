var IPHistoryUI = (function() {
    'use strict';

    var containerSelector = '#login_history-ws-container';
    var no_messages_error = 'Your account has no Login/Logout activity.';
    var flexTable;

    function init() {
        var $title = $('#login_history-title').children().first();
        $title.text(text.localize($title.text()));
    }

    function update(history) {
        if (flexTable) {
            return flexTable.replace(history);
        }
        var headers = ['Date and Time', 'Action', 'Browser', 'IP Address', 'Status'];
        var columns = ['timestamp', 'action', 'browser', 'ip', 'status'];
        flexTable = new FlexTableUI({
            id:        'login-history-table',
            container: containerSelector,
            header:    headers.map(function(s) { return text.localize(s); }),
            cols:      columns,
            data:      history,
            formatter: formatRow,
            style: function($row) {
                $row.children('.timestamp').addClass('pre');
            },
        });
        if (!history.length) {
            return flexTable.displayError(text.localize(no_messages_error), 6);
        }
        showLocalTimeOnHover('td.timestamp');
    }

    function formatRow(data) {
        var timestamp = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        var status = text.localize(data.success ? 'Successful' : 'Failed');
        var browser = data.browser;
        var browserString = browser ?
            browser.name + ' v' + browser.version :
            'Unknown';
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
        init: init,
        clean: clean,
        update: update,
        displayError: displayError,
    };
}());
