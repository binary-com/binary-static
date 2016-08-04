var SelfExclusionWS = (function() {
    "use strict";

    /*
    *  1. Check if current User is virtual.
    *  2. If user is virtual, then hide form and description, and show error message.
    *  3. Else wait until the `authorize` call responds, and check again.
    *  4. Populate the fields global.
    *  5. Get the exclusion settings, and populate the forms and fields global.
    *  6. When user submits, validate the form. If ok => submit request.
    *  7. After successful submission, go to step 5.
    *  8. god bless you.
    */

    var $form,
        $loading,
        dateID,
        timeDateID,
        timeID,
        time,
        errorClass,
        hiddenClass;

    var fields;

    function reallyInit() {
        $form       = $('#frmSelfExclusion');
        $loading    = $('#loading');
        timeDateID  = 'timeout_until_duration';
        timeID      = 'timeout_until';
        time        = new Date();
        dateID      = 'exclude_until';
        errorClass  = 'errorfield';
        hiddenClass = 'hidden';

        if (page.client.is_virtual()) {
            $('#selfExclusionDesc').addClass(hiddenClass);
            showPageError(Content.localize().textFeatureUnavailable, true);
            return;
        }
        showLoadingImage($loading);

        fields = {};
        $form.find('input').each(function() {
            fields[this.name] = '';
        });

        bind_validation.simple($form[0], {
            validate: validate,
            submit: submitForm,
        });

        initDatePicker();
        getRequest();
    }

    function init() {
        Content.populate();
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);
                var msg_type = response.msg_type;
                if      (msg_type === 'authorize') reallyInit();
                else if (msg_type === 'get_self_exclusion') getResponse(response);
                else if (msg_type === 'set_self_exclusion') setResponse(response);
            }
        });
        if ('is_virtual' in TUser.get()) {
            reallyInit();
        }
    }

    // ----------------------
    // ----- Get Values -----
    // ----------------------
    function getRequest() {
        BinarySocket.send({get_self_exclusion: 1});
    }

    function getResponse(response) {
        if (response.error) {
            if (response.error.code === 'ClientSelfExclusion') {
                page.client.send_logout_request();
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
        // force reloading
        getSchema(true);
    }

    function initDatePicker() {
        attach_time_picker($('#' + timeID));

        $('#' + timeDateID).datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : moment().toDate(),
            maxDate   : moment().add(moment.duration(6, 'weeks')).toDate(),
            onSelect  : function(dateText, inst) {
                $(this).val(dateText);
            }
        });

        $('#' + dateID).datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : moment().add(moment.duration(6, 'months')).toDate(),
            maxDate   : moment().add(moment.duration(5, 'years')).toDate(),
            onSelect  : function(dateText, inst) {
                $(this).val(dateText);
            }
        });
    }

    // ----------------------
    // ----- Set Values -----
    // ----------------------
    function setRequest(data) {
        data.set_self_exclusion = 1;
        BinarySocket.send(data);
    }

    function setResponse(response) {
        if (response.error) {
            var errMsg = response.error.message;
            var field  = response.error.field;
            if (field) {
                showError(field, errMsg);
            } else {
                showFormMessage(text.localize(errMsg), false);
            }
            return;
        }
        showFormMessage('Your changes have been updated.', true);
        page.client.set_storage_value('session_start', moment().unix()); // used to handle session duration limit
        getRequest();
    }

    // To propogate empty values.
    function EMPTY() {}
    function allowEmpty(value) {
        return value.length > 0 ?
            dv.ok(value) :
            dv.fail(EMPTY);
    }

    function afterToday(date) {
        return date.isAfter(moment()) ?
            dv.ok(date) :
            dv.fail('Exclude time must be after today.');
    }

    // Let empty values go to next validator, because it
    // is ok to put empty values at this stage.
    function numericOrEmpty(value) {
        if (!value) return dv.ok(value);
        return /^\d+$/.test(value) ?
            dv.ok(value) :
            dv.fail('Please enter an integer value');
    }

    function againstField(key) {
        var old = fields[key];
        var err = text.localize('Please enter a number between 0 and [_1]', [old]);
        var hasOld = +old > 0;
        return function(value) {
            var isEmpty = value.length === 0;
            if (!hasOld) {
                return isEmpty ? dv.fail(EMPTY) : dv.ok(+value);
            }
            return (isEmpty || +value > +old) ?
                dv.fail(err) :
                dv.ok(+value);
        };
    }

    function validSessionDuration(value) {
        return value <= moment.duration(6, 'weeks').as('minutes') ?
            dv.ok(value) :
            dv.fail('Session duration limit cannot be more than 6 weeks.');
    }

    function validExclusionDate(date) {
        var six_months = moment().add(moment.duration(6, 'months'));
        var five_years = moment().add(moment.duration(5, 'years'));
        return (
            (date.isBefore(six_months) && dv.fail('Exclude time cannot be less than 6 months.')) ||
            (date.isAfter(five_years)  && dv.fail('Exclude time cannot be for more than 5 years.')) ||
            dv.ok(date)
        );
    }

    function toDateString(date) {
        return dv.ok(date.format('YYYY-MM-DD'));
    }

    var schema;
    function getSchema(force) {
        if (!force && schema) return schema;
        var V2 = ValidateV2;
        var validTime = V2.momentFmt('HH:mm', 'Please select a valid time');
        var validDate = V2.momentFmt('YYYY-MM-DD', 'Please select a valid date');
        schema = {
            max_7day_losses:    [numericOrEmpty, againstField('max_7day_losses')],
            max_7day_turnover:  [numericOrEmpty, againstField('max_7day_turnover')],
            max_30day_losses:   [numericOrEmpty, againstField('max_30day_losses')],
            max_30day_turnover: [numericOrEmpty, againstField('max_30day_turnover')],
            max_balance:        [numericOrEmpty, againstField('max_balance')],
            max_losses:         [numericOrEmpty, againstField('max_losses')],
            max_open_bets:      [numericOrEmpty, againstField('max_open_bets')],
            max_turnover:       [numericOrEmpty, againstField('max_turnover')],
            session_duration_limit: [numericOrEmpty, againstField('session_duration_limit'), validSessionDuration],
            exclude_until:          [allowEmpty, validDate, afterToday, validExclusionDate, toDateString],
            // these two are combined.
            timeout_until_duration: [allowEmpty, validDate, afterToday],
            timeout_until:          [allowEmpty, validTime],
        };
    }

    function validate(data) {
        var info = validate_object(data, getSchema());
        info.errors = info.errors.filter(function(e) {
            return e.err !== EMPTY;
        });
        return info;
    }

    function detectChange(a, b) {
        var k_a = Object.keys(a);
        var k_b = Object.keys(b);
        if (k_a.length !== k_b.length) {
            return true;
        }
        for (var i = 0; i < k_a.length; i++) {
            var key = k_a[i];
            if (a[key] !== b[key]) return true;
        }
        return false;
    }

    function submitForm(e, validation) {
        e.preventDefault();
        e.stopPropagation();
        clearError();
        var info = validateForm(validation);
        if (!info.valid) return;
        if (!info.changed) {
            showFormMessage('You did not change anything.', false);
            return;
        }
        if ('timeout_until' in info.data && !hasConfirmed()) {
            return;
        }
        setRequest(info.data);
    }

    function validateForm(validation) {
        var values = validation.values;
        var valid = validation.errors.length === 0;

        // Do the date time addition and validation here
        var date = values.timeout_until_duration;
        if (date) {
            // If we've gotten this far then there must *not*
            // be an error with the timeout date.
            var time = values.timeout_until || moment.duration({});
            var six_weeks = moment().add(moment.duration(6, 'weeks'));
            date = date.add(time);
            if (date.isAfter(six_weeks)) {
                ValidationUI.draw(
                    'timeout_until_duration',
                    'Exclude time cannot be more than 6 weeks.'
                );
                valid = false;
            } else {
                delete values.timeout_until_duration;
                values.timeout_until = date.unix();
            }
        }

        return {
            data: values,
            valid: valid,
            changed: valid && detectChange(validation.raw, fields),
        };
    }

    function hasConfirmed() {
        var message = 'When you click "Ok" you will be excluded from trading on the site until the selected date.';
        return window.confirm(text.localize(message));
    }

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    function showPageError(errMsg, hideForm) {
        $('#errorMsg').html(errMsg).removeClass(hiddenClass);
        if (hideForm) {
            $form.addClass(hiddenClass);
        }
    }

    function clearError() {
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    }

    function showFormMessage(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    }

    return {
        init: init,
    };
}());
