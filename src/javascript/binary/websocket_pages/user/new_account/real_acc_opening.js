const BinaryPjax         = require('../../../base/binary_pjax');
const Client             = require('../../../base/client');
const defaultRedirectUrl = require('../../../base/url').defaultRedirectUrl;
const AccountOpening     = require('../../../common_functions/account_opening');
const FormManager        = require('../../../common_functions/form_manager');

const RealAccOpening = (() => {
    'use strict';


    const onLoad = () => {
        if (Client.get('residence')) {
            if (AccountOpening.redirectAccount()) return;

            const form_id = '#frm_real';
            AccountOpening.populateForm(form_id,
                () => AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id)));
            FormManager.handleSubmit({
                form_selector       : form_id,
                obj_request         : { new_account_real: 1 },
                fnc_response_handler: handleResponse,
            });
        } else {
            BinaryPjax.load(defaultRedirectUrl());
        }
    };

    const handleResponse = response => (AccountOpening.handleNewAccount(response, response.msg_type));

    return {
        onLoad: onLoad,
    };
})();

module.exports = RealAccOpening;
