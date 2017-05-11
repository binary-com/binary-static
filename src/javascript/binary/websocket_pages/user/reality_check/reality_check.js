const RealityCheckData = require('./reality_check.data');
const RealityCheckUI   = require('./reality_check.ui');
const BinarySocket     = require('../../socket');
const Client           = require('../../../base/client');

const RealityCheck = (() => {
    'use strict';

    const storageHandler = (ev) => {
        const key = ev.key;
        const new_value = ev.newValue;
        if ((key === 'client.reality_check.ack' && +new_value === 1) ||
            (key === 'client.reality_check.keep_open' && +new_value === 0)) {
            RealityCheckUI.closePopUp();
        }
    };

    const onLoad = () => {
        if (RealityCheckUI.shouldShowPopup()) {
            BinarySocket.wait('landing_company').then(() => {
                if ((Client.currentLandingCompany() || {}).has_reality_check) {
                    RealityCheckUI.setLoginTime(Client.get('session_start') * 1000);
                    window.addEventListener('storage', storageHandler, false);

                    RealityCheckData.resetInvalid();

                    if (!RealityCheckData.get('ack')) {
                        RealityCheckUI.renderFrequencyPopUp();
                    } else if (RealityCheckData.get('keep_open')) {
                        RealityCheckUI.getSummaryAsync();
                    } else {
                        RealityCheckUI.startSummaryTimer();
                    }
                }
            });
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = RealityCheck;
