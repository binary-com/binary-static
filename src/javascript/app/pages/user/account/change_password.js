const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const Dialog         = require('../../../common/attach_dom/dialog');
const FormManager    = require('../../../common/form_manager');
const Password       = require('../../../../_common/check_password');
const getElementById = require('../../../../_common/common_functions').getElementById;
const localize       = require('../../../../_common/localize').localize;
const State          = require('../../../../_common/storage').State;
const toTitleCase    = require('../../../../_common/string_util').toTitleCase;
const Url            = require('../../../../_common/url');

const ChangePassword = (() => {
    let $change_password_loading,
        $change_password_container,
        binary_form_id,
        trading_form_id,
        social_unlink_btn_id,
        $binary_password_container,
        $social_signup_container,
        $trading_password_container,
        $set_trading_password_container,
        social_signup_identifier,
        $msg_success_container,
        $msg_success,
        $msg_success_trading_container,
        $msg_success_trading,
        forgot_binary_pw_btn_id,
        forgot_trading_pw_btn_id;

    const social_signups = {
        'Google': {
            icon: 'ic-linked-google',
            name: 'Google',
        },
        'Facebook': {
            icon: 'ic-linked-facebook',
            name: 'Facebook',
        },
        'Apple': {
            icon: 'ic-linked-apple',
            name: 'Apple',
        },
    };

    const shouldSetTradingPassword = () => {
        const { status } = State.getResponse('get_account_status');
        return Array.isArray(status) && status.includes('trading_password_required');
    };

    const hasSocialSignup = () => {
        const { social_identity_provider, status } = State.getResponse('get_account_status');
        social_signup_identifier = toTitleCase(social_identity_provider);
        return Array.isArray(status) && status.includes('social_signup');
    };

    const getDialogMessage = (event_type, social_identifier) => {
        switch (event_type) {
            case 'unlink':
                if (social_identifier === 'Google') {
                    return localize('Check your Google account email and click the link in the email to proceed.');
                } else if (social_identifier === 'Facebook') {
                    return localize('Check your Facebook account email and click the link in the email to proceed.');
                }
                return localize('Check the email account associated with your Apple ID and click the link in the email to proceed.');
            case 'trading_password':
                return localize('Please click on the link in the email to reset your trading password.');
            default:
                return localize('Please click on the link in the email to reset your binary password.');
        }
    };

    const onSentEmail = (event_type, social_identifier) => {
        const req = {
            verify_email: Client.get('email'),
            type        : event_type === 'trading_password' ? 'trading_platform_password_reset' : 'reset_password',
        };
        BinarySocket.send(req).then(() => {
            Dialog.alert({
                id               : 'sent_email_dialog',
                localized_message: getDialogMessage(event_type, social_identifier),
                localized_title  : localize('We’ve sent you an email'),
            });
        });
    };

    const init = () => {
        $binary_password_container.setVisibility(1);

        // Handle change binary password
        FormManager.init(binary_form_id, [
            { selector: '#old_password', validations: ['req', ['length', { min: 6, max: 25 }]], clear_form_error_on_input: true },
            { selector: '#new_password', validations: ['req', 'password', ['not_equal', { to: '#old_password', name1: localize('Current password'), name2: localize('New password') }], 'compare_to_email'] },
            { request_field: 'change_password', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : binary_form_id,
            fnc_response_handler: changePasswordHandler,
        });

        // Handle forgot binary password
        $(forgot_binary_pw_btn_id).off('click').on('click', () => {
            onSentEmail('binary_password');
        });
    };

    const initSocialSignup = () => {
        // TODO: temporary condition; remove once BE Apple social signup is ready
        if (social_signup_identifier === 'Apple') {
            getElementById('frm_change_password').setVisibility(0);
        } else {
            $social_signup_container.setVisibility(1);
            getElementById('linked_social_identifier').innerHTML = localize('Linked with [_1]', social_signups[social_signup_identifier].name);
            getElementById('ic_linked_social_identifier').src = Url.urlForStatic(`images/pages/account_password/${social_signups[social_signup_identifier].icon}.svg`);
    
            // Handle unlinking social signup
            $(social_unlink_btn_id).off('click').on('click', () => {
                Dialog.confirm({
                    id               : 'unlink_confirmation_dialog',
                    localized_message: localize('You will need to set a password to complete the process.'),
                    localized_title  : localize('Are you sure you want to unlink from [_1]?', social_signup_identifier),
                    cancel_text      : localize('Cancel'),
                    ok_text          : localize('Unlink'),
                    onConfirm        : () => onSentEmail('unlink', social_signup_identifier),
                });
            });
        }
    };

    const initTradingPassword = () => {
        $trading_password_container.setVisibility(1);
        $set_trading_password_container.setVisibility(0);

        // Handle change trading password
        FormManager.init(trading_form_id, [
            { selector: '#old_trading_password', request_field: 'old_password', validations: ['req', ['length', { min: 6, max: 25 }]], clear_form_error_on_input: true },
            { selector: '#new_trading_password', request_field: 'new_password', validations: ['req', 'password', ['not_equal', { to: '#old_trading_password', name1: localize('Current password'), name2: localize('New password') }], 'compare_to_email'] },
            { request_field: 'trading_platform_password_change', value: 1 },
        ]);
        FormManager.handleSubmit({
            form_selector       : trading_form_id,
            fnc_response_handler: tradingPwHandler,
            enable_button       : true,
        });

        // Handle forgot trading password
        $(forgot_trading_pw_btn_id).off('click').on('click', () => {
            onSentEmail('trading_password');
        });
    };

    const initSetTradingPassword = () => {
        $set_trading_password_container.setVisibility(1);

        // Handle set trading password
        FormManager.init(trading_form_id, [
            { selector: '#set_new_trading_password', request_field: 'new_password', validations: ['req', 'password', 'compare_to_email'] },
            { request_field: 'old_password', value: '' },
            { request_field: 'trading_platform_password_change', value: 1 },
        ], null, shouldSetTradingPassword());
        FormManager.handleSubmit({
            form_selector       : trading_form_id,
            fnc_response_handler: setTradingPwHandler,
        });
    };

    const changePasswordHandler = (response) => {
        if ('error' in response) {
            const $frm_change_binary_password_error = $('#frm_change_binary_password_error');
            $frm_change_binary_password_error.text(response.error.message).setVisibility(1);
            setTimeout(() => {
                $frm_change_binary_password_error.setVisibility(0);
            }, 5000);
        } else {
            $msg_success.text(localize('Your binary password has been changed. Please log in again.'));
            $msg_success_container.setVisibility(1);
            setTimeout(() => {
                Client.sendLogoutRequest(true);
            }, 5000);
        }
    };

    const setTradingPwHandler = (response) => {
        if ('error' in response) {
            const $frm_set_trading_password_error = $('#frm_set_trading_password_error');
            $frm_set_trading_password_error.text(response.error.message).setVisibility(1);
            setTimeout(() => {
                $frm_set_trading_password_error.setVisibility(0);
            }, 5000);
        } else {
            $msg_success_trading.text(localize('Your trading password has been set. Please use this to log in to MetaTrader 5.'));
            $msg_success_trading_container.setVisibility(1);
            $trading_password_container.setVisibility(1);
            $set_trading_password_container.setVisibility(0);
            $(trading_form_id).trigger('reset');
            setTimeout(() => {
                $msg_success_trading.setVisibility(0);
                BinarySocket.send({ get_account_status: 1 }).then(() => onLoad());
            }, 5000);
        }
    };

    const tradingPwHandler = (response) => {
        if ('error' in response) {
            const $frm_change_trading_password_error = $('#frm_change_trading_password_error');
            $frm_change_trading_password_error.text(response.error.message).setVisibility(1);
            setTimeout(() => {
                $frm_change_trading_password_error.setVisibility(0);
            }, 5000);
        } else {
            $msg_success_trading.text(localize('Your trading password has been changed. Please use this to log in to MetaTrader 5.'));
            $msg_success_trading_container.setVisibility(1);
            $(trading_form_id).trigger('reset');
            Password.removeCheck('#new_trading_password', true);
            setTimeout(() => {
                $msg_success_trading_container.setVisibility(0);
            }, 5000);
        }
    };

    const onLoad = () => {
        $change_password_container      = $('#change_password_container');
        $change_password_loading        = $('#change_password_loading');
        binary_form_id                  = '#frm_change_password';
        trading_form_id                 = '#frm_trading_password';
        social_unlink_btn_id            = '#social_unlink_button';
        $binary_password_container      = $('#binary_password_container');
        $social_signup_container        = $('#social_signup_container');
        $trading_password_container     = $('#trading_password_container');
        $set_trading_password_container = $('#set_trading_password_container');
        social_signup_identifier        = '';
        $msg_success_container          = $('#msg_success_container');
        $msg_success                    = $('#msg_success');
        $msg_success_trading_container  = $('#msg_success_trading_container');
        $msg_success_trading            = $('#msg_success_trading');
        forgot_binary_pw_btn_id         = '#forgot_binary_pw_btn';
        forgot_trading_pw_btn_id        = '#forgot_trading_pw_btn';

        $change_password_loading.setVisibility(1);

        BinarySocket.wait('get_account_status').then(() => {
            $change_password_loading.setVisibility(0);
            $change_password_container.setVisibility(1);
            const should_set_trading_password   = shouldSetTradingPassword();
            const has_social_signup             = hasSocialSignup();

            if (has_social_signup) {
                initSocialSignup();
            } else {
                init();
            }
            if (should_set_trading_password) {
                initSetTradingPassword();
            } else {
                initTradingPassword();
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ChangePassword;

