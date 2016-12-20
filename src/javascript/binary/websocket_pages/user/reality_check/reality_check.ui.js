var showLocalTimeOnHover  = require('../../../base/utility').showLocalTimeOnHover;
var onlyNumericOnKeypress = require('../../../common_functions/event_handler').onlyNumericOnKeypress;
var Content               = require('../../../common_functions/content').Content;
var RealityCheckData      = require('./reality_check.data').RealityCheckData;
require('../../../../lib/polyfills/array.includes');
require('../../../../lib/polyfills/string.includes');

var RealityCheckUI = (function() {
    'use strict';

    var frequency_url = page.url.url_for('user/reality_check_frequencyws');
    var summary_url = page.url.url_for('user/reality_check_summaryws');
    var hiddenClass = 'invisible';
    var loginTime; // milliseconds
    var getAccountStatus;

    function initializeValues() {
        getAccountStatus = false;
    }

    function showPopUp(content) {
        if ($('#reality-check').length > 0) {
            return;
        }

        var lightboxDiv = $("<div id='reality-check' class='lightbox'></div>");

        var wrapper = $('<div></div>');
        wrapper = wrapper.append(content);
        wrapper = $('<div></div>').append(wrapper);
        wrapper.appendTo(lightboxDiv);
        lightboxDiv.appendTo('body');

        $('#realityDuration').val(RealityCheckData.getInterval());
        $('#realityDuration').keypress(onlyNumericOnKeypress);
    }

    function showIntervalOnPopUp() {
        var intervalMinutes = Math.floor(RealityCheckData.getInterval() / 60 / 1000);
        $('#realityDuration').val(intervalMinutes);
    }

    function renderFrequencyPopUp() {
        $.ajax({
            url     : frequency_url,
            dataType: 'html',
            method  : 'GET',
            success : function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    var payload = $(realityCheckText);
                    showPopUp(payload.find('#reality-check-content'));
                    showIntervalOnPopUp();
                    $('#continue').click(RealityCheckUI.onContinueClick);
                }
            },
            error: function() {
            },
        });
        $('#continue').click(RealityCheckUI.onContinueClick);
    }

    function updateSummary(summary) {
        $('#start-time').text(summary.startTimeString);
        $('#login-time').text(summary.loginTime);
        $('#current-time').text(summary.currentTime);
        $('#session-duration').text(summary.sessionDuration);

        $('#login-id').text(summary.loginId);
        $('#rc_currency').text(summary.currency);
        $('#turnover').text(summary.turnover);
        $('#profitloss').text(summary.profitLoss);
        $('#bought').text(summary.contractsBought);
        $('#sold').text(summary.contractsSold);
        $('#open').text(summary.openContracts);
        $('#potential').text(summary.potentialProfit);

        showLocalTimeOnHover('#start-time');
        showLocalTimeOnHover('#login-time');
        showLocalTimeOnHover('#current-time');
    }

    function renderSummaryPopUp(summary) {
        $.ajax({
            url     : summary_url,
            dataType: 'html',
            method  : 'GET',
            success : function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    var payload = $(realityCheckText);
                    showPopUp(payload.find('#reality-check-content'));
                    updateSummary(summary);
                    showIntervalOnPopUp();
                    $('#continue').click(RealityCheckUI.onContinueClick);
                    $('button#btn_logout').click(RealityCheckUI.onLogoutClick);
                }
            },
            error: function() {
            },
        });
    }

    function frequencyEventHandler() {
        $('button#continue').click(function() {
            RealityCheckData.updateAck();
        });
    }

    function summaryEventHandler() {
        $('button#continue').click(function() {
            RealityCheckData.updateAck();
        });

        $('button#btn_logout').click(function() {
            BinarySocket.send({ logout: 1 });
        });
    }

    function closePopUp() {
        $('#reality-check').remove();
        RealityCheckUI.sendAccountStatus();
    }

    function onContinueClick() {
        var intervalMinute = +($('#realityDuration').val());

        if (!(Math.floor(intervalMinute) === intervalMinute && $.isNumeric(intervalMinute))) {
            var shouldBeInteger = page.text.localize('Interval should be integer.');
            $('#rc-err').text(shouldBeInteger);
            $('#rc-err').removeClass(hiddenClass);
            return;
        }

        if (intervalMinute < 10 || intervalMinute > 120) {
            Content.populate();
            var minimumValueMsg = Content.errorMessage('number_should_between', '10 to 120');
            $('#rc-err').text(minimumValueMsg);
            $('#rc-err').removeClass(hiddenClass);
            return;
        }

        var intervalMs = intervalMinute * 60 * 1000;
        RealityCheckData.updateInterval(intervalMs);
        RealityCheckData.triggerCloseEvent();
        RealityCheckData.updateAck();
        RealityCheckUI.closePopUp();
        startSummaryTimer();
        sendAccountStatus();
    }

    function onLogoutClick() {
        logout();
    }

    function logout() {
        BinarySocket.send({ logout: '1' });
    }

    function sendAccountStatus() {
        if (!page.client.is_virtual() && page.client.residence !== 'jp' && !getAccountStatus) {
            BinarySocket.send({ get_account_status: 1 });
            getAccountStatus = true;
        }
    }

    function computeIntervalForNextPopup(loggedinTime, interval) {
        var currentTime = Date.now();
        var timeLeft = interval - ((currentTime - loggedinTime) % interval);
        return timeLeft;
    }

    function startSummaryTimer() {
        var interval = RealityCheckData.getInterval();
        var toWait = computeIntervalForNextPopup(loginTime, interval);

        window.setTimeout(function() {
            RealityCheckData.setOpenSummaryFlag();
            RealityCheckData.getSummaryAsync();
        }, toWait);
    }

    return {
        frequencyEventHandler: frequencyEventHandler,
        summaryEventHandler  : summaryEventHandler,
        renderFrequencyPopUp : renderFrequencyPopUp,
        renderSummaryPopUp   : renderSummaryPopUp,
        closePopUp           : closePopUp,
        onContinueClick      : onContinueClick,
        onLogoutClick        : onLogoutClick,
        sendAccountStatus    : sendAccountStatus,
        initializeValues     : initializeValues,
        startSummaryTimer    : startSummaryTimer,
        setLoginTime         : function(time) { loginTime = time; },
    };
})();

module.exports = {
    RealityCheckUI: RealityCheckUI,
};
