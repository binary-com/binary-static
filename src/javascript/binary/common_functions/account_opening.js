const generateBirthDate    = require('./attach_dom/birth_date_picker');
const localize             = require('../base/localize').localize;
const Client               = require('../base/client').Client;
const State                = require('../base/storage').State;
const url_for              = require('../base/url').url_for;
const appendTextValueChild = require('../common_functions/common_functions').appendTextValueChild;
const FormManager          = require('../common_functions/form_manager');
const Cookies              = require('../../lib/js-cookie');
require('select2');

const redirectCookie = function() {
    if (!Client.get('is_virtual') || Client.get('has_real')) {
        window.location.href = url_for('trading');
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
            ((Client.can_upgrade_gaming_to_financial(landing_company) && !isVirtual) ||
            Client.can_upgrade_virtual_to_financial(landing_company))) {
            window.location.href = url_for('new_account/maltainvestws');
            return false;
        } else if (!State.get('is_japan_opening') && Client.can_upgrade_virtual_to_japan(landing_company) && isVirtual) {
            window.location.href = url_for('new_account/japanws');
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
    const obj_residence_el = {
        residence     : document.getElementById('residence'),
        place_of_birth: document.getElementById('place_of_birth'),
        tax_residence : document.getElementById('tax_residence'),
    };
    Object.keys(obj_residence_el).forEach(function (key) {
        if (obj_residence_el[key] === null || obj_residence_el[key].childElementCount !== 0) {
            delete obj_residence_el[key];
        }
    });
    if (obj_residence_el.length === 0) return;
    const phoneElement   = document.getElementById('phone');
    const residenceValue = Client.get('residence');
    let text,
        value;
    if (residence_list.length > 0) {
        for (let j = 0; j < residence_list.length; j++) {
            const residence = residence_list[j];
            text = residence.text;
            value = residence.value;
            appendIfExist(obj_residence_el, text, value, residence.disabled ? 'disabled' : undefined);

            if (residenceValue !== 'jp' && phoneElement && phoneElement.value === '' && residence.phone_idd && residenceValue === residence.value) {
                phoneElement.value = '+' + residence.phone_idd;
            }
        }
        const $tax_residence = $('#tax_residence');
        if (obj_residence_el.tax_residence) {
            $tax_residence.select2()
                .removeClass('invisible');
        }
        if (residenceValue) {
            if (obj_residence_el.residence) {
                obj_residence_el.residence.value = residenceValue;
            }
            if (obj_residence_el.place_of_birth) {
                obj_residence_el.place_of_birth.value = residenceValue || '';
            }
            $tax_residence.val(residenceValue).trigger('change');
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

const appendIfExist = (object_el, text, value, disabled) => {
    let object_el_key;
    Object.keys(object_el).forEach(function(key) {
        object_el_key = object_el[key];
        if (object_el_key) {
            appendTextValueChild(object_el_key, text, value, disabled && key === 'residence' ? disabled : undefined);
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
        { selector: '#address_line_1',     validations: ['req', 'general'] },
        { selector: '#address_line_2',     validations: ['general'] },
        { selector: '#address_city',       validations: ['req', 'letter_symbol'] },
        { selector: '#address_state',      validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : ['letter_symbol'], request_field: 'address_state' },
        { selector: '#address_postcode',   validations: ['postcode'] },
        { selector: '#phone',              validations: ['req', 'phone', ['min', { min: 6, max: 35 }]] },
        { selector: '#secret_question',    validations: ['req'] },
        { selector: '#secret_answer',      validations: ['req', 'letter_symbol', ['min', { min: 4, max: 50 }]] },
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
