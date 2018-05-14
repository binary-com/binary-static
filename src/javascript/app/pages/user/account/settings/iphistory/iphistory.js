const IPHistoryInit = require('./iphistory.init');
const BinaryPjax    = require('../../../../../base/binary_pjax');
const isJPClient    = require('../../../../../base/client').isJPClient;

const IPHistory = (() => {
    const onLoad = () => {
        if (isJPClient()) {
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
