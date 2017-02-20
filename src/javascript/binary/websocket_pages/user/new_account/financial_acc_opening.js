const AccountOpening = require('../../../common_functions/account_opening');
const Validation     = require('../../../common_functions/form_validation');
const toISOFormat    = require('../../../common_functions/string_util').toISOFormat;
const objectNotEmpty = require('../../../base/utility').objectNotEmpty;
const Client         = require('../../../base/client').Client;
const State          = require('../../../base/storage').State;
const url_for        = require('../../../base/url').url_for;
const getFormData    = require('../../../base/utility').getFormData;
const Cookies        = require('../../../../lib/js-cookie');
const moment         = require('moment');

const FinancialAccOpening = (function() {
    const formID = '#financial-form';

    const onLoad = function() {
        Client.set('accept_risk', 0);
        State.set('is_financial_opening', 1);
        if (Client.get('has_financial')) {
            window.location.href = url_for('trading');
            return;
        } else if (Client.get('has_gaming')) {
            $('.security').hide();
        }
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
                } else if (key === 'tax_residence') {
                    value = value.split(',');
                }
                if (value) $element.val(value).trigger('change');
            });
        });

        bindValidation();
    };

    const getValidations = () => (
        AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(formID), [
            { selector: '#tax_identification_number', validations: ['req', 'postcode', ['length', { min: 1, max: 20 }]] },
        ])
    );

    const bindValidation = () => {
        $(formID).off('submit').on('submit', function(evt) { onSubmit(evt); });
        $('#financial-risk').off('submit').on('submit', function(evt) {
            Client.set('accept_risk', 1);
            onSubmit(evt);
        });
    };

    const onSubmit = (evt) => {
        evt.preventDefault();
        if (Validation.validate(formID)) {
            BinarySocket.send(populateReq()).then((response) => {
                if ('error' in response && response.error.code === 'show risk disclaimer') {
                    $('#financial-form').addClass('hidden');
                    $('#financial-risk').removeClass('hidden');
                } else {
                    AccountOpening.handleNewAccount(response, response.msg_type);
                }
            });
        }
    };

    const populateReq = () => {
        let req = {
            new_account_maltainvest: 1,
            accept_risk            : Client.get('accept_risk'),
        };

        req = $.extend(req, getFormData());

        if (Client.get('has_gaming')) {
            delete req.secret_question;
            delete req.secret_answer;
        }

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }

        return req;
    };

    const onUnload = () => {
        State.set('is_financial_opening', 0);
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    FinancialAccOpening: FinancialAccOpening,
};
