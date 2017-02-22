const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;
const url_for         = require('../../../../base/url').url_for;
const IPHistory       = require('./iphistory/iphistory.init').IPHistory;

const IPHistoryWS = (function() {
    const onLoad = function() {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
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
