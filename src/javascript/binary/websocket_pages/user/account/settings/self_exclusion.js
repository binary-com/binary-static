const showLoadingImage = require('../../../../base/utility').showLoadingImage;
const Content          = require('../../../../common_functions/content').Content;
const ValidateV2       = require('../../../../common_functions/validation_v2').ValidateV2;
const ValidationUI     = require('../../../../validator').ValidationUI;
const validate_object  = require('../../../../validator').validate_object;
const bind_validation  = require('../../../../validator').bind_validation;
const moment           = require('moment');
const dv               = require('../../../../../lib/validation');
const TimePicker       = require('../../../../components/time_picker').TimePicker;
const DatePicker       = require('../../../../components/date_picker').DatePicker;
const dateValueChanged = require('../../../../common_functions/common_functions').dateValueChanged;
const localize         = require('../../../../base/localize').localize;
const Client           = require('../../../../base/client').Client;

const SelfExclusionWS = (function() {
    'use strict';

    let $form,
        $loading,
        fields;

    const timeDateID  = 'timeout_until_duration',
        timeID      = 'timeout_until',
        dateID      = 'exclude_until',
        errorClass  = 'errorfield',
        hiddenClass = 'hidden';

    // ----------------------
    // ----- Get Values -----
    // ----------------------
    const getRequest = function() {
        BinarySocket.send({ get_self_exclusion: 1 });
    };

    const getResponse = function(response) {
        if (response.error) {
            if (response.error.code === 'ClientSelfExclusion') {
                Client.send_logout_request();
            }
            if (response.error.message) {
                showPageError(response.error.message, true);
            }
            return false;
        }
        $loading.addClass(hiddenClass);
        $form.removeClass(hiddenClass);
        $.each(response.get_self_exclusion, function(key, value) {
            fields[key] = value + '';
            $form.find('#' + key).val(value);
        });
        return true;
    };

    const initDatePicker = function() {
        const timePickerInst = new TimePicker('#' + timeID);
        timePickerInst.show();
        // 6 weeks
        const datePickerTime = new DatePicker('#' + timeDateID);
        datePickerTime.show({
            minDate: 'today',
            maxDate: 6 * 7,
        });
        // 5 years
        const datePickerDate = new DatePicker('#' + dateID);
        datePickerDate.show({
            minDate: moment().add(moment.duration(6, 'months')).toDate(),
            maxDate: 5 * 365,
        });
        $('#' + timeDateID + ', #' + dateID).change(function() {
            dateValueChanged(this, 'date');
        });
    };

    // ----------------------
    // ----- Set Values -----
    // ----------------------
    const setRequest = function(data) {
        data.set_self_exclusion = 1;
        BinarySocket.send(data);
    };

    const setResponse = function(response) {
        if (response.error) {
            const errMsg = response.error.message;
            const field  = response.error.field;
            if (field) {
                ValidationUI.draw('input[name=' + field + ']', errMsg);
            } else {
                showFormMessage(localize(errMsg), false);
            }
            return;
        }
        showFormMessage('Your changes have been updated.', true);
        Client.set('session_start', moment().unix()); // used to handle session duration limit
        getRequest();
    };

    const validate = function(data) {
        if (data.exclude_until) {
            delete data.exclude_until;
            data.exclude_until = $('#' + dateID).attr('data-value');
        }
        if (data.timeout_until_duration) {
            delete data.timeout_until_duration;
            data.timeout_until_duration = $('#' + timeDateID).attr('data-value');
        }
        const info = validate_object(data, getSchema());
        info.errors = info.errors.filter(function(e) {
            return e.err !== EMPTY;
        });
        return info;
    };

    const reallyInit = function() {
        $form    = $('#frmSelfExclusion');
        $loading = $('#loading');

        // for error messages to show properly
        $('#' + timeID).attr('style', 'margin-bottom:10px');

        if (Client.get('is_virtual')) {
            $('#selfExclusionDesc').addClass(hiddenClass);
            showPageError(Content.localize().featureNotRelevantToVirtual, true);
            return;
        }
        showLoadingImage($loading);

        fields = {};
        $form.find('input').each(function() {
            fields[this.name] = '';
        });

        bind_validation.simple($form[0], {
            validate: validate,
            submit  : submitForm,
        });

        initDatePicker();
        getRequest();
    };

    const init = function() {
        Content.populate();
        BinarySocket.init({
            onmessage: function(msg) {
                const response = JSON.parse(msg.data);
                const msg_type = response.msg_type;
                if      (msg_type === 'authorize') reallyInit();
                else if (msg_type === 'get_self_exclusion') getResponse(response);
                else if (msg_type === 'set_self_exclusion') setResponse(response);
            },
        });
        if (Client.get('values_set')) {
            reallyInit();
        }
    };

    // To propagate empty values.
    const EMPTY = function() {};
    const allowEmpty = function(value) {
        return value.length > 0 ?
            dv.ok(value) :
            dv.fail(EMPTY);
    };

    const afterToday = function(date) {
        return date.isAfter(moment()) ?
            dv.ok(date) :
            dv.fail('Exclude time must be after today.');
    };

    // big unsigned integer.
    const big_uint = function(x) {
        return x.replace(/^0+/, '');
    };

    big_uint.gt = function(x, y) {
        const maxLength = Math.max(x.length, y.length);
        const lhs = leftPadZeros(x, maxLength);
        const rhs = leftPadZeros(y, maxLength);
        return lhs > rhs; // lexicographical comparison
    };

    // Let empty values go to next validator, because it
    // is ok to put empty values at this stage.
    const numericOrEmpty = function(value) {
        if (!value) return dv.ok(value);
        return /^\d+$/.test(value) ?
            dv.ok(big_uint(value)) :
            dv.fail('Please enter an integer value');
    };

    const leftPadZeros = function(strint, zeroCount) {
        let result = strint;
        for (let i = 0; i < (zeroCount - strint.length); i++) {
            result = '0' + result;
        }
        return result;
    };

    const againstField = function(key) {
        return function(value) {
            const old = fields[key];
            const err = localize('Please enter a number between 0 and [_1]', [old]);
            const hasOld = !!old;
            const isEmpty = value.length === 0;
            if (!hasOld) {
                return isEmpty ? dv.fail(EMPTY) : dv.ok(value);
            }
            return (isEmpty || big_uint.gt(value, old)) ?
                dv.fail(err) :
                dv.ok(value);
        };
    };

    const validSessionDuration = function(value) {
        return +value <= moment.duration(6, 'weeks').as('minutes') ?
            dv.ok(value) :
            dv.fail('Session duration limit cannot be more than 6 weeks.');
    };

    const validExclusionDate = function(date) {
        const six_months = moment().add(moment.duration(6, 'months'));
        const five_years = moment().add(moment.duration(5, 'years'));
        return (
            (date.isBefore(six_months) && dv.fail('Exclude time cannot be less than 6 months.')) ||
            (date.isAfter(five_years)  && dv.fail('Exclude time cannot be for more than 5 years.')) ||
            dv.ok(date)
        );
    };

    const toDateString = function(date) {
        return dv.ok(date.format('YYYY-MM-DD'));
    };

    const allowEmptyUnless = function(key) {
        return function(value, data) {
            if (value.length > 0) return dv.ok(value);
            if (data[key].length > 0) return dv.fail('Please select a valid date');
            return dv.fail(EMPTY);
        };
    };

    let schema;
    const getSchema = function() {
        if (schema) return schema;
        const V2 = ValidateV2;
        const validTime = V2.momentFmt('HH:mm', 'Please select a valid time');
        const validDate = V2.momentFmt('YYYY-MM-DD', 'Please select a valid date');

        schema = {
            max_7day_losses       : [numericOrEmpty, againstField('max_7day_losses')],
            max_7day_turnover     : [numericOrEmpty, againstField('max_7day_turnover')],
            max_30day_losses      : [numericOrEmpty, againstField('max_30day_losses')],
            max_30day_turnover    : [numericOrEmpty, againstField('max_30day_turnover')],
            max_balance           : [numericOrEmpty, againstField('max_balance')],
            max_losses            : [numericOrEmpty, againstField('max_losses')],
            max_open_bets         : [numericOrEmpty, againstField('max_open_bets')],
            max_turnover          : [numericOrEmpty, againstField('max_turnover')],
            session_duration_limit: [numericOrEmpty, againstField('session_duration_limit'), validSessionDuration],
            exclude_until         : [allowEmpty, validDate, afterToday, validExclusionDate, toDateString],
            // these two are combined.
            timeout_until_duration: [allowEmptyUnless('timeout_until'), validDate],
            timeout_until         : [allowEmpty, validTime],
        };
        return schema;
    };

    const detectChange = function(a, b) {
        const k_a = Object.keys(a);
        const k_b = Object.keys(b);
        if (k_a.length !== k_b.length) {
            return true;
        }
        for (let i = 0; i < k_a.length; i++) {
            const key = k_a[i];
            if (a[key] !== b[key]) return true;
        }
        return false;
    };

    const submitForm = function(e, validation) {
        e.preventDefault();
        e.stopPropagation();
        clearError();
        const info = validateForm(validation);
        if (!info.valid) return;
        if (!info.changed) {
            showFormMessage('You did not change anything.', false);
            return;
        }
        if ('timeout_until' in info.data || 'exclude_until' in info.data) {
            if (!hasConfirmed()) return;
        }
        setRequest(info.data);
    };

    const validateForm = function(validation) {
        const values = validation.values;
        let valid = validation.errors.length === 0;

        // Do the date time addition and validation here
        let date = values.timeout_until_duration;
        if (date) {
            // If we've gotten this far then there must *not*
            // be an error with the timeout date.
            date = moment(date);
            const time = values.timeout_until;
            if (time) {
                date = date.add(time.format('HH'), 'hours').add(time.format('mm'), 'minutes');
            }
            const six_weeks = moment().add(moment.duration(6, 'weeks'));
            const res = dv.first(date, [
                afterToday,
                dv.check(function(d) { return !d.isAfter(six_weeks); }, 'Exclude time cannot be more than 6 weeks'),
            ]);
            if (!res.isOk) {
                ValidationUI.draw(
                    'input[name=timeout_until_duration]',
                    res.value[0]);
                valid = false;
            } else {
                delete values.timeout_until_duration;
                values.timeout_until = date.unix();
            }
        }

        return {
            data   : values,
            valid  : valid,
            changed: valid && detectChange(validation.raw, fields),
        };
    };

    const hasConfirmed = function() {
        const message = 'When you click "Ok" you will be excluded from trading on the site until the selected date.';
        return window.confirm(localize(message));
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    const showPageError = function(errMsg, hideForm) {
        $('#errorMsg').html(errMsg).removeClass(hiddenClass);
        if (hideForm) {
            $form.addClass(hiddenClass);
        }
    };

    const clearError = function() {
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    };

    const showFormMessage = function(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + localize(msg) + '</li></ul>' : localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };

    return {
        init: init,
    };
})();

module.exports = {
    SelfExclusionWS: SelfExclusionWS,
};
