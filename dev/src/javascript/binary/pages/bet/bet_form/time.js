/*
 * Represents the overall time selection ui(duration & end time)
*/
BetForm.Time = function() {
    this.model = {};
    this.model.expiry_type = BetForm.attributes.model.expiry_type();
    this.trading_time = new BetForm.TradingTime();
    this.duration = new BetForm.Time.Duration(this.trading_time);
    this.end_time = new BetForm.Time.EndTime(this.trading_time);
};

BetForm.Time.prototype = {
    init: function() {
        this.trading_time.init();
        this.duration.init();
        this.end_time.init();
        $('#expiry_type').val(this.model.expiry_type);
        this.register();
        this.update_ui();
    },
    register: function() {
        this.on_expiry_type_change();
        this.duration.register();
        this.end_time.register();

        var that = this;
        $(this.duration).on('change', function(event, time) {
            $(that).trigger('change', [ time ]);
        });

        $(this.end_time).on('change', function(event, time) {
            $(that).trigger('change', [ time ]);
        });

        $(this.duration).on('enter_pressed', function() {
            $(that).trigger('enter_pressed');
        });

        $(this.end_time).on('enter_pressed', function() {
            $(that).trigger('enter_pressed');
        });
    },
    unregister: function() {
        $('#expiry_type').off('change');
        if(this.duration) {
            this.duration.unregister();
        }

        if(this.end_time) {
            this.end_time.unregister();
        }

        $(this.duration).off('change');
        $(this.end_time).off('change');

        $(this.duration).off('enter_pressed');
        $(this.end_time).off('enter_pressed');
    },
    update_for_start_time_change: function() {
        this.duration.update_units_select();
        this.duration.update_ui();
        this.end_time.update_ui();
    },
    update_ui: function() {
        if(this.model.expiry_type == 'duration') {
            this.duration.show();
            this.end_time.hide();
        } else {
            this.duration.hide();
            this.end_time.show();
        }
    },
    on_expiry_type_change: function() {
        var that = this;
        $('#expiry_type').on('change', function() {
            BetForm.attributes.model.expiry_type($(this).val());
            that.model.expiry_type = $(this).val();
            that.update_ui();
        }).addClass('unbind_later');
    },
};

/*
 * This object acts as a model for time parameter. It performs the following functions.
 *      - Read and interpret the time parameter from model(input / localstore).
 *              - The data can be interpretted in both duration format and end time format independent of underlying storage.
 *      - Provide a meachanism to parse and query the minimum durations passed through the form.
 *      - Provide functions to query trading_days and trading_times from the server.
 *      - Validate the time parameter
 *              - through the minimum durations passed to us through the form.
 *              - by querying on trading_days and trading_times from the server.
 *      - Provide mechanism to update the time model.
*/
BetForm.TradingTime = function() {
    this.time_is_duration_regex = /^\d+[smhd]$/;
    this.time_is_tick_regex = /^\d+t$/;
    this.trading_info = {};
};

