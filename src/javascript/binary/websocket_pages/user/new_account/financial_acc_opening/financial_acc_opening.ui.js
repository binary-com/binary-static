const Content             = require('../../../../common_functions/content').Content;
const ValidAccountOpening = require('../../../../common_functions/valid_account_opening').ValidAccountOpening;
const Validate            = require('../../../../common_functions/validation').Validate;
const FinancialAccOpeningData = require('./financial_acc_opening.data').FinancialAccOpeningData;
const selectorExists    = require('../../../../common_functions/common_functions').selectorExists;

const FinancialAccOpeningUI = (function() {
    'use strict';

    const checkValidity = function() {
        window.accountErrorCounter = 0;

        const elementObj = {};
        const errorObj = {};

        const all_ids = $('#financial-form').find('.form_input');
        for (let i = 0; i < all_ids.length; i++) {
            const id = all_ids[i].getAttribute('id');
            const error_id = 'error_' + id;
            elementObj[id] = document.getElementById(id);
            errorObj[id] = document.getElementById(error_id);
        }

        ValidAccountOpening.checkFname(elementObj.first_name, errorObj.first_name);
        ValidAccountOpening.checkLname(elementObj.last_name, errorObj.last_name);
        ValidAccountOpening.checkDate(elementObj.dobdd, elementObj.dobmm, elementObj.dobyy, errorObj.dobdd);
        ValidAccountOpening.checkPostcode(elementObj.address_postcode, errorObj.address_postcode);

        if (elementObj.residence.value === 'gb' && /^$/.test((elementObj.address_postcode.value).trim())) {
            if (selectorExists(errorObj.address_postcode)) {
                errorObj.address_postcode.innerHTML = Content.errorMessage('req');
                Validate.displayErrorMessage(errorObj.postcode);
            }
            window.accountErrorCounter++;
        }

        ValidAccountOpening.checkTel(elementObj.phone, errorObj.phone);
        if (elementObj.secret_answer.offsetParent !== null) {
            ValidAccountOpening.checkAnswer(elementObj.secret_answer, errorObj.secret_answer);
        }
        ValidAccountOpening.checkCity(elementObj.address_city, errorObj.address_city);

        const optional_fields = ['address_line_2', 'address_postcode', 'address_state'];

        Object.keys(elementObj).forEach(function (key) {
            if (elementObj[key].offsetParent !== null && key.indexOf(optional_fields) < 0) {
                if (/^$/.test((elementObj[key].value).trim()) && elementObj[key].type !== 'checkbox') {
                    errorObj[key].innerHTML = Content.errorMessage('req');
                    Validate.displayErrorMessage(errorObj[key]);
                    window.accountErrorCounter++;
                }
                if (elementObj[key].type === 'checkbox' && !elementObj[key].checked) {
                    errorObj[key].innerHTML = Content.errorMessage('req');
                    Validate.displayErrorMessage(errorObj[key]);
                    window.accountErrorCounter++;
                }
            }
        });

        if (window.accountErrorCounter === 0) {
            elementObj.date_of_birth = elementObj.dobyy.value + '-' + elementObj.dobmm.value + '-' + elementObj.dobdd.value;
            delete elementObj.dobdd;
            delete elementObj.dobmm;
            delete elementObj.dobyy;
            delete elementObj.tnc;
            FinancialAccOpeningData.getRealAcc(elementObj);
            Object.keys(errorObj).forEach(function (key) {
                if (errorObj[key] && errorObj[key].offsetParent !== null) {
                    errorObj[key].setAttribute('style', 'display:none');
                }
            });
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
