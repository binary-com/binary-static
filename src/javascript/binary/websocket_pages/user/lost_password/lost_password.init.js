var Content        = require('../../../common_functions/content').Content;
var validateEmail  = require('../../../common_functions/validation').validateEmail;
var localize       = require('../../../base/localize').localize;
var load_with_pjax = require('../../../base/pjax').load_with_pjax;

var LostPassword = (function() {
    'use strict';

    var hiddenClass = 'invisible';

    function submitEmail() {
        var emailInput = ($('#lp_email').val() || '').trim();

        if (emailInput === '') {
            $('#email_error').removeClass(hiddenClass).text(localize('This field is required.'));
        } else if (!validateEmail(emailInput)) {
            $('#email_error').removeClass(hiddenClass).text(Content.errorMessage('valid', localize('email address')));
        } else {
            BinarySocket.send({ verify_email: emailInput, type: 'reset_password' });
            $('#submit').prop('disabled', true);
        }
    }

    function onEmailInput(input) {
        if (input) {
            $('#email_error').addClass(hiddenClass);
        }
    }

    function lostPasswordWSHandler(msg) {
        var response = JSON.parse(msg.data);
        var type = response.msg_type;

        if (type === 'verify_email') {
            if (response.verify_email === 1) {
                load_with_pjax(page.url.url_for('user/reset_passwordws'));
            } else if (response.error) {
                $('#email_error').removeClass(hiddenClass).text(Content.errorMessage('valid', localize('email address')));
                $('#submit').prop('disabled', false);
            }
        }
    }

    function init() {
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
    }

    return {
        lostPasswordWSHandler: lostPasswordWSHandler,
        init                 : init,
    };
})();

module.exports = {
    LostPassword: LostPassword,
};
