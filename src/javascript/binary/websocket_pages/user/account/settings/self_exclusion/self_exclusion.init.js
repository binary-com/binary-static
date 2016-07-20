var SelfExclusionWS = (function() {
    "use strict";

    function FormInput(id, validate, convert) {
        this.id = id;
        this.validator = validate;
        this.convert = convert;
        this.$input = $('#' + id);
        this.old = this.get();
    }

    FormInput.prototype = {
        set: function(value) {
            this.old = value;
            return this.$input.val(value);
        },
        get: function() {
            return this.$input.val().trim();
        },
        validate: function() {
            var that = this;
            var curr = this.get();
            var error = this.validator(curr, this.old);
            if (error) {
                this.emitError(error);
                return null;
            }
            return this.convert(curr);
        },
        emitError: function(err) {
            SelfExclusionUI.showError(this.id, text.localize(err));
        }
    };

    function initDatePicker() {
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

        var $timeID = $('#timeout_until');
        attach_time_picker($timeID);

        var $timeDateID = $('#timeout_until_duration');
        $timeDateID.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : now_date,
            maxDate   : week_end_date,
            onSelect  : function(dateText, inst) {
                $timeDateID.attr('value', dateText);
            }
        });

        var $dateID = $('#exclude_until');
        $dateID.datepicker({
            dateFormat: 'yy-mm-dd',
            minDate   : start_date,
            maxDate   : end_date,
            onSelect  : function(dateText, inst) {
                $dateID.attr('value', dateText);
            }
        });
    }

    function toNumber(str) {
        return parseInt(str, 10);
    }

    function momentFmt(format) {
        return function(str) {
            return moment(str, format);
        };
    }

    var $form;
    var guards;
    var inputs;

    function init() {
        Content.populate();
        SelfExclusionUI.init();
        if (page.client.is_virtual()) {
            SelfExclusionUI.hide('#selfExclusionDesc');
            SelfExclusionUI.showPageError(Content.localize().textFeatureUnavailable, true);
            return;
        }
        setupForm();
        setupHandlers();
        SelfExclusionData.get();
    }

    function setupHandlers() {
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response) {
                    if (response.msg_type === "authorize") {
                        init();
                    }
                    else if (response.msg_type === "get_self_exclusion") {
                        getResponse(response);
                    }
                    else if (response.msg_type === "set_self_exclusion") {
                        setResponse(response);
                    }
                }
                else {
                    console.log('some error occured');
                }
            }
        });
    }

    function setupForm() {
        var data = SelfExclusionData;
        var numeric = [data.valid.integer, data.valid.limit];
        $form  = $('#frmSelfExclusion');
        guards = {
            max_balance:            numeric,
            max_turnover:           numeric,
            max_losses:             numeric,
            max_7day_turnover:      numeric,
            max_7day_losses:        numeric,
            max_30day_turnover:     numeric,
            max_30day_losses:       numeric,
            max_open_bets:          numeric,
            session_duration_limit: numeric.concat([data.valid.session]),
            timeout_until_duration: [data.valid.dateString],
            timeout_until:          [data.valid.timeString],
            exclude_until:          [data.valid.dateString, data.valid.exclusion],
        };

        var converts = {
            exclude_until:          momentFmt('YYYY-MM-DD'),
            timeout_until_duration: momentFmt('YYYY-MM-DD'),
            timeout_until:          momentFmt('HH-mm'),
        };

        inputs = {};
        $.each(guards, function(id, checks) {
            inputs[id] = new FormInput(
                id,
                data.validator(checks),
                converts[id] || toNumber
            );
        });

        $form.find('button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var params = formValidate();
            if (params !== null) {
                SelfExclusionData.set(params);
            }
        });
        initDatePicker();
    }

    function formValidate() {
        SelfExclusionUI.clearError();
        var changed = false;
        var valid = true;
        var collect = {};
        $.each(inputs, function(id, input) {
            var value = null;
            var prev = input.old;
            var curr = input.get();
            if (curr.length) {
                value = input.validate();
                if (value === null) {
                    valid = false;
                }
            }
            input.old = curr;
            collect[id] = value;
            if (curr !== prev) {
                changed = true;
            }
        });
        collect = dataToParams(collect);
        if (!valid || !collect) {
            return null;
        }
        if (!changed) {
            SelfExclusionUI.showFormMessage('You did not change anything', false);
            return null;
        }
        console.log(collect);
        return collect;
    }

    function dataToParams(data) {
        // add date and time
        var date = data.timeout_until_duration;
        if (date) {
            date.add(data.timeout_until || moment.duration());
            var err = SelfExclusionData.valid.timeout(date);
            if (err) {
                inputs.timeout_until_duration.emitError(err);
                return null;
            }
        }
        delete data.timeout_until_duration;
        convertToUnix(data, 'timeout_until');
        convertToUnix(data, 'exclude_until');
        return data;
    }

    function convertToUnix(params, key) {
        if (params[key]) {
            params[key] = params[key].unix();
        }
    }

    function setResponse(response) {
        if ('error' in response) {
            var errMsg = response.error.message;
            if('field' in response.error) {
                SelfExclusionUI.showError(response.error.field, text.localize(errMsg));
            }
            else {
                SelfExclusionUI.showFormMessage(text.localize(errMsg), false);
            }
        } else {
            SelfExclusionUI.showFormMessage(text.localize('Your changes have been updated.'), true);
            page.client.set_storage_value('session_start', moment().unix()); // used to handle session duration limit
            SelfExclusionData.get();
        }
    }

    function getResponse(response) {
        SelfExclusionUI.loaded();
        if('error' in response) {
            if (response.error.code === 'ClientSelfExclusion') {
                page.client.send_logout_request();
            }
            if ('message' in response.error) {
                SelfExclusionUI.showPageError(response.error.message, true);
            }
            return false;
        }
        $.each(response.get_self_exclusion, function(key, value) {
            inputs[key].set(value + '');
        });
    }

    return {
        init: init,
    };
})();
