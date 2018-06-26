const BinarySocket   = require('../../app/base/socket');
const FormManager    = require('../../app/common/form_manager');
const getElementById = require('../../_common/common_functions').getElementById;
const localize       = require('../../_common/localize').localize;
const Login          = require('../../_common/base/login');

const Signup = (() => {
    let clients_country,
        $google_btn,
        $login_btn;

    const form_id = '#signup_form';

    const onLoad = () => {
        getElementById('footer').setVisibility(0); // always hide footer in this page

        $google_btn = $('#google-signup');
        $login_btn  = $('#login');

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
            $('.error-msg').addClass('center-text');

            $google_btn.off('click').on('click', (e) => {
                e.preventDefault();
                window.location.href = Login.socialLoginUrl('google');
            });
            $login_btn.off('click').on('click', (e) => {
                e.preventDefault();
                Login.redirectToLogin();
            });
        });
    };

    const verifyEmailHandler = (response) => {
        if (response.error) {
            showError('error', response.error.message);
        } else {
            $(form_id).setVisibility(0);
            $('#verify_email').setVisibility(1);
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

module.exports = Signup;
