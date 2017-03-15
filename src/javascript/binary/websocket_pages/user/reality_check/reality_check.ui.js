const Client                    = require('../../../base/client').Client;
const showLocalTimeOnHover      = require('../../../base/clock').Clock.showLocalTimeOnHover;
const localize                  = require('../../../base/localize').localize;
const url_for                   = require('../../../base/url').url_for;
const Content                   = require('../../../common_functions/content').Content;
const onlyNumericOnKeypress     = require('../../../common_functions/event_handler').onlyNumericOnKeypress;
const RealityCheckData          = require('./reality_check.data').RealityCheckData;
require('../../../../lib/polyfills/array.includes');
require('../../../../lib/polyfills/string.includes');

const RealityCheckUI = (function() {
    'use strict';

    const frequency_url = url_for('user/reality_check_frequencyws'),
        summary_url = url_for('user/reality_check_summaryws'),
        hiddenClass = 'invisible';
    let loginTime; // milliseconds

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

        $('#realityDuration').val(RealityCheckData.get('interval'))
                             .keypress(onlyNumericOnKeypress);
    };

    const showIntervalOnPopUp = function() {
        const intervalMinutes = Math.floor(+RealityCheckData.get('interval') / 60 / 1000);
        $('#realityDuration').val(intervalMinutes);
    };

    const getAjax = (summary) => {
        $.ajax({
            url     : summary ?  summary_url : frequency_url,
            dataType: 'html',
            method  : 'GET',
            success : (realityCheckText) => {
                ajaxSuccess(realityCheckText, summary);
            },
        });
    };

    const ajaxSuccess = (realityCheckText, summary) => {
        if (realityCheckText.includes('reality-check-content')) {
            const payload = $(realityCheckText);
            showPopUp(payload.find('#reality-check-content'));
            showIntervalOnPopUp();
            $('#continue').off('click').on('click dblclick', onContinueClick);
            $('#statement').off('click').on('click dblclick', onStatementClick);
            $('button#btn_logout').off('click').on('click dblclick', onLogoutClick);
            if (summary) {
                updateSummary(summary);
            }
        }
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
        RealityCheckData.set('interval', intervalMs);
        RealityCheckData.set('keep_open', 0);
        RealityCheckData.set('ack', 1);
        RealityCheckUI.closePopUp();
        startSummaryTimer();
    };

    const onStatementClick = function() {
        const win = window.open(url_for('user/statementws') + '#no-reality-check', '_blank');
        if (win) {
            win.focus();
        }
    };

    const onLogoutClick = function() {
        BinarySocket.send({ logout: '1' });
    };

    const sendAccountStatus = function() {
        if (!Client.get('is_virtual') && Client.get('residence') !== 'jp') {
            BinarySocket.send({ get_account_status: 1 });
        }
    };

    const startSummaryTimer = function() {
        const interval = +RealityCheckData.get('interval');
        const currentTime = Date.now();
        const toWait = interval - ((currentTime - loginTime) % interval);

        window.setTimeout(function() {
            RealityCheckData.set('keep_open', 1);
            RealityCheckData.getSummaryAsync();
        }, toWait);
    };

    return {
        renderFrequencyPopUp: () => { getAjax(); },
        renderSummaryPopUp  : (summary) => { getAjax(summary); },
        closePopUp          : closePopUp,
        sendAccountStatus   : sendAccountStatus,
        startSummaryTimer   : startSummaryTimer,
        setLoginTime        : function(time) { loginTime = time; },
    };
})();

module.exports = {
    RealityCheckUI: RealityCheckUI,
};
