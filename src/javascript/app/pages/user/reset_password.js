const BinarySocket   = require('../../base/socket');
const ClientBase = require('../../../_common/base/client_base');
const Dialog         = require('../../common/attach_dom/dialog');
const FormManager    = require('../../common/form_manager');
const Login          = require('../../../_common/base/login');
const getElementById = require('../../../_common/common_functions').getElementById;
const localize       = require('../../../_common/localize').localize;
const State          = require('../../../_common/storage').State;
const toTitleCase    = require('../../../_common/string_util').toTitleCase;

const ResetPassword = (() => {
    let form_reset_pw_id,
        form_reset_binary_pw_id,
        $reset_pw_container,
        $reset_pw_binary_container,
        social_signup_identifier,
        $msg_reset_password,
        $form_error,
        $form_error_msg;

    const hasSocialSignup = () => {
        const { social_identity_provider, status } = State.getResponse('get_account_status');
        if (Array.isArray(status)) {
            social_signup_identifier = toTitleCase(social_identity_provider);
            return status.includes('social_signup');
        }
        return false;
    };

    const responseHandler = (response) => {
        if (response.error) {
            $reset_pw_container.setVisibility(0);
            $msg_reset_password.setVisibility(0);

            let err_msg;
            const error_code = response.error.code;
            if (error_code === 'SocialBased') {
                err_msg = response.error.message;
                $form_error.find('a').setVisibility(0);
            } else { // special handling as backend return inconsistent format
                err_msg = localize('[_1] Please click the link below to restart the password recovery process.', error_code === 'InputValidationFailed' ? localize('There was some invalid character in an input field.') : response.error.message);
            }

            $form_error_msg.text(err_msg);
            $form_error.setVisibility(1);
        } else {
            Dialog.alert({
                id               : 'change_password_success_dialog',
                localized_message: localize('You have a new binary password.'),
                localized_title  : localize('Binary password'),
                ok_text          : localize('Done'),
                onConfirm        : () => Login.redirectToLogin(true),
            });
        }
    };

    const unlinkResponseHandler = (response) => {
        if (response.error) {
            $reset_pw_binary_container.setVisibility(0);
            const err_msg     = response.error.message;

            $msg_reset_password.setVisibility(0);
            $form_error.find('a').setVisibility(0);
            $form_error_msg.text(err_msg);
            $form_error.setVisibility(1);
        } else {
            Dialog.alert({
                id               : 'sent_email_success_dialog',
                localized_message: localize('Your Binary account is unlinked from [_1]. Use [_2]your email and password for future log in.', [social_signup_identifier, '<br />']),
                localized_title  : localize('Success!'),
                ok_text          : localize('Got it'),
                onConfirm        : () => Login.redirectToLogin(true),
            });
        }
    };

    const initResetPw = () => {
        getElementById('password_reset_header').innerHTML = localize('Binary Password Reset');
        $reset_pw_container.setVisibility(1);
        FormManager.init(form_reset_pw_id, [
            { selector: '#have_real_account',  validations: ['req'], exclude_request: 1 },
            { selector: '#new_password',       validations: ['req', 'password'] },
            { request_field: 'reset_password', value: 1 },
        ], true);

        FormManager.handleSubmit({
            form_selector       : form_reset_pw_id,
            fnc_response_handler: responseHandler,
        });
    };

    const initResetBinaryPw = () => {
        getElementById('password_reset_header').innerHTML = localize('Binary password');
        $reset_pw_binary_container.setVisibility(1);
        FormManager.init(form_reset_binary_pw_id, [
            { selector: '#have_real_account',  validations: ['req'], exclude_request: 1 },
            { selector: '#new_binary_password', request_field: 'new_password', validations: ['req', 'password'] },
            { request_field: 'reset_password', value: 1 },
        ], true);

        FormManager.handleSubmit({
            form_selector       : form_reset_binary_pw_id,
            fnc_response_handler: unlinkResponseHandler,
        });
    };

    const onLoad = () => {
        form_reset_pw_id           = '#frm_reset_password';
        form_reset_binary_pw_id    = '#frm_reset_binary_password';
        $reset_pw_container        = $('#container_reset_password');
        $reset_pw_binary_container = $('#container_reset_binary_password');
        $msg_reset_password        = $('#msg_reset_password');
        $form_error                = $('#form_error');
        $form_error_msg            = $('#form_error_msg');

        if (ClientBase.isLoggedIn()) {
            BinarySocket.wait('get_account_status').then(() => {
                if (hasSocialSignup()) {
                    initResetBinaryPw();
                } else {
                    initResetPw();
                }
            });
        } else {
            initResetPw();
        }
    };

    return {
        onLoad,
    };
})();

module.exports = ResetPassword;