BetForm.TradingTime.prototype = {
    init: function() {
        this.suggested_duration = this.virgule_duration("" + $('#duration_amount').val() + $('#duration_units').val());
        this.parse_units_from_form();
    },
    value: function(time) {
        if(time) {
            BetForm.attributes.model.time(time);
        }

        time = BetForm.attributes.model.time();
        if(time) {
            return time;
        }

        
        //If we are not able to find something in the model(param/stored) 
        //then we just use the value in duration as defaults.
        //This is becuase only duration comes populated.
        return "" + $('#duration_amount').val() + $('#duration_units').val();
    },
    underlying: function() {
        return BetForm.attributes.underlying();
    },
    is_forward_starting: function() {
        return BetForm.attributes.is_forward_starting();
    },
    as_duration: function() {
        var time = this.value();
        var duration;
        if(this.time_is_tick(time)) {
            duration = this.virgule_duration(time);
        } else if(this.time_is_duration(time)) {
            duration = this.virgule_duration(time);
        } else if(isNaN(parseInt(time))) {
            duration = this.suggested_duration;
        } else {
            duration = this.convert_to_duration(time);
        }

        //Validate the duration
        var selected_unit = this.configured_unit_for(duration.units);

        if(!selected_unit) {
            var min_unit = this.min_unit();
            duration.amount = min_unit.min;
            duration.units = min_unit.units;
        }

        return duration;
    },
    as_end_time: function() {
        var time = this.value();
        var end_time;
        if(this.time_is_duration(time)) {
            var duration = this.virgule_duration(time);
            end_time = this.convert_to_end_time(duration.amount, duration.units);
        } else if(isNaN(parseInt(time))) {
            end_time = this.convert_to_end_time(this.suggested_duration);
        } else {
            end_time = this.virgule_end_time(time);
        }

        //Validate the end_time
        var min_time = this.min_time();
        if(end_time.moment.isBefore(min_time)) {
            end_time = this.virgule_end_time(min_time.utc() / 1000);
        }

        var max_time = this.max_time();
        if(end_time.moment.isAfter(max_time)) {
            end_time = this.virgule_end_time(min_time.utc() / 1000);
        }

        return end_time;
    },
    update_from_duration: function(amount, unit) {
        var selected_unit = this.configured_unit_for(unit);

        this.value("" + amount + unit);
    },
    update_from_end_time: function(expiry_date, expiry_time) {
        var end_time = moment.utc(expiry_date + " " + expiry_time);
        var min_time = this.min_time();
        if(end_time.isBefore(min_time)) {
            end_time = min_time;
        }

        if(!moment.utc().isSame(end_time, 'day')) {
            var trading_times = this.get_trading_times(expiry_date);
            end_time = moment.utc(trading_times.closing);
        }

        this.value(Math.ceil(end_time.utc() / 1000));
    },
    min_time: function() {
        var min_unit = this.min_unit();
        return this.convert_to_end_time(min_unit.min, min_unit.units).moment;
    },
    max_time: function() {
        var max_unit = this.max_unit();
        return this.convert_to_end_time(max_unit.max, max_unit.units).moment;
    },
    min_unit: function() {
        var units = this.configured_units_by_start_time();
        var order = [ 'd', 'h', 'm', 's' ,'t'];
        var checking = order.length;
        while(checking > 0) {
            checking--;
            if(units[order[checking]]) {
                return units[order[checking]];
            }
        }
    },
    max_unit: function() {
        var units = this.configured_units_by_start_time();
        var order = [ 's', 'm', 'h', 'd', 't'];
        var checking = order.length;
        while(checking > 0) {
            checking--;
            if(units[order[checking]]) {
                return units[order[checking]];
            }
        }
    },
    time_is_tick: function(time) {
        return this.time_is_tick_regex.test(time);
    },
    time_is_duration: function(time) {
        return this.time_is_duration_regex.test(time);
    },
    convert_to_duration: function(inputTime) {
        var units;
        var amount;
        var start_time = BetForm.attributes.start_time_moment();
        
        var time = moment.utc(parseInt(inputTime) * 1000);

        var diff = time.valueOf() - start_time.valueOf();
        var min_unit = this.min_unit();
        var min_expiration_time = BetForm.attributes.start_time_moment().add(min_unit.units, min_unit.min);
        if(time.isBefore(min_expiration_time)) {
            units = min_unit.units;
            amount = min_unit.min;
        } else if (start_time.utc().date() != time.utc().date()) {
            units = 'd';
            amount = time.diff(start_time, 'day');
        } else if(diff % (60 * 60) === 0) {
            units = 'h';
            amount = Math.ceil(diff / (60 * 60 * 1000));
        } else if(diff % 60 === 0) {
            units = 'm';
            amount = Math.ceil(diff / (60 * 1000));
        } else  {
            units = 's';
            amount = Math.ceil(diff / 1000);
        }

        return {
            units: units,
            amount: amount
        };
    },
    convert_to_end_time: function(duration_amount, duration_units) {
        var ms = BetForm.attributes.start_time_moment();
        ms.add(duration_units, duration_amount);
        if(duration_units == "d") {
            var trading_times = this.get_trading_times(ms.format("YYYY-MM-DD"));
            ms = trading_times.closing;
        }

        var expiry_time = ms.format('HH:mm:ss');
        if(moment.utc().isSame(ms, 'day')) {
            expiry_time = ms.format('HH:mm');
        }
        return {
            expiry_date: ms.format('YYYY-MM-DD'),
            expiry_time: expiry_time,
            moment: ms
        };
    },
    virgule_duration: function(time) {
        var units = time.substring(time.length - 1);
        var amount = time.substring(0, time.length - 1);

        return {
            units: units,
            amount: amount
        };
    },
    virgule_end_time: function(inputTime) {
        var time = parseInt(inputTime) * 1000,
            ms = moment.utc(time),
            expiry_time = ms.format('HH:mm:ss');
        
        if(moment.utc().isSame(ms, 'day')) {
            expiry_time = ms.format('HH:mm');
        }
        if(!moment.utc().isSame(ms, 'day')) {
            var trading_times = this.get_trading_times(ms.format('YYYY-MM-DD'));
            expiry_time = moment.utc(trading_times.closing).format('HH:mm:ss');
        }
        
        return {
            expiry_date: ms.format('YYYY-MM-DD'),
            expiry_time: expiry_time,
            moment: ms
        };
    },
    is_valid_duration: function(amount, unit) {
        var selected_unit = this.configured_unit_for(unit);
        if(amount < selected_unit.min) {
            return false;
        }

        return true;
    },
    configured_units_by_start_time: function() {
        var units = this.configured_units.spot;
        if(this.is_forward_starting()) {
            units = this.configured_units.forward_starting;
        }

        return units;
    },
    configured_unit_for: function(duration_unit) {
        var units = this.configured_units_by_start_time();
        return units[duration_unit];
    },
    parse_units_from_form: function() {
        var normal_durations = {};
        var forward_starting_durations = {};
        var duration_container = BetForm.attributes.duration_container();
        $('#duration_units > option').each(function(){
            var duration_unit = {};
            duration_unit.className = $(this).attr('class');
            duration_unit.selected = $(this).attr('selected');
            duration_unit.units = $(this).val();
            duration_unit.label = $(this).text();

            duration_unit.max = 59;
            if(duration_unit.units == 'd') {
                duration_unit.max = 365;
            } else if(duration_unit.units == 'h') {
                duration_unit.max = 23;
            } else if (duration_unit.units == 't') {
                duration_unit.max = 10;
            }

            if(duration_unit.className == 'forward_starting') {
                duration_unit.min_select = duration_container.find('.non_input.forward_starting.' + duration_unit.units);
                duration_unit.min = parseInt(duration_unit.min_select.html().split(":")[1]);
                forward_starting_durations[duration_unit.units] = duration_unit;
            } else {
                duration_unit.min_select = duration_container.find('.non_input.' + duration_unit.units + ':not(.forward_starting)');
                duration_unit.min = parseInt(duration_unit.min_select.html().split(":")[1]);
                normal_durations[duration_unit.units] = duration_unit;
            }
        });

        this.configured_units = {};
        this.configured_units.spot = normal_durations;
        this.configured_units.forward_starting = forward_starting_durations;
    },
    trading_dates: function() {
        var trading_dates  = [];
        var trading_days = this.get_trading_days();

        for (var day in trading_days) {
            if(trading_days[day]['trading']) {
                trading_dates.push(day);
            }
        }

        return trading_dates;
    },
    get_trading_days: function() {
        var underlying_symbol = this.underlying();
        if (typeof this.trading_info[underlying_symbol] === 'undefined') {
            var that = this;
            $.ajax({
                url: page.url.url_for('trade_get.cgi'),
                data: { controller_action: 'trading_days',
                        underlying_symbol: underlying_symbol
                    },
                dataType:'json',
                async: false
            }).done(function(trading_days) {
                that.trading_info[underlying_symbol] = {};
                for (var day in trading_days) if (trading_days.hasOwnProperty(day)) {
                    var day_arr = day.split('-');
                    day_arr[1] = parseInt(day_arr[1] - 1);
                    var date = moment.utc(day_arr).format("YYYY-MM-DD");
                    that.trading_info[underlying_symbol][date] = { trading: ((trading_days[day] == 1) ? true: false) };
                }
            });
        }
        return this.trading_info[underlying_symbol];
    },
    get_trading_times: function(date) {
        var underlying_symbol = this.underlying();
        if(typeof this.trading_info[underlying_symbol] === "undefined") {
            this.get_trading_days();
        }

        var that = this;
        if(typeof this.trading_info[underlying_symbol][date] === "undefined") {
            this.trading_info[underlying_symbol][date] = { trading: 0 };
        }

        if(typeof this.trading_info[underlying_symbol][date]['opening'] === "undefined" ||
            typeof this.trading_info[underlying_symbol][date]['closing'] === "undefined") {
            $.ajax({
                url: page.url.url_for('trade_get.cgi', '', 'cached'),
                data: {
                    controller_action: 'trading_times',
                    underlying_symbol: underlying_symbol,
                    trading_date: date,
                },
                dataType: 'json',
                type: 'GET',
                async: false,
            }).done(function(response) {
                that.trading_info[underlying_symbol][date].opening = moment.utc(response.opening);
                that.trading_info[underlying_symbol][date].closing = moment.utc(response.closing);
            });
        }
        return this.trading_info[underlying_symbol][date];
    },
};

