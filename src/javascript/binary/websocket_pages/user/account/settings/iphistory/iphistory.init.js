var IPHistory = (function() {
    'use strict';

    function makeRequest() {
        BinarySocket.send({login_history: 1, limit: 50});
    }

    function responseHandler(msg) {
        var response = JSON.parse(msg.data);
        if (!response || response.msg_type !== 'login_history') {
            return;
        }
        if (response.error && response.error.message) {
            return IPHistoryUI.displayError(response.error.message);
        }
        var parsed = response.login_history.map(IPHistoryData.parse);
        IPHistoryUI.displayTable(parsed);
    }

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
