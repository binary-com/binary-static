const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');
const getElementById = require('../../../../_common/common_functions').getElementById;
const State          = require('../../../../_common/storage').State;

const RealAccOpening = (() => {
    const form_id = '#frm_real';

    const onLoad = () => {
        if (Client.get('residence')) {
            BinarySocket.wait('get_settings', 'landing_company', 'get_account_status').then(() => {
                if (AccountOpening.redirectAccount()) return;
                const is_unwelcome_uk = State.getResponse('get_account_status.status').some(status => status === 'unwelcome') && (/gb/.test(Client.get('residence')));

                if (State.getResponse('authorize.upgradeable_landing_companies').some(item => item === 'svg')) {
                    getElementById('risk_disclaimer').setVisibility(1);
                }
                if (is_unwelcome_uk) {
                    getElementById('ukgc_age_verification').setVisibility(1);
                }

                const get_settings = State.getResponse('get_settings');
                if (get_settings.has_secret_answer) {
                    $('.security').hide();
                }

                AccountOpening.populateForm(form_id, getValidations, false);

                FormManager.handleSubmit({
                    form_selector       : form_id,
                    obj_request         : { new_account_real: 1 },
                    fnc_response_handler: handleResponse,
                });
                $('#tax_information_note_toggle').off('click').on('click', (e) => {
                    e.stopPropagation();
                    $('#tax_information_note_toggle').toggleClass('open');
                    $('#tax_information_note').slideToggle();
                });
            });
        } else {
            BinaryPjax.loadPreviousUrl();
        }
        AccountOpening.showHidePulser(0);
        AccountOpening.registerPepToggle();
    };

    const getValidations = () => {
        let validations = AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id));
        const place_of_birth = State.getResponse('get_settings.place_of_birth');
        if (place_of_birth) {
            validations = validations.concat([{ request_field: 'place_of_birth', value: place_of_birth }]);
        }
        if (
            State.getResponse('authorize.upgradeable_landing_companies')
                .some(item => ['malta', 'iom'].some(lc => lc === item))
        ) {
            validations = validations.concat([{ selector: '#citizen', validations: ['req'] }]);
        }
        return validations;
    };

    const handleResponse = response => (AccountOpening.handleNewAccount(response, response.msg_type));

    const onUnload = () => { AccountOpening.showHidePulser(1); };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = RealAccOpening;
