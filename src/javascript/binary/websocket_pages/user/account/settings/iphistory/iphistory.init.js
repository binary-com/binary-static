const IPHistoryUI   = require('./iphistory.ui');
const IPHistoryData = require('./iphistory.data');

const IPHistoryInit = (function() {
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
        const req = {
            login_history: '1',
            limit        : 50,
        };
        BinarySocket.send(req).then((response) => {
            responseHandler(response);
        });
    };

    const clean = function() {
        IPHistoryUI.clean();
    };

    return {
        init : init,
        clean: clean,
    };
})();

module.exports = IPHistoryInit;
