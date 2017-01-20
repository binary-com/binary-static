const Content             = require('../../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../../common_functions/valid_account_opening').ValidAccountOpening;
const hideAllErrors       = require('../../../../common_functions/account_opening').hideAllErrors;
const checkRequiredInputs = require('../../../../common_functions/account_opening').checkRequiredInputs;
const Validate            = require('../../../../common_functions/validation').Validate;
const RealAccOpeningData  = require('./real_acc_opening.data').RealAccOpeningData;

const RealAccOpeningUI = (function() {
    'use strict';

    const checkValidity = function(elementObj, errorObj, errorEl) {
        hideAllErrors(errorObj, errorEl);

        ValidAccountOpening.checkFname(elementObj.first_name, errorObj.first_name);
        ValidAccountOpening.checkLname(elementObj.last_name, errorObj.last_name);
        ValidAccountOpening.checkDate(elementObj.dobdd, elementObj.dobmm, elementObj.dobyy, errorObj.dobdd);
        ValidAccountOpening.checkPostcode(elementObj.address_postcode, errorObj.address_postcode);

        if (elementObj.residence.value === 'gb' && /^$/.test((elementObj.address_postcode.value).trim())) {
            elementObj.address_postcode.innerHTML = Content.errorMessage('req');
            Validate.displayErrorMessage(elementObj.address_postcode);
            window.accountErrorCounter++;
        }

        ValidAccountOpening.checkTel(elementObj.phone, errorObj.phone);
        ValidAccountOpening.checkAnswer(elementObj.secret_answer, errorObj.secret_answer);
        ValidAccountOpening.checkCity(elementObj.address_city, errorObj.address_city);
        // we need to update address_state as it could be changes to input box now
        elementObj.address_state = document.getElementById('address_state');
        if (elementObj.address_state.nodeName === 'INPUT') {
            ValidAccountOpening.checkState(elementObj.address_state, errorObj.address_state);
        }

        const optional_fields = ['address_line_2', 'address_postcode', 'address_state'];
        checkRequiredInputs(elementObj, errorObj, optional_fields);

        if (window.accountErrorCounter === 0) {
            RealAccOpeningData.getRealAcc(elementObj);
            hideAllErrors(errorObj);
            return 1;
        }
        return 0;
    };

    return {
        checkValidity: checkValidity,
    };
})();

module.exports = {
    RealAccOpeningUI: RealAccOpeningUI,
};
