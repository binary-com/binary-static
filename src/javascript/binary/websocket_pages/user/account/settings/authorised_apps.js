const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;
const url_for         = require('../../../../base/url').url_for;
const Applications    = require('./authorised_apps/authorised_apps.init').Applications;

const AuthorisedApps = (function() {
    const onLoad = function() {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
        }
        Content.populate();
        Applications.init();
    };

    const onUnload = function() {
        Applications.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = AuthorisedApps;
