const Content             = require('../../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../../common_functions/valid_account_opening').ValidAccountOpening;
const hideAllErrors       = require('../../../../common_functions/account_opening').hideAllErrors;
const checkRequiredInputs = require('../../../../common_functions/account_opening').checkRequiredInputs;
const Validate            = require('../../../../common_functions/validation').Validate;
const JapanAccOpeningData = require('./japan_acc_opening.data').JapanAccOpeningData;
const localize            = require('../../../../base/localize').localize;

const JapanAccOpeningUI = (function () {
    'use strict';

    const checkValidity = function(elementObj, errorObj, errorEl) {
        hideAllErrors(errorObj, errorEl);

        const letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace,
            hyphen  = Content.localize().textHyphen,
            period  = Content.localize().textPeriod,
            apost   = Content.localize().textApost;

        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:?><,|\d]+/.test((elementObj.first_name.value).trim())) {
            errorObj.first_name.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorObj.first_name);
            window.accountErrorCounter++;
        }

        if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:?><,|\d]+/.test((elementObj.last_name.value).trim())) {
            errorObj.last_name.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
            Validate.displayErrorMessage(errorObj.last_name);
            window.accountErrorCounter++;
        }

        ValidAccountOpening.checkDate(elementObj.dobdd, elementObj.dobmm, elementObj.dobyy, errorObj.dobdd);

        if (!/^\d{3}-\d{4}$/.test(elementObj.address_postcode.value)) {
            errorObj.address_postcode.innerHTML = localize('Please follow the pattern 3 numbers, a dash, followed by 4 numbers.');
            Validate.displayErrorMessage(errorObj.address_postcode);
            window.accountErrorCounter++;
        }

        if (elementObj.phone.value.replace(/\+| /g, '').length < 6) {
            errorObj.phone.innerHTML = Content.errorMessage('min', 6);
            Validate.displayErrorMessage(errorObj.phone);
            window.accountErrorCounter++;
        } else if (!/^\+?[0-9\s-]{6,35}$/.test(elementObj.phone.value)) {
            errorObj.phone.innerHTML = Content.errorMessage('reg', [numbers, space, hyphen]);
            Validate.displayErrorMessage(errorObj.phone);
            window.accountErrorCounter++;
        }

        if (!/^\d+$/.test(elementObj.daily_loss_limit.value)) {
            errorObj.daily_loss_limit.innerHTML = Content.errorMessage('reg', [numbers]);
            Validate.displayErrorMessage(errorObj.daily_loss_limit);
            window.accountErrorCounter++;
        }

        if (elementObj.hedge_asset_amount.offsetParent !== null && !/^\d+$/.test(elementObj.hedge_asset_amount.value)) {
            errorObj.hedge_asset_amount.innerHTML = Content.errorMessage('reg', [numbers]);
            Validate.displayErrorMessage(errorObj.hedge_asset_amount);
            window.accountErrorCounter++;
        }

        const optional_fields = ['address_line_2'];
        checkRequiredInputs(elementObj, errorObj, optional_fields);

        const $submit_msg = $('#submit-message');
        if (window.accountErrorCounter === 0) {
            hideAllErrors(errorObj);
            $submit_msg.removeClass('errorfield').text(localize('Processing your request...'));
            JapanAccOpeningData.getJapanAcc(elementObj);
            return 1;
        }
        // else
        $submit_msg.addClass('errorfield').text(localize('Please check the above form for pending errors.'));
        return 0;
    };

    return {
        checkValidity: checkValidity,
    };
})();

module.exports = {
    JapanAccOpeningUI: JapanAccOpeningUI,
};
