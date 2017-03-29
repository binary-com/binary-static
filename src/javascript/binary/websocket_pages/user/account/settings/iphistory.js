const IPHistoryInit = require('./iphistory/iphistory.init');
const BinaryPjax    = require('../../../../base/binary_pjax');
const jpClient      = require('../../../../common_functions/country_base').jpClient;

const IPHistory = (() => {
    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('user/settingsws');
        }
        IPHistoryInit.init();
    };

    const onUnload = () => {
        IPHistoryInit.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = IPHistory;
