var japanese_client = require('../../../../common_functions/country_base').japanese_client;
var Applications = require('./authorised_apps/authorised_apps.init').Applications;

var AuthorisedApps = (function() {
    var onLoad = function() {
        if (japanese_client()) {
            window.location.href = page.url.url_for('user/settingsws');
        }
        Content.populate();
        Applications.init();
    };

    var onUnload = function() {
        Applications.clean();
    };

    return {
        onLoad: onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    AuthorisedApps: AuthorisedApps,
};
