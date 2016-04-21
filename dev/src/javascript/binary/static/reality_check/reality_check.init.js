var RealityCheck = (function () {
    'use strict';
    var hiddenClass = 'invisible';
    var loginTime;

    function realityCheckWSHandler(response) {
        if ($.isEmptyObject(response.reality_check)) {
            // not required for reality check
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

    function onContinueClick() {
        var intervalMinute = +($('#realityDuration').val());

        if (!(Math.floor(intervalMinute) == intervalMinute && $.isNumeric(intervalMinute))) {
            var shouldBeInteger = text.localize('Interval should be integer.');
            $('p.error-msg').text(shouldBeInteger);
            $('p.error-msg').removeClass(hiddenClass);
            return;
        }

        if (intervalMinute < 10 || intervalMinute > 120) {
            var minimumValueMsg = Content.errorMessage('number_should_between', '10 to 120');
            $('p.error-msg').text(minimumValueMsg);
            $('p.error-msg').removeClass(hiddenClass);
            return;
        }
        
        var intervalMs = intervalMinute * 60 * 1000;
        RealityCheckData.updateInterval(intervalMs);
        RealityCheckData.triggerCloseEvent();
        RealityCheckData.updateAck();
        RealityCheckUI.closePopUp();
        startSummaryTimer();
    }

    function onLogoutClick() {
        logout();
    }

    function logout() {
        BinarySocket.send({"logout": "1"});
    }

    function init() {
        if (!page.client.require_reality_check()) {
            RealityCheckData.setPreviousLoadLoginId();
            return;
        }

        var rcCookie = getCookieItem('reality_check');
        loginTime = rcCookie && rcCookie.split(',')[1] * 1000;

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
    }
    
    return {
        init: init,
        onContinueClick: onContinueClick,
        onLogoutClick: onLogoutClick,
        realityCheckWSHandler: realityCheckWSHandler
    };
}());
