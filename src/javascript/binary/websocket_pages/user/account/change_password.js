const BinaryPjax      = require('../../../base/binary_pjax');
const Client          = require('../../../base/client').Client;
const localize        = require('../../../base/localize').localize;
const Content         = require('../../../common_functions/content').Content;
const ValidateV2      = require('../../../common_functions/validation_v2').ValidateV2;
const bind_validation = require('../../../validator').bind_validation;
const customError     = require('../../../validator').customError;
const ValidationUI    = require('../../../validator').ValidationUI;
const dv              = require('../../../../lib/validation');

const PasswordWS = (function() {
    let $form,
        $result;

    const hasPassword = function () {
        if (Client.get('values_set') && !Client.get('has_password')) {
            BinaryPjax.load('user/settingsws');
            return false;
        }
        return true;
    };

    const init = function() {
        if (!hasPassword()) return;
        const $container = $('#change-password');
        $container.removeClass('invisible');
        $form = $container.find(' > form');
        $result = $container.find(' > div[data-id="success-result"]');
        bind_validation.simple($form[0], {
            stop  : displayErrors,
            schema: getSchema(),
            submit: function(ev, info) {
                ev.preventDefault();
                ev.stopPropagation();
                if (info.errors.length > 0) return;
                sendRequest(info.values);
            },
        });
    };

    const IS_EMPTY = { q: 'old-blank' };
    const MATCHES_OLD = { q: 'same-as-old' };

    const displayErrors = function(info) {
        ValidationUI.clear();
        $form.find('p[data-error]').addClass('hidden');
        info.errors.forEach(function(err) {
            switch (err.err) {
                case MATCHES_OLD:
                case IS_EMPTY:
                    $form.find('p[data-error="' + err.err.q + '"]').removeClass('hidden');
                    break;
                default:
                    ValidationUI.draw('input[name=' + err.ctx + ']', err.err);
            }
        });
    };

    const getSchema = function() {
        const V2 = ValidateV2;
        const err = Content.localize().textPasswordsNotMatching;

        const notMatchingOld = function(value, data) {
            return value !== data.old_password;
        };

        const match = function(value, data) {
            return value === data.new_password;
        };
        return {
            old_password   : [customError(V2.required, IS_EMPTY)],
            new_password   : [V2.required, dv.check(notMatchingOld, MATCHES_OLD), V2.password],
            repeat_password: [V2.required, dv.check(match, err)],
        };
    };

    const sendRequest = function(data) {
        if (!hasPassword()) return;
        BinarySocket.send({
            change_password: '1',
            old_password   : data.old_password,
            new_password   : data.new_password,
        });
    };

    const handler = function(response) {
        if ('error' in response) {
            let errorMsg = localize('Old password is wrong.');
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
            Client.send_logout_request(true);
        }, 5000);
    };

    const onLoad = function() {
        Content.populate();

        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                if (!response) return;
                const type = response.msg_type;
                if (type === 'change_password' || (type === 'error' && 'change_password' in response.echo_req)) {
                    handler(response);
                }
            },
        });
        init();
    };

    return {
        onLoad : onLoad,
        init   : init,
        handler: handler,
    };
})();

module.exports = PasswordWS;
