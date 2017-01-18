const RealityCheckUI   = require('./reality_check.ui').RealityCheckUI;
const RealityCheckData = require('./reality_check.data').RealityCheckData;
const Client           = require('../../../base/client').Client;

const RealityCheck = (function() {
    'use strict';

    const realityCheckWSHandler = function(response) {
        RealityCheckUI.initializeValues();
        if ($.isEmptyObject(response.reality_check)) {
            // not required for reality check
            RealityCheckUI.sendAccountStatus();
            return;
        }
        if (/no-reality-check/.test(window.location.hash)) {
            RealityCheckData.set_value('delay_check', 1);
        } else {
            RealityCheckData.set_value('delay_check', 0);
            const summary = RealityCheckData.summaryData(response.reality_check);
            RealityCheckUI.renderSummaryPopUp(summary);
        }
    };

    const realityStorageEventHandler = function(ev) {
        if (ev.key === 'reality_check.ack' && ev.newValue === '1') {
            RealityCheckUI.closePopUp();
            RealityCheckUI.startSummaryTimer();
        } else if (ev.key === 'reality_check.keep_open' && ev.newValue === '0') {
            RealityCheckUI.closePopUp();
            RealityCheckUI.startSummaryTimer();
        }
    };

    const init = function() {
        RealityCheckUI.initializeValues();
        if (!Client.get_boolean('has_reality_check')) {
            RealityCheckData.set_value('loginid', Client.get_value('loginid'));
            RealityCheckUI.sendAccountStatus();
            return;
        }

        RealityCheckUI.setLoginTime(Client.get_value('session_start') * 1000);

        window.addEventListener('storage', realityStorageEventHandler, false);

        if (Client.get_value('loginid') !== RealityCheckData.get_value('loginid')) {
            RealityCheckData.clear();
        }

        RealityCheckData.resetInvalid(); // need to reset after clear

        if (!RealityCheckData.get_value('ack')) {
            RealityCheckUI.renderFrequencyPopUp();
        } else if (RealityCheckData.get_value('keep_open')) {
            RealityCheckData.getSummaryAsync();
        } else {
            RealityCheckUI.startSummaryTimer();
        }

        RealityCheckData.set_value('loginid', Client.get_value('loginid'));
        RealityCheckUI.sendAccountStatus();
    };

    return {
        init                 : init,
        realityCheckWSHandler: realityCheckWSHandler,
    };
})();

module.exports = {
    RealityCheck: RealityCheck,
};
