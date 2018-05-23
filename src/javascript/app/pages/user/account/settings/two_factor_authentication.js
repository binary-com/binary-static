const FormManager  = require('../../../../common/form_manager');
const BinarySocket         = require('../../../../base/socket');

const TwoFactorAuthentication = (() => {
    let enabled_state;
    // loader
    const onLoad = () => {
        // initialize form
        init();
    };

    const init = () => {
        BinarySocket.send({ account_security: 1, totp_action: 'status'}).then((res) => {
            // TODO: handle error

            enabled_state = res.account_security.totp.is_enabled ? 'should_disable' : 'should_enable';
            const form_id = '#frm_two_factor_auth';

            FormManager.init(form_id, [
                { selector: '#otp', validations: ['req'], request_field: 'otp' },
                { request_field: 'account_security', value: 1 },
                { request_field: 'totp_action', value: res.account_security.totp.is_enabled ? 'disable' : 'enable' },
            ]);
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: handler,
            });

            $(`#${enabled_state}`).setVisibility(1);
            if (enabled_state === 'should_enable') {
                initEnable();
            } else if (enabled_state === 'should_disable') {
                initDisable();
            }
        });
    };

    const initEnable = () => {
        // initEnabled
        // 1. get key
        BinarySocket.send({ account_security: 1, totp_action: 'generate'}).then((res) => {
            // TODO: handle error
            makeQrCode(res.account_security.totp.secret_key);
        });
    };

    const initDisable = () => {
        // init disable
        // disabled state:
    };

    const makeQrCode = (key) => {
        console.log(key);
        handler();
        // create QR code from key
    };

    const handler = () => {
        // handle submit of the form
        // 1. error - show error
        // 2. enabled - show success + initialize enabled state (?)
        // 3. disabled - show success + initialize disabled state (?)
    };

    return {
        onLoad,
    };
})();

module.exports = TwoFactorAuthentication;
