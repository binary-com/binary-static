const Applications    = require('./authorised_apps/authorised_apps.init').Applications;
const BinaryPjax      = require('../../../../base/binary_pjax');
const Content         = require('../../../../common_functions/content').Content;
const japanese_client = require('../../../../common_functions/country_base').japanese_client;

const AuthorisedApps = (function() {
    const onLoad = function() {
        if (japanese_client()) {
            BinaryPjax.load('user/settingsws');
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
