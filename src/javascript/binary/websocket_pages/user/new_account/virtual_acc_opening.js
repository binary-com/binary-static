const localize              = require('../../../base/localize').localize;
const Client                = require('../../../base/client').Client;
const url_for               = require('../../../base/url').url_for;
const getFormData           = require('../../../base/utility').getFormData;
const template              = require('../../../base/utility').template;
const getResidence          = require('../../../common_functions/account_opening').getResidence;
const japanese_client       = require('../../../common_functions/country_base').japanese_client;
const Validation            = require('../../../common_functions/form_validation');
const TrafficSource         = require('../../../common_functions/traffic_source').TrafficSource;
const Cookies               = require('../../../../lib/js-cookie');

const VirtualAccOpening = (function() {
    const onLoad = function() {
        if (Client.is_logged_in()) {
            window.location.href = url_for('trading');
            return;
        }
        if (japanese_client()) {
            handleJPForm();
        } else {
            getResidence();
        }

        const form = '#virtual-form';

        Validation.init(form, [
            { selector: '#verification_code', validations: ['req', 'email_token'] },
            { selector: '#client_password',   validations: ['req', 'password'] },
            { selector: '#repeat_password',   validations: ['req', ['compare', { to: '#client_password' }]] },
        ]);

        $(form).submit(() => {
            event.preventDefault();
            if (Validation.validate(form)) {
                BinarySocket.send(populateRequest()).then((response) => {
                    handleNewAccount(response);
                });
            }
        });
    };

    const handleJPForm = () => {
        // show email consent field for japanese accounts
        // and don't allow them to change residence
        const $residence = $('#residence');
        $residence.replaceWith($('<label/>', { id: 'lbl_residence', class: 'form_input', 'data-value': 'jp', text: localize('Japan') }));
        $('#email_consent').parent().parent().removeClass('invisible');
    };

    const populateRequest = () => {
        const req = $.extend({ new_account_virtual: 1 }, getFormData());

        // Add TrafficSource parameters
        const utm_data = TrafficSource.getData();
        req.utm_source = TrafficSource.getSource(utm_data);
        if (utm_data.utm_medium)   req.utm_medium   = utm_data.utm_medium;
        if (utm_data.utm_campaign) req.utm_campaign = utm_data.utm_campaign;

        const gclid = Client.get('gclid');
        if (gclid) req.gclid_url = gclid;

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }
        return req;
    };

    const handleNewAccount = (response) => {
        if (!response) return false;
        const error = response.error;
        if (!error) {
            const new_account = response.new_account_virtual;
            Client.set_cookie('residence', response.echo_req.residence);
            return Client.process_new_account(
                new_account.email,
                new_account.client_id,
                new_account.oauth_token,
                true);
        }

        switch (error.code) {
            case 'InvalidToken': {
                const message = 'Your token has expired. Please click <a class="pjaxload" href="[_1]">here</a> to restart the verification process.';
                return showFormError(message, '');
            }
            case 'duplicate email': {
                const message = 'Your provided email address is already in use by another Login ID. According to our terms and conditions, you may only register once through our site. If you have forgotten the password of your existing account, please <a href="[_1]">try our password recovery tool</a> or contact customer service.';
                return showFormError(message, 'user/lost_passwordws');
            }
            case 'PasswordError': {
                return showError('Password is not strong enough.');
            }
            default: {
                return showError(error.message);
            }
        }
    };

    const showFormError = (message, url) => {
        $('.notice-message').remove();
        const $form = $('#virtual-form');
        $form.html($('<p/>', {
            html: template(
                localize(message),
                [url_for(url)]),
        }));
    };

    const showError = (message) => {
        const $error = $('#error-account-opening');
        $error.removeClass('invisible')
            .text(localize(message));
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = {
    VirtualAccOpening: VirtualAccOpening,
};
