var IPHistory = (function() {
    'use strict';

    function makeRequest() {
        var request = {login_history: 1, limit: 50};
        BinarySocket.send(request);
    }

    function responseHandler(msg) {
        var response = JSON.parse(msg.data);
        if (!response || response.msg_type !== 'login_history') {
            return;
        }
        if (response.error && response.error.message) {
            IPHistoryUI.displayError(response.error.message);
        }
        var parsed = response.login_history.map(IPHistoryData.parse);
        IPHistoryUI.displayTable(parsed);
    }

    // localize, title, create tables
    // register the callback on IPHistoryQueue
    function init() {
        IPHistoryUI.init();
        makeRequest();
    }

    function clean() {
        IPHistoryUI.clean();
    }

    return {
        init: init,
        clean: clean,
        responseHandler: responseHandler,
    };
})();
