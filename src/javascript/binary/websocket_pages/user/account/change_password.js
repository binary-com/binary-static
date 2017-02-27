const Client      = require('../../../base/client').Client;
const localize    = require('../../../base/localize').localize;
const url_for     = require('../../../base/url').url_for;
const FormManager = require('../../../common_functions/form_manager');

const ChangePassword = (function() {
    const form_id = '#frm_change_password';

    const init = function() {
        FormManager.init(form_id, [
            { selector: '#old_password',    validations: ['req', 'password'] },
            { selector: '#new_password',    validations: ['req', 'password', ['not_equal', { to: '#old_password', name1: 'Current password', name2: 'New password' }]] },
            { selector: '#repeat_password', validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },
        ]);
        FormManager.handleSubmit(form_id, { change_password: 1 }, handler);
    };

    const handler = function(response) {
        if ('error' in response) {
            $('#form_error').text(localize(response.error.message)).removeClass('hidden');
        } else {
            $(form_id).addClass('hidden');
            $('#msg_success').removeClass('invisible');
            setTimeout(function() {
                Client.send_logout_request(true);
            }, 5000);
        }
    };

    const onLoad = function() {
        BinarySocket.wait('get_account_status').then((response) => {
            if (/has_password/.test(response.get_account_status.status)) {
                init();
            } else {
                window.location.href = url_for('user/settingsws');
            }
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = ChangePassword;
