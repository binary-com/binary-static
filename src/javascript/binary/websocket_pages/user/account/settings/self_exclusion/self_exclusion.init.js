var SelfExclusionWS = (function() {
    "use strict";

    function FormInput(id, validator) {
        this.id = id;
        this.validator = validator;
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
            var info = this.validator(curr, this.old);
            info.errors.forEach(function(err) {
                that.emitError(err);
            });
            return info.valid ? info.value : null;
        },
        emitError: function(err) {
            SelfExclusionUI.showError(this.id, err);
        }
    };

    var $form;
    var guards;
    var inputs;

    // TODO: init datepicker and timepicker
    function init() {
        if (page.client.is_virtual()) {
            $('#selfExclusionDesc').addClass(hiddenClass);
            SelfExclusionUI.showPageError(Content.localize().textFeatureUnavailable, true);
            return;
        }

        SelfExclusionUI.init();
        var d = SelfExclusionData;
        var numeric = [d.isInteger, d.lessThanPrevious];
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
            session_duration_limit: [d.isInteger, d.minutesWithin(moment.duration(6, 'weeks'))],
            exclude_until:          [d.validDateString],
            timeout_until_duration: [d.validDateString],
            timeout_until:          [d.validTimeString],
        };

        inputs = {};
        $.each(guards, function(id, value) {
            var validator = d.chain(value);
            inputs[id] = new FormInput(id, validator);
        });

        $form.find('button').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var params = formValidate();
            console.log(params);
            if (params !== null) {
                setRequest(params);
            }
        });
        getRequest();
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
        if (!valid) {
            return null;
        }
        if (!changed) {
            SelfExclusionUI.showFormMessage('You did not change anything', false);
            return null;
        }
        // add date and time and get unix epoch
        var date = collect.timeout_until_duration;
        if (date) {
            date.add(collect.timeout_until);
            collect.timeout_until = date.unix();
        } else {
            collect.timeout_until = null;
        }
        delete collect.timeout_until_duration;
        console.log(collect);
        return collect;
    }

    function setRequest(params) {
        params.set_self_exclusion = '1';
        BinarySocket.send(params);
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
            getRequest();
        }
    }

    function getResponse(response) {
        SelfExclusionUI.loaded();
        if('error' in response) {
            if (response.error.code === 'ClientSelfExclusion') {
                page.client.send_logout_request();
            }
            if('message' in response.error) {
                SelfExclusionUI.showPageError(response.error.message, true);
            }
            return false;
        }
        $.each(response.get_self_exclusion, function(key, value) {
            inputs[key].set(value + '');
        });
    }

    function getRequest(params) {
        BinarySocket.send({get_self_exclusion: "1"});
    }

    return {
        init: init,
        getResponse: getResponse,
        setResponse: setResponse,
    };
})();
