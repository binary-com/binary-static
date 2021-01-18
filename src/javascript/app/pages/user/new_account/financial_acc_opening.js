const moment         = require('moment');
const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');
const localize       = require('../../../../_common/localize').localize;
const isEmptyObject  = require('../../../../_common/utility').isEmptyObject;
const toISOFormat    = require('../../../../_common/string_util').toISOFormat;
const State          = require('../../../../_common/storage').State;

const FinancialAccOpening = (() => {
    const form_id = '#financial-form';

    let get_settings,
        txt_secret_answer;

    const doneLoading = () => {
        $('#financial_loading').remove();
        $('#financial_wrapper').setVisibility(1);
    };

    const onLoad = () => {
        const client_details = sessionStorage.getItem('client_form_response');
        
        if (Client.hasAccountType('financial') || !Client.get('residence')) {
            BinaryPjax.loadPreviousUrl();
            return;
        }

        if (sessionStorage.getItem('is_risk_disclaimer')){
            handleResponse(JSON.parse(client_details));
        }

        const req_financial_assessment = BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
            const get_financial_assessment = response.get_financial_assessment;
            if (!isEmptyObject(get_financial_assessment)) {
                const keys = Object.keys(get_financial_assessment);
                keys.forEach((key) => {
                    const val = get_financial_assessment[key];
                    $(`#${key}`).val(val);
                });

            }
        });

        const req_settings = BinarySocket.wait('get_settings').then((response) => {
            get_settings = response.get_settings;
            let $element,
                value;
            Object.keys(get_settings).forEach((key) => {
                $element = $(`#${key}`);
                value    = get_settings[key];
                // date_of_birth can be 0 as a valid epoch
                if (key === 'date_of_birth' && value !== 'null') {
                    const moment_val = moment.utc(value * 1000);
                    get_settings[key] = moment_val.format('DD MMM, YYYY');
                    $element.attr({
                        'data-value': toISOFormat(moment_val),
                        'value'     : toISOFormat(moment_val),
                        'type'      : 'text',
                    });
                    $('.input-disabled').attr('disabled', 'disabled');
                } else if (value) $element.val(value);
            });
        });

        Promise.all([req_settings, req_financial_assessment]).then(() => {
            const client_form_response = client_details ? JSON.parse(client_details).echo_req : {};
            if (!isEmptyObject(client_form_response)) {
                const keys = Object.keys(client_form_response);
                keys.forEach((key) => {
                    const val = client_form_response[key];
                    $(`#${key}`).val(val);
                });

            }

            AccountOpening.populateForm(form_id, getValidations, true);

            // date_of_birth can be 0 as a valid epoch
            if ('date_of_birth' in get_settings && get_settings.date_of_birth !== 'null') {
                $('#date_of_birth').val(get_settings.date_of_birth);
            }
            FormManager.handleSubmit({
                form_selector       : form_id,
                obj_request         : { new_account_maltainvest: 1, accept_risk: 0 },
                fnc_additional_check: storeSecretAnswer,
                fnc_response_handler: handleResponse,
            });
        });

        $('#tax_information_note_toggle').off('click').on('click', (e) => {
            e.stopPropagation();
            $('#tax_information_note_toggle').toggleClass('open');
            $('#tax_information_note').slideToggle();
        });

        $('#financial_risk_decline').off('click').on('click', () => {
            sessionStorage.removeItem('is_risk_disclaimer');
        });

        AccountOpening.showHidePulser(0);
        AccountOpening.registerPepToggle();
    };

    // API won't return secret answer in echo_req, it will return <not shown> so we should store it in FE before sending it after accept_risk
    const storeSecretAnswer = (request) => {
        txt_secret_answer = request.secret_answer;
        return true;
    };

    const getValidations = () => {
        let validations =
              AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id), [
                  { selector: '#citizen',                   validations: ['req'] },
                  { selector: '#tax_residence',             validations: ['req'] },
                  {
                      selector   : '#tax_identification_number',
                      validations: [
                          'req',
                          ['tax_id', { residence_list: State.getResponse('residence_list'), $warning: $('#tax_id_warning'), $tax_residence: $('#tax_residence') }],
                          ['length', { min: 1, max: 20 }],
                      ],
                  },
                  { selector: '#chk_tax_id',                validations: [['req', { hide_asterisk: true, message: localize('Please confirm that all the information above is true and complete.') }]], exclude_request: 1 },
              ]);
        const place_of_birth = State.getResponse('get_settings.place_of_birth');
        if (place_of_birth) {
            validations = validations.concat([{ request_field: 'place_of_birth', value: place_of_birth }]);
        }
        doneLoading();
        return validations;
    };

    const handleResponse = (response) => {
        sessionStorage.setItem('client_form_response', JSON.stringify(response));
        if ('error' in response && response.error.code === 'show risk disclaimer') {
            sessionStorage.setItem('is_risk_disclaimer', true);
            $(form_id).setVisibility(0);
            $('#client_message').setVisibility(0);
            const risk_form_id = '#financial-risk';
            $(risk_form_id).setVisibility(1);
            $.scrollTo($(risk_form_id), 500, { offset: -10 });
  
            FormManager.init(risk_form_id, []);

            const echo_req = $.extend({}, response.echo_req);
            echo_req.accept_risk = 1;
            echo_req.secret_answer = txt_secret_answer; // update from <not shown> to the previous value stored in FE
            FormManager.handleSubmit({
                form_selector       : risk_form_id,
                obj_request         : echo_req,
                fnc_response_handler: handleResponse,
            });
            doneLoading();
        } else {
            sessionStorage.removeItem('is_risk_disclaimer');
            AccountOpening.handleNewAccount(response, response.msg_type);
        }
    };

    const onUnload = () => { AccountOpening.showHidePulser(1); };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = FinancialAccOpening;
