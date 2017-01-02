var showLocalTimeOnHover  = require('../../../base/clock').Clock.showLocalTimeOnHover;
var onlyNumericOnKeypress = require('../../../common_functions/event_handler').onlyNumericOnKeypress;
var Content               = require('../../../common_functions/content').Content;
var RealityCheckData      = require('./reality_check.data').RealityCheckData;
var localize = require('../../../base/localize').localize;
var Client   = require('../../../base/client').Client;
var url_for  = require('../../../base/url').url_for;
require('../../../../lib/polyfills/array.includes');
require('../../../../lib/polyfills/string.includes');

var RealityCheckUI = (function() {
    'use strict';

    var frequency_url = url_for('user/reality_check_frequencyws');
    var summary_url = url_for('user/reality_check_summaryws');
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
                    eventHandlers();
                }
            },
            error: function() {
            },
        });
        eventHandlers();
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
                    eventHandlers();
                }
            },
            error: function() {
            },
        });
    }

    function eventHandlers() {
        $('#continue').click(RealityCheckUI.onContinueClick);
        $('#view_statement').click(function() {
            RealityCheckData.showInStatement(0);
            window.location.href = url_for('user/statementws');
        });
        $('button#btn_logout').click(function() { BinarySocket.send({ logout: '1' }); });
    }

    function closePopUp() {
        $('#reality-check').remove();
        RealityCheckUI.sendAccountStatus();
    }

    function onContinueClick() {
        var intervalMinute = +($('#realityDuration').val());

        if (!(Math.floor(intervalMinute) === intervalMinute && $.isNumeric(intervalMinute))) {
            var shouldBeInteger = localize('Interval should be integer.');
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

    function sendAccountStatus() {
        if (!Client.get_boolean('is_virtual') && Client.get_value('residence') !== 'jp' && !getAccountStatus) {
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
        renderFrequencyPopUp: renderFrequencyPopUp,
        renderSummaryPopUp  : renderSummaryPopUp,
        closePopUp          : closePopUp,
        onContinueClick     : onContinueClick,
        sendAccountStatus   : sendAccountStatus,
        initializeValues    : initializeValues,
        startSummaryTimer   : startSummaryTimer,
        setLoginTime        : function(time) { loginTime = time; },
    };
})();

module.exports = {
    RealityCheckUI: RealityCheckUI,
};
