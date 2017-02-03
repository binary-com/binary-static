const IPHistoryUI   = require('./iphistory.ui').IPHistoryUI;
const IPHistoryData = require('./iphistory.data').IPHistoryData;

const IPHistory = (function() {
    'use strict';

    const responseHandler = function(response) {
        if (response.error && response.error.message) {
            return IPHistoryUI.displayError(response.error.message);
        }
        const parsed = response.login_history.map(IPHistoryData.parse);
        return IPHistoryUI.update(parsed);
    };

    const init = function() {
        IPHistoryUI.init();
        BinarySocket.init({
            onmessage: IPHistoryData.calls(responseHandler),
        });
        IPHistoryData.get(50);
    };

    const clean = function() {
        IPHistoryUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = {
    IPHistory: IPHistory,
};
