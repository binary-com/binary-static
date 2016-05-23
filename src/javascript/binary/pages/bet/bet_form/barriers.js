BetForm.Barriers = function() {
    this.defaults = {};
    this.barriers = [];
};

BetForm.Barriers.prototype = {
    register: function() {
        var that = this;
        this.each(function(barrier) {
            barrier.register();
            $(barrier).on('change', function(event, value) {
                $(that).trigger('change', [ value ]);
            });
        });
    },
    unregister: function() {
        this.each(function(barrier) {
            barrier.unregister();
            $(barrier).off('change');
        });
    },
    spot_changed: function(spot) {
        this.each(function(barrier) { barrier.update_calclulated_value(barrier.value()); });
    },
    time_changed: function(end_time) {
        var current_barrier_type = BetForm.attributes.barrier_type();
        if(!moment.utc().isSame(moment.utc(end_time), 'day')) {
            if(current_barrier_type == 'relative') {
                this.switch_to('absolute');
            }
        } else if (current_barrier_type == 'absolute' && page.settings.get('enable_relative_barrier')) {
            this.switch_to('relative');
        }
    },
    init: function() {
        this.barriers = [];
        var barrier,
            barrier_type = BetForm.attributes.barrier_type();
        if($('#bet_H').length > 0) {
            barrier = new BetForm.Barriers.Barrier({
                    component_id: 'bet_H',
                    calculated_barrier_id: 'betInputBox span.calculated_barrier_from_relative_high',
                    barrier_type: barrier_type,
            });

            barrier.value(this.select_barrier_value(BetForm.attributes.barrier_1(), 'H'));
            this.barriers.push(barrier);
        }

        if($('#bet_L').length > 0) {
            barrier = new BetForm.Barriers.Barrier({
                    component_id: 'bet_L',
                    calculated_barrier_id: 'betInputBox span.calculated_barrier_from_relative_low',
                    barrier_type: barrier_type,
            });
            barrier.value(this.select_barrier_value(BetForm.attributes.barrier_2(), 'L'));
            this.barriers.push(barrier);
        }

        this.register();
    },
    select_barrier_value: function(model_value, default_type) {
        var barrier_value;
        var is_valid_barrier = function(value) {
            return true;
        };

        if(is_valid_barrier(model_value)) {
            return model_value;
        }

        var defaults = this.get_defaults_for(BetForm.attributes.barrier_type());
        if(defaults && is_valid_barrier(defaults[default_type])) {
            return defaults[default_type];
        }

        return 0;
    },
    switch_to: function(barrier_type) {
        if(barrier_type == 'absolute') {
            $('.barrier_text_absolute').show();
            $('.barrier_text_relative').hide();
            $('[name=barrier_type]', BetForm.attributes.form_selector()).val('absolute');
            this.each(function(barrier) { barrier.switch_to('absolute'); });
        } else if(barrier_type == 'relative') {
            $('.barrier_text_absolute').hide();
            $('.barrier_text_relative').show();
            $('[name=barrier_type]', BetForm.attributes.form_selector()).val('relative');
            this.each(function(barrier) { barrier.switch_to('relative'); });
        }
    },
    each: function(method) {
        var rets = [];
        var barriers_count = this.barriers.length - 1;
        while(barriers_count >= 0) {
            rets.push(method(this.barriers[barriers_count]));
            barriers_count--;
        }

        return rets;
    },
    get_defaults_for: function(barrierType) {
        var that = this;
        var underlying = BetForm.attributes.underlying();
        market = BetForm.attributes.market();
        time = BetForm.attributes.duration_string();
        form_name = BetForm.attributes.form_name();
        prediction = BetForm.attributes.prediction();

        var lookup = underlying + '_' +  time + '_' + form_name + '_' + prediction;
        if(typeof this.defaults[lookup] === 'undefined') {
            $.ajax({
                url: page.url.url_for('trade_get.cgi'),
                data: {
                    controller_action: 'barrier_defaults',
                    underlying_symbol: underlying,
                    market: market,
                    time: time,
                    form_name: form_name,
                    barrier_type: barrierType,
                },
                dataType: 'json',
                type: 'GET',
                async: false,
            }).done(function(ranges) {
                that.defaults[lookup] = ranges;
            });
        }

        return this.defaults[lookup];
    },
};

