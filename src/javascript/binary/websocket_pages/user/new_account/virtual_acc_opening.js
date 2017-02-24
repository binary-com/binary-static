const Client                = require('../../../base/client').Client;
const localize              = require('../../../base/localize').localize;
const url_for               = require('../../../base/url').url_for;
const template              = require('../../../base/utility').template;
const getResidence          = require('../../../common_functions/account_opening').getResidence;
const japanese_client       = require('../../../common_functions/country_base').japanese_client;
const FormManager           = require('../../../common_functions/form_manager');
const TrafficSource         = require('../../../common_functions/traffic_source').TrafficSource;
const Cookies               = require('../../../../lib/js-cookie');

const VirtualAccOpening = (function() {
    const form = '#virtual-form';

    const onLoad = function() {
        if (japanese_client()) {
            handleJPForm();
        } else {
            getResidence();
            bindValidation();
        }

        FormManager.handleSubmit(form, { new_account_virtual: 1 }, handleNewAccount);
    };

    const bindValidation = () => {
        // Add TrafficSource parameters
        const utm_data = TrafficSource.getData();

        const req = [
            { selector: '#verification_code', validations: ['req', 'email_token'] },
            { selector: '#client_password',   validations: ['req', 'password'] },
            { selector: '#repeat_password',   validations: ['req', ['compare', { to: '#client_password' }]], exclude_request: 1 },

            { selector: '#residence' },
            { request_field: 'email_consent' },
            { request_field: 'utm_source', value: TrafficSource.getSource(utm_data) },
        ];

        if (utm_data.utm_medium)   req.push({ request_field: 'utm_medium', value: utm_data.utm_medium });
        if (utm_data.utm_campaign) req.push({ request_field: 'utm_campaign', value: utm_data.utm_campaign });

        const gclid = Client.get('gclid');
        if (gclid) req.push({ request_field: 'gclid_url', value: gclid });

        if (Cookies.get('affiliate_tracking')) req.push({ request_field: 'affiliate_token', value: Cookies.getJSON('affiliate_tracking').t });

        FormManager.init(form, req);
    };

    const handleJPForm = () => {
        // show email consent field for japanese accounts
        // and don't allow them to change residence
        const $residence = $('#residence');
        $residence.replaceWith($('<label/>', { id: 'residence', 'data-value': 'jp', text: localize('Japan') }));
        $('#email_consent').parent().parent().removeClass('invisible');
        bindValidation();
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
                const message = 'Your token has expired. Please click <a href="[_1]">here</a> to restart the verification process.';
                return showFormError(message, '');
            }
            case 'duplicate email': {
                const message = 'The email address provided is already in use. If you forgot your password, please try our <a href="[_1]">password recovery tool</a> or contact our customer service.';
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
        $('#error-account-opening').removeClass('invisible')
            .text(localize(message));
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = VirtualAccOpening;
