const BinaryPjax  = require('../../../base/binary_pjax');
const Client      = require('../../../base/client');
const localize    = require('../../../base/localize').localize;
const FormManager = require('../../../common_functions/form_manager');

const ChangePassword = (function() {
    const form_id = '#frm_change_password';

    const init = function() {
        FormManager.init(form_id, [
            { selector: '#old_password',    validations: ['req', ['length', { min: 6, max: 25 }]] },
            { selector: '#new_password',    validations: ['req', 'password', ['not_equal', { to: '#old_password', name1: 'Current password', name2: 'New password' }]], re_check_field: '#repeat_password' },
            { selector: '#repeat_password', validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },

            { request_field: 'change_password', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: handler,
        });
    };

    const handler = function(response) {
        if ('error' in response) {
            $('#form_error').text(localize(response.error.message)).removeClass('hidden');
        } else {
            $(form_id).addClass('hidden');
            $('#msg_success').removeClass('invisible');
            setTimeout(function() {
                Client.sendLogoutRequest(true);
            }, 5000);
        }
    };

    const onLoad = function() {
        BinarySocket.wait('get_account_status').then((response) => {
            if (/has_password/.test(response.get_account_status.status)) {
                init();
            } else {
                BinaryPjax.load('user/settingsws');
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = ChangePassword;

