import ApplicationsInit from './authorised_apps/authorised_apps.init';
import BinaryPjax from '../../../../base/binary_pjax';
import { jpClient } from '../../../../common_functions/country_base';

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
