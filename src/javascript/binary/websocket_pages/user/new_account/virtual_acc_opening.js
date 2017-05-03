const BinarySocket  = require('../../socket');
const Client        = require('../../../base/client');
const localize      = require('../../../base/localize').localize;
const urlFor        = require('../../../base/url').urlFor;
const makeOption    = require('../../../common_functions/common_functions').makeOption;
const jpClient      = require('../../../common_functions/country_base').jpClient;
const FormManager   = require('../../../common_functions/form_manager');
const TrafficSource = require('../../../common_functions/traffic_source');
const Cookies       = require('../../../../lib/js-cookie');

const VirtualAccOpening = (() => {
    'use strict';

    const form = '#virtual-form';

    const onLoad = () => {
        if (jpClient()) {
            handleJPForm();
        } else {
            BinarySocket.send({ residence_list: 1 }).then(response => handleResidenceList(response.residence_list));
            $('#residence').setVisibility(1);
            bindValidation();
        }

        FormManager.handleSubmit({
            form_selector       : form,
            fnc_response_handler: handleNewAccount,
        });
    };

    const handleResidenceList = (residence_list) => {
        if (residence_list.length > 0) {
            const $residence      = $('#residence');
            const residence_value = Client.get('residence') || '';

            const $options_with_disabled = $('<div/>');
            residence_list.forEach((res) => {
                $options_with_disabled.append(makeOption(res.text, res.value, res.disabled));
            });
            $residence.html($options_with_disabled.html());

            if (!residence_value) {
                BinarySocket.wait('website_status').then(data => handleWebsiteStatus(data.website_status));
            }
        }
    };

    const handleWebsiteStatus = (website_status) => {
        const clients_country = (website_status || {}).clients_country;
        if (!clients_country) return;
        const $residence = $('#residence');

        // set residence value to client's country, detected by IP address from back-end
        const $clients_country = $residence.find(`option[value="${clients_country}"]`);
        if (!$clients_country.attr('disabled')) {
            $clients_country.prop('selected', true);
        }
        $residence.setVisibility(1);
    };

    const bindValidation = () => {
        // Add TrafficSource parameters
        const utm_data = TrafficSource.getData();

        const req = [
            { selector: '#verification_code', validations: ['req', 'email_token'] },
            { selector: '#client_password',   validations: ['req', 'password'], re_check_field: '#repeat_password' },
            { selector: '#repeat_password',   validations: ['req', ['compare', { to: '#client_password' }]], exclude_request: 1 },

            { selector: '#residence' },
            { selector: '#email_consent' },
            { request_field: 'utm_source',          value: TrafficSource.getSource(utm_data) },
            { request_field: 'new_account_virtual', value: 1 },
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
        $('#email_consent').parent().parent().setVisibility(1);
        bindValidation();
    };

    const handleNewAccount = (response) => {
        if (!response) return false;
        const error = response.error;
        if (!error) {
            const new_account = response.new_account_virtual;
            Client.setCookie('residence', response.echo_req.residence);
            return Client.processNewAccount(
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
        $('#virtual-form').html($('<p/>', { html: localize(message, [urlFor(url)]) }));
    };

    const showError = (message) => {
        $('#error-account-opening').setVisibility(1).text(localize(message));
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = VirtualAccOpening;
