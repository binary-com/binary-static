const localize             = require('../../../../base/localize').localize;
const Client               = require('../../../../base/client').Client;
const State                = require('../../../../base/storage').State;
const Content              = require('../../../../common_functions/content').Content;
const detect_hedging       = require('../../../../common_functions/common_functions').detect_hedging;
const appendTextValueChild = require('../../../../common_functions/common_functions').appendTextValueChild;
const Validation           = require('../../../../common_functions/form_validation');
const moment               = require('moment');
require('select2');

const SettingsDetailsWS = (function() {
    'use strict';

    const formID = '#frmPersonalDetails';
    const RealAccElements = '.RealAcc';
    let isInitialized,
        editable_fields,
        isJP,
        isVirtual,
        residence,
        tax_residence_values,
        place_of_birth_value;

    const init = function() {
        isInitialized = true;
        isVirtual = Client.get('is_virtual');
        residence = Client.get('residence');
        isJP = residence === 'jp';
        if (isJP && !isVirtual) {
            $('#fieldset_email_consent').removeClass('invisible');
            detect_hedging($('#trading_purpose'), $('.hedge'));
        }
        if (Client.should_complete_tax()) {
            $('#tax_information_notice').removeClass('invisible');
        }
    };

    const getDetailsResponse = function(data) {
        data.date_of_birth = data.date_of_birth ? moment.utc(new Date(data.date_of_birth * 1000)).format('YYYY-MM-DD') : '';
        data.name = isJP ? data.last_name : (data.salutation || '') + ' ' + (data.first_name || '') + ' ' + (data.last_name || '');

        displayGetSettingsData(data);

        if (Client.get('is_virtual')) { // Virtual Account
            $(RealAccElements).remove();
            $(formID).removeClass('hidden');
            return;
        }
        // Real Account
        // Generate states list
        if (isJP) {
            const jpData = data.jp_settings;
            displayGetSettingsData(jpData);
            if (jpData.hedge_asset !== null && jpData.hedge_asset_amount !== null) {
                $('.hedge').removeClass('invisible');
            }
            $('.JpAcc').removeClass('invisible hidden');
        } else {
            $(RealAccElements).removeClass('hidden');
        }
        $(formID)
            .submit(handleSubmit)
            .removeClass('hidden');
        bindValidation();
    };

    const displayGetSettingsData = (data, populate = true) => {
        if (data.tax_residence) {
            tax_residence_values = data.tax_residence.split(',');
        }
        if (data.place_of_birth) {
            place_of_birth_value = data.place_of_birth;
        }
        let $key,
            $lbl_key,
            $data_key,
            has_key,
            has_lbl_key;
        Object.keys(data).forEach((key) => {
            $key = $(`#${key}`);
            $lbl_key = $(`#lbl_${key}`);
            has_key = $key.length > 0;
            has_lbl_key = $lbl_key.length > 0;
            // prioritise labels for japan account
            $key = has_key && has_lbl_key ? (isJP ? $lbl_key : $key) : (has_key ? $key : $lbl_key);
            if ($key.length > 0) {
                $data_key = data[key];
                editable_fields[key] = $data_key === null ? '' : $data_key;
                if (populate) {
                    if ($key.is(':checkbox')) {
                        $key.prop('checked', !!$data_key);
                    } else if (/(SELECT|INPUT)/.test($key.prop('nodeName'))) {
                        $key.val($data_key);
                    } else {
                        $key.text($data_key ? localize($data_key) : '-');
                    }
                }
            }
        });
    };

    const handleSubmit = () => {
        event.preventDefault();
        if (Validation.validate(formID)) {
            let data = populateData();
            if (isJP) {
                data = $.extend(data, populateJPData());
                delete data.place_of_birth;
                delete data.tax_identification_number;
            }
            if (!isChanged(data)) {
                showFormMessage('You did not change anything.', false);
                return;
            }
            setDetails(data);
        }
    };

    const populateData = () => {
        const data = {};
        let id,
            val,
            $this;
        $('.form_input').each(function () {
            $this = $(this);
            id = $this.attr('id');
            if (/lbl_/.test(id)) {
                val = $this.text();
            } else if ($this.is(':checkbox')) {
                val = $this.is(':checked') ? 1 : 0;
            } else {
                val = $this.val();
            }
            data[id.replace('lbl_', '')] = val;
        });
        const tax_residence_val = $('#tax_residence').val();
        data.tax_residence = (Array.isArray(tax_residence_val) ? tax_residence_val.join(',') : tax_residence_val) || '';
        return data;
    };

    const populateJPData = function() {
        let id,
            val,
            $this;
        const jpDataKeys = {};
        jpDataKeys.jp_settings = {};
        $('.jp_value').each(function() {
            $this = $(this);
            id = $this.attr('id');
            if (/lbl_/.test(id)) {
                val = $this.text();
                jpDataKeys[id.replace('lbl_', '')] = val;
            } else {
                val = $this.val();
                jpDataKeys.jp_settings[id] = val;
            }
        });
        if (/Hedging/.test($('#trading_purpose').val())) {
            jpDataKeys.jp_settings.hedge_asset = $('#hedge_asset').val();
            jpDataKeys.jp_settings.hedge_asset_amount = $('#hedge_asset_amount').val().trim();
        }
        return jpDataKeys;
    };

    const isChanged = data => (
        Object.keys(editable_fields).some(key => (
            (key in data && editable_fields[key] !== data[key]) ||
            (data.jp_settings && key in data.jp_settings && editable_fields[key] !== data.jp_settings[key])
        ))
    );

    const bindValidation = () => {
        let validations;
        if (isJP) {
            validations = [
                { selector: '#hedge_asset_amount', validations: ['req', 'number'] },
                { selector: '#hedge_asset',        validations: ['req'] },
            ];
        } else {
            validations = [
                { selector: '#address_line_1',   validations: ['req', 'general'] },
                { selector: '#address_line_2',   validations: ['general'] },
                { selector: '#address_city',     validations: ['req', 'letter_symbol'] },
                { selector: '#address_state',    validations: ['letter_symbol'] },
                { selector: '#address_postcode', validations: ['postcode', ['length', { min: 0, max: 20 }]] },
                { selector: '#phone',            validations: ['phone', ['length', { min: 6, max: 35 }]] },
            ];
            const tax_id_validation = { selector: '#tax_identification_number',  validations: ['postcode', ['length', { min: 0, max: 20 }]] };
            if (Client.is_financial()) {
                validations.push(
                    { selector: '#place_of_birth', validations: ['req'] },
                    { selector: '#tax_residence',  validations: ['req'] },
                );
                tax_id_validation.validations[1][1].min = 1;
                tax_id_validation.validations.unshift('req');
            }
            validations.push(tax_id_validation);
        }
        Validation.init(formID, validations);
    };

    const setDetails = function(data) {
        const req = { set_settings: 1 };
        Object.keys(data).forEach(function(key) {
            req[key] = data[key];
        });
        BinarySocket.send(req).then((response) => {
            setDetailsResponse(response);
        });
    };

    const setDetailsResponse = function(response) {
        // allow user to resubmit the form on error.
        const is_error = response.set_settings !== 1;
        // don't display the data again, but repopulate the editable_fields
        if (!is_error) {
            const echo_req = response.echo_req;
            displayGetSettingsData(echo_req, false);
            if (Client.is_financial() && echo_req.tax_residence && echo_req.tax_identification_number) {
                Client.set('has_tax_information', 1);
                $('#tax_information_notice').addClass('invisible');
            }
            // to update the State with latest get_settings data
            BinarySocket.send({ get_settings: '1' }, true);
        }
        showFormMessage(is_error ?
            'Sorry, an error occurred while processing your account.' :
            'Your settings have been updated successfully.', !is_error);
    };

    const showFormMessage = function(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : 'errorfield')
            .html(isSuccess ? '<ul class="checked"><li>' + localize(msg) + '</li></ul>' : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    const populateResidence = function(response) {
        const residence_list = response.residence_list;
        const obj_residence_el = {
            place_of_birth: document.getElementById('place_of_birth'),
            tax_residence : document.getElementById('tax_residence'),
        };
        if (obj_residence_el.place_of_birth.childElementCount !== 0) return;
        let text,
            value;
        if (residence_list.length > 0) {
            for (let j = 0; j < residence_list.length; j++) {
                const current_residence = residence_list[j];
                text = current_residence.text;
                value = current_residence.value;
                appendIfExist(obj_residence_el, text, value);
            }
            $('#tax_residence').select2()
                .val(tax_residence_values).trigger('change')
                .removeClass('invisible');
            obj_residence_el.place_of_birth.value = place_of_birth_value || residence;
        }
    };

    const appendIfExist = (object_el, text, value) => {
        let object_el_key;
        Object.keys(object_el).forEach(function(key) {
            object_el_key = object_el[key];
            if (object_el_key) {
                appendTextValueChild(object_el_key, text, value);
            }
        });
    };

    const populateStates = function(response) {
        const address_state = '#address_state';
        let $field = $(address_state);
        const defaultValue = response.echo_req.passthrough.value;
        const states = response.states_list;

        $field.empty();

        if (states && states.length > 0) {
            $field.append($('<option/>', { value: '', text: localize('Please select') }));
            states.forEach(function(state) {
                $field.append($('<option/>', { value: state.value, text: state.text }));
            });
        } else {
            $field.replaceWith($('<input/>', { id: address_state.replace('#', ''), name: 'address_state', type: 'text', maxlength: '35' }));
            $field = $(address_state);
        }
        $field.val(defaultValue);
    };

    const onLoad = function() {
        if (isInitialized) return;
        Content.populate();
        editable_fields = {};

        BinarySocket.wait('authorize', 'get_account_status', 'get_settings').then(() => {
            init();
            const data = State.get(['response', 'get_settings', 'get_settings']);
            getDetailsResponse(data);
            if (!isJP) {
                BinarySocket.send({ residence_list: 1 }).then((response) => {
                    populateResidence(response);
                });
            }
            if (residence) {
                const states_req = { states_list: residence, passthrough: { value: data.address_state } };
                BinarySocket.send(states_req).then((response) => {
                    populateStates(response);
                });
            }
        });
    };

    const onUnload = () => {
        isInitialized = false;
    };

    return {
        onLoad  : onLoad,
        onUnload: onUnload,
    };
})();

module.exports = {
    SettingsDetailsWS: SettingsDetailsWS,
};
