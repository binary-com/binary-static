const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');
const detectHedging  = require('../../../../_common/common_functions').detectHedging;

const JapanAccOpening = (() => {
    const onLoad = () => {
        if (AccountOpening.redirectAccount()) return;
        AccountOpening.populateForm();
        const form_id = '#japan-form';

        FormManager.init(form_id, [
            { selector: '#first_name',         validations: ['req', 'letter_symbol'] },
            { selector: '#last_name',          validations: ['req', 'letter_symbol'] },
            { selector: '#date_of_birth',      validations: ['req'] },
            { selector: '#address_line_1',     validations: ['req', 'address'] },
            { selector: '#address_line_2',     validations: ['address'] },
            { selector: '#address_city',       validations: ['req', 'letter_symbol'] },
            { selector: '#address_state',      validations: ['req'] },
            { selector: '#address_postcode',   validations: ['req', ['regular', { regex: /^\d{3}-\d{4}$/, message: 'Please follow the pattern 3 numbers, a dash, followed by 4 numbers.' }]] },
            { selector: '#phone',              validations: ['req', ['regular', { regex: /^\+?[0-9\s-]+$/, message: 'Only numbers, space, and hyphen are allowed.' }], ['min', { min: 6, max: 35 }]] },
            { selector: '#secret_answer',      validations: ['req', ['min', { min: 1, max: 50 }]] },
            { selector: '#daily_loss_limit',   validations: ['req', 'number'] },
            { selector: '#hedge_asset_amount', validations: ['req', 'number'] },
            { selector: '#motivation_circumstances', validations: ['req'] },

            { request_field: 'residence',         value: Client.get('residence') },
            { request_field: 'new_account_japan', value: 1 },
        ].concat(AccountOpening.selectCheckboxValidation(form_id)));

        detectHedging($('#trading_purpose'), $('.hedging-assets'));

        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: handleResponse,
        });
    };

    const handleResponse = (response) => {
        if ('error' in response) {
            AccountOpening.handleNewAccount(response, response.msg_type);
        } else {
            BinaryPjax.load('new_account/knowledge_testws');
            $('#topbar-msg').children('a').setVisibility(0);
        }
    };

    return {
        onLoad,
    };
})();

module.exports = JapanAccOpening;