/*
 * Represents the duration ui
*/
BetForm.Time.Duration = function(trading_time) {
    this.trading_time = trading_time;
    this.date_picker = new DatePicker.SelectedDates('duration_amount', 'diff');
};

BetForm.Time.Duration.prototype = {
    init: function() {
        this.update_units_select();
    },
    register: function() {
        this.on_unit_change();
        this.on_amount_change();

        var that = this;
        $(this.date_picker).on('enter_pressed', function() {
            $(that).trigger('enter_pressed');
        });
    },
    unregister: function() {
        this.date_picker.hide();

        $(this.date_picker).off('change');
        $('#duration_amount').off('change');

        $(this.date_picker).off('enter_pressed');
        $('#duration_units').off('change');
    },
    show: function(ms) {
        $('#expiry_type_duration').show();
        this.update_ui();
    },
    hide: function() {
        $('#expiry_type_duration').hide();
        this.date_picker.hide();
    },
    update_units_select: function() {
        $('#duration_units option').remove();
        var configured_units = this.trading_time.configured_units_by_start_time();
        for (var unit in configured_units) if (configured_units.hasOwnProperty(unit)) {
            this.add_duration_unit(configured_units[unit]);
        }
    },
    update_ui: function() {
        var selected = this.trading_time.as_duration();
        if($('#duration_units >option[value=' + selected.units + ']').length > 0) {
            $('#duration_units').val(selected.units);
            var unit = this.trading_time.configured_unit_for(selected.units);
            BetForm.attributes.duration_container().find('.non_input').hide();
            unit.min_select.show();
        }
        $('#duration_amount').val(selected.amount);
        if(selected.units == 'd') {
            this.date_picker.show(this.trading_time.trading_dates());
        } else {
            this.date_picker.hide();
        }

        var hidden_expiry_type;
        if (selected.units == 't') {
            $('#expiry_type option[value="endtime"]').prop('disabled', true);
        } else {
            $('#expiry_type option[value="endtime"]').prop('disabled', false);
            $(this).trigger('change', [ this.trading_time.as_end_time().moment ]);
        }

    },
    on_unit_change: function() {
        var that = this;
        $('#duration_units').on('change', function(event) {
            var amount = that.trading_time.as_duration().amount;
            that.trading_time.update_from_duration(amount, this.value);
            $(that).trigger('change', [ that.trading_time.as_end_time().moment ]);
            that.update_ui();
        }).addClass('unbind_later');
    },
    on_amount_change: function() {
        var that = this;
        var handle_change = function(duration) {
            var selected_units = that.trading_time.as_duration().units;
            duration = isNaN(parseInt(duration)) ? BetForm.time.trading_time.configured_unit_for(selected_units).min : parseInt(duration);
            var min_span = that.trading_time.configured_unit_for(selected_units).min_select;

            that.trading_time.update_from_duration(duration, selected_units);
            that.update_ui();
            if(that.trading_time.is_valid_duration(duration, selected_units)) {
                $(this).removeClass('error');
                min_span.removeClass('error');
            } else {
                $(this).addClass('error');
                min_span.addClass('error').effect('pulsate', {times: 2});
            }
        };

        $('#duration_amount').on('change', function() {
            handle_change($(this).val());
        }).addClass('unbind_later');

        $(this.date_picker).on('change', function(event, duration) {
            handle_change(duration);
        });
    },
    add_duration_unit: function(duration_unit) {
        if(duration_unit) {
            var option = this.create_option(duration_unit);
            var drop_down = document.getElementById("duration_units");
            try {
                // for IE version less than 8
                drop_down.add(option, drop_down.options[null]);
            } catch (e) {
                drop_down.add(option, null);
            }
        }
    },
    create_option: function(duration_unit) {
        var option = document.createElement("option");

        option.className = duration_unit.className;
        option.value = duration_unit.units;
        option.selected = duration_unit.selected;
        option.text = duration_unit.label;

        return option;
    },
};

