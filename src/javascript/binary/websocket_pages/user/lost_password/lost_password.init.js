const Content        = require('../../../common_functions/content').Content;
const validateEmail  = require('../../../common_functions/validation').validateEmail;
const localize       = require('../../../base/localize').localize;
const url_for        = require('../../../base/url').url_for;

const LostPassword = (function() {
    'use strict';

    const hiddenClass = 'invisible';

    const submitEmail = function() {
        const emailInput = ($('#lp_email').val() || '').trim();

        if (emailInput === '') {
            $('#email_error').removeClass(hiddenClass).text(localize('This field is required.'));
        } else if (!validateEmail(emailInput)) {
            $('#email_error').removeClass(hiddenClass).text(Content.errorMessage('valid', localize('email address')));
        } else {
            BinarySocket.send({ verify_email: emailInput, type: 'reset_password' });
            $('#submit').prop('disabled', true);
        }
    };

    const onEmailInput = function(input) {
        if (input) {
            $('#email_error').addClass(hiddenClass);
        }
    };

    const lostPasswordWSHandler = function(msg) {
        const response = JSON.parse(msg.data);
        const type = response.msg_type;

        if (type === 'verify_email') {
            if (response.verify_email === 1) {
                window.location.href = url_for('user/reset_passwordws');
            } else if (response.error) {
                $('#email_error').removeClass(hiddenClass).text(Content.errorMessage('valid', localize('email address')));
                $('#submit').prop('disabled', false);
            }
        }
    };

    const init = function() {
        Content.populate();
        $('#lost_passwordws').removeClass('invisible');
        $('#submit:enabled').click(function() {
            submitEmail();
        });

        $('#lp_email').keypress(function(ev) {
            if (ev.which === 13) {
                submitEmail();
            }
            onEmailInput(ev.target.value);
        });
    };

    return {
        lostPasswordWSHandler: lostPasswordWSHandler,
        init                 : init,
    };
})();

module.exports = {
    LostPassword: LostPassword,
};