BetForm.Barriers.Barrier = function(args) {
    args = (typeof args === 'undefined') ? {} : args;
    this.component_id = args.component_id;
    this.calculated_barrier_id = args.calculated_barrier_id;
    this.barrier_type = args.barrier_type;
};

BetForm.Barriers.Barrier.prototype = {
    register: function() {
        this.on_change();
        this.on_keyup();
    },
    unregister: function() {
        $('#' + this.component_id).off('keyup');
        $('#' + this.component_id).off('change');
    },
    value: function(value) {
        if(typeof value !== 'undefined') {
            var barrier_prefix = "";
            if (BetForm.attributes.form_name() != 'digits') {
                if(this.barrier_type == 'relative') {
                    if(value > 0) {
                        barrier_prefix = "+";
                    } else if(value === 0) {
                        barrier_prefix = "+";
                        value = this.min_value();
                    }
                } else {
                    if(value < 0) {
                        value = BetForm.spot.value();
                    } else if(value === 0) {
                        value = this.to_absolute_value(this.min_value());
                    }
                }
                value = this.pipsized_value(value);
            }

            $('#' + this.component_id).val(barrier_prefix + value);

            this.update_calclulated_value(value);
            $(this).trigger('change', [ barrier_prefix + value ]);
        }

        return $('#' + this.component_id).val();
    },
    switch_to: function(barrier_type) {
        this.barrier_type = barrier_type;
        var value = $('#' + this.component_id).val();
        if(barrier_type == 'absolute') {
            this.value(this.to_absolute_value(value));
            $('#' + this.calculated_barrier_id).hide();
        } else if(barrier_type == 'relative') {
            this.value(this.to_relative_value(value));
            $('#' + this.calculated_barrier_id).show();
        }
    },
    update_calclulated_value: function(value) {
        if(this.barrier_type == 'relative') {
            value = this.pipsized_value(this.to_absolute_value(value));
            $('#' + this.calculated_barrier_id).html("(" + value + ")");
        }
    },
    on_change: function() {
        var that = this;
        $('#' + this.component_id).on('change', function(event) {
            var value = $(this).val();
            if(value.length > 0) {
                that.value(value);
            }
        }).addClass('unbind_later');
    },
    on_keyup: function() {
        var that = this;
        $('#' + this.component_id).on('keyup', function(event) {
            var value = $(this).val();
            if(value.length > 0) {
                that.update_calclulated_value(value);
            }
        }).addClass('unbind_later');
    },
    pipsized_value: function(value) {
        var pip_size = BetForm.attributes.pip_size();
        if (/indices/.test(window.location.search)) {
            return parseInt(value);
        } else {
            return parseFloat(value).toFixed(pip_size);
        }
    },
    to_relative_value: function(barrier) {
        var spot = BetForm.spot.value();
        if(spot > 0) {
            return this.pipsized_value(parseFloat(barrier) - spot);
        }

        return 0.00;
    },
    to_absolute_value: function(barrier) {
        var spot = BetForm.spot.value();
        if(spot > 0) {
            return this.pipsized_value(parseFloat(barrier) + spot);
        }

        return 0.00;
    },
    min_value: function() {
        if(typeof this.min_relative_value === 'undefined') {
            var pip_size = BetForm.attributes.pip_size();
            var value = "0.";
            var zeros = pip_size - 1;
            while(zeros > 0) {
                value += 0;
                zeros--;
            }
            value += 1;
            this.min_relative_value = value;
        }

        if(this.barrier_type == "absolute") {
            return this.to_absolute_value(this.min_relative_value);
        }

        return this.min_relative_value;
    },
};
