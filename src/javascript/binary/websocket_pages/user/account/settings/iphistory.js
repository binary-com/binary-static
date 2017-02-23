const IPHistory       = require('./iphistory/iphistory.init').IPHistory;
const BinaryPjax      = require('../../../../base/binary_pjax');
const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;

const IPHistoryWS = (function() {
    const onLoad = function() {
        if (japanese_client()) {
            BinaryPjax.load('user/settingsws');
        }
        Content.populate();
        IPHistory.init();
    };

    const onUnload = function() {
        IPHistory.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = IPHistoryWS;
