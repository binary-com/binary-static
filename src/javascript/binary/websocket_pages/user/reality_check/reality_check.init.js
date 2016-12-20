var RealityCheckUI   = require('./reality_check.ui').RealityCheckUI;
var RealityCheckData = require('./reality_check.data').RealityCheckData;
var Client           = require('../../../base/client').Client;

var RealityCheck = (function() {
    'use strict';

    function realityCheckWSHandler(response) {
        RealityCheckUI.initializeValues();
        if ($.isEmptyObject(response.reality_check)) {
            // not required for reality check
            RealityCheckUI.sendAccountStatus();
            return;
        }

        var summary = RealityCheckData.summaryData(response.reality_check);
        RealityCheckUI.renderSummaryPopUp(summary);
    }

    function realityStorageEventHandler(ev) {
        if (ev.key === 'reality_check.ack' && ev.newValue === '1') {
            RealityCheckUI.closePopUp();
            RealityCheckUI.startSummaryTimer();
        } else if (ev.key === 'reality_check.keep_open' && ev.newValue === '0') {
            RealityCheckUI.closePopUp();
            RealityCheckUI.startSummaryTimer();
        }
    }

    function init() {
        RealityCheckUI.initializeValues();
        if (!Client.require_reality_check()) {
            RealityCheckData.setPreviousLoadLoginId();
            RealityCheckUI.sendAccountStatus();
            return;
        }

        RealityCheckUI.setLoginTime(Client.get_value('session_start') * 1000);

        window.addEventListener('storage', realityStorageEventHandler, false);

        if (Client.get_value('loginid') !== RealityCheckData.getPreviousLoadLoginId()) {
            RealityCheckData.clear();
        }

        RealityCheckData.resetInvalid(); // need to reset after clear

        if (RealityCheckData.getAck() !== '1') {
            RealityCheckUI.renderFrequencyPopUp();
        } else if (RealityCheckData.getOpenSummaryFlag() === '1') {
            RealityCheckData.getSummaryAsync();
        } else {
            RealityCheckUI.startSummaryTimer();
        }

        RealityCheckData.setPreviousLoadLoginId();
        RealityCheckUI.sendAccountStatus();
    }

    return {
        init                 : init,
        realityCheckWSHandler: realityCheckWSHandler,
    };
})();

module.exports = {
    RealityCheck: RealityCheck,
};
