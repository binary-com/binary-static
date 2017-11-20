const BinaryPjax     = require('../../../base/binary_pjax');
const Client         = require('../../../base/client');
const AccountOpening = require('../../../common_functions/account_opening');
const FormManager    = require('../../../common_functions/form_manager');
const BinarySocket   = require('../../../websocket_pages/socket');
const localize       = require('../../../base/localize').localize;

const RealAccOpening = (() => {

    const onLoad = () => {
        if (Client.get('residence')) {
            const account_type_ico = /ico/.test(window.location.hash);

            if (account_type_ico) $('h1').html(localize('ICO Account Opening'));

            if (AccountOpening.redirectAccount(account_type_ico)) return;

            BinarySocket.wait('landing_company').then(() => {
                const form_id = '#frm_real';
                AccountOpening.populateForm(form_id,
                    () => AccountOpening.commonValidations().concat(AccountOpening.selectCheckboxValidation(form_id))
                    , false, account_type_ico);

                FormManager.handleSubmit({
                    form_selector       : form_id,
                    obj_request         : { new_account_real: 1, account_type: account_type_ico ? 'ico' : 'default' },
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
