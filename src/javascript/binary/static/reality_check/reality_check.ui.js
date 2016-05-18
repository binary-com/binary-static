var RealityCheckUI = (function () {
    'use strict';

    var frequency_url = page.url.url_for('user/reality_check_frequencyws');
    var summary_url  = page.url.url_for('user/reality_check_summaryws');

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
            url: frequency_url,
            dataType: 'html',
            method: 'GET',
            success: function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    var payload = $(realityCheckText);
                    showPopUp(payload.find('#reality-check-content'));
                    showIntervalOnPopUp();
                    $('#continue').click(RealityCheck.onContinueClick);
                }
            },
            error: function(xhr) {
                return;
            }
        });
        $('#continue').click(RealityCheck.onContinueClick);
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
            url: summary_url,
            dataType: 'html',
            method: 'GET',
            success: function(realityCheckText) {
                if (realityCheckText.includes('reality-check-content')) {
                    var payload = $(realityCheckText);
                    showPopUp(payload.find('#reality-check-content'));
                    updateSummary(summary);
                    showIntervalOnPopUp();
                    $('#continue').click(RealityCheck.onContinueClick);
                    $('button#btn_logout').click(RealityCheck.onLogoutClick);
                }
            },
            error: function(xhr) {
                return;
            }
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
            BinarySocket.send({logout: 1});
        });
    }

    function closePopUp() {
        $('#reality-check').remove();
        if (!page.client.is_virtual() && page.client.residence !== 'jp') BinarySocket.send({get_account_status: 1});
    }

    return {
        frequencyEventHandler: frequencyEventHandler,
        summaryEventHandler: summaryEventHandler,
        renderFrequencyPopUp: renderFrequencyPopUp,
        renderSummaryPopUp: renderSummaryPopUp,
        closePopUp: closePopUp
    };
}());
