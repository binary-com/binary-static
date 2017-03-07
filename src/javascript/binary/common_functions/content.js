const template = require('../base/utility').template;
const localize = require('../base/localize').localize;

const Content = (function() {
    'use strict';

    let localized = {};

    const populate = function() {
        localized = {
            textBarrier                    : 'Barrier',
            textPayout                     : 'Payout',
            textStake                      : 'Stake',
            textDuration                   : 'Duration',
            textEndTime                    : 'End Time',
            textDurationSeconds            : 'seconds',
            textDurationMinutes            : 'minutes',
            textDurationHours              : 'hours',
            textDurationDays               : 'days',
            textDurationTicks              : 'ticks',
            textContractConfirmationHeading: 'Contract Confirmation',
            textContractConfirmationBalance: 'Account balance:',
            textFormRiseFall               : 'Rise/Fall',
            textFormHigherLower            : 'Higher/Lower',
            textFormUpDown                 : 'Up/Down',
            textFormInOut                  : 'In/Out',
            textFormMatchesDiffers         : 'Matches/Differs',
            textFormEvenOdd                : 'Even/Odd',
            textFormOverUnder              : 'Over/Under',
            textTickResultLabel            : 'Tick',
            textAmountPerPoint             : 'Amount per point',
            textStopLoss                   : 'Stop-loss',
            textStopProfit                 : 'Stop-profit',
            textSpreadTypeLong             : 'Long',
            textSpreadTypeShort            : 'Short',
            textContractStatusWon          : 'This contract won',
            textContractStatusLost         : 'This contract lost',
            textNow                        : 'Now',
            textDate                       : 'Date',
            textRef                        : 'Ref.',
            textDetails                    : 'Details',
            textLoss                       : 'Loss',
            textProfit                     : 'Profit',
            textCloses                     : 'Closes',
            textMessageRequired            : 'This field is required.',
            textMessageRequiredCheckBox    : 'Please select the checkbox.',
            textMessageRequiredTNC         : 'Please accept the terms and conditions.',
            textMessageCountLimit          : 'You should enter between [_1] characters.', // [_1] should be replaced by a range. sample: (6-20)
            textMessageJustAllowed         : 'Only [_1] are allowed.',      // [_1] should be replaced by values including: letters, numbers, space, period, ...
            textMessageValid               : 'Please submit a valid [_1].', // [_1] should be replaced by values such as email address
            textMessageMinRequired         : 'Minimum of [_1] characters required.',
            textNumberLimit                : 'Please enter a number between [_1].', // [_1] should be a range
            textLetters                    : 'letters',
            textNumbers                    : 'numbers',
            textSpace                      : 'space',
            textPeriod                     : 'period',
            textComma                      : 'comma',
            textHyphen                     : 'hyphen',
            textApost                      : 'apostrophe',
            textPassword                   : 'password',
            textPasswordsNotMatching       : 'The two passwords that you entered do not match.',
            featureNotRelevantToVirtual    : 'This feature is not relevant to virtual-money accounts.',
        };

        Object.keys(localized).forEach(function(key) {
            localized[key] = localize(localized[key]);
        });
    };

    const errorMessage = function(messageType, param) {
        let msg = '';
        const separator = ', ';
        switch (messageType) {
            case 'req':
                msg = param && param.field_type === 'checkbox' ?
                    (param.for === 'tnc' ? localized.textMessageRequiredTNC : localized.textMessageRequiredCheckBox) :
                    localized.textMessageRequired;
                break;
            case 'reg':
                if (param) msg = template(localized.textMessageJustAllowed, [param.join(separator)]);
                break;
            case 'range':
                if (param) msg = template(localized.textMessageCountLimit, [param]);
                break;
            case 'valid':
                if (param) msg = template(localized.textMessageValid, [param]);
                break;
            case 'min':
                if (param) msg = template(localized.textMessageMinRequired, [param]);
                break;
            case 'number_should_between':
                if (param) msg = template(localized.textNumberLimit, [param]);
                break;
            default:
                break;
        }
        return msg;
    };

    return {
        localize    : function() { return localized; },
        populate    : populate,
        errorMessage: errorMessage,
    };
})();

module.exports = {
    Content: Content,
};
