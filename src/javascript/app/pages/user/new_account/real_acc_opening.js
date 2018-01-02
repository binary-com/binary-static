const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const AccountOpening = require('../../../common/account_opening');
const FormManager    = require('../../../common/form_manager');

const RealAccOpening = (() => {

    const onLoad = () => {
        if (Client.get('residence')) {
            if (AccountOpening.redirectAccount()) return;

            BinarySocket.wait('landing_company').then(() => {
                const form_id = '#frm_real';
                AccountOpening.populateForm(form_id,
                    () => AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id))
                    , false);

                FormManager.handleSubmit({
                    form_selector       : form_id,
                    obj_request         : { new_account_real: 1, account_type: 'default' },
                    fnc_response_handler: handleResponse,
                });
            });
        } else {
            BinaryPjax.loadPreviousUrl();
        }
    };

    const handleResponse = response => (AccountOpening.handleNewAccount(response, response.msg_type));

    return {
        onLoad,
    };
})();

module.exports = RealAccOpening;
