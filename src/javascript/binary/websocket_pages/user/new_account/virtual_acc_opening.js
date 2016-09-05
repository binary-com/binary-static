pjax_config_page("new_account/virtualws", function() {
    function onSuccess(res) {
        var new_account = res.new_account_virtual;
        page.client.set_cookie('residence', res.echo_req.residence);
        page.client.process_new_account(
            new_account.email,
            new_account.client_id,
            new_account.oauth_token,
            true
        );
    }

    function onInvalidToken(res) {
        $('.notice-message').remove();
        var $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(Content.localize().textClickHereToRestart, [page.url.url_for('')]),
        }));
    }

    function onDuplicateEmail(res) {
        $('.notice-message').remove();
        var $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(Content.localize().textDuplicatedEmail, [page.url.url_for('user/lost_passwordws')]),
        }));
    }

    function onPasswordError(res) {
        var $error = $('#error-account-opening');
        $error.css({display: 'block'})
            .text(text.localize('Password is not strong enough.'));
    }

    function configureSocket() {
        BinarySocket.init({
            onmessage: VirtualAccOpeningData.handler({
                success:        onSuccess,
                invalidToken:   onInvalidToken,
                duplicateEmail: onDuplicateEmail,
                passwordError:  onPasswordError,
            })
        });
    }

    function init() {
        Content.populate();
        handle_residence_state_ws();
        BinarySocket.send({residence_list: 1});

        var form = $('#virtual-form')[0];
        if (!form) return;
        if (!isIE()) {
            $('#password').on('input', function() {
                $('#password-meter').attr('value', testPassword($('#password').val())[0]);
            });
        } else {
            $('#password-meter').remove();
        }

        bind_validation.simple(form, {
            schema: VirtualAccOpeningData.getSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                if (info.errors.length > 0) {
                    return;
                }
                configureSocket();
                var data = info.values;
                VirtualAccOpeningData.newAccount({
                    password:  data.password,
                    residence: data.residence,
                    verification_code: data['verification-code'],
                });
            },
        });
    }

    return {
        onLoad: function() {
            if (CommonData.getLoginToken()) {
                window.location.href = page.url.url_for('home');
                return;
            }
            init();
        }
    };
});
