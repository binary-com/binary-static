const BinaryPjax     = require('../base/binary_pjax');
const BinarySocket   = require('../base/socket');
const FormManager    = require('../common/form_manager');
const getFormRequest = require('../../app/common/verify_email');
const Login          = require('../../_common/base/login');
const localize       = require('../../_common/localize').localize;
const State          = require('../../_common/storage').State;
const urlFor         = require('../../_common/url').urlFor;
const isBinaryApp    = require('../../config').isBinaryApp;

const NewAccount = (() => {
    let clients_country,
        $login_btn,
        $verify_email;

    const form_id = '#signup_form';

    const onLoad = () => {
        $login_btn    = $('#login');
        $verify_email = $('#verify_email');

        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            clients_country = State.getResponse('website_status.clients_country');
            
            FormManager.init(form_id, getFormRequest());
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: verifyEmailHandler,
                fnc_additional_check: checkCountry,
            });
            $('.error-msg').addClass('center-text'); // this element exist only after calling FormManager.init
        });

        $login_btn.off('click').on('click', (e) => {
            e.preventDefault();
            Login.redirectToLogin();
        });
        Login.initOneAll();
    };

    const verifyEmailHandler = (response) => {
        if (response.error) {
            showError('error', response.error.message);
        } else {
            $(form_id).setVisibility(0);
            if (isBinaryApp()) {
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

    return {
        onLoad,
    };
})();

module.exports = NewAccount;
