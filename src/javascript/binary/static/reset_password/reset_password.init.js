var ResetPassword = (function () {
    'use strict';

    var hiddenClass = 'invisible';
    var resetErrorTemplate = '[_1]' +
        ' Please click the link below to restart the password recovery process. ' +
        'If you require further assistance, please contact our Customer Support.';
    var dobdd, dobmm, dobyy;

    function submitResetPassword() {
        var token = $('#verification-code').val();
        var pw1 = $('#reset-password1').val();
        var pw2 = $('#reset-password2').val();

        if (token.length < 48) {
            $('#verification-error').removeClass(hiddenClass).text(text.localize('Verification code format incorrect.'));
            return;
        }

        if (!pw1) {                                         // password not entered
            $('#password-error1').empty();
            $('#password-error1').append('<p></p>', {class: 'errorfield'}).text(Content.localize().textMessageRequired);
            $('#password-error1').removeClass(hiddenClass);
            return;
        } else if (!passwordValid(pw1)) {                   // password failed validation
            var errMsgs = showPasswordError(pw1);
            $('#password-error1').empty();
            errMsgs.forEach(function(msg){
                var $errP = $('<p></p>', {class: 'errorfield'}).text(msg);
                $('#password-error1').append($errP);
            });

            $('#password-error1').removeClass(hiddenClass);
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

        var dobEntered = dobdd && dobmm && dobyy;
        if (dobEntered) {
            var dob;
            if (!isValidDate(dobdd, dobmm, dobyy)) {
                $('#dob-error').removeClass(hiddenClass).text(text.localize('Invalid format for date of birth.'));
                return;
            }

            dob = dobyy + '-' + dobmm + '-' + dobdd;
            BinarySocket.send({
                reset_password: 1,
                verification_code: token,
                new_password: pw1,
                date_of_birth: dob
            });
            $('#reset').prop('disabled', true);
        } else {
            BinarySocket.send({
                reset_password: 1,
                verification_code: token,
                new_password: pw1
            });
            $('#reset').prop('disabled', true);
        }
    }

    function hideError() {
        $('.errorfield').addClass(hiddenClass);
    }

    function resetPasswordWSHandler(msg) {
        var response = JSON.parse(msg.data);
        var type = response.msg_type;

        if (type === 'reset_password') {
            $('#reset').prop('disabled', true);
            $('#reset-form').addClass(hiddenClass);

            if (response.error) {
                $('p.notice-msg').addClass(hiddenClass);
                $('#reset-error').removeClass(hiddenClass);

                // special handling as backend return inconsistent format
                var errMsg;
                if (response.error.code === 'InputValidationFailed') {
                    errMsg = text.localize(resetErrorTemplate).replace('[_1]', text.localize('Token has expired.'));
                } else {
                    errMsg = text.localize(resetErrorTemplate).replace('[_1]', text.localize(response.error.message));
                }

                $('#reset-error-msg').text(errMsg);
            } else {
                $('p.notice-msg')
                    .text(text.localize('Your password has been successfully reset. ' +
                        'Please log into your account using your new password.'));
                window.setTimeout(function () {
                    Login.redirect_to_login();
                }, 5000);
            }
        }
    }

    function haveRealAccountHandler() {
        var isChecked = $('#have-real-account').is(':checked');

        dobdd = undefined;
        dobmm = undefined;
        dobyy = undefined;

        if (page.language().toLowerCase() === 'ja') {
          $("#dobyy").val($("#dobyy option:first").val());
          $("#dobmm").val($("#dobmm option:first").val());
          $("#dobdd").val($("#dobdd option:first").val());
        } else {
          $('#dobdd').val('');
          $('#dobmm').val('');
          $('#dobyy').val('');
        }

        if (isChecked) {
            $('#dob-field').removeClass(hiddenClass);
        } else {
            $('#dob-field').addClass(hiddenClass);
        }
    }

    function onDOBChange() {
        dobdd = $('#dobdd').val();
        dobmm = $('#dobmm').val();
        dobyy = $('#dobyy').val();
    }

    function onEnterKey(e) {
        if (e.which === 13) {
            submitResetPassword();
        }
    }

    function init() {
        $('#reset_passwordws').removeClass('invisible');
        Content.populate();
        if (page.language().toLowerCase() === 'ja') {
          $('#dobmm').insertAfter('#dobyy');
          $('#dobdd').insertAfter('#dobmm');
        }
        generateBirthDate();
        var $pmContainer = $('#password-meter-container');

        $('input').keypress(function (e) {
            hideError();
            onEnterKey(e);
        });

        $('#reset-password1').keyup(function (ev) {
            PasswordMeter.updateMeter($pmContainer, ev.target.value);
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

        PasswordMeter.attach($pmContainer);
    }

    return {
        resetPasswordWSHandler: resetPasswordWSHandler,
        init: init
    };
}());
