var PasswordWS = (function(){
    var $form, $result;

    function init() {
        $('#change-password').removeClass('invisible');
        $form   = $('#change-password > form');
        $result = $('#change-password > div[data-id="success-result"]');
        bind_validation.simple($form[0], {
            stop:     displayErrors,
            schema:   getSchema(),
            submit:   function(ev, info) {
                ev.preventDefault();
                ev.stopPropagation();
                if (info.errors.length > 0) return;
                sendRequest(info.values);
            },
        });
    }

    var IS_EMPTY    = {q: 'old-blank'};
    var MATCHES_OLD = {q: 'same-as-old'};

    function displayErrors(info) {
        ValidationUI.clear();
        $form.find('p[data-error]').addClass('hidden');
        info.errors.forEach(function(err) {
            switch (err.err) {
                case MATCHES_OLD:
                case IS_EMPTY:
                    $form.find('p[data-error="'+err.err.q+'"]').removeClass('hidden');
                    break;
                default:
                    ValidationUI.draw('input[name=' + err.ctx + ']', err.err);
            }
        });
    }

    function getSchema() {
        var V2 = ValidateV2;
        var err = Content.localize().textPasswordsNotMatching;
        function notMatchingOld(value, data) {
            return value !== data.old_password;
        }
        function match(value, data) {
            return value === data.new_password;
        }
        return {
            old_password: [customError(V2.required, IS_EMPTY)],
            new_password: [V2.required, dv.check(notMatchingOld, MATCHES_OLD), V2.password],
            repeat_password: [V2.required, dv.check(match, err)],
        };
    }

    function sendRequest(data) {
        BinarySocket.send({
            'change_password': '1',
            'old_password': data.old_password,
            'new_password': data.new_password,
        });
    }

    function handler(response) {
        if ('error' in response) {
            var errorMsg = text.localize('Old password is wrong.');
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
            page.client.send_logout_request(true);
        }, 5000);
    }

    return {
        init: init,
        handler: handler
    };
})();

pjax_config_page_require_auth('user/security/change_password', function() {
    return {
        onLoad: function() {
            Content.populate();
            if (isIE() === false) {
                $('#new_password').on('input', function() {
                    $('#password-meter').attr('value', testPassword(this.value)[0]);
                });
            } else {
                $('#password-meter').remove();
            }

            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (!response) return;
                    var type = response.msg_type;
                    if (type === 'change_password' || (type === 'error' && 'change_password' in response.echo_req)) {
                        PasswordWS.handler(response);
                    }
                }
            });
            PasswordWS.init();
        }
    };
});
