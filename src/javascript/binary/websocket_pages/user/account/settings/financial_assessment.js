const Client             = require('../../../../base/client').Client;
const localize           = require('../../../../base/localize').localize;
const State              = require('../../../../base/storage').State;
const url_for            = require('../../../../base/url').url_for;
const showLoadingImage   = require('../../../../base/utility').showLoadingImage;
const Content            = require('../../../../common_functions/content').Content;
const japanese_client    = require('../../../../common_functions/country_base').japanese_client;
const RiskClassification = require('../../../../common_functions/risk_classification').RiskClassification;
const Validation         = require('../../../../common_functions/form_validation');

const FinancialAssessment = (() => {
    'use strict';

    let financial_assessment = {},
        arr_validation = [];

    const form_selector = '#frm_assessment';
    const hidden_class  = 'invisible';

    const onLoad = () => {
        if (japanese_client()) {
            window.location.href = url_for('user/settingsws');
        }
        if (checkIsVirtual()) return;

        Content.populate();
        $(form_selector).on('submit', (event) => {
            event.preventDefault();
            submitForm();
        });

        BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
            handleForm(response);
        });
    };

    const handleForm = (response) => {
        if (!response) {
            response = State.get(['response', 'get_financial_assessment']);
        }
        hideLoadingImg(true);

        financial_assessment = response.get_financial_assessment;
        Object.keys(response.get_financial_assessment).forEach((key) => {
            const val = response.get_financial_assessment[key];
            $(`#${key}`).val(val);
        });

        arr_validation = [];
        if (financial_assessment.occupation === undefined) {  // handle existing assessments
            financial_assessment.occupation = '';
        }
        $(form_selector).find('select').map(function() {
            arr_validation.push({ selector: `#${$(this).attr('id')}`, validations: ['req'] });
        });
        Validation.init(form_selector, arr_validation);
    };

    const submitForm = () => {
        const $btn_submit = $(`${form_selector} #btn_submit`);
        $btn_submit.attr('disabled', 'disabled');

        if (Validation.validate(form_selector)) {
            let hasChanged = false;
            Object.keys(financial_assessment).forEach((key) => {
                const $key = $(`#${key}`);
                if ($key.length && $key.val() !== financial_assessment[key]) {
                    hasChanged = true;
                }
            });
            if (Object.keys(financial_assessment).length === 0) hasChanged = true;
            if (!hasChanged) {
                showFormMessage('You did not change anything.', false);
                setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
                return;
            }

            const data = { set_financial_assessment: 1 };
            showLoadingImage($('#msg_form'));
            $(form_selector).find('select').each(function() {
                financial_assessment[$(this).attr('id')] = data[$(this).attr('id')] = $(this).val();
            });
            BinarySocket.send(data).then((response) => {
                $btn_submit.removeAttr('disabled');
                if (response.error) {
                    showFormMessage('Sorry, an error occurred while processing your request.', false);
                } else {
                    showFormMessage('Your changes have been updated successfully.', true);
                    RiskClassification.cleanup();
                }
            });
        } else {
            setTimeout(() => { $btn_submit.removeAttr('disabled'); }, 1000);
        }
    };

    const hideLoadingImg = (show_form) => {
        $('#assessment_loading').remove();
        if (show_form) {
            $(form_selector).removeClass(hidden_class);
        }
    };

    const checkIsVirtual = () => {
        if (Client.get('is_virtual')) {
            hideLoadingImg();
            $(form_selector).addClass(hidden_class);
            $('#msg_main').addClass('notice-msg center-text').removeClass(hidden_class).text(Content.localize().featureNotRelevantToVirtual);
            hideLoadingImg(false);
            return true;
        }
        return false;
    };

    const showFormMessage = (msg, isSuccess) => {
        const redirect_url = localStorage.getItem('financial_assessment_redirect');
        if (isSuccess && /metatrader/i.test(redirect_url)) {
            localStorage.removeItem('financial_assessment_redirect');
            $.scrollTo($('h1#heading'), 500, { offset: -10 });
            $(form_selector).addClass(hidden_class);
            $('#msg_main').removeClass(hidden_class);
            BinarySocket.send({ get_account_status: 1 }).then((response_status) => {
                if ($.inArray('authenticated', response_status.get_account_status.status) === -1) {
                    $('#msg_authenticate').removeClass(hidden_class);
                }
            });
        } else {
            $('#msg_form')
                .attr('class', isSuccess ? 'success-msg' : 'errorfield')
                .html(isSuccess ? '<ul class="checked" style="display: inline-block;"><li>' + localize(msg) + '</li></ul>' : localize(msg))
                .css('display', 'block')
                .delay(5000)
                .fadeOut(1000);
        }
    };

    return {
        onLoad    : onLoad,
        handleForm: handleForm,
        submitForm: submitForm,
    };
})();

module.exports = FinancialAssessment;
