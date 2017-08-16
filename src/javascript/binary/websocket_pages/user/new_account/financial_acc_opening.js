const moment             = require('moment');
const BinarySocket       = require('../../socket');
const BinaryPjax         = require('../../../base/binary_pjax');
const Client             = require('../../../base/client');
const isEmptyObject      = require('../../../base/utility').isEmptyObject;
const AccountOpening     = require('../../../common_functions/account_opening');
const FormManager        = require('../../../common_functions/form_manager');
const toISOFormat        = require('../../../common_functions/string_util').toISOFormat;

const FinancialAccOpening = (() => {
    'use strict';

    const form_id = '#financial-form';

    const onLoad = () => {
        if (Client.hasAccountType('financial') || !Client.get('residence')) {
            BinaryPjax.loadPreviousUrl();
            return;
        } else if (Client.hasAccountType('gaming')) {
            $('.security').hide();
        }

        if (AccountOpening.redirectAccount()) return;
        AccountOpening.populateForm(form_id, getValidations);

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
            const get_settings = response.get_settings;
            let $element,
                value;
            Object.keys(get_settings).forEach((key) => {
                $element = $(`#${key}`);
                value = get_settings[key];
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
    };

    const getValidations = () => (
        AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id), [
            { selector: '#tax_identification_number', validations: ['req', 'postcode', ['length', { min: 1, max: 20 }]] },
        ])
    );

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
        onLoad: onLoad,
    };
})();

module.exports = FinancialAccOpening;
