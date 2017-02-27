const Client            = require('../../base/client').Client;
const localize          = require('../../base/localize').localize;
const Login             = require('../../base/login').Login;
const generateBirthDate = require('../../common_functions/attach_dom/birth_date_picker');
const FormManager       = require('../../common_functions/form_manager');

const ResetPassword = (function () {
    'use strict';

    const hidden_class = 'invisible';

    const responseHandler = function(response) {
        $('#container_reset_password').addClass(hidden_class);
        if (response.error) {
            const $form_error = $('#form_error');
            const resetErrorTemplate = '[_1] Please click the link below to restart the password recovery process. If you require further assistance, please contact our Customer Support.';
            const error_code = response.error.code;

            $('#msg_reset_password').addClass(hidden_class);

            let errMsg;
            if (error_code === 'SocialBased') {
                errMsg = localize(response.error.message);
                $form_error.find('a').addClass(hidden_class);
            } else { // special handling as backend return inconsistent format
                errMsg = localize(resetErrorTemplate, [error_code === 'InputValidationFailed' ? localize('Token has expired.') : localize(response.error.message)]);
            }

            $('#form_error_msg').text(errMsg);
            $form_error.removeClass(hidden_class);
        } else {
            $('#msg_reset_password').text(localize('Your password has been successfully reset. Please log into your account using your new password.'));
            setTimeout(function () {
                Login.redirect_to_login();
            }, 5000);
        }
    };

    const init = function() {
        generateBirthDate();

        $('#have_real_account').click(function () {
            if ($(this).is(':checked')) {
                $('#dob_field').removeClass(hidden_class);
            } else {
                $('#dob_field').addClass(hidden_class);
            }
        });

        const form_id = '#frm_reset_password';
        FormManager.init(form_id, [
            { selector: '#verification_code', validations: ['req', 'email_token'] },
            { selector: '#new_password',      validations: ['req', 'password'] },
            { selector: '#repeat_password',   validations: ['req', ['compare', { to: '#new_password' }]], exclude_request: 1 },
            { selector: '#date_of_birth',     validations: ['req'] },
        ]);

        FormManager.handleSubmit(form_id, { reset_password: 1 }, responseHandler);
    };

    const onLoad = function() {
        if (!Client.redirect_if_login()) {
            init();
        }
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = ResetPassword;

