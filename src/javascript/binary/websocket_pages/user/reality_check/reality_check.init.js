var Content = require('../../../common_functions/content').Content;
var RealityCheckUI = require('./reality_check.ui').RealityCheckUI;
var RealityCheckData = require('./reality_check.data').RealityCheckData;

var RealityCheck = (function () {
    'use strict';
    var hiddenClass = 'invisible';
    var loginTime;      // milliseconds
    var getAccountStatus;

    function initializeValues() {
      getAccountStatus = false;
    }

    function realityCheckWSHandler(response) {
        initializeValues();
        if ($.isEmptyObject(response.reality_check)) {
            // not required for reality check
            RealityCheckUI.sendAccountStatus();
            return;
        }

        var summary = RealityCheckData.summaryData(response.reality_check);
        RealityCheckUI.renderSummaryPopUp(summary);
    }

    function computeIntervalForNextPopup(loginTime, interval) {
        var currentTime = Date.now();
        var timeLeft = interval - ((currentTime - loginTime) % interval);
        return timeLeft;
    }

    function startSummaryTimer() {
        var interval = RealityCheckData.getInterval();
        var toWait = computeIntervalForNextPopup(loginTime, interval);

        window.setTimeout(function () {
            RealityCheckData.setOpenSummaryFlag();
            RealityCheckData.getSummaryAsync();
        }, toWait);
    }

    function realityStorageEventHandler(ev) {
        if (ev.key === 'reality_check.ack' && ev.newValue === '1') {
            RealityCheckUI.closePopUp();
            startSummaryTimer();
        } else if (ev.key === 'reality_check.keep_open' && ev.newValue === '0') {
            RealityCheckUI.closePopUp();
            startSummaryTimer();
        }
    }

    function init() {
        initializeValues();
        if (!page.client.require_reality_check()) {
            RealityCheckData.setPreviousLoadLoginId();
            RealityCheckUI.sendAccountStatus();
            return;
        }

        loginTime = TUser.get().logintime * 1000;

        window.addEventListener('storage', realityStorageEventHandler, false);

        if (TUser.get().loginid !== RealityCheckData.getPreviousLoadLoginId()) {
            RealityCheckData.clear();
        }

        RealityCheckData.resetInvalid();            // need to reset after clear

        if (RealityCheckData.getAck() !== '1') {
            RealityCheckUI.renderFrequencyPopUp();
        } else if (RealityCheckData.getOpenSummaryFlag() === '1') {
            RealityCheckData.getSummaryAsync();
        } else {
            startSummaryTimer();
        }

        RealityCheckData.setPreviousLoadLoginId();
        RealityCheckUI.sendAccountStatus();
    }

    return {
        init: init,
        realityCheckWSHandler: realityCheckWSHandler,
    };
}());

module.exports = {
    RealityCheck: RealityCheck,
};
