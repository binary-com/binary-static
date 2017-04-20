import BinaryPjax from '../../../base/binary_pjax';
import Client from '../../../base/client';
import AccountOpening from '../../../common_functions/account_opening';
import FormManager from '../../../common_functions/form_manager';

const RealAccOpening = (() => {
    'use strict';

    const onLoad = () => {
        if (AccountOpening.redirectCookie()) return;

        if (Client.get('residence')) {
            if (AccountOpening.redirectAccount()) return;

            const form_id = '#frm_real';
            AccountOpening.populateForm(form_id, () =>
                AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id)),
            );
            FormManager.handleSubmit({
                form_selector       : form_id,
                obj_request         : { new_account_real: 1 },
                fnc_response_handler: handleResponse,
            });
        } else {
            BinaryPjax.load('trading');
        }
    };

    const handleResponse = response => AccountOpening.handleNewAccount(response, response.msg_type);

    return {
        onLoad: onLoad,
    };
})();

module.exports = RealAccOpening;
