var realityCheck = (function() {
    "use strict";
    var reality_check_url = page.url.url_for('user/reality_check');
    var reality_freq_url  = page.url.url_for('user/reality_check_frequency');
    var defaultFrequencyInMin = 60;

    function currentFrequencyInMS() {
        return LocalStore.get('reality_check.interval') || defaultFrequencyInMin * 60 * 1000;
    };

    function updateFrequency(min) {
        var ms = min * 60 * 1000;
        LocalStore.set('reality_check.interval', ms);
    }

    function displayPopUp(div) {
        var lightboxDiv = $("<div id='reality-check' class='lightbox'><div></div></div>");
        div.appendTo(lightboxDiv);
        lightboxDiv.appendTo('body');
        var inputBox = lightboxDiv.find('#realityDuration')
        inputBox.val(currentFrequencyInMS());
        inputBox.change(function(e) {
            updateFrequency(e.target.value);
        });

        lightboxDiv.find('#continue').click(closePopUp);
        lightboxDiv.find('#btn_logout').click(function(){
            BinarySocket.send({"logout": "1"});
        });
    }

    function closePopUp() {
        $('#reality-check').remove();
    }

    function popUpFrequency() {
        // show pop up to get user approval
        $.ajax({
            url: reality_freq_url,
            dataType: 'html',
            success: function(realityFreqText) {
                displayPopUp($(realityFreqText));
            },
            error: function (xhr) {
                if (xhr.status === 404) return;
            }
        });
    }

    function popUpRealityCheck() {
        $.ajax({
            url: reality_check_url,
            dataType: 'html',
            success: function(realityCheckText) {
                var realityCheckDiv = $(realityCheckText);
                var loginDate = new Date(realityCheckDiv.find('#login-time').text());

                realityCheckDiv
                    .find('#current-time')
                    .value(loginDate.toUTCString());
                displayPopUp(realityCheckDiv);
                window.setInterval(function () {
                    realityCheckDiv
                        .find('#current-time')
                        .value((new Date()).toUTCString());
                }, 1000);
            },
            error: function (xhr) {
                if (xhr.status === 404) return;
            }
        });
    }
    
}());
