const BinaryPjax        = require('../../../base/binary_pjax');
const Client            = require('../../../base/client').Client;
const State             = require('../../../base/storage').State;
const AccountOpening    = require('../../../common_functions/account_opening');
const detect_hedging    = require('../../../common_functions/common_functions').detect_hedging;
const FormManager       = require('../../../common_functions/form_manager');

const JapanAccOpening = (function() {
    const onLoad = function() {
        if (AccountOpening.redirectCookie()) return;
        BinarySocket.wait('authorize').then(() => {
            if (Client.get('residence') !== 'jp') {
                BinaryPjax.load('trading');
                return;
            }
            State.set('is_japan_opening', 1);
            if (AccountOpening.redirectAccount()) return;
            AccountOpening.populateForm();
            const formID = '#japan-form';

            FormManager.init(formID, [
                { selector: '#first_name',         validations: ['req', 'letter_symbol'] },
                { selector: '#last_name',          validations: ['req', 'letter_symbol'] },
                { selector: '#date_of_birth',      validations: ['req'] },
                { selector: '#address_line_1',     validations: ['req', 'general'] },
                { selector: '#address_line_2',     validations: ['general'] },
                { selector: '#address_city',       validations: ['req', 'letter_symbol'] },
                { selector: '#address_state',      validations: ['req'] },
                { selector: '#address_postcode',   validations: ['req', ['regular', { regex: /^\d{3}-\d{4}$/, message: 'Please follow the pattern 3 numbers, a dash, followed by 4 numbers.' }]] },
                { selector: '#phone',              validations: ['req', ['regular', { regex: /^\+?[0-9\s-]+$/, message: 'Only numbers, space, and hyphen are allowed.' }], ['min', { min: 6, max: 35 }]] },
                { selector: '#secret_answer',      validations: ['req', ['min', { min: 1, max: 50 }]] },
                { selector: '#daily_loss_limit',   validations: ['req', 'number'] },
                { selector: '#hedge_asset_amount', validations: ['req', 'number'] },

                { request_field: 'residence',         value: Client.get('residence') },
                { request_field: 'new_account_japan', value: 1 },
            ].concat(AccountOpening.selectCheckboxValidation(formID)));

            detect_hedging($('#trading_purpose'), $('.hedging-assets'));

            FormManager.handleSubmit({
                form_selector       : formID,
                fnc_response_handler: handleResponse,
            });
        });
    };

    const handleResponse = (response) => {
        if ('error' in response) {
            AccountOpening.handleNewAccount(response, response.msg_type);
        } else {
            BinaryPjax.load('new_account/knowledge_testws');
            $('#topbar-msg').children('a').addClass('invisible');
        }
    };

    const onUnload = () => {
        State.set('is_japan_opening', 0);
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = JapanAccOpening;
