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

    var fields,
        isValid;

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
            fields[$(this).attr('id')] = '';
        });

        initDatePicker();
        $form.find('button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var info = formValidate();
            if (info.valid && info.changed) {
                setRequest(info.data);
            } else if (info.valid && !info.changed) {
                showFormMessage('You did not change anything.', false);
            }
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

    // ----------------------------
    // ----- Form Validations -----
    // ----------------------------
    var formValidate = function() {
        clearError();
        isValid = true;
        var changed = false;
        var submittedValues = {};

        $.each(fields, function(key, currentValue) {
            var newValue = $form.find('#' + key).val().trim();

            if (newValue.length > 0) {
                if (key === timeDateID) {
                    if (validateExclusionDate(newValue, 'timeDate')) {
                        submittedValues['timeout_until'] = time;
                    }
                } else if (key !== timeID) {
                    submittedValues[key] = newValue;
                }
                if (key === dateID) {
                    validateExclusionDate(newValue);
                }
                else if (key !== timeID && key !== timeDateID) {
                    if (newValue.length > 0 && !isNormalInteger(newValue)) {
                        showError(key, 'Please enter an integer value');
                    }
                    else if (currentValue > 0 && (newValue.length === 0 || isLargerInt(newValue, currentValue))) {
                        showError(key, text.localize('Please enter a number between 0 and [_1]', [currentValue]));
                    }
                    else if (key === 'session_duration_limit' && newValue > (6 * 7 * 24 * 60)) {
                        showError(key, 'Session duration limit cannot be more than 6 weeks.');
                    }
                }
            } else if (key === timeDateID && $form.find('#' + timeID).val().trim().length > 0) {
                showError(timeDateID, 'Please select a valid date');
            }
            if (newValue !== currentValue) {
                changed = true;
            }
        });
        return {
            data: submittedValues,
            valid: isValid,
            changed: changed,
        };
    };

    var isLargerInt = function(a, b) {
        return a.length === b.length ? a > b : a.length > b.length;
    };

    var isNormalInteger = function(value) {
        return /^\d+$/.test(value);
    };

    var hasConfirmed = function() {
        var message = 'When you click "Ok" you will be excluded from trading on the site until the selected date.';
        return window.confirm(text.localize(message));
    };

    var validateExclusionDate = function(exclusion_date, opt) {
        var errMsg;
        var date = moment(exclusion_date, 'YYYY-MM-DD');

        if (!date.isValid()) {
            errMsg = 'Please select a valid date';
        } else {
            if (opt) {
                var value = $('#' + timeID).val().trim();
                if (value.length > 0) {
                    if (!validateExclusionTime(value)) return false;
                    date.add(moment(value, 'HH:mm'));
                }
                time = date.unix();
            }

            var six_month_date = moment().add(moment.duration(6, 'months'));
            var five_year_date = moment().add(moment.duration(5, 'years'));
            var six_weeks_date = moment().add(moment.duration(6, 'weeks'));

            if (date.isBefore(moment())) {
                errMsg = 'Exclude time must be after today.';
            } else if (!opt) {
                errMsg = (
                    (date.isBefore(six_month_date) && 'Exclude time cannot be less than 6 months.')    ||
                    (date.isAfter(five_year_date)  && 'Exclude time cannot be for more than 5 years.') ||
                    null
                );
            } else {
                if (date.isAfter(six_weeeks_date)) {
                    errMsg = 'Exclude time cannot be more than 6 weeks.';
                }
            }
        }

        if (errMsg) {
            showError((opt ? timeDateID : dateID), errMsg);
            return false;
        }
        return true && hasConfirmed();
    };

    var validateExclusionTime = function(exclusion_time) {
        var time = moment(exclusion_time, 'HH:mm');
        if (time.isValid()) {
            showError(timeID, 'Please select a valid time');
            return false;
        }
        return true;
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
        isValid = false;
    };

    var clearError = function(fieldID) {
        $(fieldID ? fieldID : '#frmSelfExclusion p.' + errorClass).remove();
        $('#errorMsg').html('').addClass(hiddenClass);
        $('#formMessage').html('');
    };

    var showFormMessage = function(msg, isSuccess) {
        var $elmID = $('#formMessage');
        $elmID
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
