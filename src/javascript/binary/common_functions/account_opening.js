const generateBirthDate    = require('./attach_dom/birth_date_dropdown').generateBirthDate;
const objectNotEmpty       = require('../base/utility').objectNotEmpty;
const localize             = require('../base/localize').localize;
const Client               = require('../base/client').Client;
const url_for              = require('../base/url').url_for;
const Validate             = require('../common_functions/validation').Validate;
const Content              = require('../common_functions/content').Content;
const japanese_client      = require('../common_functions/country_base').japanese_client;
const appendTextValueChild = require('../common_functions/common_functions').appendTextValueChild;
const Cookies              = require('../../lib/js-cookie');
const moment               = require('moment');
const elementInnerHtml     = require('../common_functions/common_functions').elementInnerHtml;

const displayAcctSettings = function(response) {
    const country = response.get_settings.country_code;
    if (country && country !== null) {
        $('#real-form').show();
        Client.set_value('residence', country);
        generateBirthDate();
        generateState();
        if (/maltainvestws/.test(window.location.pathname)) {
            const settings = response.get_settings;
            const title = document.getElementById('title'),
                fname = document.getElementById('fname'),
                lname = document.getElementById('lname'),
                dobdd = document.getElementById('dobdd'),
                dobmm = document.getElementById('dobmm'),
                dobyy = document.getElementById('dobyy');
            const inputs = document.getElementsByClassName('input-disabled');
            if (settings.salutation) {
                title.value = settings.salutation;
                fname.value = settings.first_name;
                lname.value = settings.last_name;
                const date = moment.utc(settings.date_of_birth * 1000);
                dobdd.value = date.format('DD').replace(/^0/, '');
                dobmm.value = date.format('MM');
                dobyy.value = date.format('YYYY');
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = true;
                }
                document.getElementById('address1').value = settings.address_line_1;
                document.getElementById('address2').value = settings.address_line_2;
                document.getElementById('address-town').value = settings.address_city;
                window.state = settings.address_state;
                document.getElementById('address-postcode').value = settings.address_postcode;
                document.getElementById('tel').value = settings.phone;
            } else {
                for (let j = 0; j < inputs.length; j++) {
                    inputs[j].disabled = false;
                }
            }
        }
    } else if (document.getElementById('move-residence-here') && $('#residence-form').is(':hidden')) {
        show_residence_form();
    }
};

const show_residence_form = function() {
    const residenceForm = $('#residence-form');
    const residenceDisabled = $('#residence-disabled');
    residenceDisabled.insertAfter('#move-residence-here');
    $('#error-residence').insertAfter('#residence-disabled');
    residenceDisabled.removeAttr('disabled');
    residenceForm.show();
    residenceForm.submit(function(evt) {
        evt.preventDefault();
        const residence_value = residenceDisabled.val();
        if (Validate.fieldNotEmpty(residence_value, document.getElementById('error-residence'))) {
            Client.set_cookie('residence', residence_value);
            Client.set_value('residence', residence_value);
            BinarySocket.send({ set_settings: 1, residence: residence_value });
        }
    });
};

const generateState = function() {
    const state = document.getElementById('address-state');
    if (state.length !== 0) return;
    appendTextValueChild(state, Content.localize().textSelect, '');
    if (Client.get_value('residence') !== '') {
        BinarySocket.send({ states_list: Client.get_value('residence') });
    }
};

