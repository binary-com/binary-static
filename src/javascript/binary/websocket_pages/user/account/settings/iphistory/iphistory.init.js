var IPHistory = (function() {
    'use strict';

    var no_messages_error = text.localize(
        "Your account has no Login/Logout activity."
    );

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
                        text: no_messages_error
                      })
                    )
                )
            );
    }

    function getNextChunk() {
        IPHistoryQueue.fetchNext({limit: 50});
    }

    function handler(response) {
        if (response.error && response.error.message) {
            document.getElementById('err').textContent = response.error.message;
            return;
        }

        var login_history = response.login_history;
        updateTable(login_history);
    }

    function loadChunkOnScroll() {
       $(document).scroll(function() {
            function hidableHeight(percentage) {
                var totalHidable = $(document).height() - $(window).height();
                return Math.floor(totalHidable * percentage / 100);
            }

            var pFromTop = $(document).scrollTop();
            if (pFromTop < hidableHeight(70)) {
                return;
            }
            getNextChunk();
       });
    }

    // localize, title, create tables
    // register the callback on IPHistoryQueue
    function init() {
        var titleElement = $id('login_history-title').firstElementChild;
        titleElement.textContent = text.localize(titleElement.textContent);
        IPHistoryUI.createEmptyTable().appendTo('#login_history-ws-container');
        IPHistoryQueue.register(handler);
        loadChunkOnScroll();
        getNextChunk();
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
