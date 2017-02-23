const VirtualAccOpeningData = require('./virtual_acc_opening/virtual_acc_opening.data').VirtualAccOpeningData;
const Client                = require('../../../base/client').Client;
const localize              = require('../../../base/localize').localize;
const url_for               = require('../../../base/url').url_for;
const template              = require('../../../base/utility').template;
const handleResidence       = require('../../../common_functions/account_opening').handleResidence;
const Content               = require('../../../common_functions/content').Content;
const japanese_client       = require('../../../common_functions/country_base').japanese_client;
const bind_validation       = require('../../../validator').bind_validation;

const VirtualAccOpening = (function() {
    const onSuccess = function(res) {
        const new_account = res.new_account_virtual;
        Client.set_cookie('residence', res.echo_req.residence);
        Client.process_new_account(
            new_account.email,
            new_account.client_id,
            new_account.oauth_token,
            true);
    };

    const onInvalidToken = function() {
        $('.notice-message').remove();
        const $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(Content.localize().textClickHereToRestart, [url_for('')]),
        }));
    };

    const onDuplicateEmail = function() {
        $('.notice-message').remove();
        const $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(
                localize('Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.'),
                [url_for('user/lost_passwordws')]),
        }));
    };

    const onPasswordError = function() {
        const $error = $('#error-account-opening');
        $error.css({ display: 'block' })
            .text(localize('Password is not strong enough.'));
    };

    const configureSocket = function() {
        BinarySocket.init({
            onmessage: VirtualAccOpeningData.handler({
                success       : onSuccess,
                invalidToken  : onInvalidToken,
                duplicateEmail: onDuplicateEmail,
                passwordError : onPasswordError,
            }),
        });
    };

    const onLoad = function() {
        Content.populate();
        handleResidence();
        BinarySocket.send({ residence_list: 1 });
        BinarySocket.send({ website_status: 1 });

        const form = $('#virtual-form')[0];
        if (!form) return;

        bind_validation.simple(form, {
            schema: VirtualAccOpeningData.getSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                if (info.errors.length > 0) {
                    return;
                }
                configureSocket();
                const data = info.values;
                VirtualAccOpeningData.newAccount({
                    password         : data.password,
                    residence        : (japanese_client() ? 'jp' : data.residence),
                    verification_code: data['verification-code'],
                });
            },
        });
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = VirtualAccOpening;
