const ApplicationsInit = require('./authorised_apps/authorised_apps.init');
const BinaryPjax       = require('../../../../base/binary_pjax');
const jpClient         = require('../../../../common_functions/country_base').jpClient;

const AuthorisedApps = (() => {
    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('user/settingsws');
        }
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
