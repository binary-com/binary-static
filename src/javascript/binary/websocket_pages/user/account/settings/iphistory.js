const IPHistoryInit   = require('./iphistory/iphistory.init');
const BinaryPjax      = require('../../../../base/binary_pjax');
const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;

const IPHistory = (() => {
    const onLoad = () => {
        if (japanese_client()) {
            BinaryPjax.load('user/settingsws');
        }
        Content.populate();
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
