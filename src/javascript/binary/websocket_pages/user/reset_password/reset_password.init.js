const Login             = require('../../../base/login').Login;
const isValidDate       = require('../../../common_functions/common_functions').isValidDate;
const Content           = require('../../../common_functions/content').Content;
const generateBirthDate = require('../../../common_functions/attach_dom/birth_date_picker').generateBirthDate;
const passwordValid     = require('../../../common_functions/validation').passwordValid;
const showPasswordError = require('../../../common_functions/validation').showPasswordError;
const localize = require('../../../base/localize').localize;

const ResetPassword = (function () {
    'use strict';

    const hiddenClass = 'invisible';
    const resetErrorTemplate = '[_1] Please click the link below to restart the password recovery process. If you require further assistance, please contact our Customer Support.';
    let date_of_birth;

    const submitResetPassword = function() {
        const token = $('#verification-code').val();
        const pw1 = $('#reset-password1').val();
        const pw2 = $('#reset-password2').val();

        if (token.length < 48) {
            $('#verification-error').removeClass(hiddenClass).text(localize('Verification code format incorrect.'));
            return;
        }
        const $pw_err1 = $('#password-error1');
        if (!pw1) {                                         // password not entered
            $pw_err1.empty()
                    .append('<p></p>', { class: 'errorfield' }).text(Content.localize().textMessageRequired)
                    .removeClass(hiddenClass);
            return;
        } else if (!passwordValid(pw1)) {                   // password failed validation
            const errMsgs = showPasswordError(pw1);
            $pw_err1.empty();
            errMsgs.forEach(function(msg) {
                const $errP = $('<p></p>', { class: 'errorfield' }).text(msg);
                $pw_err1.append($errP);
            });
            $pw_err1.removeClass(hiddenClass);
            return;
        }

        if (pw1 !== pw2) {
            if (!pw2) {
                $('#password-error2')
                    .removeClass(hiddenClass)
                    .text(Content.localize().textMessageRequired);
            } else {
                $('#password-error2')
                    .removeClass(hiddenClass)
                    .text(Content.localize().textPasswordsNotMatching);
            }

            return;
        }

        if (date_of_birth) {
            if (!isValidDate(date_of_birth)) {
                $('#dob-error').removeClass(hiddenClass).text(localize('Invalid format for date of birth.'));
                return;
            }

            BinarySocket.send({
                reset_password   : 1,
                verification_code: token,
                new_password     : pw1,
                date_of_birth    : date_of_birth,
            });
            $('#reset').prop('disabled', true);
        } else {
            BinarySocket.send({
                reset_password   : 1,
                verification_code: token,
                new_password     : pw1,
            });
            $('#reset').prop('disabled', true);
        }
    };

    const hideError = function() {
        $('.errorfield').addClass(hiddenClass);
    };

    const resetPasswordWSHandler = function(msg) {
        const response = JSON.parse(msg.data);
        const type = response.msg_type;

        if (type === 'reset_password') {
            $('#reset').prop('disabled', true);
            $('#reset-form').addClass(hiddenClass);

            if (response.error) {
                $('p.notice-msg').addClass(hiddenClass);
                $('#reset-error').removeClass(hiddenClass);

                const error_code = response.error.code;
                let errMsg;
                if (error_code === 'SocialBased') {
                    errMsg = localize(response.error.message);
                    $('#reset-error').find('a').addClass(hiddenClass);
                } else { // special handling as backend return inconsistent format
                    errMsg = localize(resetErrorTemplate, [error_code === 'InputValidationFailed' ? localize('Token has expired.') : localize(response.error.message)]);
                }

                $('#reset-error-msg').text(errMsg);
            } else {
                $('p.notice-msg')
                    .text(localize('Your password has been successfully reset. Please log into your account using your new password.'));
                window.setTimeout(function () {
                    Login.redirect_to_login();
                }, 5000);
            }
        }
    };

    const haveRealAccountHandler = function() {
        const isChecked = $('#have-real-account').is(':checked');
        if (isChecked) {
            $('#dob-field').removeClass(hiddenClass);
        } else {
            $('#dob-field').addClass(hiddenClass);
        }
    };

    const onDOBChange = function() {
        date_of_birth = $('#date_of_birth').attr('data-value');
    };

    const onEnterKey = function(e) {
        if (e.which === 13) {
            submitResetPassword();
        }
    };

    const init = function() {
        $('#reset_passwordws').removeClass('invisible');
        Content.populate();
        generateBirthDate();

        $('input').keypress(function (e) {
            hideError();
            onEnterKey(e);
        });

        $('#reset:enabled').click(function () {
            submitResetPassword();
        });

        $('#have-real-account').click(function () {
            haveRealAccountHandler();
        });

        $('select').change(function () {
            hideError();
            onDOBChange();
        });
    };

    return {
        resetPasswordWSHandler: resetPasswordWSHandler,
        init                  : init,
    };
})();

module.exports = {
    ResetPassword: ResetPassword,
};
