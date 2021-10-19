const Client         = require('../../../base/client');
const BinarySocket   = require('../../../base/socket');
const Dialog         = require('../../../common/attach_dom/dialog');
const getElementById = require('../../../../_common/common_functions').getElementById;
const localize       = require('../../../../_common/localize').localize;
const State          = require('../../../../_common/storage').State;
const toTitleCase    = require('../../../../_common/string_util').toTitleCase;
const Url            = require('../../../../_common/url');

const ChangePassword = (() => {
    let $change_password_loading,
        $change_password_container,
        social_unlink_btn_id,
        $binary_password_container,
        $social_signup_container,
        $trading_password_container,
        social_signup_identifier,
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
                return localize('Please click on the link in the email to change your MT5 password.');
            default:
                return localize('Please click on the link in the email to change your binary password.');
        }
    };

    const onSentEmail = (event_type, social_identifier) => {
        const req = {
            verify_email: Client.get('email'),
            type        : event_type === 'trading_password' ? 'trading_platform_mt5_password_reset' : 'reset_password',
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
            getElementById('linked_social_hint').innerHTML = localize('You\'re using your [_1] account to log in to your Binary.com account. To change your login method into using a username and password, click the [_2]Unlink[_3] button.', [ social_signups[social_signup_identifier].name, '<strong>', '</strong>' ]);
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

        // Handle forgot trading password
        $(forgot_trading_pw_btn_id).off('click').on('click', () => {
            onSentEmail('trading_password');
        });
    };

    const onLoad = () => {
        $change_password_container      = $('#change_password_container');
        $change_password_loading        = $('#change_password_loading');
        social_unlink_btn_id            = '#social_unlink_button';
        $binary_password_container      = $('#binary_password_container');
        $social_signup_container        = $('#social_signup_container');
        $trading_password_container     = $('#trading_password_container');
        social_signup_identifier        = '';
        forgot_binary_pw_btn_id         = '#forgot_binary_pw_btn';
        forgot_trading_pw_btn_id        = '#forgot_trading_pw_btn';

        $change_password_loading.setVisibility(1);

        BinarySocket.wait('get_account_status').then(() => {
            $change_password_loading.setVisibility(0);
            $change_password_container.setVisibility(1);
            const has_social_signup             = hasSocialSignup();

            if (has_social_signup) {
                initSocialSignup();
            } else {
                init();
            }
            initTradingPassword();
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ChangePassword;

