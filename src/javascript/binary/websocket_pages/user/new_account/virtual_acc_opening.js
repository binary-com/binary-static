var template              = require('../../../base/utility').template;
var handleResidence       = require('../../../common_functions/account_opening').handleResidence;
// var isIE                  = require('../../../common_functions/common_functions').isIE;
var Content               = require('../../../common_functions/content').Content;
var japanese_client       = require('../../../common_functions/country_base').japanese_client;
var bind_validation       = require('../../../validator').bind_validation;
var VirtualAccOpeningData = require('./virtual_acc_opening/virtual_acc_opening.data').VirtualAccOpeningData;

var VirtualAccOpening = (function() {
    function onSuccess(res) {
        var new_account = res.new_account_virtual;
        page.client.set_cookie('residence', res.echo_req.residence);
        page.client.process_new_account(
            new_account.email,
            new_account.client_id,
            new_account.oauth_token,
            true);
    }

    function onInvalidToken() {
        $('.notice-message').remove();
        var $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(Content.localize().textClickHereToRestart, [page.url.url_for('')]),
        }));
    }

    function onDuplicateEmail() {
        $('.notice-message').remove();
        var $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(Content.localize().textDuplicatedEmail, [page.url.url_for('user/lost_passwordws')]),
        }));
    }

    function onPasswordError() {
        var $error = $('#error-account-opening');
        $error.css({ display: 'block' })
            .text(page.text.localize('Password is not strong enough.'));
    }

    function configureSocket() {
        BinarySocket.init({
            onmessage: VirtualAccOpeningData.handler({
                success       : onSuccess,
                invalidToken  : onInvalidToken,
                duplicateEmail: onDuplicateEmail,
                passwordError : onPasswordError,
            }),
        });
    }

    function init() {
        Content.populate();
        handleResidence();
        BinarySocket.send({ residence_list: 1 });
        BinarySocket.send({ website_status: 1 });

        var form = $('#virtual-form')[0];
        if (!form) return;
        // if (!isIE()) {
        //     $('#password').on('input', function() {
        //         $('#password-meter').attr('value', testPassword($('#password').val())[0]);
        //     });
        // } else {
        //     $('#password-meter').remove();
        // }

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
                    password         : data.password,
                    residence        : (japanese_client() ? 'jp' : data.residence),
                    verification_code: data['verification-code'],
                });
            },
        });
    }

    var onLoad = function() {
        if (page.client.is_logged_in) {
            window.location.href = page.url.url_for('home');
            return;
        }
        init();
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = {
    VirtualAccOpening: VirtualAccOpening,
};
