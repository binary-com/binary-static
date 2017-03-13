const generateBirthDate    = require('./attach_dom/birth_date_picker');
const BinaryPjax           = require('../base/binary_pjax');
const localize             = require('../base/localize').localize;
const Client               = require('../base/client').Client;
const State                = require('../base/storage').State;
const makeOption           = require('../common_functions/common_functions').makeOption;
const FormManager          = require('../common_functions/form_manager');
const Cookies              = require('../../lib/js-cookie');
require('select2');

const redirectCookie = function() {
    if (Client.get('has_real')) {
        BinaryPjax.load('trading');
        return true;
    }
    return false;
};

const redirectAccount = function() {
    BinarySocket.wait('landing_company').then((response) => {
        const isVirtual = Client.get('is_virtual');
        const landing_company = response.landing_company;

        // redirect client to correct account opening page if needed
        if (!State.get('is_financial_opening') &&
            ((!isVirtual && Client.can_upgrade_gaming_to_financial(landing_company)) ||
            Client.can_upgrade_virtual_to_financial(landing_company))) {
            BinaryPjax.load('new_account/maltainvestws');
            return false;
        }
        if (!State.get('is_japan_opening') && isVirtual && Client.can_upgrade_virtual_to_japan(landing_company)) {
            BinaryPjax.load('new_account/japanws');
            return false;
        }
        return true;
    });
};

const populateForm = (formID, getValidations) => {
    getResidence();
    BinarySocket.send({ states_list: Client.get('residence') }).then(data => handleState(data.states_list, formID, getValidations));
    generateBirthDate();
};

const getResidence = () => {
    BinarySocket.send({ residence_list: 1 }).then(response => handleResidenceList(response.residence_list));
};

const handleResidenceList = (residence_list) => {
    const $residence      = $('#residence');
    const $place_of_birth = $('#place_of_birth');
    const $tax_residence  = $('#tax_residence');
    const phoneElement   = document.getElementById('phone');
    const residenceValue = Client.get('residence');
    if (residence_list.length > 0) {
        const $options_with_disabled = $('<div/>');
        residence_list.forEach((res) => {
            $options_with_disabled.append(makeOption(res.text, res.value, res.disabled));
            if (residenceValue !== 'jp' && phoneElement && phoneElement.value === '' && res.phone_idd && residenceValue === res.value) {
                phoneElement.value = '+' + res.phone_idd;
            }
        });

        const $options = $('<div/>');
        residence_list.forEach((res) => {
            $options.append(makeOption(res.text, res.value));
        });

        $residence.html($options_with_disabled.html());
        $place_of_birth.html($options.html());
        $tax_residence.html($options.html()).promise().done(() => {
            setTimeout(() => {
                $tax_residence.select2()
                    .val(residenceValue).trigger('change')
                    .removeClass('invisible');
            }, 500);
        });

        if (residenceValue) {
            $residence.val(residenceValue);
            $place_of_birth.val(residenceValue || '');
        } else {
            BinarySocket.wait('website_status').then(data => handleWebsiteStatus(data.website_status));
        }
    }
};

const handleWebsiteStatus = (website_status) => {
    if (!website_status) return;
    const clients_country = website_status.clients_country;
    if (!clients_country) return;
    const $residence = $('#residence');

    // set residence value to client's country, detected by IP address from back-end
    const $clients_country = $residence.find('option[value="' + clients_country + '"]');
    if (!$clients_country.attr('disabled')) {
        $clients_country.prop('selected', true);
    }
    $residence.removeClass('invisible');
};

const handleState = (states_list, formID, getValidations) => {
    BinarySocket.wait('get_settings').then((response) => {
        let $address_state = $('#address_state');

        $address_state.empty();

        const client_state = response.get_settings.address_state;

        if (states_list && states_list.length > 0) {
            states_list.forEach(function(state) {
                $address_state.append($('<option/>', { value: state.value, text: state.text }));
            });
            if (client_state) {
                $address_state.val(client_state);
            }
        } else {
            $address_state.replaceWith($('<input/>', { id: 'address_state', name: 'address_state', type: 'text', maxlength: '35' }));
            $address_state = $('#address_state');
            if (client_state) {
                $address_state.text(client_state);
            }
        }
        $address_state.parent().parent().show();

        if (formID && typeof getValidations === 'function') {
            FormManager.init(formID, getValidations());
        }
    });
};

const handleNewAccount = function(response, message_type) {
    if (response.error) {
        const errorMessage = response.error.message;
        $('#submit-message').empty();
        $('#client_message').find('.notice-msg').text(response.msg_type === 'sanity_check' ? localize('There was some invalid character in an input field.') : errorMessage).end()
            .removeClass('invisible');
    } else {
        Client.process_new_account(Client.get('email'), response[message_type].client_id, response[message_type].oauth_token, false);
    }
};

const commonValidations = () => {
    const req = [
        { selector: '#salutation',         validations: ['req'] },
        { selector: '#first_name',         validations: ['req', ['length', { min: 2, max: 30 }], 'letter_symbol'] },
        { selector: '#last_name',          validations: ['req', ['length', { min: 2, max: 30 }], 'letter_symbol'] },
        { selector: '#date_of_birth',      validations: ['req'] },
        { selector: '#address_line_1',     validations: ['req', 'address'] },
        { selector: '#address_line_2',     validations: ['address'] },
        { selector: '#address_city',       validations: ['req', ['length', { min: 1, max: 35 }], 'letter_symbol'] },
        { selector: '#address_state',      validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : [['length', { min: 0, max: 35 }], 'letter_symbol'] },
        { selector: '#address_postcode',   validations: ['postcode', ['length', { min: 0, max: 20 }]] },
        { selector: '#phone',              validations: ['req', 'phone', ['min', { min: 6, max: 35 }]] },
        { selector: '#secret_question',    validations: ['req'] },
        { selector: '#secret_answer',      validations: ['req', 'general', ['min', { min: 4, max: 50 }]] },
        { selector: '#tnc',                validations: [['req', { message: localize('Please accept the terms and conditions.') }]], exclude_request: 1 },

        { request_field: 'residence', value: Client.get('residence') },
    ];

    if (Cookies.get('affiliate_tracking')) {
        req.push({ request_field: 'affiliate_token', value: Cookies.getJSON('affiliate_tracking').t });
    }

    return req;
};

const selectCheckboxValidation = (formID) => {
    const validations = [];
    let validation,
        id;
    $(formID).find('select, input[type=checkbox]').each(function () {
        id = $(this).attr('id');
        if (id !== 'tnc') {
            validation = { selector: `#${id}`, validations: ['req'] };
            if (id === 'not_pep') {
                validation.exclude_request = 1;
            }
            validations.push(validation);
        }
    });
    return validations;
};

module.exports = {
    redirectAccount : redirectAccount,
    populateForm    : populateForm,
    getResidence    : getResidence,
    redirectCookie  : redirectCookie,
    handleNewAccount: handleNewAccount,

    commonValidations       : commonValidations,
    selectCheckboxValidation: selectCheckboxValidation,
};
