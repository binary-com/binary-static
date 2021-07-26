const SelectMatcher    = require('@binary-com/binary-style').select2Matcher;
const moment           = require('moment');
const BinaryPjax       = require('../../../../base/binary_pjax');
const Client           = require('../../../../base/client');
const Header           = require('../../../../base/header');
const BinarySocket     = require('../../../../base/socket');
const FormManager      = require('../../../../common/form_manager');
const DatePicker       = require('../../../../components/date_picker');
const CommonFunctions  = require('../../../../../_common/common_functions');
const localize         = require('../../../../../_common/localize').localize;
const State            = require('../../../../../_common/storage').State;
const toISOFormat      = require('../../../../../_common/string_util').toISOFormat;
const getHashValue     = require('../../../../../_common/url').getHashValue;
const getPropertyValue = require('../../../../../_common/utility').getPropertyValue;

const PersonalDetails = (() => {
    const form_id                = '#frmPersonalDetails';
    const real_acc_elements      = '.RealAcc';
    const real_acc_auth_elements = '.RealAccAuth';
    const name_fields            = ['first_name', 'last_name'];

    let is_for_new_account = false;

    let editable_fields,
        is_virtual,
        is_fully_authenticated,
        residence,
        get_settings_data,
        mt_acct_type,
        is_mt_tax_required,
        validations,
        $tax_residence;

    const init = () => {
        editable_fields   = {};
        get_settings_data = {};
        is_virtual        = Client.get('is_virtual');
        residence         = Client.get('residence');
        mt_acct_type      = getHashValue('mt5_redirect');
        validations       = [];
        // demo and synthetic mt accounts do not require tax info
        is_mt_tax_required = /real/.test(mt_acct_type) && mt_acct_type.split('_').length > 2 && +State.getResponse('landing_company.config.tax_details_required') === 1;
    };

    const checkStatus = (status, string) => status.findIndex(s => s === string) < 0 ? Boolean(false) : Boolean(true);

    const showHideTaxMessage = () => {
        const $tax_info_declaration = $('#tax_information_declaration');
        if (Client.shouldCompleteTax()) {
            $('#tax_information_note_toggle').off('click').on('click', (e) => {
                e.stopPropagation();
                $('#tax_information_note_toggle').toggleClass('open');
                $('#tax_information_note').slideToggle();
            });
        } else {
            $tax_info_declaration.setVisibility(0); // hide tax info declaration
        }
    };

    const shouldShowTax = (get_settings) => {
        const is_tax_req = isTaxReq();
        const has_set_tax = get_settings.tax_identification_number || get_settings.tax_residence;
        return is_tax_req || has_set_tax;
    };

    const showHideMissingDetails = () => {
        const has_missing_field = validations.find((validation) => /req/.test(validation.validations) && $(validation.selector).val() === '');
        $('#missing_details_notice').setVisibility(!!has_missing_field);
    };

    /**
     * Remove inputs and replace them with labels and static fields when fields are immutable.
     *
     * @param get_settings to prepopulate some of the values.
     */

    const displayChangeableFields = (get_settings) => {
        get_settings.immutable_fields.forEach(field => {
            CommonFunctions.getElementById(`row_${field}`).setVisibility(0);
            CommonFunctions.getElementById(`row_lbl_${field}`).setVisibility(1);
        });

        name_fields.forEach((field) => {
            if (get_settings.immutable_fields.includes(field)) {
                CommonFunctions.getElementById('row_name').setVisibility(1);
                CommonFunctions.getElementById(field).setVisibility(0);
            }
        });

        if (!get_settings.immutable_fields.includes('date_of_birth')) {
            $('#date_of_birth').setVisibility(1);

            DatePicker.init({
                selector: '#date_of_birth',
                minDate : -100 * 365,
                maxDate : (
                    -18 * 365
                ) - 5,
                yearRange: '-100:-18',
            });
        }

        const is_changeable_citizen = !get_settings.immutable_fields.includes('citizen');
        const is_changeable_pob     = !get_settings.immutable_fields.includes('place_of_birth');
        const is_changeable_tax     = !get_settings.immutable_fields.includes('tax_residence');
        if (is_changeable_pob || is_changeable_citizen || is_changeable_tax) {
            const $options       = $('<div/>');
            const residence_list = State.getResponse('residence_list');
            residence_list.forEach((res) => {
                $options.append(CommonFunctions.makeOption({ text: res.text, value: res.value }));
            });
            $options.prepend($('<option/>', { value: '', text: localize('Please select') }));
            if (is_changeable_pob) {
                $('#place_of_birth')
                    .html($options.html())
                    .val(get_settings.place_of_birth);
            }

            if (is_changeable_citizen) {
                $('#citizen')
                    .html($options.html())
                    .val(get_settings.citizen);
            }
            if (is_changeable_tax) {
                $('#tax_residence')
                    .html($options.html())
                    .val(get_settings.tax_residence);
            }
        }
    };

    const getDetailsResponse = (data, residence_list = State.getResponse('residence_list')) => {
        const get_settings         = $.extend({}, data);
        // date_of_birth can be 0 as a valid epoch
        get_settings.date_of_birth = 'date_of_birth' in get_settings && get_settings.date_of_birth !== 'null' ? moment.utc(new Date(get_settings.date_of_birth * 1000)).format('YYYY-MM-DD') : '';
        const accounts             = Client.getAllLoginids();
        // for subaccounts, back-end sends loginid of the master account as name
        const hide_name            = accounts.some(loginid => new RegExp(loginid, 'i').test(get_settings.first_name)) || is_virtual;
        if (!hide_name) {
            get_settings.name = `${(get_settings.first_name || '')} ${(get_settings.last_name || '')}`;
        }

        if (get_settings.place_of_birth && get_settings.immutable_fields.includes('place_of_birth') && residence_list) {
            get_settings.place_of_birth =
                (residence_list.find(obj => obj.value === get_settings.place_of_birth) || {}).text ||
                get_settings.place_of_birth;
        }

        if (get_settings.citizen && get_settings.immutable_fields.includes('citizen') && residence_list) {
            get_settings.citizen =
                (residence_list.find(obj => obj.value === get_settings.citizen) || {}).text ||
                get_settings.citizen;
        }
        if (get_settings.tax_residence && get_settings.immutable_fields.includes('tax_residence') && residence_list) {
            get_settings.tax_residence =
                (residence_list.find(obj => obj.value === get_settings.tax_residence) || {}).text ||
                get_settings.tax_residence;
        }

        displayGetSettingsData(get_settings);

        if (is_virtual) {
            $(real_acc_elements).remove();
        } else {
            displayChangeableFields(data);
            $(real_acc_elements).setVisibility(1);
            showHideTaxMessage();
            if (is_fully_authenticated) {
                $(real_acc_auth_elements).setVisibility(1);
            }
        }

        $(form_id).setVisibility(1);
        $('#loading').remove();
        setValidations();
        FormManager.init(form_id, validations);
        FormManager.handleSubmit({
            form_selector       : form_id,
            obj_request         : { set_settings: 1 },
            fnc_response_handler: setDetailsResponse,
            fnc_additional_check: additionalCheck,
            enable_button       : true,
        });
        showHideMissingDetails();
    };

    const displayGetSettingsData = (get_settings) => {
        Object.keys(get_settings).forEach((key) => {
            // If field is immutable and value was set by client, show label instead of input
            const has_label         = get_settings.immutable_fields.includes(key);
            const should_show_label = has_label && get_settings[key];
            const element_id  = `${should_show_label ? 'lbl_' : ''}${key}`;
            const element_key = document.getElementById(element_id);
            if (!element_key) return;

            editable_fields[key] = (get_settings[key] !== null ? get_settings[key] : '');

            const should_update_value = /select|text/i.test(element_key.type);
            if (element_id !== 'salutation' || !get_settings_data.salutation){
                CommonFunctions.getElementById(`row_${element_id}`).setVisibility(1);
            }
           
            if (element_key.type === 'checkbox') {
                element_key.checked = !!get_settings[key];
            } else if (!should_update_value) { // for all non (checkbox|select|text) elements
                const getOptionText = (value) =>  (document.querySelector(`#${key} option[value="${value}"]`) || {}).innerText || value;
                let localized_text;
                if (key === 'tax_residence') { // Resolve comma-separated country codes to country names
                    localized_text = get_settings[key] ? get_settings[key]
                        .split(',')
                        .map((value) => getOptionText(value))
                        .join(', ') : '';
                } else {
                    localized_text = getOptionText(get_settings[key]);
                }
                CommonFunctions.elementInnerHtml(element_key, localized_text || '-');
            }
            if (should_update_value || should_show_label) {
                // if should show label, set the value of the non-label so that it doesn't count as missing information
                const $element = $(should_show_label ? `#${key}` : element_key);
                const el_value = get_settings[key] ? get_settings[key].split(',') : '';
                $element
                    .val(el_value)
                    .trigger('change');
                if (should_show_label) { // If we show label, (input) row should be hidden
                    CommonFunctions.getElementById(`row_${key}`).setVisibility(0);
                }
                if (has_label) { // Force pushing values, used for (API-)expected values
                    $element.attr({ 'data-force': true, 'data-value': el_value });
                }
                // Update data-value on change for inputs
                if (should_update_value) {
                    $(element_key).change(function () {
                        if (this.getAttribute('id') === 'date_of_birth') {
                            // value could be epoch or already formatted to ISO
                            const date_of_birth = this.value.indexOf('-') < 0 ? toISOFormat(moment(this.value, 'DD MMM, YYYY')) : this.value;
                            this.setAttribute('data-value', date_of_birth);
                            return CommonFunctions.dateValueChanged(this, 'date');
                        }
                        return this.setAttribute('data-value', this.value);
                    });
                }
            }
        });
        if (get_settings.country) {
            $('#residence').replaceWith($('<label/>').append($('<strong/>', { id: 'country' })));
            $('#country').text(get_settings.country);
        }

        if (is_virtual) {
            CommonFunctions.getElementById('row_date_of_birth').setVisibility(0);
        }
    };

    const additionalCheck = (data) => {
        if (!isChanged(data)) {
            showFormMessage(localize('You did not change anything.'), false);
            return false;
        }
        return true;
    };

    const isChanged = (data) => {
        const compare_data = $.extend({}, data);
        return Object.keys(compare_data).some(key => (
            key !== 'set_settings' && editable_fields[key] !== compare_data[key]
        ));
    };

    const isTaxReq = () =>
        (Client.isAccountOfType('financial') && Client.shouldCompleteTax()) ||
        is_mt_tax_required;

    const setValidations = () => {
        if (is_virtual) {
            validations = [
                { selector: '#email_consent' },
                { selector: '#residence', validations: ['req'] },
            ];
        } else {
            const is_financial = Client.isAccountOfType('financial');
            const is_gaming    = Client.isAccountOfType('gaming');
            const is_tax_req   = isTaxReq();

            validations = [
                { selector: '#salutation',             validations: ['req'] },
                { selector: '#first_name',             validations: ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]] },
                { selector: '#last_name',              validations: ['req', 'letter_symbol', ['length', { min: 2, max: 50 }]] },
                { selector: '#address_line_1',         validations: ['req', 'address'] },
                { selector: '#address_line_2',         validations: ['address'] },
                { selector: '#address_city',           validations: ['req', 'letter_symbol'] },
                { selector: '#address_state',          validations: $('#address_state').prop('nodeName') === 'SELECT' ? '' : ['letter_symbol'] },
                { selector: '#address_postcode',       validations: [residence === 'gb' || Client.get('landing_company_shortcode') === 'iom' ? 'req' : '', 'postcode', ['length', { min: 0, max: 20 }]] },
                { selector: '#email_consent' },
                { selector: '#phone',                  validations: ['req', 'phone', ['length', { min: 9, max: 35, value: () => $('#phone').val().replace(/\D/g,'') }]] },
                { selector: '#place_of_birth',         validations: ['req'] },
                { selector: '#account_opening_reason', validations: ['req'] },
                { selector: '#date_of_birth',          validations: ['req'] },

                // recheck tax_identiciation_number after tax_residence is selected as the validation regex is taken from API based on tax residence
                { selector: '#tax_residence',             validations: is_tax_req ? ['req'] : '', re_check_field: '#tax_identification_number' },
                {
                    selector   : '#tax_identification_number',
                    validations: [
                        is_tax_req ? 'req' : undefined,
                        ['tax_id', { residence_list: State.getResponse('residence_list'), $warning: $('#tax_id_warning'), $tax_residence: $('#tax_residence') }],
                        ['length', { min: is_tax_req ? 1 : 0, max: 20 }],
                    ].filter(item => item),
                },

                // all mt account opening requires citizen
                { selector: '#citizen',    validations: (is_financial || is_gaming || mt_acct_type) ? ['req'] : '' },
                { selector: '#chk_tax_id', validations: is_financial ? [['req', { hide_asterisk: true, message: localize('Please confirm that all the information above is true and complete.') }]] : '', exclude_request: 1 },
            ];

            // loop backwards since we are removing array items
            for (let i = validations.length - 1; i >= 0; i--) {
                // if field is immutable, no need to validate or send it to API
                if (!validations[i].exclude_request &&
                    get_settings_data.immutable_fields.includes(validations[i].selector.slice(1))) {
                    validations.splice(i, 1);
                }
            }
        }
    };

    const setDetailsResponse = (response) => {
        // allow user to resubmit the form on error.
        const is_error = response.set_settings !== 1;
        if (!is_error) {
            // to update tax information message for financial clients
            BinarySocket.send({ get_account_status: 1 }, { forced: true }).then(() => {
                showHideTaxMessage();
                Header.displayAccountStatus();
            });

            // to update the State with latest get_settings data
            BinarySocket.send({ get_settings: 1 }, { forced: true }).then((data) => {
                if (is_virtual && response.echo_req.residence) {
                    window.location.reload(); // reload page if we are setting residence
                    return;
                }
                // update notification shown for set residence etc
                Header.displayAccountStatus();
                if (is_for_new_account) {
                    is_for_new_account = false;
                    BinaryPjax.loadPreviousUrl();
                    return;
                }
                const get_settings    = data.get_settings;
                get_settings_data = get_settings;
                const has_required_mt = is_mt_tax_required ?
                    (get_settings.tax_residence && get_settings.tax_identification_number && get_settings.citizen)
                    :
                    get_settings.citizen; // only check Citizen if user selects mt synthetic account
                if (mt_acct_type && has_required_mt) {
                    $.scrollTo($('h1#heading'), 500, { offset: -10 });
                    $(form_id).setVisibility(0);
                    $('#missing_details_notice').setVisibility(0);
                    $('.rowCustomerSupport').setVisibility(0);
                    $('#msg_main').setVisibility(1);
                    return;
                }
                if (additionalCheck(get_settings)) {
                    getDetailsResponse(get_settings);

                    // Re-populate changeable fields based on incoming data
                    displayChangeableFields(get_settings);
                    showFormMessage(localize('Your settings have been updated successfully.'), true);
                }
            });
        } else { // is_error
            showFormMessage((getPropertyValue(response, ['error', 'message']) || localize('Sorry, an error occurred while processing your account.')), false);
        }
    };

    const showFormMessage = (localized_text, is_success) => {
        const $ul = $('<ul/>', { class: 'checked' }).append($('<li/>', { text: localized_text }));
        $('#formMessage')
            .attr('class', is_success ? 'success-msg' : 'errorfield')
            .html(is_success ? $ul : localized_text)
            .css('display', 'block')
            .delay(15000)
            .fadeOut(1000);
    };

    const populateResidence = (response) => (
        new Promise((resolve) => {
            const residence_list = response.residence_list;
            if (residence_list.length > 0) {
                const $options               = $('<div/>');
                const $options_with_disabled = $('<div/>');
                residence_list.forEach((res) => {
                    $options.append(CommonFunctions.makeOption({ text: res.text, value: res.value }));
                    $options_with_disabled.append(CommonFunctions.makeOption({
                        text       : res.text,
                        value      : res.value,
                        is_disabled: res.disabled,
                    }));
                });
                if (residence) {
                    if (shouldShowTax(get_settings_data)) {
                        $tax_residence = $('#tax_residence');
                        $tax_residence.html($options.html()).promise().done(() => {
                            setTimeout(() => {
                                const residence_value = get_settings_data.tax_residence ?
                                    get_settings_data.tax_residence.split(',') : residence || '';
                                $tax_residence.select2()
                                    .val(residence_value)
                                    .trigger('change')
                                    .setVisibility(1);
                            }, 500);
                        });
                    }

                    if (!get_settings_data.place_of_birth) {
                        $options.prepend($('<option/>', { value: '', text: localize('Please select') }));
                        $('#place_of_birth')
                            .html($options.html())
                            .val(residence);
                    }

                    if (!get_settings_data.citizen) {
                        $options.prepend($('<option/>', { value: '', text: localize('Please select') }));
                        $('#citizen')
                            .html($options.html())
                            .val(residence);
                    }
                } else {
                    $('#country').parent().replaceWith($('<select/>', { id: 'residence', single: 'single' }));
                    const $residence = $('#residence');
                    $options_with_disabled.prepend($('<option/>', { text: localize('Please select a country'), value: '' }));
                    $residence.html($options_with_disabled.html());
                    $residence.select2({
                        matcher(params, data) {
                            return SelectMatcher(params, data);
                        },
                    });
                }
            }
            resolve();
        })
    );

    const populateStates = (response) => (
        new Promise((resolve) => {
            const states = response.states_list;

            const address_state = '#address_state';
            let $field          = $(address_state);

            $field.empty();

            if (states && states.length > 0) {
                $field.append($('<option/>', { value: '', text: localize('Please select') }));
                states.forEach((state) => {
                    $field.append($('<option/>', { value: state.value, text: state.text }));
                });
            } else {
                $field.replaceWith($('<input/>', { id: address_state.replace('#', ''), name: 'address_state', type: 'text', maxlength: '35', 'data-lpignore': true }));
                $field = $(address_state);
            }
            $field.val(get_settings_data.address_state);

            if (states && states.length > 0) {
                $('#address_state').select2({
                    matcher(params, data) {
                        return SelectMatcher(params, data);
                    },
                });
            }
            $field.val(get_settings_data.address_state);

            resolve();
        })
    );

    const onLoad = () => {
        BinarySocket.wait('get_account_status', 'get_settings', 'landing_company').then(() => {
            init();
            const account_status = State.getResponse('get_account_status').status;
            get_settings_data = State.getResponse('get_settings');
            is_fully_authenticated = checkStatus(account_status , 'authenticated');

            displayResidenceList();
        });
    };

    const displayResidenceList = () => {
        BinarySocket.send({ residence_list: 1 }).then(response => {
            populateResidence(response).then(() => {
                if (residence) {
                    BinarySocket.send({ states_list: residence }).then(response_state => {
                        populateStates(response_state).then(() => {
                            getDetailsResponse(get_settings_data, response.residence_list);
                        });
                    });
                } else {
                    getDetailsResponse(get_settings_data, response.residence_list);
                }
                $('#place_of_birth, #citizen').select2({
                    matcher(params, data) {
                        return SelectMatcher(params, data);
                    },
                });
            });
        });
    };

    const onUnload = () => {
        is_for_new_account = false;
    };

    return {
        onLoad,
        onUnload,

        setIsForNewAccount: (bool) => { is_for_new_account = bool; },
    };
})();

module.exports = PersonalDetails;
