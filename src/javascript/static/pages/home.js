const localize     = require('../../_common/localize').localize;
const TabSelector  = require('../../_common/tab_selector');
const Login        = require('../../app/base/login');
const BinarySocket = require('../../app/base/socket');
const FormManager  = require('../../app/common/form_manager');

const Home = (() => {
    let clients_country;

    const onLoad = () => {
        TabSelector.onLoad();

        BinarySocket.wait('website_status').then((response) => {
            clients_country = response.website_status.clients_country;

            // we need to initiate selector after it becoming visible
            TabSelector.repositionSelector();

            const form_id = '#frm_verify_email';
            FormManager.init(form_id, [
                { selector: '#email', validations: ['req', 'email'], request_field: 'verify_email' },
                { request_field: 'type', value: 'account_opening' },
            ]);
            FormManager.handleSubmit({
                form_selector       : form_id,
                fnc_response_handler: handler,
                fnc_additional_check: checkCountry,
            });
            socialLogin();
        });
    };

    const socialLogin = () => {
        $('#google-signup').off('click').on('click', (e) => {
            e.preventDefault();
            window.location.href = Login.socialLoginUrl('google');
        });
    };

    const checkCountry = (req) => {
        if ((clients_country !== 'my') || /@binary\.com$/.test(req.verify_email)) {
            return true;
        }
        $('#frm_verify_email').find('div')
            .html($('<p/>', { class: 'notice-msg center-text', html: localize('Sorry, account signup is not available in your country.') }));
        return false;
    };


    const handler = (response) => {
        const error = response.error;
        if (!error) {
            $('.signup-box div').replaceWith($('<p/>', { text: localize('Thank you for signing up! Please check your email to complete the registration process.'), class: 'gr-10 gr-centered center-text' }));
        } else {
            $('#signup_error').setVisibility(1).text(error.message);
        }
    };

    const onUnload = () => {
        TabSelector.onUnload();
    };


    return {
        onLoad,
        onUnload,
    };
})();

module.exports = Home;
