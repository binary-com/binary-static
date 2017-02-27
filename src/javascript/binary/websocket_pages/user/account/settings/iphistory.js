const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;
const url_for         = require('../../../../base/url').url_for;
const IPHistoryInit   = require('./iphistory/iphistory.init');

const IPHistory = (() => {
    const onLoad = () => {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
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
