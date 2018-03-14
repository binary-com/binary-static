const moment         = require('moment');
const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');
const localize       = require('../../../../_common/localize').localize;
const isEmptyObject  = require('../../../../_common/utility').isEmptyObject;
const State          = require('../../../../_common/storage').State;
const toISOFormat    = require('../../../../_common/string_util').toISOFormat;

const FinancialAccOpening = (() => {
    const form_id = '#financial-form';

    const onLoad = () => {
        if (Client.hasAccountType('financial') || !Client.get('residence')) {
            BinaryPjax.loadPreviousUrl();
            return;
        } else if (Client.hasAccountType('gaming')) {
            $('.security').hide();
        }

        if (AccountOpening.redirectAccount()) return;

        if (Client.get('landing_company_shortcode') === 'iom') {
            $('#authentication_notice_message').setVisibility(1);
        }

        BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
            if (!isEmptyObject(response.get_financial_assessment)) {
                const keys = Object.keys(response.get_financial_assessment);
                keys.forEach((key) => {
                    const val = response.get_financial_assessment[key];
                    $(`#${key}`).val(val);
                });
            }
        });

        BinarySocket.wait('get_settings').then((response) => {
            AccountOpening.populateForm(form_id, getValidations, true);
            const get_settings = response.get_settings;
            let $element,
                value;
            Object.keys(get_settings).forEach((key) => {
                $element = $(`#${key}`);
                value    = get_settings[key];
                if (key === 'date_of_birth') {
                    const moment_val = moment.utc(value * 1000);
                    value = moment_val.format('DD MMM, YYYY');
                    $element.attr('data-value', toISOFormat(moment_val));
                    $('.input-disabled').attr('disabled', 'disabled');
                }
                if (value) $element.val(value);
            });
        });

        FormManager.handleSubmit({
            form_selector       : form_id,
            obj_request         : { new_account_maltainvest: 1, accept_risk: 0 },
            fnc_response_handler: handleResponse,
        });

        $('#tax_information_note_toggle').off('click').on('click', (e) => {
            e.stopPropagation();
            $('#tax_information_note_toggle').toggleClass('open');
            $('#tax_information_note').slideToggle();
        });
    };

    const getValidations = () => {
        let validations =
              AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id), [
                  { selector: '#tax_identification_number', validations: ['req', 'tax_id', ['length', { min: 1, max: 20 }]] },
                  { selector: '#chk_tax_id',                validations: [['req', { hide_asterisk: true, message: localize('Please confirm that all the information above is true and complete.')}]], exclude_request: 1 },
              ]);
        const place_of_birth = State.getResponse('get_settings.place_of_birth');
        if (place_of_birth) {
            validations = validations.concat([{ request_field: 'place_of_birth', value: place_of_birth }]);
        }
        return validations;
    };

    const handleResponse = (response) => {
        if ('error' in response && response.error.code === 'show risk disclaimer') {
            $('#financial-form').setVisibility(0);
            const $financial_risk = $('#financial-risk');
            $financial_risk.setVisibility(1);
            $.scrollTo($financial_risk, 500, { offset: -10 });

            const risk_form_id = '#financial-risk';
            FormManager.init(risk_form_id, []);

            const echo_req = $.extend({}, response.echo_req);
            echo_req.accept_risk = 1;
            FormManager.handleSubmit({
                form_selector       : risk_form_id,
                obj_request         : echo_req,
                fnc_response_handler: handleResponse,
            });
        } else {
            AccountOpening.handleNewAccount(response, response.msg_type);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = FinancialAccOpening;
