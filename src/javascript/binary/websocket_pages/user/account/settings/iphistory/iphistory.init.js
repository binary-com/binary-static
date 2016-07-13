var IPHistory = (function() {
    'use strict';

    var no_messages_error = "Your account has no Login/Logout activity.";

    function updateTable(batch) {
        IPHistoryUI.updateTable(batch);
        if (batch.length) {
            return;
        }
        $('#login-history-table tbody')
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

    function handler(response) {
        if (response.error && response.error.message) {
            document.getElementById('err').textContent = response.error.message;
            return;
        }
        updateTable(response.login_history);
    }

    // localize, title, create tables
    // register the callback on IPHistoryQueue
    function init() {
        var titleElement = document.getElementById('login_history-title').firstElementChild;
        titleElement.textContent = text.localize(titleElement.textContent);
        IPHistoryUI.createEmptyTable().appendTo('#login_history-ws-container');
        IPHistoryQueue.register(handler);
        IPHistoryQueue.fetchNext({limit: 50});
    }

    function clean() {
        $('#login_history-ws-container .error-msg').text('');
        IPHistoryUI.clearTableContent();
        IPHistoryQueue.clear();
    }

    return {
        init: init,
        clean: clean,
    };
})();
