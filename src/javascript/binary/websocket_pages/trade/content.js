var template = require('../../base/utility').template;

var Content = (function() {
    'use strict';

    var localize = {};

    var populate = function() {
        localize = {
            textStartTime: page.text.localize('Start time'),
            textSpot: page.text.localize('Spot'),
            textBarrier: page.text.localize('Barrier'),
            textBarrierOffset: page.text.localize('Barrier offset'),
            textHighBarrier: page.text.localize('High barrier'),
            textHighBarrierOffset: page.text.localize('High barrier offset'),
            textLowBarrier: page.text.localize('Low barrier'),
            textLowBarrierOffset: page.text.localize('Low barrier offset'),
            textPayout: page.text.localize('Payout'),
            textStake: page.text.localize('Stake'),
            textPurchase: page.text.localize('Purchase'),
            textDuration: page.text.localize('Duration'),
            textEndTime: page.text.localize('End Time'),
            textMinDuration: page.text.localize('min'),
            textMinDurationTooltip: page.text.localize('minimum available duration'),
            textBarrierOffsetTooltip: page.text.localize("Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received"),
            textDurationSeconds: page.text.localize('seconds'),
            textDurationMinutes: page.text.localize('minutes'),
            textDurationHours: page.text.localize('hours'),
            textDurationDays: page.text.localize('days'),
            textDurationTicks: page.text.localize('ticks'),
            textNetProfit: page.text.localize('Net profit'),
            textReturn: page.text.localize('Return'),
            textNow: page.text.localize('Now'),
            textContractConfirmationHeading: page.text.localize('Contract Confirmation'),
            textContractConfirmationReference: page.text.localize('Your transaction reference is'),
            textContractConfirmationBalance: page.text.localize('Account balance:'),
            textFormRiseFall: page.text.localize('Rise/Fall'),
            textFormHigherLower: page.text.localize('Higher/Lower'),
            textFormUpDown: page.text.localize('Up/Down'),
            textFormInOut: page.text.localize('In/Out'),
            textContractPeriod: page.text.localize('Period'),
            predictionLabel: page.text.localize('Last Digit Prediction'),
            textContractConfirmationPayout: page.text.localize('Potential Payout'),
            textContractConfirmationCost: page.text.localize('Total Cost'),
            textContractConfirmationProfit: page.text.localize('Potential Profit'),
            textAmountPerPoint: page.text.localize('Amount per point'),
            textStopLoss: page.text.localize('Stop-loss'),
            textStopProfit: page.text.localize('Stop-profit'),
            textStopType: page.text.localize('Stop-type'),
            textStopTypePoints: page.text.localize('Points'),
            textContractConfirmationButton: page.text.localize('View'),
            textIndicativeBarrierTooltip: page.text.localize('This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.'),
            textSpreadTypeLong: page.text.localize('Long'),
            textSpreadTypeShort: page.text.localize('Short'),
            textSpreadDepositComment: page.text.localize('Deposit of'),
            textSpreadRequiredComment: page.text.localize('is required. Current spread'),
            textSpreadPointsComment: page.text.localize('points'),
            textContractStatusWon: page.text.localize('This contract won'),
            textContractStatusLost: page.text.localize('This contract lost'),
            textTickResultLabel: page.text.localize('Tick'),
            textStatement: page.text.localize('Statement'),
            textDate: page.text.localize('Date'),
            textRef: page.text.localize('Ref.'),
            textAction: page.text.localize('Action'),
            textDescription: page.text.localize('Description'),
            textCreditDebit: page.text.localize('Credit/Debit'),
            textBalance: page.text.localize('Balance'),
            textDetails: page.text.localize('Details'),
            textProfitTable: page.text.localize('Profit Table'),
            textPurchaseDate: page.text.localize('Date (GMT)'),
            textContract: page.text.localize('Contract'),
            textPurchasePrice: page.text.localize('Purchase Price'),
            textSaleDate: page.text.localize('Sale Date'),
            textSalePrice: page.text.localize('Sale Price'),
            textProfitLoss: page.text.localize('Profit/Loss'),
            textTotalProfitLoss: page.text.localize('Total Profit/Loss'),
            textItem: page.text.localize('Item'),
            textLimit: page.text.localize('Limit'),
            textMaxOpenPosition: page.text.localize('Maximum number of open positions'),
            textMaxOpenPositionTooltip: page.text.localize('Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.'),
            textMaxAccBalance: page.text.localize('Maximum account cash balance'),
            textMaxAccBalanceTooltip: page.text.localize('Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.'),
            textMaxDailyTurnover: page.text.localize('Maximum daily turnover'),
            textMaxDailyTurnoverTooltip: page.text.localize('Represents the maximum volume of contracts that you may purchase in any given trading day.'),
            textMaxAggregate: page.text.localize('Maximum aggregate payouts on open positions'),
            textMaxAggregateTooltip: page.text.localize('Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.'),
            textAuthenticatedWithdrawal: page.text.localize('Your account is fully authenticated and your withdrawal limits have been lifted.'),
            textWithdrawalLimits: page.text.localize('Your withdrawal limit is [_1] [_2].'),
            textWithdrawalLimitsEquivalant: page.text.localize('Your withdrawal limit is [_1] [_2] (or equivalent in other currency).'),
            textWithrawalAmount: page.text.localize('You have already withdrawn [_1] [_2].'),
            textWithrawalAmountEquivalant: page.text.localize('You have already withdrawn the equivalent of [_1] [_2].'),
            textCurrentMaxWithdrawal: page.text.localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].'),
            textCurrentMaxWithdrawalEquivalant: page.text.localize('Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).'),
            textWithdrawalLimitsEquivalantDay: page.text.localize('Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).'),
            textWithrawalAmountEquivalantDay: page.text.localize('You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.'),
            textBuyPrice: page.text.localize('Buy price'),
            textFinalPrice: page.text.localize('Final price'),
            textLoss: page.text.localize('Loss'),
            textProfit: page.text.localize('Profit'),
            textFormMatchesDiffers: page.text.localize('Matches/Differs'),
            textFormEvenOdd: page.text.localize('Even/Odd'),
            textFormOverUnder: page.text.localize('Over/Under'),
            textMessageRequired: page.text.localize('This field is required.'),
            textMessageCountLimit: page.text.localize('You should enter between [_1] characters.'), // [_1] should be replaced by a range. sample: (6-20)
            textMessageJustAllowed: page.text.localize('Only [_1] are allowed.'), // [_1] should be replaced by values including: letters, numbers, space, period, ...
            textMessageValid: page.text.localize('Please submit a valid [_1].'), // [_1] should be replaced by values such as email address
            textLetters: page.text.localize('letters'),
            textNumbers: page.text.localize('numbers'),
            textSpace: page.text.localize('space'),
            textPeriod: page.text.localize('period'),
            textComma: page.text.localize('comma'),
            textHyphen: page.text.localize('hyphen'),
            textApost: page.text.localize('apostrophe'),
            textPassword: page.text.localize('password'),
            textPasswordsNotMatching: page.text.localize('The two passwords that you entered do not match.'),
            textClickHereToRestart: page.text.localize('Your token has expired. Please click <a class="pjaxload" href="[_1]">here</a> to restart the verification process.'),
            textDuplicatedEmail: page.text.localize('Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.'),
            textAsset: page.text.localize('Asset'),
            textOpens: page.text.localize('Opens'),
            textCloses: page.text.localize('Closes'),
            textSettles: page.text.localize('Settles'),
            textUpcomingEvents: page.text.localize('Upcoming Events'),
            textMr: page.text.localize('Mr'),
            textMrs: page.text.localize('Mrs'),
            textMs: page.text.localize('Ms'),
            textMiss: page.text.localize('Miss'),
            textErrorBirthdate: page.text.localize('Please input a valid date'),
            textSelect: page.text.localize('Please select'),
            textUnavailableReal: page.text.localize('Sorry, account opening is unavailable.'),
            textMessageMinRequired: page.text.localize('Minimum of [_1] characters required.'),
            textFeatureUnavailable: page.text.localize('Sorry, this feature is not available.'),
            textMessagePasswordScore: page.text.localize( 'Password score is: [_1]. Passing score is: 20.'),
            textShouldNotLessThan: page.text.localize('Please enter a number greater or equal to [_1].'),
            textNumberLimit: page.text.localize('Please enter a number between [_1].')       // [_1] should be a range
        };

        var starTime = document.getElementById('start_time_label');
        if (starTime) {
            starTime.textContent = localize.textStartTime;
        }

        var minDurationTooltip = document.getElementById('duration_tooltip');
        if (minDurationTooltip) {
            minDurationTooltip.textContent = localize.textMinDuration;
            minDurationTooltip.setAttribute('data-balloon', localize.textMinDurationTooltip);
        }

        var spotLabel = document.getElementById('spot_label');
        if (spotLabel) {
            spotLabel.textContent = localize.textSpot;
        }

        var barrierTooltip = document.getElementById('barrier_tooltip');
        if (barrierTooltip) {
            barrierTooltip.textContent = localize.textBarrierOffset;
            barrierTooltip.setAttribute('data-balloon', localize.textBarrierOffsetTooltip);
        }

        var barrierSpan = document.getElementById('barrier_span');
        if (barrierSpan) {
            barrierSpan.textContent = localize.textBarrier;
        }

        var barrierHighTooltip = document.getElementById('barrier_high_tooltip');
        if (barrierHighTooltip) {
            barrierHighTooltip.textContent = localize.textHighBarrierOffset;
            barrierHighTooltip.setAttribute('data-balloon', localize.textBarrierOffsetTooltip);
        }
        var barrierHighSpan = document.getElementById('barrier_high_span');
        if (barrierHighSpan) {
            barrierHighSpan.textContent = localize.textHighBarrier;
        }

        var barrierLowTooltip = document.getElementById('barrier_low_tooltip');
        if (barrierLowTooltip) {
            barrierLowTooltip.textContent = localize.textLowBarrierOffset;
            barrierLowTooltip.setAttribute('data-balloon', localize.textBarrierOffsetTooltip);
        }
        var barrierLowSpan = document.getElementById('barrier_low_span');
        if (barrierLowSpan) {
            barrierLowSpan.textContent = localize.textLowBarrier;
        }

        var predictionLabel = document.getElementById('prediction_label');
        if (predictionLabel) {
            predictionLabel.textContent = localize.predictionLabel;
        }

        var payoutOption = document.getElementById('payout_option');
        if (payoutOption) {
            payoutOption.textContent = localize.textPayout;
        }

        var stakeOption = document.getElementById('stake_option');
        if (stakeOption) {
            stakeOption.textContent = localize.textStake;
        }

        var purchaseButtonTop = document.getElementById('purchase_button_top');
        if (purchaseButtonTop) {
            purchaseButtonTop.textContent = localize.textPurchase;
        }

        var purchaseButtonBottom = document.getElementById('purchase_button_bottom');
        if (purchaseButtonBottom) {
            purchaseButtonBottom.textContent = localize.textPurchase;
        }

        var period_label = document.getElementById('period_label');
        if (period_label) {
            period_label.textContent = localize.textContractPeriod;
        }

        var amount_per_point_label = document.getElementById('amount_per_point_label');
        if (amount_per_point_label) {
            amount_per_point_label.textContent = localize.textAmountPerPoint;
        }

        var stop_loss_label = document.getElementById('stop_loss_label');
        if (stop_loss_label) {
            stop_loss_label.textContent = localize.textStopLoss;
        }

        var stop_profit_label = document.getElementById('stop_profit_label');
        if (stop_profit_label) {
            stop_profit_label.textContent = localize.textStopProfit;
        }

        var stop_type_label = document.getElementById('stop_type_label');
        if (stop_type_label) {
            stop_type_label.textContent = localize.textStopType;
        }

        var stop_type_points = document.getElementById('stop_type_points_label');
        if (stop_type_points) {
            stop_type_points.textContent = localize.textStopTypePoints;
        }

        var indicative_barrier_tooltip = document.getElementById('indicative_barrier_tooltip');
        if (indicative_barrier_tooltip) {
            indicative_barrier_tooltip.setAttribute('data-balloon', localize.textIndicativeBarrierTooltip);
        }

        var indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip');
        if (indicative_high_barrier_tooltip) {
            indicative_high_barrier_tooltip.setAttribute('data-balloon', localize.textIndicativeBarrierTooltip);
        }

        var indicative_low_barrier_tooltip = document.getElementById('indicative_low_barrier_tooltip');
        if (indicative_low_barrier_tooltip) {
            indicative_low_barrier_tooltip.setAttribute('data-balloon', localize.textIndicativeBarrierTooltip);
        }

        var jpbarrier_label = document.getElementById('jbarrier_label');
        if (jpbarrier_label) {
            jpbarrier_label.textContent = localize.textExercisePrice;
        }

        var jpbarrier_high_label = document.getElementById('jbarrier_high_label');
        if (jpbarrier_high_label) {
            jpbarrier_high_label.textContent = localize.textHighBarrier;
        }

        var jpbarrier_low_label = document.getElementById('jbarrier_low_label');
        if (jpbarrier_low_label) {
            jpbarrier_low_label.textContent = localize.textLowBarrier;
        }
    };

    var errorMessage = function(messageType, param) {
        var msg = "",
            separator = ', ';
        switch (messageType) {
            case 'req':
                msg = localize.textMessageRequired;
                break;
            case 'reg':
                if (param)
                    msg = template(localize.textMessageJustAllowed, [param.join(separator)]);
                break;
            case 'range':
                if (param)
                    msg = template(localize.textMessageCountLimit, [param]);
                break;
            case 'valid':
                if (param)
                    msg = template(localize.textMessageValid, [param]);
                break;
            case 'min':
                if (param)
                    msg = template(localize.textMessageMinRequired, [param]);
                break;
            case 'pass':
                if (param)
                    msg = template(localize.textMessagePasswordScore, [param]);
                break;
            case 'number_not_less_than':
                msg = template(localize.textShouldNotLessThan, [param]);
                break;
            case 'number_should_between':
                msg = template(localize.textNumberLimit, [param]);
                break;
            default:
                break;
        }
        return msg;
    };

    return {
        localize: function() {
            return localize;
        },
        populate: populate,
        errorMessage: errorMessage
    };

})();

module.exports = {
    Content: Content,
};
