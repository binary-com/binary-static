const IPHistoryInit = require('./iphistory.init');
const BinaryPjax    = require('../../../../../base/binary_pjax');
const Client        = require('../../../../../base/client');

const IPHistory = (() => {
    const onLoad = () => {
        if (Client.get('is_jp')) {
            BinaryPjax.loadPreviousUrl();
            return;
        }
        IPHistoryInit.init();
    };

    const onUnload = () => {
        IPHistoryInit.clean();
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = IPHistory;
