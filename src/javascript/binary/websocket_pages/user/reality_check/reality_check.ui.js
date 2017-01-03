const showLocalTimeOnHover  = require('../../../base/clock').Clock.showLocalTimeOnHover;
const onlyNumericOnKeypress = require('../../../common_functions/event_handler').onlyNumericOnKeypress;
const Content               = require('../../../common_functions/content').Content;
const RealityCheckData      = require('./reality_check.data').RealityCheckData;
const localize = require('../../../base/localize').localize;
const Client   = require('../../../base/client').Client;
const url_for  = require('../../../base/url').url_for;
require('../../../../lib/polyfills/array.includes');
require('../../../../lib/polyfills/string.includes');

const RealityCheckUI = (function() {
    'use strict';

    const frequency_url = url_for('user/reality_check_frequencyws'),
        summary_url = url_for('user/reality_check_summaryws'),
        hiddenClass = 'invisible';
    let loginTime, // milliseconds
        getAccountStatus;

    const initializeValues = function() {
        getAccountStatus = false;
    };

    const showPopUp = function(content) {
        if ($('#reality-check').length > 0) {
            return;
        }

        const lightboxDiv = $("<div id='reality-check' class='lightbox'></div>");

        let wrapper = $('<div></div>');
        wrapper = wrapper.append(content);
        wrapper = $('<div></div>').append(wrapper);
        wrapper.appendTo(lightboxDiv);
        lightboxDiv.appendTo('body');

        $('#realityDuration').val(RealityCheckData.getInterval())
                             .keypress(onlyNumericOnKeypress);
    };

    const showIntervalOnPopUp = function() {
        const intervalMinutes = Math.floor(RealityCheckData.getInterval() / 60 / 1000);
        $('#realityDuration').val(intervalMinutes);
    };

    const renderFrequencyPopUp = function() {
        $.ajax({
            url     : frequency_url,
            dataType: 'html',
            method  : 'GET',
            success : function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    const payload = $(realityCheckText);
                    showPopUp(payload.find('#reality-check-content'));
                    showIntervalOnPopUp();
                    $('#continue').click(RealityCheckUI.onContinueClick);
                }
            },
            error: function() {
            },
        });
        $('#continue').click(RealityCheckUI.onContinueClick);
    };

    const updateSummary = function(summary) {
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
    };

    const renderSummaryPopUp = function(summary) {
        $.ajax({
            url     : summary_url,
            dataType: 'html',
            method  : 'GET',
            success : function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    const payload = $(realityCheckText);
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
    };

    const frequencyEventHandler = function() {
        $('button#continue').click(function() {
            RealityCheckData.updateAck();
        });
    };

    const summaryEventHandler = function() {
        $('button#continue').click(function() {
            RealityCheckData.updateAck();
        });

        $('button#btn_logout').click(function() {
            BinarySocket.send({ logout: 1 });
        });
    };

    const closePopUp = function() {
        $('#reality-check').remove();
        RealityCheckUI.sendAccountStatus();
    };

    const onContinueClick = function() {
        const intervalMinute = +($('#realityDuration').val());

        if (!(Math.floor(intervalMinute) === intervalMinute && $.isNumeric(intervalMinute))) {
            const shouldBeInteger = localize('Interval should be integer.');
            $('#rc-err').text(shouldBeInteger)
                        .removeClass(hiddenClass);
            return;
        }

        if (intervalMinute < 10 || intervalMinute > 120) {
            Content.populate();
            const minimumValueMsg = Content.errorMessage('number_should_between', '10 to 120');
            $('#rc-err').text(minimumValueMsg)
                        .removeClass(hiddenClass);
            return;
        }

        const intervalMs = intervalMinute * 60 * 1000;
        RealityCheckData.updateInterval(intervalMs);
        RealityCheckData.triggerCloseEvent();
        RealityCheckData.updateAck();
        RealityCheckUI.closePopUp();
        startSummaryTimer();
        sendAccountStatus();
    };

    const onLogoutClick = function() {
        logout();
    };

    const logout = function() {
        BinarySocket.send({ logout: '1' });
    };

    const sendAccountStatus = function() {
        if (!Client.get_boolean('is_virtual') && Client.get_value('residence') !== 'jp' && !getAccountStatus) {
            BinarySocket.send({ get_account_status: 1 });
            getAccountStatus = true;
        }
    };

    const computeIntervalForNextPopup = function(loggedinTime, interval) {
        const currentTime = Date.now();
        return (interval - ((currentTime - loggedinTime) % interval));
    };

    const startSummaryTimer = function() {
        const interval = RealityCheckData.getInterval();
        const toWait = computeIntervalForNextPopup(loginTime, interval);

        window.setTimeout(function() {
            RealityCheckData.setOpenSummaryFlag();
            RealityCheckData.getSummaryAsync();
        }, toWait);
    };

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
