const BinaryPjax         = require('../../../base/binary_pjax');
const Client             = require('../../../base/client');
const State              = require('../../../base/storage').State;
const defaultRedirectUrl = require('../../../base/url').defaultRedirectUrl;
const objectNotEmpty     = require('../../../base/utility').objectNotEmpty;
const AccountOpening     = require('../../../common_functions/account_opening');
const FormManager        = require('../../../common_functions/form_manager');
const toISOFormat        = require('../../../common_functions/string_util').toISOFormat;
const moment             = require('moment');

const FinancialAccOpening = (function() {
    const formID = '#financial-form';

    const onLoad = function() {
        State.set('is_financial_opening', 1);
        if (Client.get('has_financial') || !Client.get('residence')) {
            BinaryPjax.load('trading');
            return;
        } else if (Client.get('has_gaming')) {
            $('.security').hide();
        }
        $('#tax_residence').select2();

        BinarySocket.wait('landing_company').then((response) => {
            const landing_company = response.landing_company;
            if (Client.get('is_virtual')) {
                if (Client.canUpgradeVirtualToJapan(landing_company)) {
                    BinaryPjax.load('new_account/japanws');
                } else if (!Client.canUpgradeVirtualToFinancial(landing_company)) {
                    BinaryPjax.load('new_account/realws');
                }
            } else if (!Client.canUpgradeGamingToFinancial(landing_company)) {
                BinaryPjax.load(defaultRedirectUrl());
            }
        });

        if (AccountOpening.redirectAccount()) return;
        AccountOpening.populateForm(formID, getValidations);

        BinarySocket.send({ get_financial_assessment: 1 }).then((response) => {
            if (objectNotEmpty(response.get_financial_assessment)) {
                const keys = Object.keys(response.get_financial_assessment);
                keys.forEach(function(key) {
                    const val = response.get_financial_assessment[key];
                    $('#' + key).val(val);
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
                } else if (key === 'tax_residence' && value) {
                    value = value.split(',');
                }
                if (value) {
                    $element.val(value).trigger('change');
                }
            });
        });

        FormManager.handleSubmit({
            form_selector       : formID,
            obj_request         : { new_account_maltainvest: 1, accept_risk: 0 },
            fnc_response_handler: handleResponse,
        });
    };

    const getValidations = () => (
        AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(formID), [
            { selector: '#tax_identification_number', validations: ['req', 'postcode', ['length', { min: 1, max: 20 }]] },
        ])
    );

    const handleResponse = (response) => {
        if ('error' in response && response.error.code === 'show risk disclaimer') {
            $('#financial-form').addClass('hidden');
            const $financial_risk = $('#financial-risk');
            $financial_risk.removeClass('hidden');
            $.scrollTo($financial_risk, 500, { offset: -10 });

            const form_id = '#financial-risk';
            FormManager.init(form_id, []);

            const echo_req = $.extend({}, response.echo_req);
            echo_req.accept_risk = 1;
            FormManager.handleSubmit({
                form_selector       : form_id,
                obj_request         : echo_req,
                fnc_response_handler: handleResponse,
            });
        } else {
            AccountOpening.handleNewAccount(response, response.msg_type);
        }
    };

    const onUnload = () => {
        State.set('is_financial_opening', 0);
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = FinancialAccOpening;
