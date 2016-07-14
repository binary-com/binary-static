var IPHistoryUI = (function() {
    'use strict';

    var tableID  = 'login-history-table';
    var selector = '#' + tableID;
    var containerSelector = '#login_history-ws-container';
    var columns  = ['timestamp', 'action', 'browser', 'ip', 'status'];
    var no_messages_error = 'Your account has no Login/Logout activity.';

    function init() {
        var $title = $('#login_history-title').children().first();
        $title.text(text.localize($title.text()));
    }

    function displayError() {
        $(selector + ' tbody')
            .append($('<tr/>', {class: 'flex-tr'})
                .append($('<td/>', {colspan: 6})
                    .append($('<p/>', {
                        class: 'notice-msg center-text',
                        text: text.localize(no_messages_error)
                      })
                    )
                )
            );
    }

    function displayTable(history) {
        var header = [
            'Date and Time',
            'Action',
            'Browser',
            'IP Address',
            'Status',
        ].map(text.localize);
        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $table = Table.createFlexTable(data, metadata, header);
        $table.appendTo(containerSelector);
        if (!history.length) {
            return displayError();
        }
        Table.appendTableBody(tableID, history, formatRow);
        showLocalTimeOnHover('td.timestamp');
    }

    function formatRow(data) {
        var timestamp = moment.unix(data.time).utc().format('YYYY-MM-DD HH:mm:ss').replace(' ', '\n') + ' GMT';
        var status = text.localize(data.success ? 'Successful' : 'Failed');
        var browser = data.browser;
        var browserString = browser ?
            browser.name + ' v' + browser.version :
            'Unknown';
        var row = [
            timestamp,
            data.action,
            browserString,
            data.ip_addr,
            status
        ];
        var $row = Table.createFlexTableRow(row, columns, 'data');
        $row.children('.timestamp').addClass('pre');
        return $row[0];
    }

    function clean() {
        $(containerSelector + ' .error-msg').text('');
        if ($(selector).length) {
            Table.clearTableBody(tableID);
            $(selector +'>tfoot').hide();
        }
    }

    function displayErrorOnMain(error) {
        $('#err').text(error);
    }

    return {
        init: init,
        clean: clean,
        displayTable: displayTable,
        displayError: displayErrorOnMain,
    };
}());
