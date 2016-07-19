var IPHistory = (function() {
    'use strict';

    function responseHandler(response) {
        if (response.error && response.error.message) {
            return IPHistoryUI.displayError(response.error.message);
        }
        var parsed = response.login_history.map(IPHistoryData.parse);
        IPHistoryUI.update(parsed);
    }

    function init() {
        IPHistoryUI.init();
        BinarySocket.init({
            onmessage: IPHistoryData.calls(responseHandler)
        });
        IPHistoryData.get(50);
    }

    function clean() {
        IPHistoryUI.clean();
    }

    return {
        init: init,
        clean: clean,
    };
})();
