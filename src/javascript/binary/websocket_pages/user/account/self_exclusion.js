var SelfExlusionWS = (function() {
    "use strict";

    var $form,
        $loading,
        dateID,
        timeDateID,
        timeID,
        time,
        errorClass,
        hiddenClass;

    var fields,
        submittedValues,
        isValid;

    var init = function() {
        $form       = $('#frmSelfExclusion');
        $loading    = $('#loading');
        timeDateID  = 'timeout_until_duration';
        timeID      = 'timeout_until';
        time        = new Date();
        dateID      = 'exclude_until';
        errorClass  = 'errorfield';
        hiddenClass = 'hidden';

        if(page.client.is_virtual()) {
            $('#selfExclusionDesc').addClass(hiddenClass);
            showPageError(Content.localize().textFeatureUnavailable, true);
            return;
        }

        showLoadingImage($loading);

        submittedValues = {};

        fields = {};
        $form.find('input').each(function() {
            fields[$(this).attr('id')] = '';
        });

        initDatePicker();
        $form.find('button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(formValidate()) {
                setRequest();
            }
        });

        getRequest();
    };

    // ----------------------
    // ----- Get Values -----
    // ----------------------
    var getRequest = function() {
        BinarySocket.send({"get_self_exclusion": "1"});
    };

    var getResponse = function(response) {
        $loading.addClass(hiddenClass);
        $form.removeClass(hiddenClass);

        if('error' in response) {
            if (response.error.code === 'ClientSelfExclusion') {
                page.client.send_logout_request();
            }
            if('message' in response.error) {
                showPageError(response.error.message, true);
            }
            return false;
        } else {
            $.each(response.get_self_exclusion, function(key, value) {
                fields[key] = value + '';
                $form.find('#' + key).val(value);
            });
        }
    };

    var initDatePicker = function () {
        // 6 months from now
        var start_date = new Date();
        start_date.setMonth(start_date.getMonth() + 6);
        start_date.setDate(start_date.getDate() + 1);

        // 5 years from now
        var end_date = new Date();
        end_date.setFullYear(end_date.getFullYear() + 5);

        // 6 weeks from now
        var week_end_date = new Date();
        week_end_date.setMonth(week_end_date.getMonth() + 2);
        week_end_date.setDate(week_end_date.getDate() + 1);

        var now_date = new Date();

        var $timeID = $('#' + timeID);
        attach_time_picker($timeID);

        var $timeDateID = $('#' + timeDateID);
        $timeDateID.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : now_date,
            maxDate   : week_end_date,
            onSelect  : function(dateText, inst) {
                $timeDateID.attr('value', dateText);
            }
        });

        var $dateID = $('#' + dateID);
        $dateID.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : start_date,
            maxDate   : end_date,
            onSelect  : function(dateText, inst) {
                $dateID.attr('value', dateText);
            }
        });
    };

    // ----------------------
    // ----- Set Values -----
    // ----------------------
    var setRequest = function() {
        submittedValues['set_self_exclusion'] = '1';
        BinarySocket.send(submittedValues);
    };

    var setResponse = function(response) {
        if('error' in response) {
            var  errMsg = response.error.message;
            if('field' in response.error) {
                showError(response.error.field, text.localize(errMsg));
            }
            else {
                showFormMessage(text.localize(errMsg), false);
            }
        }
        else {
            showFormMessage(text.localize('Your changes have been updated.'), true);
            page.client.set_storage_value('session_start', parseInt(moment().valueOf() / 1000)); // used to handle session duration limit
            getRequest();
        }
    };

    // ----------------------------
    // ----- Form Validations -----
    // ----------------------------
    var formValidate = function() {
        clearError();
        isValid = true;
        var isChanged = false;
        submittedValues = {};

        $.each(fields, function(key, currentValue) {
            var newValue = $form.find('#' + key).val().trim();

            if(newValue.length > 0) {
                if (key === timeDateID) {
                    if (validateExclusionDate(newValue, 'timeDate')) {
                        submittedValues['timeout_until'] = time;
                    }
                } else if (key !== timeID) {
                    submittedValues[key] = newValue;
                }
                if(key === dateID) {
                    validateExclusionDate(newValue);
                }
                else if(key !== timeID && key !== timeDateID) {
                    if(newValue.length > 0 && !isNormalInteger(newValue)) {
                        showError(key, text.localize('Please enter an integer value'));
                    }
                    else if(currentValue > 0 && (newValue.length === 0 || isLargerInt(newValue, currentValue))) {
                        showError(key, text.localize('Please enter a number between 0 and [_1]').replace('[_1]', currentValue));
                    }
                    else if(key === 'session_duration_limit' && newValue > (6 * 7 * 24 * 60)) {
                        showError(key, text.localize('Session duration limit cannot be more than 6 weeks.'));
                    }
                }
            } else if (key === timeDateID && $form.find('#' + timeID).val().trim().length > 0) {
                showError(timeDateID, text.localize('Please select a valid date'));
            }

            if(newValue !== currentValue) {
                isChanged = true;
            }
        });

        if(isValid && !isChanged) {
            showFormMessage('You did not change anything.', false);
            isValid = false;
        }

        return isValid;
    };

    var isLargerInt = function(a, b) {
        return a.length === b.length ? a > b : a.length > b.length;
    };

    var isNormalInteger = function(value) {
        return /^\d+$/.test(value);
    };

    var validateExclusionDate = function(exclusion_date, opt) {
        var date_regex = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
        var errMsg = '';

        if (exclusion_date) {
            if(date_regex.test(exclusion_date) === false){
                errMsg = 'Please select a valid date';
            }
            else {
                exclusion_date = new Date(exclusion_date);
                if (opt) {
                    if (validateExclusionTime($('#' + timeID).val().trim())) {
                        if ($('#' + timeID).val().trim().length > 0) {
                            exclusion_date.setHours(parseInt($('#' + timeID).val().split(':')[0]));
                            exclusion_date.setMinutes(parseInt($('#' + timeID).val().split(':')[1]));
                        }
                        time = Math.floor(exclusion_date.getTime()/1000);
                    } else {
                        return false;
                    }
                }
                // self exclusion date must > 6 months from now
                var six_month_date = new Date();
                six_month_date.setMonth(six_month_date.getMonth() + 6);
                // self exclusion date must < 5 years from now
                var five_year_date = new Date();
                five_year_date.setFullYear(five_year_date.getFullYear() + 5);

                var six_week_date = new Date();
                six_week_date.setMonth(six_week_date.getMonth() + 2);

                if (exclusion_date < new Date()) {
                    errMsg = 'Exclude time must be after today.';
                } else if (!opt) {
                    if (exclusion_date < six_month_date) {
                        errMsg = 'Exclude time cannot be less than 6 months.';
                    }
                    else if (exclusion_date > five_year_date) {
                        errMsg = 'Exclude time cannot be for more than 5 years.';
                    }
                } else if (opt) {
                    if (exclusion_date > six_week_date) {
                        errMsg = 'Exclude time cannot be more than 6 weeks.';
                    }
                }
            }
        }

        if(errMsg.length > 0) {
            showError((opt ? timeDateID : dateID), text.localize(errMsg));
            return false;
        } else {
            var isConfirmed = confirm(text.localize('When you click "Ok" you will be excluded from trading on the site until the selected date.'));
            if(!isConfirmed) {
                isValid = false;
            }
            return true;
        }
    };

    var validateExclusionTime = function(exclusion_time) {
        var time_regex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        var errMsg = '';

        if (exclusion_time) {
            if(time_regex.test(exclusion_time) === false){
                errMsg = 'Please select a valid time';
            }
        }

        if(errMsg.length > 0) {
            showError(timeID, text.localize(errMsg));
            return false;
        }
        return true;
    };

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    var showPageError = function(errMsg, hideForm) {
        $('#errorMsg').html(errMsg).removeClass(hiddenClass);
        if(hideForm) {
            $form.addClass(hiddenClass);
        }
    };

    var showError = function(fieldID, errMsg) {
        $('#' + fieldID).parent().append($('<p/>', {class: errorClass, text: errMsg}));
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
        init        : init,
        getResponse : getResponse,
        setResponse : setResponse
    };
}());


pjax_config_page_require_auth("user/settings/self_exclusionws", function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        if (response.msg_type === "authorize") {
                            SelfExlusionWS.init();
                        }
                        else if (response.msg_type === "get_self_exclusion") {
                            SelfExlusionWS.getResponse(response);
                        }
                        else if (response.msg_type === "set_self_exclusion") {
                            SelfExlusionWS.setResponse(response);
                        }
                    }
                    else {
                        console.log('some error occured');
                    }
                }
            });

            Content.populate();
            if(TUser.get().hasOwnProperty('is_virtual')) {
                SelfExlusionWS.init();
            }
        }
    };
});