/*
 * Represents the end time ui
*/
BetForm.Time.EndTime = function(trading_time) {
    this.trading_time = trading_time;
    this.time_picker = new TimePicker('expiry_time');
    this.date_picker = new DatePicker.SelectedDates('expiry_date');
};

BetForm.Time.EndTime.prototype = {
    init: function() {
    },
    register: function() {
        this.on_time_change();
        this.on_date_change();

        var that = this;
        var when_enter_pressed = function() {
            $(that).trigger('enter_pressed');
        };

        $(this.time_picker).on('enter_pressed', when_enter_pressed);
        $(this.date_picker).on('enter_pressed', when_enter_pressed);
    },
    unregister: function() {
        this.time_picker.hide();
        this.date_picker.hide();
        $(this.date_picker).off('change');
        $(this.time_picker).off('change');

        $(this.date_picker).off('enter_pressed');
        $(this.time_picker).off('enter_pressed');
    },
    show: function(ms) {
        $('#expiry_type_endtime').show();
        this.update_ui();
    },
    hide: function() {
        $('#expiry_type_endtime').hide();
        this.time_picker.hide();
        this.date_picker.hide();
    },
    update_ui: function() {
        var selected = this.trading_time.as_end_time();
        $('#expiry_date').val(selected.expiry_date);
        $('#expiry_time').val(selected.expiry_time);
        $(this).trigger('change', [ selected.moment ]);

        var now = moment.utc();
        this.date_picker.hide();
        this.time_picker.hide();
        if(now.isSame(selected.moment, 'day')) {
            $('#expiry_time').attr('disabled', false);
            var trading_times = this.trading_time.get_trading_times(selected.expiry_date);
            this.time_picker.show(trading_times.opening, trading_times.closing);
            $('#market-closed-tip').hide();
        } else {
            $('#expiry_time').attr('disabled', true);
            $('#market-closed-tip').show();
        }

        if(this.trading_time.is_forward_starting()) {
            $('#expiry_date').attr('disabled', true);
        } else {
            $('#expiry_date').attr('disabled', false);
        }

        //Add Today, to make it selectable.
        var min_unit = this.trading_time.min_unit();
        var dates = this.trading_time.trading_dates();
        if(min_unit.units !== "d" || min_unit.min === 0) {
            dates.push(now.format("YYYY-MM-DD"));
        }
        this.date_picker.show(dates);
    },
    on_date_change: function() {
        var that = this;
        $(this.date_picker).on('change', function(event, date) {
            var selected = that.trading_time.as_end_time();
            that.trading_time.update_from_end_time(date, selected.expiry_time);
            that.update_ui();
        }).addClass('unbind_later');
    },
    on_time_change: function() {
        var that = this;
        $(this.time_picker).on('change', function(event, time) {
            var selected = that.trading_time.as_end_time();
            that.trading_time.update_from_end_time(selected.expiry_date, time);
            that.update_ui();
        }).addClass('unbind_later');
    },
};
