import IPHistoryInit from './iphistory/iphistory.init';
import BinaryPjax from '../../../../base/binary_pjax';
import { jpClient } from '../../../../common_functions/country_base';

const IPHistory = (() => {
    const onLoad = () => {
        if (jpClient()) {
            BinaryPjax.load('user/settingsws');
        }
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
