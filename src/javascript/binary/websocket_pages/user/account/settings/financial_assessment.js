const selectCheckboxValidation = require('../../../../common_functions/account_opening').selectCheckboxValidation;
const Content                  = require('../../../../common_functions/content').Content;
const japanese_client          = require('../../../../common_functions/country_base').japanese_client;
const Validation               = require('../../../../common_functions/form_validation');
const RiskClassification       = require('../../../../common_functions/risk_classification').RiskClassification;
const showLoadingImage         = require('../../../../base/utility').showLoadingImage;
const localize                 = require('../../../../base/localize').localize;
const Client                   = require('../../../../base/client').Client;
const url_for                  = require('../../../../base/url').url_for;

const FinancialAssessmentws = (function() {
    'use strict';

    let financial_assessment = {};
    const formID = '#assessment_form';

    const submitForm = function() {
        $('#submit').attr('disabled', 'disabled');

        if (!Validation.validate(formID)) {
            setTimeout(function() { $('#submit').removeAttr('disabled'); }, 1000);
            return;
        }

        if (!hasChanged()) return;

        showLoadingImage($('#form_message'));

        const req = $.extend({ set_financial_assessment: 1 }, populateReq());
        BinarySocket.send(req).then(response => handleResponse(response));
    };

    const populateReq = () => {
        const req = {};
        $(formID).find('select').each(function() {
            financial_assessment[$(this).attr('id')] = req[$(this).attr('id')] = $(this).val();
        });
        return req;
    };

    const hasChanged = () => {
        let has_changed = false;
        Object.keys(financial_assessment).forEach(function(key) {
            const $key = $('#' + key);
            if ($key.length && $key.val() !== financial_assessment[key]) {
                has_changed = true;
            }
        });
        if (Object.keys(financial_assessment).length === 0) has_changed = true;
        if (!has_changed) {
            showFormMessage('You did not change anything.', false);
            setTimeout(function() { $('#submit').removeAttr('disabled'); }, 1000);
            return false;
        }
        return true;
    };

    const handleResponse = (response) => {
        $('#submit').removeAttr('disabled');
        if ('error' in response) {
            showFormMessage('Sorry, an error occurred while processing your request.', false);
        } else {
            showFormMessage('Your changes have been updated successfully.', true);
            if ($('#risk_classification').length > 0) {
                RiskClassification.cleanup();
                return;
            }
            const redirect_url = localStorage.getItem('financial_assessment_redirect');
            if (redirect_url) {
                localStorage.removeItem('financial_assessment_redirect');
                setTimeout(() => { window.location.href = redirect_url; }, 5000);
            }
        }
    };

    const bindValidation = () => {
        Validation.init(formID, selectCheckboxValidation(formID));

        $('#assessment_form').on('submit', function(event) {
            event.preventDefault();
            submitForm();
        });
    };

    const hideLoadingImg = function(show_form) {
        $('#loading').remove();

        if (show_form || typeof show_form === 'undefined') {
            $(formID).removeClass('invisible');
            bindValidation();
        }
    };

    const responseGetAssessment = function(response) {
        hideLoadingImg();

        financial_assessment = response.get_financial_assessment;
        Object.keys(response.get_financial_assessment).forEach(function (key) {
            const val = response.get_financial_assessment[key];
            $('#' + key).val(val);
        });

        // handle existing assessments
        if (financial_assessment.occupation === undefined) {
            financial_assessment.occupation = '';
        }
    };

    const checkIsVirtual = function() {
        if (Client.get('is_virtual')) {
            $(formID).addClass('invisible');
            $('#response_on_success').addClass('notice-msg center-text')
                .text(Content.localize().featureNotRelevantToVirtual)
                .removeClass('invisible');
            hideLoadingImg(false);
            return true;
        }
        return false;
    };

    const showFormMessage = function(msg, isSuccess) {
        $('#form_message')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked" style="display: inline-block;"><li>' + localize(msg) + '</li></ul>' : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    const onLoad = function() {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
            return;
        }

        showLoadingImage($('<div/>', { id: 'loading', class: 'center-text' }).insertAfter('#heading'));
        Content.populate();

        BinarySocket.wait('authorize').then(() => {
            if (checkIsVirtual()) return;
            BinarySocket.send({ get_financial_assessment: 1 }).then(response => responseGetAssessment(response));
        });
    };

    return {
        submitForm: submitForm,
        onLoad    : onLoad,
    };
})();

module.exports = {
    FinancialAssessmentws: FinancialAssessmentws,
};
