var template = require('../base/utility').template;

var Content = (function() {
    'use strict';

    var localize = {};

    var populate = function() {
        localize = {
            textStartTime                     : 'Start time',
            textSpot                          : 'Spot',
            textBarrier                       : 'Barrier',
            textBarrierOffset                 : 'Barrier offset',
            textHighBarrier                   : 'High barrier',
            textHighBarrierOffset             : 'High barrier offset',
            textLowBarrier                    : 'Low barrier',
            textLowBarrierOffset              : 'Low barrier offset',
            textPayout                        : 'Payout',
            textStake                         : 'Stake',
            textPurchase                      : 'Purchase',
            textDuration                      : 'Duration',
            textEndTime                       : 'End Time',
            textDurationSeconds               : 'seconds',
            textDurationMinutes               : 'minutes',
            textDurationHours                 : 'hours',
            textDurationDays                  : 'days',
            textDurationTicks                 : 'ticks',
            textMinDuration                   : 'min',
            textMinDurationTooltip            : 'minimum available duration',
            textBarrierOffsetTooltip          : 'Enter the barrier in terms of the difference from the spot price. If you enter +0.005, then you will be purchasing a contract with a barrier 0.005 higher than the entry spot. The entry spot will be the next tick after your order has been received',
            textIndicativeBarrierTooltip      : 'This is an indicative barrier. Actual barrier will be the entry spot plus the barrier offset.',
            textContractConfirmationHeading   : 'Contract Confirmation',
            textContractConfirmationReference : 'Your transaction reference is',
            textContractConfirmationBalance   : 'Account balance:',
            textContractConfirmationButton    : 'View',
            textContractConfirmationPayout    : 'Potential Payout',
            textContractConfirmationCost      : 'Total Cost',
            textContractConfirmationProfit    : 'Potential Profit',
            textFormRiseFall                  : 'Rise/Fall',
            textFormHigherLower               : 'Higher/Lower',
            textFormUpDown                    : 'Up/Down',
            textFormInOut                     : 'In/Out',
            textFormMatchesDiffers            : 'Matches/Differs',
            textFormEvenOdd                   : 'Even/Odd',
            textFormOverUnder                 : 'Over/Under',
            textContractPeriod                : 'Period',
            textPredictionLabel               : 'Last Digit Prediction',
            textTickResultLabel               : 'Tick',
            textAmountPerPoint                : 'Amount per point',
            textStopLoss                      : 'Stop-loss',
            textStopProfit                    : 'Stop-profit',
            textStopType                      : 'Stop-type',
            textStopTypePoints                : 'Points',
            textSpreadTypeLong                : 'Long',
            textSpreadTypeShort               : 'Short',
            textSpreadDepositComment          : 'Deposit of',
            textSpreadRequiredComment         : 'is required. Current spread',
            textSpreadPointsComment           : 'points',
            textContractStatusWon             : 'This contract won',
            textContractStatusLost            : 'This contract lost',
            textNow                           : 'Now',
            textDate                          : 'Date',
            textPurchaseDate                  : 'Date (GMT)',
            textPurchasePrice                 : 'Purchase Price',
            textStatement                     : 'Statement',
            textProfitTable                   : 'Profit Table',
            textRef                           : 'Ref.',
            textAction                        : 'Action',
            textDescription                   : 'Description',
            textCreditDebit                   : 'Credit/Debit',
            textBalance                       : 'Balance',
            textDetails                       : 'Details',
            textContract                      : 'Contract',
            textSaleDate                      : 'Sale Date',
            textSalePrice                     : 'Sale Price',
            textBuyPrice                      : 'Buy price',
            textFinalPrice                    : 'Final price',
            textLoss                          : 'Loss',
            textReturn                        : 'Return',
            textNetProfit                     : 'Net profit',
            textProfit                        : 'Profit',
            textProfitLoss                    : 'Profit/Loss',
            textTotalProfitLoss               : 'Total Profit/Loss',
            textUpcomingEvents                : 'Upcoming Events',
            textItem                          : 'Item',
            textLimit                         : 'Limit',
            textAsset                         : 'Asset',
            textOpens                         : 'Opens',
            textCloses                        : 'Closes',
            textSettles                       : 'Settles',
            textMaxOpenPosition               : 'Maximum number of open positions',
            textMaxOpenPositionTooltip        : 'Represents the maximum number of outstanding contracts in your portfolio. Each line in your portfolio counts for one open position. Once the maximum is reached, you will not be able to open new positions without closing an existing position first.',
            textMaxAccBalance                 : 'Maximum account cash balance',
            textMaxAccBalanceTooltip          : 'Represents the maximum amount of cash that you may hold in your account.  If the maximum is reached, you will be asked to withdraw funds.',
            textMaxDailyTurnover              : 'Maximum daily turnover',
            textMaxDailyTurnoverTooltip       : 'Represents the maximum volume of contracts that you may purchase in any given trading day.',
            textMaxAggregate                  : 'Maximum aggregate payouts on open positions',
            textMaxAggregateTooltip           : 'Presents the maximum aggregate payouts on outstanding contracts in your portfolio. If the maximum is attained, you may not purchase additional contracts without first closing out existing positions.',
            textAuthenticatedWithdrawal       : 'Your account is fully authenticated and your withdrawal limits have been lifted.',
            textWithdrawalLimits              : 'Your withdrawal limit is [_1] [_2].',
            textWithdrawalLimitsEquivalant    : 'Your withdrawal limit is [_1] [_2] (or equivalent in other currency).',
            textWithrawalAmount               : 'You have already withdrawn [_1] [_2].',
            textWithrawalAmountEquivalant     : 'You have already withdrawn the equivalent of [_1] [_2].',
            textCurrentMaxWithdrawal          : 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2].',
            textCurrentMaxWithdrawalEquivalant: 'Therefore your current immediate maximum withdrawal (subject to your account having sufficient funds) is [_1] [_2] (or equivalent in other currency).',
            textWithdrawalLimitsEquivalantDay : 'Your [_1] day withdrawal limit is currently [_2] [_3] (or equivalent in other currency).',
            textWithrawalAmountEquivalantDay  : 'You have already withdrawn the equivalent of [_1] [_2] in aggregate over the last [_3] days.',
            textMessageRequired               : 'This field is required.',
            textMessageCountLimit             : 'You should enter between [_1] characters.', // [_1] should be replaced by a range. sample: (6-20)
            textMessageJustAllowed            : 'Only [_1] are allowed.',      // [_1] should be replaced by values including: letters, numbers, space, period, ...
            textMessageValid                  : 'Please submit a valid [_1].', // [_1] should be replaced by values such as email address
            textLetters                       : 'letters',
            textNumbers                       : 'numbers',
            textSpace                         : 'space',
            textPeriod                        : 'period',
            textComma                         : 'comma',
            textHyphen                        : 'hyphen',
            textApost                         : 'apostrophe',
            textPassword                      : 'password',
            textMr                            : 'Mr',
            textMrs                           : 'Mrs',
            textMs                            : 'Ms',
            textMiss                          : 'Miss',
            textPasswordsNotMatching          : 'The two passwords that you entered do not match.',
            textClickHereToRestart            : 'Your token has expired. Please click <a class="pjaxload" href="[_1]">here</a> to restart the verification process.',
            textDuplicatedEmail               : 'Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.',
            textErrorBirthdate                : 'Please input a valid date',
            textSelect                        : 'Please select',
            textUnavailableReal               : 'Sorry, account opening is unavailable.',
            textMessageMinRequired            : 'Minimum of [_1] characters required.',
            textFeatureUnavailable            : 'Sorry, this feature is not available.',
            textMessagePasswordScore          : 'Password score is: [_1]. Passing score is: 20.',
            textShouldNotLessThan             : 'Please enter a number greater or equal to [_1].',
            textNumberLimit                   : 'Please enter a number between [_1].', // [_1] should be a range
        };

        Object.keys(localize).forEach(function(key) {
            localize[key] = page.text.localize(localize[key]);
        });

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
            predictionLabel.textContent = localize.textPredictionLabel;
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
        var msg = '',
            separator = ', ';
        switch (messageType) {
            case 'req':
                msg = localize.textMessageRequired;
                break;
            case 'reg':
                if (param)                    {
                    msg = template(localize.textMessageJustAllowed, [param.join(separator)]);
                }
                break;
            case 'range':
                if (param)                    {
                    msg = template(localize.textMessageCountLimit, [param]);
                }
                break;
            case 'valid':
                if (param)                    {
                    msg = template(localize.textMessageValid, [param]);
                }
                break;
            case 'min':
                if (param)                    {
                    msg = template(localize.textMessageMinRequired, [param]);
                }
                break;
            case 'pass':
                if (param)                    {
                    msg = template(localize.textMessagePasswordScore, [param]);
                }
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
        localize    : function() { return localize; },
        populate    : populate,
        errorMessage: errorMessage,
    };
})();

module.exports = {
    Content: Content,
};
