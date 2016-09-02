TimePicker = function(component_id) {
    this.component_id = component_id;
};

TimePicker.prototype = {
    show: function(min_time, max_time) {
        var that = this;

        $('#' + this.component_id).keydown(function(e) {
                if(e.which == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).timepicker('setTime', $(this).val());
                    $(this).timepicker('hide');
                    $(this).blur();
                    $(that).trigger('enter_pressed');
                    return false;
                }
        }).timepicker(this.config(min_time, max_time));
    },
    hide: function() {
        if($('#' + this.component_id + '.hasTimepicker').length > 0)
            $('#' + this.component_id).timepicker('destroy');
        $('#' + this.component_id).off('keydown');
    },
    time_now: function() {
        return moment.utc(page.header.time_now);
    },
    config: function(min_time, max_time) {
        var that = this;
        min_time = moment.utc(min_time);
        max_time = moment.utc(max_time);
        var time_now = this.time_now();

        if(min_time.isBefore(time_now)) {
            min_time = this.time_now();
        }

        var config = {
            minTime: {hour: parseInt(min_time.hour()), minute: parseInt(min_time.minute())},
            maxTime: {hour: parseInt(max_time.hour()), minute: parseInt(max_time.minute())},
        };

        config.onSelect = function(time, inst) {
            if (!time.match(/^(:?[0-3]\d):(:?[0-5]\d):(:?[0-5]\d)$/)) {
                var invalid = time.match(/([a-z0-9]*):([a-z0-9]*):?([a-z0-9]*)?/);
                var hour = that.time_now().format("hh");
                var minute = that.time_now().format("mm");
                var second = that.time_now().format("ss");

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

                var new_time = moment(that.time_now().format("YYYY-MM-DD") + ' ' + hour +':'+minute+':'+second);
                $(this).val(new_time.format("HH:mm"));
                $(that).trigger('change', [new_time.format("HH:mm")]);
            } else {
                $(that).trigger('change', [time]);
            }
        };

        return config;
    },
};
