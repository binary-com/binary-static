const moment           = require('moment');
const Client           = require('../../../../base/client');
const localize         = require('../../../../base/localize').localize;
const dateValueChanged = require('../../../../common_functions/common_functions').dateValueChanged;
const FormManager      = require('../../../../common_functions/form_manager');
const DatePicker       = require('../../../../components/date_picker').DatePicker;
const TimePicker       = require('../../../../components/time_picker').TimePicker;

const SelfExclusion = (function() {
    'use strict';

    let $form,
        fields,
        self_exclusion_data;

    const form_id          = '#frm_self_exclusion';
    const timeout_date_id  = '#timeout_until_date';
    const timeout_time_id  = '#timeout_until_time';
    const exclude_until_id = '#exclude_until';
    const error_class      = 'errorfield';
    const hidden_class     = 'invisible';

    const onLoad = function() {
        $form = $(form_id);

        fields = {};
        $form.find('input').each(function() {
            fields[this.name] = '';
        });

        initDatePicker();
        getData();
    };

    const getData = () => {
        BinarySocket.send({ get_self_exclusion: 1 }).then((response) => {
            if (response.error) {
                if (response.error.code === 'ClientSelfExclusion') {
                    Client.sendLogoutRequest();
                }
                if (response.error.message) {
                    $('#msg_error').html(response.error.message).removeClass(hidden_class);
                    $form.addClass(hidden_class);
                }
                return;
            }

            $('#loading').addClass(hidden_class);
            $form.removeClass(hidden_class);
            self_exclusion_data = response.get_self_exclusion;
            $.each(self_exclusion_data, function(key, value) {
                fields[key] = value + '';
                $form.find(`#${key}`).val(value);
            });
            bindValidation();
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
                    ['custom', { func: validDate, message: 'Please select a valid date.' }],
                    ['custom', { func: value => !value.length || toMoment(value).isAfter(moment().subtract(1, 'days'), 'day'), message: 'Time out must be after today.' }],
                    ['custom', { func: value => !value.length || toMoment(value).isBefore(moment().add(6, 'weeks')),           message: 'Time out cannot be more than 6 weeks.' }],
                ],
            },
            {
                selector       : timeout_time_id,
                exclude_request: 1,
                re_check_field : timeout_date_id,
                validations    : [
                    ['custom', { func: () => ($(timeout_date_id).val() && toMoment($(timeout_date_id).val()).isSame(moment(), 'day') ? $(timeout_time_id).val().length : true), message: 'This field is required.' }],
                    ['custom', { func: value => !value.length || !$(timeout_date_id).val() || (getTimeout() > moment().valueOf() / 1000), message: 'Time out cannot be in the past.' }],
                    ['custom', { func: validTime, message: 'Please select a valid time.' }],
                ],
            },
            {
                selector        : exclude_until_id,
                exclude_if_empty: 1,
                value           : () => dateFormat(exclude_until_id),
                validations     : [
                    ['custom', { func: validDate, message: 'Please select a valid date.' }],
                    ['custom', { func: value => !value.length || toMoment(value).isAfter(moment().add(6, 'months')), message: 'Exclude time cannot be less than 6 months.' }],
                    ['custom', { func: value => !value.length || toMoment(value).isBefore(moment().add(5, 'years')), message: 'Exclude time cannot be for more than 5 years.' }],
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
    const validDate            = value => !value.length || moment(new Date(value), 'YYYY-MM-DD', true).isValid();
    const validTime            = value => !value.length || moment(value,           'HH:mm',      true).isValid();

    const toMoment   = value  => moment(new Date(value));
    const dateFormat = elm_id => ($(elm_id).val() ? toMoment($(elm_id).val()).format('YYYY-MM-DD') : '');
    const getTimeout = () => ($(timeout_date_id).val() ? moment((dateFormat(timeout_date_id) + ' ' + $(timeout_time_id).val()).trim()).valueOf() / 1000 : '');

    const initDatePicker = function() {
        // timeout_until
        new TimePicker(timeout_time_id).show();
        new DatePicker(timeout_date_id).show({
            minDate: 'today',
            maxDate: 6 * 7, // 6 weeks
        });

        // exclude_until
        new DatePicker(exclude_until_id).show({
            minDate: moment().add(6, 'months').add(1, 'day').toDate(),
            maxDate: 5 * 365, // 5 years
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

    const setExclusionResponse = function(response) {
        if (response.error) {
            const error_msg = response.error.message;
            const error_fld = response.error.field;
            if (error_fld) {
                $(`#${error_fld}`).siblings('.error-msg').removeClass(hidden_class).html(error_msg);
            } else {
                showFormMessage(localize(error_msg), false);
            }
            return;
        }
        showFormMessage('Your changes have been updated.', true);
        Client.set('session_start', moment().unix()); // used to handle session duration limit
        getData();
    };

    const showFormMessage = function(msg, is_success) {
        $('#msg_form')
            .attr('class', is_success ? 'success-msg' : error_class)
            .html(is_success ? '<ul class="checked"><li>' + localize(msg) + '</li></ul>' : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = SelfExclusion;
