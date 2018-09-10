const BinaryPjax     = require('../base/binary_pjax');
const BinarySocket   = require('../base/socket');
const FormManager    = require('../common/form_manager');
const Login          = require('../../_common/base/login');
const getElementById = require('../../_common/common_functions').getElementById;
const localize       = require('../../_common/localize').localize;
const State          = require('../../_common/storage').State;
const urlFor         = require('../../_common/url').urlFor;
const getAppId       = require('../../config').getAppId;

const NewAccount = (() => {
    let clients_country,
        $google_btn,
        $login_btn,
        $verify_email;

    const form_id = '#signup_form';

    const onLoad = () => {
        getElementById('footer').setVisibility(0); // always hide footer in this page

        $google_btn   = $('#google-signup');
        $login_btn    = $('#login');
        $verify_email = $('#verify_email');

        BinarySocket.wait('website_status').then((response) => {
            clients_country = response.website_status.clients_country;

            FormManager.init(form_id, [
                { selector: '#email', validations: ['req', 'email'], request_field: 'verify_email' },
                { request_field: 'type', value: 'account_opening' },
            ]);
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: verifyEmailHandler,
                fnc_additional_check: checkCountry,
            });
            $('.error-msg').addClass('center-text'); // this element exist only after calling FormManager.init
            if (State.get('is_eu')) {
                $('.mfsa_message').slideDown(300);
            }
        });

        $google_btn.on('click', (e) => {
            e.preventDefault();
            window.location.href = Login.socialLoginUrl('google');
        });
        $login_btn.on('click', (e) => {
            e.preventDefault();
            Login.redirectToLogin();
        });
    };

    const verifyEmailHandler = (response) => {
        if (response.error) {
            showError('error', response.error.message);
        } else {
            $(form_id).setVisibility(0);
            if (+getAppId() !== 1) { // TODO: update app_id to handle desktop
                BinaryPjax.load(urlFor('new_account/virtualws'));
            } else {
                $verify_email.setVisibility(1);
            }
        }
    };

    const checkCountry = (req) => {
        if ((clients_country !== 'my') || /@binary\.com$/.test(req.verify_email)) {
            return true;
        }
        showError('notice', localize('Sorry, account signup is not available in your country.'));
        return false;
    };

    const showError = (type, message) => {
        $(form_id).find('div')
            .html($('<p/>', {
                class: `${type}-msg gr-centered gr-8 gr-12-m`,
                html : message,
            }));
    };

    const onUnload = () => {
        getElementById('footer').setVisibility(1);
        $google_btn.off('click');
        $login_btn.off('click');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = NewAccount;
