const BinaryPjax       = require('../../../../base/binary_pjax');
const Content          = require('../../../../common_functions/content').Content;
const japanese_client  = require('../../../../common_functions/country_base').japanese_client;
const ApplicationsInit = require('./authorised_apps/authorised_apps.init');

const AuthorisedApps = (() => {
    const onLoad = () => {
        if (japanese_client()) {
            BinaryPjax.load('user/settingsws');
        }
        Content.populate();
        ApplicationsInit.init();
    };

    const onUnload = () => {
        ApplicationsInit.clean();
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = AuthorisedApps;