const handleResidence = function() {
    generateBirthDate();
    BinarySocket.init({
        onmessage: function(msg) {
            let select;
            const response = JSON.parse(msg.data),
                type = response.msg_type,
                residenceDisabled = $('#residence-disabled');
            if (type === 'set_settings') {
                const errorElement = document.getElementById('error-residence');
                if (response.hasOwnProperty('error')) {
                    if (response.error.message) {
                        elementInnerHtml(errorElement, response.error.message);
                        errorElement.setAttribute('style', 'display:block');
                    }
                } else {
                    errorElement.setAttribute('style', 'display:none');
                    BinarySocket.send({ landing_company: Client.get_value('residence') });
                }
            } else if (type === 'landing_company') {
                Cookies.set('residence', Client.get_value('residence'), { domain: '.' + document.domain.split('.').slice(-2).join('.'), path: '/' });
                if (((Client.can_upgrade_gaming_to_financial(response.landing_company) && !Client.get_boolean('is_virtual')) || Client.can_upgrade_virtual_to_financial(response.landing_company)) && !/maltainvestws/.test(window.location.href)) {
                    window.location.href = url_for('new_account/maltainvestws');
                } else if (Client.can_upgrade_virtual_to_japan(response.landing_company) && Client.get_boolean('is_virtual') && !/japanws/.test(window.location.href)) {
                    window.location.href = url_for('new_account/japanws');
                } else if (!$('#real-form').is(':visible')) {
                    BinarySocket.send({ residence_list: 1 });
                    $('#residence-form').hide();
                    residenceDisabled.insertAfter('#move-residence-back');
                    $('#error-residence').insertAfter('#residence-disabled');
                    residenceDisabled.attr('disabled', 'disabled');
                    generateState();
                    $('#real-form').show();
                }
            } else if (type === 'states_list') {
                select = document.getElementById('address-state');
                const states_list = response.states_list;
                for (let i = 0; i < states_list.length; i++) {
                    appendTextValueChild(select, states_list[i].text, states_list[i].value);
                }
                select.parentNode.parentNode.show();
                if (window.state) {
                    select.value = window.state;
                }
            } else if (type === 'residence_list') {
                select = document.getElementById('residence-disabled') || document.getElementById('residence');
                const phoneElement   = document.getElementById('tel'),
                    residenceValue = Client.get_value('residence'),
                    residence_list = response.residence_list;
                if (residence_list.length > 0) {
                    for (let j = 0; j < residence_list.length; j++) {
                        const residence = residence_list[j];
                        if (select) {
                            appendTextValueChild(select, residence.text, residence.value, residence.disabled ? 'disabled' : undefined);
                        }
                        if (residenceValue !== 'jp' && phoneElement && phoneElement.value === '' && residence.phone_idd && residenceValue === residence.value) {
                            phoneElement.value = '+' + residence.phone_idd;
                        }
                    }
                    if (residenceValue && select) {
                        select.value = residenceValue;
                    }
                    if (document.getElementById('virtual-form')) {
                        BinarySocket.send({ website_status: 1 });
                    }
                }
            } else if (type === 'website_status') {
                const status  = response.website_status,
                    $residence = $('#residence');
                if (status && status.clients_country) {
                    const clientCountry = $residence.find('option[value="' + status.clients_country + '"]');
                    if (!clientCountry.attr('disabled')) {
                        clientCountry.prop('selected', true);
                    }
                    const email_consent_parent = $('#email_consent').parent().parent();
                    if (status.clients_country === 'jp' || japanese_client()) {
                        if (!document.getElementById('japan-label')) $residence.parent().append('<label id="japan-label">' + localize('Japan') + '</label>');
                        email_consent_parent.removeClass('invisible');
                    } else {
                        $residence.removeClass('invisible')
                            .on('change', function() {
                                if ($(this).val() === 'jp') {
                                    email_consent_parent.removeClass('invisible');
                                } else {
                                    email_consent_parent.addClass('invisible');
                                }
                            });
                    }
                }
            } else if (type === 'get_financial_assessment' && objectNotEmpty(response.get_financial_assessment)) {
                const keys = Object.keys(response.get_financial_assessment);
                keys.forEach(function(key) {
                    const val = response.get_financial_assessment[key];
                    $('#' + key).val(val);
                });
            }
        },
    });
};


module.exports = {
    displayAcctSettings: displayAcctSettings,
    handleResidence    : handleResidence,
};
