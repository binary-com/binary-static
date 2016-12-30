var Content         = require('../../../../common_functions/content').Content;
var japanese_client = require('../../../../common_functions/country_base').japanese_client;
var url_for         = require('../../../../base/url').url_for;
var IPHistory       = require('./iphistory/iphistory.init').IPHistory;

var IPHistoryWS = (function() {
    var onLoad = function() {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
        }
        Content.populate();
        IPHistory.init();
    };

    var onUnload = function() {
        IPHistory.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    IPHistoryWS: IPHistoryWS,
};
