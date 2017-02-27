const Client      = require('../../../base/client').Client;
const localize    = require('../../../base/localize').localize;
const url_for     = require('../../../base/url').url_for;
const FormManager = require('../../../common_functions/form_manager');

const ChangePassword = (function() {
    let $form,
        $result;

    const init = function() {
        const formID = '#change-password';
        const $container = $(formID);
        $container.removeClass('invisible');
        $form = $container.find(' > form');
        $result = $container.find(' > div[data-id="success-result"]');
        FormManager.init(formID, [
            { selector: '#old_password',   validations: ['req', 'password'] },
            { selector: '#new_password',   validations: ['req', 'password', ['not_equal', { to: '#old_password', name1: 'Current password', name2: 'New password' }]] },
            { selector: 'repeat_password', validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },
        ]);
        FormManager.handleSubmit(formID, { change_password: 1 }, handler);
    };

    const handler = function(response) {
        if ('error' in response) {
            let errorMsg = localize('Old password is wrong.');
            if ('message' in response.error) {
                if (response.error.message.indexOf('old_password') === -1) {
                    errorMsg = response.error.message;
                }
            }
            $form.find('p[data-error="server-sent-error"]').text(errorMsg).removeClass('hidden');
            return;
        }

        $form.addClass('hidden');
        $result.removeClass('hidden');
        setTimeout(function() {
            Client.send_logout_request(true);
        }, 5000);
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
