var moment = require('moment');
var checkInput = require('../common_functions/common_functions').checkInput;

var TimePicker = function(component_selector) {
    this.component_selector = component_selector;
};

TimePicker.prototype = {
    show: function(min_time, max_time) {
        this.checkWidth(this.config(min_time, max_time), this.component_selector, this);
    },
    hide: function() {
        if($(this.component_selector + '.hasTimepicker').length > 0)
            $(this.component_selector).timepicker('destroy');
        $(this.component_selector).off('keydown');
    },
    create: function(config) {
        var that = this;
        $(this.component_selector).keydown(function(e) {
                if(e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).timepicker('setTime', $(this).val());
                    $(this).timepicker('hide');
                    $(this).blur();
                    $(that).trigger('enter_pressed');
                    return false;
                }
        }).timepicker(config);
    },
    time_now: function() {
        return moment.utc(window.time);
    },
    config: function(min_time, max_time) {
        var that = this,
            time_now = this.time_now();

        var config = {
            hourText: page.text.localize("Hour"),
            minuteText: page.text.localize("Minute"),
            amPmText: [page.text.localize('AM'), page.text.localize('PM')],
        };
        if (min_time) {
            min_time = min_time === 'now' ? time_now : moment.utc(min_time);
            if (min_time.isBefore(time_now)) {
                min_time = time_now;
            }
            config.minTime = {hour: parseInt(min_time.hour()), minute: parseInt(min_time.minute())};
        }
        if (max_time) {
            max_time = moment.utc(max_time);
            config.maxTime = {hour: parseInt(max_time.hour()), minute: parseInt(max_time.minute())};
        }

        config.onSelect = function(time) {
            if (!time.match(/^(:?[0-3]\d):(:?[0-5]\d):(:?[0-5]\d)$/)) {
                time_now = that.time_now();
                var invalid = time.match(/([a-z0-9]*):([a-z0-9]*):?([a-z0-9]*)?/);
                var hour = time_now.format("hh");
                var minute = time_now.format("mm");
                var second = time_now.format("ss");

                if (typeof invalid[1] !== 'undefined' && isFinite(invalid[1])) {
                    hour = parseInt(invalid[1]);
                    if(hour < 10) {
                        hour = "0" + hour;
                    }
                }
                if (typeof invalid[2] !== 'undefined' && isFinite(invalid[2])) {
                    minute = parseInt(invalid[2]);
                    if(parseInt(minute) < 10) {
                        minute = "0" + minute;
                    }
                }
                if (typeof invalid[3] !== 'undefined' && isFinite(invalid[3])) {
                    second = parseInt(invalid[3]);
                    if(second < 10) {
                        second = "0" + minute;
                    }
                }

                var new_time = moment(time_now.format("YYYY-MM-DD") + ' ' + hour +':'+minute+':'+second);
                $(this).val(new_time.format("HH:mm"));
                $(that).trigger('change', [new_time.format("HH:mm")]);
            } else {
                $(that).trigger('change', [time]);
            }
        };

        return config;
    },
    checkWidth: function(config, component_selector, that) {
        var $selector = $(component_selector);
        if ($(window).width() < 769 && checkInput('time', 'not-a-time')) {
            that.hide($selector);
            $selector.attr('type', 'time');
            if (config.minTime) {
                $selector.attr('min', config.minTime);
            }
            if (config.maxTime) {
                $selector.attr('max', config.maxTime);
            }
        } else {
            $selector.attr('type', 'text');
            $selector.removeAttr('min');
            $selector.removeAttr('max');
            that.create(config);
        }
    },
};

module.exports = {
    TimePicker: TimePicker,
};
