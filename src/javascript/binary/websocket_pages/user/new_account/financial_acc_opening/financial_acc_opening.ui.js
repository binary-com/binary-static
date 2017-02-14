const FinancialAccOpeningData = require('./financial_acc_opening.data').FinancialAccOpeningData;
const Content                 = require('../../../../common_functions/content').Content;
const ValidAccountOpening     = require('../../../../common_functions/valid_account_opening').ValidAccountOpening;
const hideAllErrors           = require('../../../../common_functions/account_opening').hideAllErrors;
const checkRequiredInputs     = require('../../../../common_functions/account_opening').checkRequiredInputs;
const Validate                = require('../../../../common_functions/validation').Validate;
const selectorExists          = require('../../../../common_functions/common_functions').selectorExists;

const FinancialAccOpeningUI = (function() {
    'use strict';

    const checkValidity = function(elementObj, errorObj, errorEl) {
        hideAllErrors(errorObj, errorEl);

        ValidAccountOpening.checkFname(elementObj.first_name, errorObj.first_name);
        ValidAccountOpening.checkLname(elementObj.last_name, errorObj.last_name);
        ValidAccountOpening.checkDate(elementObj.dobdd, elementObj.dobmm, elementObj.dobyy, errorObj.dobdd);
        ValidAccountOpening.checkPostcode(elementObj.address_postcode, errorObj.address_postcode);
        ValidAccountOpening.checkAddress1(elementObj.address_line_1, errorObj.address_line_1);
        ValidAccountOpening.checkAddress2(elementObj.address_line_2, errorObj.address_line_2);

        if (elementObj.residence.value === 'gb' && /^$/.test((elementObj.address_postcode.value).trim())) {
            if (selectorExists(errorObj.address_postcode)) {
                errorObj.address_postcode.innerHTML = Content.errorMessage('req');
                Validate.displayErrorMessage(errorObj.address_postcode);
            }
            window.accountErrorCounter++;
        }

        if (!/^[\w-]{0,20}$/.test((elementObj.tax_identification_number.value).trim())) {
            if (selectorExists(errorObj.tax_identification_number)) {
                errorObj.tax_identification_number.innerHTML = Content.errorMessage('reg', [Content.localize().textLetters, Content.localize().textNumbers, Content.localize().textHyphen]);
                Validate.displayErrorMessage(errorObj.tax_identification_number);
            }
            window.accountErrorCounter++;
        }

        ValidAccountOpening.checkTel(elementObj.phone, errorObj.phone);
        if (elementObj.secret_answer.offsetParent !== null) {
            ValidAccountOpening.checkAnswer(elementObj.secret_answer, errorObj.secret_answer);
        }
        ValidAccountOpening.checkCity(elementObj.address_city, errorObj.address_city);

        const optional_fields = ['address_line_2', 'address_postcode', 'address_state'];
        checkRequiredInputs(elementObj, errorObj, optional_fields);

        if (window.accountErrorCounter === 0) {
            FinancialAccOpeningData.getRealAcc(elementObj);
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
    FinancialAccOpeningUI: FinancialAccOpeningUI,
};
