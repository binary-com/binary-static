const moment              = require('moment');
const BinarySocket        = require('../../../socket');
const Client              = require('../../../../base/client');
const Header              = require('../../../../base/header');
const localize            = require('../../../../base/localize').localize;
const dateValueChanged    = require('../../../../common_functions/common_functions').dateValueChanged;
const FormManager         = require('../../../../common_functions/form_manager');
const scrollToHashSection = require('../../../../common_functions/scroll').scrollToHashSection;
const DatePicker          = require('../../../../components/date_picker');
const TimePicker          = require('../../../../components/time_picker');

const SelfExclusion = (() => {
    'use strict';

    let $form,
        fields,
        self_exclusion_data;

    const form_id          = '#frm_self_exclusion';
    const timeout_date_id  = '#timeout_until_date';
    const timeout_time_id  = '#timeout_until_time';
    const exclude_until_id = '#exclude_until';
    const error_class      = 'errorfield';

    const onLoad = () => {
        $form = $(form_id);

        fields = {};
        $form.find('input').each(function() {
            fields[this.name] = '';
        });

        initDatePicker();
        getData(true);
    };

    const getData = (scroll) => {
        BinarySocket.send({ get_self_exclusion: 1 }).then((response) => {
            if (response.error) {
                if (response.error.code === 'ClientSelfExclusion') {
                    Client.sendLogoutRequest();
                }
                if (response.error.message) {
                    $('#msg_error').html(response.error.message).setVisibility(1);
                    $form.setVisibility(0);
                }
                return;
            }

            $('#loading').setVisibility(0);
            $form.setVisibility(1);
            self_exclusion_data = response.get_self_exclusion;
            $.each(self_exclusion_data, (key, value) => {
                fields[key] = value.toString();
                $form.find(`#${key}`).val(value);
            });
            bindValidation();
            if (scroll) scrollToHashSection();
        });
    };

    const bindValidation = () => {
        const validations = [{ request_field: 'set_self_exclusion', value: 1 }];

        $form.find('input[type="text"]').each(function() {
            const id = $(this).attr('id');

            if (/(timeout_until|exclude_until)/.test(id)) return;

            const checks = [];
            const options = { min: 0 };
            if (id in self_exclusion_data) {
                checks.push('req');
                options.max = self_exclusion_data[id];
            } else {
                options.allow_empty = true;
            }
            checks.push(['number', options]);

            if (id === 'session_duration_limit') {
                checks.push(['custom', { func: validSessionDuration, message: 'Session duration limit cannot be more than 6 weeks.' }]);
            }

            validations.push({
                selector        : `#${id}`,
                validations     : checks,
                exclude_if_empty: 1,
            });
        });

        validations.push(
            {
                selector        : timeout_date_id,
                request_field   : 'timeout_until',
                re_check_field  : timeout_time_id,
                exclude_if_empty: 1,
                value           : getTimeout,
                validations     : [
                    ['custom', { func: () => ($(timeout_time_id).val() ? $(timeout_date_id).val().length : true), message: 'This field is required.' }],
                    ['custom', { func: value => !value.length || getMoment(timeout_date_id).isAfter(moment().subtract(1, 'days'), 'day'), message: 'Time out must be after today.' }],
                    ['custom', { func: value => !value.length || getMoment(timeout_date_id).isBefore(moment().add(6, 'weeks')),           message: 'Time out cannot be more than 6 weeks.' }],
                ],
            },
            {
                selector       : timeout_time_id,
                exclude_request: 1,
                re_check_field : timeout_date_id,
                validations    : [
                    ['custom', { func: () => ($(timeout_date_id).val() && getMoment(timeout_date_id).isSame(moment(), 'day') ? $(timeout_time_id).val().length : true), message: 'This field is required.' }],
                    ['custom', { func: value => !value.length || !$(timeout_date_id).attr('data-value') || (getTimeout() > moment().valueOf() / 1000), message: 'Time out cannot be in the past.' }],
                    ['custom', { func: validTime, message: 'Please select a valid time.' }],
                ],
            },
            {
                selector        : exclude_until_id,
                exclude_if_empty: 1,
                value           : () => getDate(exclude_until_id),
                validations     : [
                    ['custom', { func: value => !value.length || getMoment(exclude_until_id).isAfter(moment().add(6, 'months')), message: 'Exclude time cannot be less than 6 months.' }],
                    ['custom', { func: value => !value.length || getMoment(exclude_until_id).isBefore(moment().add(5, 'years')), message: 'Exclude time cannot be for more than 5 years.' }],
                ],
            });

        FormManager.init(form_id, validations);
        FormManager.handleSubmit({
            form_selector       : form_id,
            fnc_response_handler: setExclusionResponse,
            fnc_additional_check: additionalCheck,
            enable_button       : true,
        });
    };

    const validSessionDuration = value => (+value <= moment.duration(6, 'weeks').as('minutes'));
    const validTime            = value => !value.length || moment(value,           'HH:mm',      true).isValid();

    const getDate = (elm_id) => {
        const $elm = $(elm_id);
        return !isNaN(new Date($elm.val()).getTime()) ? $elm.val() : $elm.attr('data-value');
    };
    const getMoment  = elm_id => moment(new Date(getDate(elm_id)));
    const getTimeout = () => ($(timeout_date_id).attr('data-value') ? moment(new Date(`${getDate(timeout_date_id)} ${$(timeout_time_id).val()}`)) : '');

    const initDatePicker = () => {
        // timeout_until
        TimePicker.init({ selector: timeout_time_id });
        DatePicker.init({
            selector: timeout_date_id,
            minDate : 0,
            maxDate : 6 * 7, // 6 weeks
        });

        // exclude_until
        DatePicker.init({
            selector: exclude_until_id,
            minDate : moment().add(6, 'months').add(1, 'day').toDate(),
            maxDate : 5 * 365, // 5 years
        });

        $(`${timeout_date_id}, ${exclude_until_id}`).change(function() {
            dateValueChanged(this, 'date');
        });
    };

    const additionalCheck = (data) => {
        const is_changed = Object.keys(data).some(key => ( // using != in next line since response types is inconsistent
            key !== 'set_self_exclusion' && (!(key in self_exclusion_data) || self_exclusion_data[key] != data[key]) // eslint-disable-line eqeqeq
        ));
        if (!is_changed) {
            showFormMessage('You did not change anything.', false);
        }

        let is_confirmed = true;
        if ('timeout_until' in data || 'exclude_until' in data) {
            is_confirmed = window.confirm(localize('When you click "OK" you will be excluded from trading on the site until the selected date.'));
        }

        return is_changed && is_confirmed;
    };

    const setExclusionResponse = (response) => {
        if (response.error) {
            const error_msg = response.error.message;
            const error_fld = response.error.field;
            if (error_fld) {
                $(`#${error_fld}`).siblings('.error-msg').setVisibility(1).html(error_msg);
            } else {
                showFormMessage(localize(error_msg), false);
            }
            return;
        }
        showFormMessage('Your changes have been updated.', true);
        Client.set('session_start', moment().unix()); // used to handle session duration limit
        getData();
        BinarySocket.send({ get_account_status: 1 }).then(() => {
            Header.displayAccountStatus();
        });
    };

    const showFormMessage = (msg, is_success) => {
        $('#msg_form')
            .attr('class', is_success ? 'success-msg' : error_class)
            .html(is_success ? $('<ul/>', { class: 'checked' }).append($('<li/>', { text: localize(msg) })) : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SelfExclusion;
