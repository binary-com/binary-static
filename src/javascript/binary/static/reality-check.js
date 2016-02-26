var RealityCheck = (function() {
    "use strict";
    var reality_check_url = page.url.url_for('user/reality_check');
    var reality_freq_url  = page.url.url_for('user/reality_check_frequency');
    var defaultFrequencyInMin = 60;
    var loginTime;

    function computeIntervalForNextPopup(loginTime, interval) {
        var currentTime = Date.now();
        var timeLeft = interval - ((currentTime - loginTime) % interval);
        return timeLeft;
    }

    function currentFrequencyInMS() {
        var currentInterval = LocalStore.get('reality_check.interval');
        if (!currentInterval) {
            LocalStore.set('reality_check.interval', defaultFrequencyInMin * 60 * 1000);
            return defaultFrequencyInMin * 60 * 1000;
        }
        return currentInterval;
    }

    function updateFrequency(mins) {
        var ms;
        if (mins > 9999) {
            $('#realityDuration').val(9999);
            ms = 9999 * 60 * 1000;
            LocalStore.set('reality_check.interval', ms);
        } else {
            ms = mins * 60 * 1000;
            LocalStore.set('reality_check.interval', ms);
        }
    }

    function displayPopUp(div) {
        if ($('#reality-check').length > 0) {
            return;
        }
        LocalStore.set('reality_check.close', 'false');
        var lightboxDiv = $("<div id='reality-check' class='lightbox'></div>");

        var wrapper = $('<div></div>');
        wrapper = wrapper.append(div);
        wrapper = $('<div></div>').append(wrapper);
        wrapper.appendTo(lightboxDiv);
        lightboxDiv.appendTo('body');

        var inputBox = lightboxDiv.find('#realityDuration');
        inputBox.val(currentFrequencyInMS() / 60 / 1000);
        inputBox.keyup(function(e) {
            updateFrequency(e.target.value);
        });

        lightboxDiv.find('#continue').click(function() {
            LocalStore.set('reality_check.ack', 1);
            closePopUp();
        });
        lightboxDiv.find('#btn_logout').click(function(){
            LocalStore.set('reality_check.ack', 0);
            BinarySocket.send({"logout": "1"});
        });
    }

    function closePopUp() {
        $('#reality-check').remove();
        LocalStore.set('reality_check.close', 'true');
        popUpWhenIntervalHit();         // start timer only after user click continue trading
    }

    function popUpFrequency() {
        if(LocalStore.get('reality_check.ack') === '1') {
            return;
        }

        // show pop up to get user approval
        $.ajax({
            url: reality_freq_url,
            dataType: 'html',
            method: 'POST',
            success: function(realityFreqText) {
                displayPopUp($(realityFreqText));
            },
            error: function(xhr) {
                return;
            }
        });
    }

    function popUpRealityCheck() {
        $.ajax({
            url: reality_check_url,
            dataType: 'html',
            method: 'POST',
            success: function(realityCheckText) {
                displayPopUp($(realityCheckText));
            },
            error: function(xhr) {
                return;
            }
        });
    }

    function popUpWhenIntervalHit() {
        var interval = LocalStore.get('reality_check.interval');

        window.setTimeout(function() {
            popUpRealityCheck();
        }, computeIntervalForNextPopup(loginTime, interval));
    }

    function popUpCloseHandler(ev) {
        if (ev.key === 'reality_check.close' && ev.newValue === 'true') {
            closePopUp();
        } else if (ev.key === 'reality_check.interval') {
            $('#realityDuration').val(ev.newValue / 60 / 1000);
        }
    }

    function init() {
        // to change old interpretation of reality_check
        if (LocalStore.get('reality_check.ack') > 1) {
            LocalStore.set('reality_check.ack', 0);
        }

        var rcCookie = getCookieItem('reality_check');
        loginTime = rcCookie && rcCookie.split(',')[1] * 1000;
        window.addEventListener('storage', popUpCloseHandler, false);

        popUpFrequency();
        popUpWhenIntervalHit();
    }

    return {
        init: init
    };
}());
