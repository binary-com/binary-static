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

    var reallyInit = function() {
        $form       = $('#frmSelfExclusion');
        $loading    = $('#loading');
        timeDateID  = 'timeout_until_duration';
        timeID      = 'timeout_until';
        time        = new Date();
        dateID      = 'exclude_until';
        errorClass  = 'errorfield';
        hiddenClass = 'hidden';

        if (page.client.is_virtual()) {
            console.log('is virtual!');
            $('#selfExclusionDesc').addClass(hiddenClass);
            showPageError(Content.localize().textFeatureUnavailable, true);
            return;
        }
        showLoadingImage($loading);

        fields = {};
        $form.find('input').each(function() {
            // hack to make formToObj work
            this.name = this.id;
            fields[this.id] = '';
        });

        bind_validation($form[0], {
            getState: extractFormData,
            checker:  validate,
            start:    function() {},
            stop:     function(info) {
                clearError();
                displayErrors(info.errors);
            },
        });

        initDatePicker();
        $form.submit(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var info = formValidate();
            console.log(info);
            if (!info.valid) return;
            if (!info.changed) {
                showFormMessage('You did not change anything.', false);
                return;
            }
            if ('timeout_until' in info.data) {
                if (!hasConfirmed()) return;
            }
            setRequest(info.data);
        });
        getRequest();
    };

    var init = function() {
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
    };

    // ----------------------
    // ----- Get Values -----
    // ----------------------
    var getRequest = function() {
        BinarySocket.send({get_self_exclusion: 1});
    };

    var getResponse = function(response) {
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
    };

    var initDatePicker = function () {
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
    };

    // ----------------------
    // ----- Set Values -----
    // ----------------------
    var setRequest = function(data) {
        data.set_self_exclusion = 1;
        BinarySocket.send(data);
    };

    var setResponse = function(response) {
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
    };

    // TODO: REMEBER TO ACCOUNT FOR THESE
    function EMPTY() {}

    function validTime(value) {
        if (!value) return dv.fail(EMPTY);
        var time = moment(value, 'HH:mm', true);
        return time.isValid() ?
            dv.ok(time) :
            dv.fail('Please select a valid time');
    }

    function validDate(value) {
        if (!value) return dv.fail(EMPTY);
        var date = moment(value, 'YYYY-MM-DD', true);
        return date.isValid() ?
            dv.ok(date) :
            dv.fail('Please select a valid date');
    }

    function afterToday(date) {
        return date.isAfter(moment()) ?
            dv.ok(date) :
            dv.fail('Exclude time must be after today.');
    }

    function numeric(value) {
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

    function displayErrors(errors) {
        console.log(errors);
        errors.forEach(function(e) {
            if (e.err === EMPTY) return;
            showError(e.ctx, e.err);
        });
    }

    function extractFormData() {
        return formToObj($form[0]);
    }

    function validate(data) {
        return validate_object(data, {
            max_7day_losses:    [numeric, againstField('max_7day_losses')],
            max_7day_turnover:  [numeric, againstField('max_7day_turnover')],
            max_30day_losses:   [numeric, againstField('max_30day_losses')],
            max_30day_turnover: [numeric, againstField('max_30day_turnover')],
            max_balance:        [numeric, againstField('max_balance')],
            max_losses:         [numeric, againstField('max_losses')],
            max_open_bets:      [numeric, againstField('max_open_bets')],
            max_turnover:       [numeric, againstField('max_turnover')],
            session_duration_limit: [numeric, againstField('session_duration_limit'), validSessionDuration],
            exclude_until:          [validDate, afterToday, validExclusionDate, toDateString],
            timeout_until_duration: [validDate, afterToday],
            timeout_until:          [validTime]
        });
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

    // ----------------------------
    // ----- Form Validations -----
    // ----------------------------
    var formValidate = function() {
        clearError();
        var data = extractFormData();
        var validation = validate(data);
        var errors = validation.errors;
        var values = validation.values;

        // Do the date time addition and validation here
        var date = values.timeout_until_duration;
        if (date) {
            var time = values.timeout_until || moment.duration({});
            var six_weeks = moment().add(moment.duration(6, 'weeks'));
            date.add(time);
            // If we've gotten this far then there must *not*
            // be an error with the timeout date.
            if (date.isAfter(six_weeks)) {
                errors.push({
                    ctx: 'timeout_until_duration',
                    err: 'Exclude time cannot be more than 6 weeks.',
                });
            } else {
                delete values.timeout_until_duration;
                values.timeout_until = date.unix();
            }
        }

        errors = errors.filter(function(e) {
            return e.err !== EMPTY;
        });
        displayErrors(errors);
        var valid = errors.length === 0;
        return {
            data: values,
            valid: valid,
            changed: valid && detectChange(data, fields),
        };
    };

    var hasConfirmed = function() {
        var message = 'When you click "Ok" you will be excluded from trading on the site until the selected date.';
        return window.confirm(text.localize(message));
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    var showPageError = function(errMsg, hideForm) {
        $('#errorMsg').html(errMsg).removeClass(hiddenClass);
        if (hideForm) {
            $form.addClass(hiddenClass);
        }
    };

    var showError = function(fieldID, errMsg) {
        $('#' + fieldID).parent().append($('<p/>', {class: errorClass, text: text.localize(errMsg)}));
        if (fieldID === timeID) {
            $('#' + fieldID).attr('style', 'margin-bottom:10px');
        }
    };

    var clearError = function() {
        $('#frmSelfExclusion p.' + errorClass).remove();
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    };

    var showFormMessage = function(msg, isSuccess) {
        $('#formMessage')
            .attr('class', isSuccess ? 'success-msg' : errorClass)
            .html(isSuccess ? '<ul class="checked"><li>' + text.localize(msg) + '</li></ul>' : text.localize(msg))
            .css('display', 'block')
            .delay(5000)
            .fadeOut(1000);
    };


    return {
        init: init,
    };
}());
