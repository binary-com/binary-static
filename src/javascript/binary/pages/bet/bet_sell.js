var BetSell = function() {
    var _sell_request = null;
    var _analyse_request = null;
    var _container = null;
    var _sell_button_disabled = false;
    var _timer_interval_obj = {};
    var _timeout_variables = {};
    var _diff_end_start_time = 300; // we show point markers if end time start time difference is <= than this (5 minutes default)
    var _model = {
        currency: null,
        shortcode: null,
        payout: null,
        purchase_price: null,
        reload_page_on_close: false,
    };
    return {
        _init: function () {
            _sell_request = null;
            _analyse_request = null;
            _container = null;
            _sell_button_disabled = false;
            _timer_interval_obj = {};
            _timeout_variables = {};
            _model = {
                currency: null,
                shortcode: null,
                payout: null,
                purchase_price: null,
                reload_page_on_close: false,
            };
            this.update_high_low(true);
        },
        model: {
            currency: function (val) {
                if (val) {
                    _model.currency = val;
                    return this;
                }
                return _model.currency;
            },
            shortcode: function (val) {
                if (val) {
                    _model.shortcode = val;
                    return this;
                }
                return _model.shortcode;
            },
            payout: function (val) {
                if (val) {
                    _model.payout = val;
                    return this;
                }
                return _model.payout;
            },
            purchase_price: function (val) {
                if (val) {
                    _model.purchase_price = val;
                    return this;
                }
                return _model.purchase_price;
            },
            reload_page_on_close: function (val) {
                if (val !== undefined) {
                    _model.reload_page_on_close = (val ? true : false);
                    return this;
                }
                return _model.reload_page_on_close;
            },
        },
        container: function (refresh) {
            if (refresh) {
                if (this._container) {
                    this._container.remove();
                }
                this._container = null;
            }
            if (!this._container) {
                var that = this;
                var con = $('<div class="inpage_popup_container" id="sell_popup_container"><a class="close">x</a><div class="inpage_popup_content"></div></div>');
                con.hide();
                var _on_close = function () {
                    var should_reload = that.model.reload_page_on_close();
                    that.cleanup(true);
                    if (should_reload) {
                        window.location.reload(true);
                    }
                };
                con.find('a.close').on('click', function () { _on_close(); } );
                $(document).on('keydown', function(e) {
                     if (e.which === 27) _on_close();
                });
                this._container = con;
            }
            return this._container;
        },
        clear_timers: function () {
            for (var timerKey in _timer_interval_obj) {
                if (_timer_interval_obj.hasOwnProperty(timerKey)) {
                    window.clearInterval(_timer_interval_obj[timerKey]);
                }
            }
            for (var timeoutKey in _timeout_variables) {
                if (_timeout_variables.hasOwnProperty(timeoutKey)) {
                    window.clearTimeout(_timeout_variables[timeoutKey]);
                }
            }
        },
        cleanup: function (cancel_prev_req) {
            this.close_container();
            if (cancel_prev_req) {
                this.cancel_previous_sell_request();
                this.cancel_previous_analyse_request();
            }
            this._init();
        },
        basic_cleanup: function () {
            this.clear_timers();
            this.sparkline.clear();
            this.streaming.stop();
            this.streaming.url(null);
        },
        close_container: function () {
            this.basic_cleanup();
            if (live_chart && typeof live_chart !== "undefined") {
                live_chart.close_chart();
            }
            if (this._container) {
                this._container.hide().remove();
                this._container = null;
            }
        },
        server_data: function () {
            var data = {};
            var field = $('#sell_extra_info_data');
            if (field) {
                if (sessionStorage.getItem('stream_url') && sessionStorage.getItem('stream_url') == field.attr('stream_url')) {
                    data['stream_url'] = sessionStorage.getItem('stream_url');
                } else {
                    sessionStorage.setItem('stream_url', field.attr('stream_url'));
                    data['stream_url'] = field.attr('stream_url');
                }
                if (sessionStorage.getItem('submit_url') && sessionStorage.getItem('submit_url') == field.attr('submit_url')) {
                    data['submit_url'] = sessionStorage.getItem('submit_url');
                } else {
                    sessionStorage.setItem('submit_url', field.attr('submit_url'));
                    data['submit_url'] = field.attr('submit_url');
                }
                if (sessionStorage.getItem('error_message') && sessionStorage.getItem('error_message') == field.attr('submit_url')) {
                    data['error_message'] = sessionStorage.getItem('error_message');
                } else {
                    sessionStorage.setItem('error_message', field.attr('error_message'));
                    data['error_message'] = field.attr('error_message');
                }
                data['sell_channel'] = field.attr('sell_channel');
                data['barrier'] = field.attr('barrier');
                data['barrier2'] = field.attr('barrier2');
                data['is_immediate'] = field.attr('is_immediate');
                data['is_negative'] = field.attr('is_negative');
                data['is_forward_starting'] = field.attr('is_forward_starting');
                data['trade_feed_delay'] = field.attr('trade_feed_delay');
                data['currency'] = field.attr('currency');
                data['purchase_price'] = field.attr('purchase_price');
                data['shortcode'] = field.attr('shortcode');
                data['payout'] = field.attr('payout');
                data['contract_id'] = field.attr('contract_id');
            }
            return data;
        },
        general_error_message: function () {
            var data = this.server_data();
            return data.error_message || 'Contract cannot be sold at this time.';
        },
        show_warning: function(data, replace) {
            if (replace) {
                this.clear_warnings();
            }
            var con = this.container();
            $('.sell_price_wrapper', con).hide();
            var warn_con = $(con.find('#warning_container')[0]);
            var warn = $('<p class="comment">' + data + '</p>');
            warn_con.html(warn).show();
            warn.show();
        },
        clear_warnings: function() {
            var warn_con = $(this.container().find('#warning_container')[0]);
            warn_con.hide();
            $('.message', warn_con).each(function () { $(this).hide().remove(); });
        },
        sell_button: function () {
            return $(this.container().find('#sell_at_market')[0]);
        },
        disable_button: function (button) {
            button.attr('disabled', 'disabled');
            button.fadeTo(0, 0.5);
        },
        enable_button: function (button) {
            button.removeAttr('disabled');
            button.fadeTo(0, 1);
        },
        disable_sell_button: function (button_id, hide) {
            var btn = $(button_id);
            var that = this;
            btn.attr('disabled', 'disabled');
            if (hide) {
                btn.hide();
            }
            this._sell_button_disabled = true;
        },
        enable_sell_button: function () {
            if (this._sell_button_disabled) {
                $('#sell_contract_form', this.container()).show();
                var btn = this.sell_button();
                btn.removeAttr('disabled');
                btn.show();
                this._sell_button_disabled = false;
            }
        },
        get_loading_html: function() {
            var image_link = page.settings.get('image_link');
            return '<span class="loading">'+text.localize('loading...')+'&nbsp;<img src="'+image_link['hourglass']+'" /></span>';
        },
        show_inpage_popup: function (data) {
            var con = this.container(true);
            if (data) {
                $('.inpage_popup_content', con).html(data);
            }
            var body = $(document.body);
            con.css('position', 'fixed').css('z-index', get_highest_zindex() + 100);
            body.append(con);
            con.show();
            // push_data_layer();
            if ($('#sell_bet_desc', con).length > 0) {
                con.draggable({
                    handle: '#sell_bet_desc'
                });
            } else {
                con.draggable();
            }
            this.reposition_confirmation();
            return con;
        },
        reposition_confirmation: function (x, y) {
            var con = this.container();
            var win_ = $(window);

            var x_min = 50;
            var y_min = 50;

            //To be responsive, on mobiles and phablets we show popup as full screen.
            if(win_.width() < 767) {
                x_min = 0;
                y_min = 0;
            }

            if (x === undefined) {
                x = Math.max(Math.floor((win_.width() - win_.scrollLeft() - con.width()) / 2), x_min) + win_.scrollLeft();
            }

            if (y === undefined) {
                y = Math.min(Math.floor((win_.height() - con.height()) / 2), y_min) + win_.scrollTop();
            }

            con.offset({left: x, top: y});
        },
        update_price: function (price) {
            var con = this._container;
            if (!con) {
                throw new Error("container is not available yet");
            }
            if (typeof price == 'object') {
                if (typeof price.price != 'undefined') {
                    price = price.price;
                } else if (typeof price.value != 'undefined') {
                    var payout = this.model.payout();
                    if (isNaN(payout)) {
                        throw new Error("Invalid payout " + payout);
                    }
                    price = price.value * payout;
                }
            }
            if (isNaN(price)) {
                throw new Error("Invalid price structure: " + price);
            }

            // update returns
            this.update_return(price);

            price = parseFloat(price).toFixed(2);
            var cur = this.model.currency(),
                prev_price;
            var price_parts = stylized_price(price);
            var price_con = $('#sell_price_container', con);

            if(price_con.length > 0) {
                var stylized = $('.stylized_price', price_con);
                $('.stylized_units', stylized).html(price_parts.units);
                $('.stylized_cents', stylized).html(price_parts.cents);
                $('.stylized_currency', stylized).html(cur);
                var price_field = $('input[name="price"]', price_con);
                prev_price = price_field.val();
                price_field.val(price);
                BetSell.sparkline.update(price);
                if (!prev_price) {
                    return;
                }

                if (prev_price < price) {
                    stylized.removeClass('price_moved_down');
                    stylized.addClass('price_moved_up');
                } else if (prev_price > price) {
                    stylized.removeClass('price_moved_up');
                    stylized.addClass('price_moved_down');
                } else {
                    stylized.removeClass('price_moved_up');
                    stylized.removeClass('price_moved_down');
                }
            }
            var trade_price = $('#trade_details_price', con);
            if (trade_price.length > 0) {
                prev_price = parseFloat(trade_price.html());
                trade_price.html(price_parts.units + '' + price_parts.cents);
                if (prev_price < price) {
                    trade_price.removeClass('price_moved_down');
                    trade_price.addClass('price_moved_up');
                } else if (prev_price > price) {
                    trade_price.removeClass('price_moved_up');
                    trade_price.addClass('price_moved_down');
                } else {
                    trade_price.removeClass('price_moved_up');
                    trade_price.removeClass('price_moved_down');
                }

            }
        },
        update_return: function(price) {
            var con = this._container;
            var trade_return = $('#trade_details_return', con);
            if (trade_return.length > 0) {
                price = (((price - this.model.purchase_price()) / this.model.purchase_price()) * 100 ).toFixed(2);
                trade_return.html(price + '%');
            }
        },
        update_spot: function (spot) {
            var con = this._container;
            if (!con) {
                throw new Error("container is not available yet");
            }
            var trade_spot = $('#now_spot', con);
            if (trade_spot.length > 0) {
                var prev_spot = parseFloat(trade_spot.html());
                trade_spot.html(spot);
                if (prev_spot < spot) {
                    trade_spot.removeClass('price_moved_down');
                    trade_spot.addClass('price_moved_up');
                } else if (prev_spot > spot) {
                    trade_spot.removeClass('price_moved_up');
                    trade_spot.addClass('price_moved_down');
                } else {
                    trade_spot.removeClass('price_moved_up');
                    trade_spot.removeClass('price_moved_down');
                }
            }
        },
        update_time: function(epoch_time){
            var that = this;

            var date = that.get_date_from_seconds(epoch_time);
            var mom = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
            
            var con = this._container;
            var selector = con.find('#trade_details_now_date');

            selector.attr('epoch_time', epoch_time);
            selector.html(mom);
        },
        update_timer: function (con, container_id, duration) {
            var that = this;
            var container = con.find('#'+container_id);

            if(container.length>0){
                var text_year = text.localize('year');
                var text_years = text.localize('years');
                var text_month = text.localize('month');
                var text_months = text.localize('months');
                var text_day = text.localize('day');
                var text_days = text.localize('days');
                var text_hour = text.localize('hour');
                var text_hours = text.localize('hours');
                var text_minute = text.localize('minute');
                var text_minutes = text.localize('minutes');
                var text_second = text.localize('second');
                var text_seconds = text.localize('seconds');

                var duration_m = moment.duration(duration*1000); 
                var text_arr = [];

                var months = duration_m.months();
                var days = duration_m.days();
                var hours = duration_m.hours();
                var minutes = duration_m.minutes();
                var seconds = duration_m.seconds();

                if(months > 0){
                    text_arr.push(months);
                    if(months > 1){
                        text_arr.push(text_months);
                    }
                    else{
                        text_arr.push(text_month);
                    }
                }

                if(days > 0){
                    text_arr.push(days);
                    if(days > 1){
                        text_arr.push(text_days);
                    }
                    else{
                        text_arr.push(text_day);
                    }
                }

                if(hours > 0){
                    text_arr.push(hours);
                    if(hours > 1){
                        text_arr.push(text_hours);
                    }
                    else{
                        text_arr.push(text_hour);
                    }
                }

                if(minutes > 0){
                    text_arr.push(minutes);
                    if(minutes > 1){
                        text_arr.push(text_minutes);
                    }
                    else{
                        text_arr.push(text_minute);
                    }
                }

                if(seconds > 0){
                    text_arr.push(seconds);
                    if(seconds > 1){
                        text_arr.push(text_seconds);
                    }
                    else{
                        text_arr.push(text_second);
                    }
                }

                var final = [text_arr[0],text_arr[1]];
                if(typeof text_arr[2] !== 'undefined'){
                    final.push(text_arr[2]);
                    final.push(text_arr[3]);
                }

                container.text(final.join(' '));
            }
        },
        update_barriers: function (barriers) {
            var that = this;
            var con = $('#live_barriers');
            if (barriers.barrier) {
                $('#now_barrier .dir', con).text(barriers.barrier.dir);
                $('#now_barrier .diff', con).text(barriers.barrier.diff);
            }
            if (barriers.barrier2) {
                $('#now_barrier2 .dir', con).html(barriers.barrier2.dir);
                $('#now_barrier2 .diff', con).text(barriers.barrier2.diff);
            }
        },
        update_high_low: function (force) {
            var con = this._container;
            var spot = $('#now_spot', con).html();
            var high = $('#now_high', con);
            var low = $('#now_low', con);
            var changed = false;
            if (high.length > 0) {
                spot = parseFloat(spot);
                if (spot > parseFloat(high.html())) {
                    high.html(spot);
                    changed = true;
                }
            }
            if (low.length > 0) {
                spot = parseFloat(spot);
                if (spot < parseFloat(low.html())) {
                    low.html(spot);
                    changed = true;
                }
            }
            if (changed || force) {
                ['now', 'final', 'eo'].forEach(function (place) {
                    var tooltip = $('#'+place+'_high_low_tooltip');
                    var local_high = $('#'+place+'_high');
                    var local_low = $('#'+place+'_low');
                    if (tooltip && local_high && local_low) {
                        tooltip.attr("title", text.localize('High') + ': '+local_high.html()+' '+text.localize('Low')+': '+ local_low.html());
                    }
                });
            }
            // Force all tooltips to the top all the time.
            // Hopefully, this isn't expensive.
            $('abbr').css('z-index', get_highest_zindex() + 1000);
        },
        resubmit_sell_at_market: function () {
            var that = this;
            this.basic_cleanup();
            $('.sell_bottom_content').hide();
            this.add_overlay();
            $('#reload_sell_container').show();
            $('#reload_sell_container').on('click', '#reload_sell', function () {
                var contractId = that.server_data().contract_id;
                that.close_container();
                _timeout_variables[Object.keys(_timeout_variables).length] = setTimeout(function() {
                    that.get_analyse_contract(contractId);
                }, 2000);
                // invoke submit after 2 seconds so settlement time differ from expiry date
            });
        },
        sell_at_market: function (data) {
            var that = this;
            var con = that.show_sell_at_market(data);
            var server_data = that.server_data();

            $('.tab_menu_container').tabs({
                load: function(event, ui){
                   var load_live_chart = ui.tab.find(".ui-tabs-anchor").attr('load_live_chart');
                   if (load_live_chart && load_live_chart == 1) {
                       var symbol = ui.tab.find(".ui-tabs-anchor").attr('underlying_symbol');
                       var liveChartConfig = new LiveChartConfig({ renderTo: 'analysis_live_chart', symbol: symbol, with_trades: 0, shift: 0});
                       var time_obj = that.get_time_interval();
                       if(time_obj['is_live'] && time_obj['is_live'] === 1) {
                            liveChartConfig.update( {
                                live: '10min'
                            });
                       } else {
                           var from_date, to_date;
                           if (server_data.is_forward_starting > 0) {
                               if(server_data.trade_feed_delay > 0) {
                                   from_date = that.get_date_from_seconds(time_obj['from_time'] - parseInt(server_data.trade_feed_delay));
                                   to_date = that.get_date_from_seconds(time_obj['to_time'] + parseInt(server_data.trade_feed_delay));
                               }
                           } else {
                               from_date = that.get_date_from_seconds(time_obj['from_time'] - 5);
                               to_date = that.get_date_from_seconds(time_obj['to_time']);
                           }

                           var display_marker = false;
                           if(time_obj['to_time'] - time_obj['from_time'] <= _diff_end_start_time) {
                               display_marker = true;
                           }

                           if(time_obj['force_tick']) {
                               liveChartConfig.update({
                                   force_tick: true,
                               });
                           }

                           liveChartConfig.update({
                               interval: {
                                   from: from_date,
                                   to: to_date
                               },
                               with_markers: display_marker,
                           });
                       }
                       configure_livechart();
                       updateLiveChart(liveChartConfig);
                       var barrier,
                           purchase_time = $('#trade_details_purchase_date').attr('epoch_time');
                       if (!purchase_time) { // dont add barrier if its forward starting
                           if(server_data.barrier && server_data.barrier2) {
                               if (liveChartConfig.has_indicator('high')) {
                                   live_chart.remove_indicator('high');
                               }
                               barrier = new LiveChartIndicator.Barrier({ name: "high", value: server_data.barrier, color: 'green', label: text.localize('High Barrier')});
                               live_chart.add_indicator(barrier);

                               if (liveChartConfig.has_indicator('low')) {
                                   live_chart.remove_indicator('low');
                               }
                               barrier = new LiveChartIndicator.Barrier({ name: "low", value: server_data.barrier2, color: 'red', label: text.localize('Low Barrier')});
                               live_chart.add_indicator(barrier);

                           } else {
                               if (liveChartConfig.has_indicator('barrier')) {
                                   live_chart.remove_indicator('barrier');
                               }
                               barrier = new LiveChartIndicator.Barrier({ name: "barrier", value: server_data.barrier, color: 'green', label: text.localize('Barrier')});
                               live_chart.add_indicator(barrier);
                           }
                       }
                       that.add_time_indicators(liveChartConfig);
                   }
                }
            });
            that.model.currency(server_data.currency);
            that.model.shortcode(server_data.shortcode);
            that.model.payout(server_data.payout);
            that.model.purchase_price(server_data.purchase_price);
            that.clear_warnings();
            var now_time_con = con.find('#now_time_container');
            if (now_time_con.length > 0 ) {
                var stream_url = server_data.stream_url + '/' + server_data.sell_channel;
                that.streaming.start(stream_url);
                // that.start_now_timer(con, 'now_time_container', 'trade_date_now'); // now timer
                // that.create_date_timer(con.find('#trade_details_now_date'));

                // var duration = now_time_con.attr('duration'); // need now duration to subtract from end duration
                // if(parseInt(duration) > 0) { // if now duration is positive then start the timer for end date
                //     if(con.find('#end_time_container').attr('duration') !== '') {
                //         duration = parseInt(con.find('#end_time_container').attr('duration')) - parseInt(duration);
                //         if (duration > 0) {
                //             that.start_end_timer(con, 'end_time_container', 'now_time_container', 'trade_date_end', duration); // end timer
                //         }
                //     }
                // }
            }
            if (con.find($('#sell_price_container')).length > 0) {
                that.sparkline.init(55);
                con.on('click', '#sell_at_market', function (e) { e.preventDefault(); that.on_sell_button_click('#sell_at_market'); return false; });
            }
            that.update_high_low(true);
            that.reposition_confirmation();
        },
        start_end_timer: function (con, end_attr_selector_id, now_attr_selector_id, container_id, duration) {
            var that = this;
            var time_container = con.find('#' + end_attr_selector_id);
            var now_time_container = con.find('#' + now_attr_selector_id);
            if (time_container.length > 0) {
                var time_obj = that.seconds_to_time(duration);
                var selected = 0;
                time_obj['is_inverse'] = 1;

                var text_year = text.localize('year');
                var text_years = text.localize('years');
                var text_month = text.localize('month');
                var text_months = text.localize('months');
                var text_day = text.localize('day');
                var text_days = text.localize('days');
                var text_hour = text.localize('hour');
                var text_hours = text.localize('hours');
                var text_minute = text.localize('minute');
                var text_minutes = text.localize('minutes');
                var text_second = text.localize('second');
                var text_seconds = text.localize('seconds');


                var interval = 1;
                var timer_input = {
                    year        : { value: time_obj.year, text: text_year, text_plural: text_years, interval: 31536000 },
                    month       : { value: time_obj.month, text: text_month, text_plural: text_months, interval: 2592000  },
                    day         : { value: time_obj.day, text: text_day, text_plural: text_days, interval: 86400 },
                    hour        : { value: time_obj.hour, text: text_hour, text_plural: text_hours, interval: 3600 },
                    minute      : { value: time_obj.minute, text: text_minute, text_plural: text_minutes, interval: 60 },
                    second      : { value: time_obj.second, text: text_second, text_plural: text_seconds, interval: 1 },
                    is_inverse  : time_obj['is_inverse'],
                };
                that.create_timer(con.find('#' + container_id), timer_input);

            }
        },
        start_now_timer: function (con, attr_selector_id, container_id) {
            var that = this;
            var time_container = con.find('#' + attr_selector_id);
            if (time_container.length > 0) {
                var time_obj = that.seconds_to_time(time_container.attr('duration'));

                var text_year = text.localize('year');
                var text_years = text.localize('years');
                var text_month = text.localize('month');
                var text_months = text.localize('months');
                var text_day = text.localize('day');
                var text_days = text.localize('days');
                var text_hour = text.localize('hour');
                var text_hours = text.localize('hours');
                var text_minute = text.localize('minute');
                var text_minutes = text.localize('minutes');
                var text_second = text.localize('second');
                var text_seconds = text.localize('seconds');

                var interval = 1;
                var timer_input = {
                    year        : { value: time_obj.year, text: text_year, text_plural: text_years, interval: 31536000 },
                    month       : { value: time_obj.month, text: text_month, text_plural: text_months, interval: 2592000  },
                    day         : { value: time_obj.day, text: text_day, text_plural: text_days, interval: 86400 },
                    hour        : { value: time_obj.hour, text: text_hour, text_plural: text_hours, interval: 3600 },
                    minute      : { value: time_obj.minute, text: text_minute, text_plural: text_minutes, interval: 60 },
                    second      : { value: time_obj.second, text: text_second, text_plural: text_seconds, interval: 1 },
                    is_negative : time_obj['is_negative'],
                };
                that.create_timer(con.find('#' + container_id), timer_input);
            }

        },
        get_params: function (element) {
            var params_arr = [];
            if (!element) return '';
            var attr = element.attributes;
            var j=0;
            for (var i = 0; i < attr.length; i++ ) {

                if (attr[i].name == 'class' || attr[i].name == 'onclick') {
                    continue;
                }

                params_arr[j] = attr[i].name+'='+encodeURIComponent(attr[i].value);
                j++;

            }
            return params_arr.join('&');
        },
        show_sell_at_market: function (data) {
            return this.show_inpage_popup('<div class="inpage_popup_content_box">' + data + '</div>');
        },
        on_sell_button_click: function (target) {
            this.disable_sell_button(target, true);
            this.streaming.stop();
            this.model.reload_page_on_close(true);
            this.show_loading();
            this.sell_bet();
        },
        cancel_previous_sell_request: function() {
            if (_sell_request) {
                _sell_request.abort();
            }
        },
        cancel_previous_analyse_request: function() {
            if (_analyse_request) {
                _analyse_request.abort();
            }
        },
        show_loading: function () {
            var con = this.container();
            var sell_info = $( con.find('.sell_info')[0] );
            var loading = this.get_loading_html();
            loading = $(loading);
            loading.show();
            sell_info.append(loading);
        },
        hide_loading: function () {
            var con = this.container();
            con.find('.loading').each( function () { $(this).hide().remove(); } );
        },
        get_sell_bet_data: function () {
            return 'controller_action=sell&purchase_price=' + this.server_data().purchase_price + '&currency=' + this.server_data().currency + '&shortcode=' + this.server_data().shortcode + '&contract_id=' + this.server_data().contract_id + '&payout=' + this.server_data().payout + '&price=' + $('input[name="price"]', $('#sell_price_container')).val() + '&ajax_only=1';
        },
        sell_bet: function () {
            var that = this;
            var timeout = 60000;
            this.cancel_previous_sell_request();
            _sell_request = $.ajax(ajax_loggedin({
                url     : that.server_data().submit_url,
                type    : 'POST',
                async   : true,
                data    : that.get_sell_bet_data(),
                timeout : timeout,
                success : function (resp, resp_status, jqXHR) {
                    that.on_sell_bet_success(resp, resp_status, jqXHR);
                },
                error   : function (jqXHR, resp_status, exp) {
                    that.on_sell_bet_error(jqXHR, resp_status, exp);
                },
            }));
        },
        on_sell_bet_success: function (resp, resp_status, jqXHR) {
            var data = {};
            if (typeof resp == 'object') {
               data = resp;
            } else {
                data = (JSON && JSON.parse(resp)) || $.parseJSON(resp) || {};
            }
            this.hide_loading();
            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            } else if (data.error) {
                this.show_warning(data.error, true);
            } else if (data.display) {
                this.clear_warnings();
                this.show_inpage_popup(data.display);
            } else {
                throw new Error("Invalid server response: " + data);
            }
        },
        on_sell_bet_error: function (jqXHR, resp_status, exp) {
            this.hide_loading();
            var details = '' + exp;
            if (jqXHR.responseText) {
                details += jqXHR.responseText;
            } else if (document.location.href.match(/^http:/) && (!details || details.match(/access/i))) {
                details += '<p>Please <a href="' + document.location.href.replace('http://', 'https://') + '">continue browsing using HTTPS secure protocol</a></p>';
            }
            this.show_warning(details, true);
        },
        get_analyse_contract: function (contract_id, bologinid, clicked_button) {
            if (clicked_button) {
                this.disable_button($(clicked_button));
            }
            this.cancel_previous_analyse_request();
            var $loading = $('#trading_init_progress');
            if($loading.length){
                $loading.show();
            }
            var data = "contract_id=" + encodeURIComponent(contract_id);
            if (bologinid) {
                data += '&bo_client=' + encodeURIComponent(bologinid);
            }
            _analyse_request = $.ajax(ajax_loggedin({
                context : this,
                url     : page.url.url_for('trade/analyse_contract'),
                type    : 'POST',
                data    : data,
                success : function (data, textStatus, jqXHR) {
                    if (jqXHR.responseJSON) {
                        this.only_show_chart(data);
                    } else {
                        var html = $.parseHTML(data);
                        if ($(html).find('#is_spread_contract').length) {
                            this.show_buy_sell(data);
                        } else {
                            this.sell_at_market(data);
                        }
                    }
                },
                error   : function (jqXHR, resp_status, exp) {
                    this.show_sell_at_market(text.localize("Please try again."));
                },
            })).always(function () {
                if($loading.length){
                    $loading.hide();
                }
                if (clicked_button) {
                    this.enable_button($(clicked_button));
                }
            });
        },
        register: function () {
            var that = this;
            $('#profit-table, #portfolio-table, #bet_calculation_container, #statement-table, #statement-ws-container, #contract_confirmation_container, #profit-table-ws-container').on('click', '.open_contract_details', function (e) {
                e.preventDefault();
                that.get_analyse_contract($(this).attr('contract_id'), $(this).attr('bo_client'), this);
            });
        },
        show_buy_sell: function(data) {
            var con = this.show_spread_popup(data);
            if (con && !con.find('#status').hasClass('loss')) {
                BetPrice.spread.stream($('#sell_extra_info_data').attr('sell_channel'));
            }
        },
        show_spread_popup: function(data) {
            var that = this;

            var con = that.container(true);
            con.addClass('spread_popup');
            data = '<div class="inpage_popup_content_box">' + data + '</div>';
            if (data) {
                $('.inpage_popup_content', con).html(data);
            }
            var body = $(document.body);
            con.css('position', 'fixed').css('z-index', get_highest_zindex() + 100);
            body.append(con);
            con.show();
            // push_data_layer();
            if ($('#sell_bet_desc', con).length > 0) {
                con.draggable({
                    handle: '#sell_bet_desc'
                });
            } else {
                con.draggable();
            }
            this.reposition_confirmation();
            return con;
        },
        only_show_chart: function(data) {
            this.show_inpage_popup('<div class="inpage_popup_content_box"><div class="popup_bet_desc drag-handle">'+data.longcode+'</div><div id="tick_chart"></div></div>');
            TickDisplay.initialize(data);
        },
        streaming: function() {
            var _stream = null;
            var _update_from_stream = false;
            var _url = null;
            var timer;
            return {
                start: function(url) {
                    BetSell.sparkline.clear();
                    this.stop();
                    if (url) {
                        this._url = url;
                    }
                    _update_from_stream = true;
                    url = this._url;
                    if (url && typeof (EventSource) !== "undefined") {
                        this._stream = new EventSource(url, { retry: 18000000 });
                        var that = this;
                        this._stream.onmessage = function(e) {
                            that.process_message(e.data);
                        };
                        this._stream.addEventListener("ping", function(e) { return true; });
                        return true;
                    } else {
                        var err_msg = "We are not able to stream live prices at the moment. To enjoy live streaming of prices try refreshing the page, if you get this issue after repeated attempts try a different browser";
                        BetSell.show_warning(err_msg);
                        $('#spot_spark').html('<span title="' + err_msg + '">No Live price update</span>"');
                        return false;
                    }
                },
                stop: function() {
                    if (this._stream) {
                        this._stream.close();
                        this._stream = null;
                    }
                },
                ignore_updates: function() {
                    _update_from_stream = false;
                },
                process_message: function(data) {
                    if (_update_from_stream) {
                        var bet = JSON.parse(data);
                        var no_error = true;
                        this.update_price(bet);
                    }
                }, // process_message

                update_price: function(bet) {
                    var prices = bet.prices;
                    var spot = bet.spot;
                    var epoch = bet.epoch;

                    var con = BetSell.container();
                    var start_epoch_el =  con.find('#trade_details_start_date');
                    var end_epoch_el = con.find('#trade_details_end_date');

                    if(start_epoch_el.length && end_epoch_el.length && start_epoch_el.attr('epoch_time') && end_epoch_el.attr('epoch_time')){
                        var start_epoch = start_epoch_el.attr('epoch_time');
                        var end_epoch = end_epoch_el.attr('epoch_time');

                        if(epoch > end_epoch){
                            epoch = end_epoch; 
                            this.stop();
                        }
                        else{
                            BetSell.update_spot(spot);
                            for (var i = 0; i < prices.length; i++) {
                                if (!prices[i] || prices[i].id != 'sell') {
                                    continue;
                                }
                                if (prices[i].err) {
                                    BetSell.show_warning(prices[i].err, true);
                                    BetSell.disable_sell_button('#sell_at_market', true);
                                    no_error = false;
                                } else {
                                    BetSell.clear_warnings();
                                    BetSell.enable_sell_button();
                                }
                                BetSell.update_price(prices[i]);
                                BetSell.update_barriers(bet.barriers);
                            } // for    
                        }
                        BetSell.update_time(epoch);
                        BetSell.update_timer(con,'trade_date_now', epoch-start_epoch);
                        BetSell.update_timer(con,'trade_date_end', end_epoch-epoch);                 
                    }
                },
                url: function(val) {
                    if (val !== undefined) {
                        this._url = val;
                        return this;
                    }
                    return this._url;
                },
            };
        }(), // streaming
        sparkline: function() {
            var _values = [];
            var _length = 30;
            return {
                init:   function(length) {
                    _values = [];
                    if (length) {
                        _length = length;
                    }
                    var container = $(BetSell.container().find('#sell_price_container')[0]);
                    $('#sell_price_sparkline').remove();
                    var spark = $('<div id="sell_price_sparkline"></div>');
                    container.append(spark);
                    spark.show();
                    $('#sell_price_container').on('mouseover', '#sell_price_sparkline canvas', function () { $('#jqstooltip').css('z-index', get_highest_zindex() + 100); });
                },
                update: function(val) {
                    var that = this;
                    _values.push(val);
                    if (_values.length >= _length) {
                        _values.shift();
                    }
                    $('#sell_price_sparkline').sparkline(_values, that._config);
                },
                clear: function() {
                    var that = this;
                    _values = [];
                    $('#sell_price_sparkline').sparkline(_values, that._config);
                },
                _config: {
                    type: 'line',
                    lineColor: '#606060',
                    fillColor: false,
                    spotColor: '#00f000',
                    minSpotColor: '#f00000',
                    maxSpotColor: '#0000f0',
                    highlightSpotColor: '#ffff00',
                    highlightLineColor: '#000000',
                    spotRadius: 1.25
                },
            };
        }(), // sparkline
        create_timer: function (selector, input) { // input in form of obj have year : { value: 0, text: 'text', interval: 1}
            var duration_obj = {};
            var interval = 1;
            var that = this;
            if(input.year && input.year.value > 0) {
                duration_obj['year'] = input.year.value;
                interval = input.year.interval;
            }
            if(input.month && input.month.value > 0) {
                duration_obj['month'] = input.month.value;
                interval = input.month.interval;
            }
            if(input.day && input.day.value > 0) {
                duration_obj['day'] = input.day.value;
                interval = input.day.interval;
            }
            if(input.hour && input.hour.value > 0) {
                duration_obj['hour'] = input.hour.value;
                interval = input.hour.interval;
            }
            if(input.minute && input.minute.value > 0) {
                duration_obj['minute'] = input.minute.value;
                interval = input.minute.interval;
            }
            if(input.second && input.second.value > 0) {
                duration_obj['second'] = input.second.value;
                interval = input.second.interval;
            }

            var duration = moment.duration(duration_obj);
            _timer_interval_obj[Object.keys(_timer_interval_obj).length] = setInterval(function anonymous() {
                    var timestring;
                    var count = 0;

                    if (input['is_negative']) {
                        timestring = '- ';
                        duration = moment.duration(duration.asSeconds() - interval, 'seconds');
                    } else if (input['is_inverse']) {
                        timestring = '';
                        duration = moment.duration(duration.asSeconds() - interval, 'seconds');
                    } else {
                        timestring = '';
                        duration = moment.duration(duration.asSeconds() + interval, 'seconds');
                    }
                    var full_count_days =  Math.floor(duration.asDays());
                    if (full_count_days == 1 && count < 2) {
                        timestring += full_count_days + ' ' + input.day.text + ' ';
                        count++;
                    } else if (full_count_days > 1 && count < 2) {
                        timestring += full_count_days + ' ' + input.day.text_plural + ' ';
                        count++;
                    }
                    if (duration.hours() == 1 && count < 2) {
                        timestring += duration.hours() + ' ' + input.hour.text + ' ';
                        count++;
                    } else if (duration.hours() > 1 && count < 2) {
                        timestring += duration.hours() + ' ' + input.hour.text_plural + ' ';
                        count++;
                    }
                    if (duration.minutes() == 1 && count < 2) {
                        timestring += duration.minutes() + ' ' + input.minute.text + ' ';
                        count++;
                    } else if (duration.minutes() > 1 && count < 2) {
                        timestring += duration.minutes() + ' ' + input.minute.text_plural + ' ';
                        count++;
                    }

                    if (duration.seconds() == 1 && count < 2) {
                        timestring += duration.seconds() + ' ' + input.second.text;
                        count++;
                    } else if (duration.seconds() > 1 && count < 2) {
                        timestring += duration.seconds() + ' ' + input.second.text_plural;
                        count++;
                    } else if (duration.seconds() === 0 && count < 1) {
                        timestring += duration.seconds() + ' ' + input.second.text;
                        count++;
                    }

                    if (count === 0) {
                        that.resubmit_sell_at_market();
                    } else if (full_count_days === 0 && duration.hours() === 0 && duration.minutes() === 0 && duration.seconds() === 0) {
                        selector.html(timestring);
                        that.resubmit_sell_at_market();
                    } else {
                        selector.html(timestring);
                    }
                    return anonymous;
            }(), Math.abs(interval) * 1000);
        },
        create_date_timer: function(selector) {
            var interval = 1;
            var that = this;
            var epoch_time = parseInt(selector.attr('epoch_time')) + 1;
            _timer_interval_obj[Object.keys(_timer_interval_obj).length] = setInterval(function anonymous() {
                epoch_time += interval;
                var date = that.get_date_from_seconds(epoch_time);
                var mom = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
                selector.attr('epoch_time', epoch_time);
                selector.html(mom);
                return anonymous;
            },  Math.abs(interval) * 1000);
        },
        seconds_to_time: function(seconds) {
            var duration = moment.duration(Math.abs(parseInt(seconds)), 'seconds');
            var days, months;
            // as we dont use month in our date format
            if (duration.asDays() > 365) {
                days = duration.days();
                months = duration.months();
            } else {
                days = Math.floor(duration.asDays());
                months = 0;
            }
            var obj = {
                year: duration.years(),
                month: months,
                day: days,
                hour: duration.hours(),
                minute: duration.minutes(),
                second: duration.seconds(),
            };
            obj['is_negative'] = parseInt(seconds) < 0 ? 1 : 0;
            return obj;
        },
        get_date_from_seconds: function(seconds) {
            var date = new Date(seconds*1000);
            return date;
        },
        get_time_interval: function() {
            var time_obj = {};
            var start_time = $('#trade_details_start_date').attr('epoch_time');
            var purchase_time = $('#trade_details_purchase_date').attr('epoch_time');
            var now_time = $('#trade_details_now_date').attr('epoch_time');
            var end_time = $('#trade_details_end_date').attr('epoch_time');
            if(purchase_time) { // forward starting
                time_obj['from_time'] = parseInt(purchase_time);
                time_obj['to_time'] = parseInt(start_time);
            } else if(start_time && now_time) {
                if (now_time > start_time) {
                    if (((parseInt(end_time) - parseInt(start_time)) > 3600) && ((parseInt(now_time) - parseInt(start_time)) < 3600)) {
                        // check if end date is more than 1 hours and now time - start time is less than 1 hours
                        // in this case we switch back to tick chart rather than ohlc
                        time_obj['from_time'] = parseInt(start_time);
                        time_obj['to_time'] = parseInt(start_time) + 3595;
                    } else if ((parseInt(end_time) - parseInt(start_time)) === 3600) {
                        time_obj['from_time'] = parseInt(start_time);
                        time_obj['to_time'] = parseInt(end_time);
                        time_obj['force_tick'] = 1;
                    } else {
                        time_obj['from_time'] = parseInt(start_time);
                        time_obj['to_time'] = parseInt(end_time);
                    }
                }
            } else if (!now_time && start_time && end_time) { // bet has expired
                time_obj['from_time'] = parseInt(start_time);
                time_obj['to_time'] = parseInt(end_time);
            } else {
                time_obj['is_live'] = 1;
            }
            return time_obj;
        },
        add_time_indicators: function(liveChartConfig) {
            var that = this,
                indicator;
            var start_time = $('#trade_details_start_date').attr('epoch_time');
            var purchase_time = $('#trade_details_purchase_date').attr('epoch_time');
            var sold_time = $('#trade_details_sold_date').attr('epoch_time');
            var end_time = $('#trade_details_end_date').attr('epoch_time');
            var entry_spot_time = $('#trade_details_entry_spot_time').attr('epoch_time');
            if(purchase_time) {
                if (liveChartConfig.has_indicator('purchase_time')) {
                    live_chart.remove_indicator('purchase_time');
                }
                indicator = new LiveChartIndicator.Barrier({ name: "purchase_time", label: 'Purchase Time', value: that.get_date_from_seconds(parseInt(purchase_time)), color: '#e98024', axis: 'x'});
                live_chart.add_indicator(indicator);
            }

            if(start_time) {
                if (liveChartConfig.has_indicator('start_time')) {
                    live_chart.remove_indicator('start_time');
                }
                indicator = new LiveChartIndicator.Barrier({ name: "start_time", label: 'Start Time', value: that.get_date_from_seconds(parseInt(start_time)), color: '#e98024', axis: 'x'});
                live_chart.add_indicator(indicator);
            }

            if(entry_spot_time && entry_spot_time != start_time) {
                if (liveChartConfig.has_indicator('entry_spot_time')) {
                    live_chart.remove_indicator('entry_spot_time');
                }

                if (start_time && entry_spot_time < start_time) {
                    indicator = new LiveChartIndicator.Barrier({ name: "entry_spot_time", label: 'Entry Spot', value: that.get_date_from_seconds(parseInt(entry_spot_time)), color: '#e98024', axis: 'x'});
                } else {
                    indicator = new LiveChartIndicator.Barrier({ name: "entry_spot_time", label: 'Entry Spot', value: that.get_date_from_seconds(parseInt(entry_spot_time)), color: '#e98024', axis: 'x', nomargin: true});
                }
                live_chart.add_indicator(indicator);
            }

            if(end_time) {
                if (liveChartConfig.has_indicator('end_time')) {
                    live_chart.remove_indicator('end_time');
                }

                indicator = new LiveChartIndicator.Barrier({ name: "end_time", label: 'End Time', value: that.get_date_from_seconds(parseInt(end_time)), color: '#e98024', axis: 'x'});
                live_chart.add_indicator(indicator);
            }
            if(sold_time) {
                if (liveChartConfig.has_indicator('sold_time')) {
                    live_chart.remove_indicator('sold_time');
                }

                indicator = new LiveChartIndicator.Barrier({ name: "sold_time", label: 'Sell Time', value: that.get_date_from_seconds(parseInt(sold_time)), color: '#e98024', axis: 'x'});
                live_chart.add_indicator(indicator);
            }

        },
        add_overlay: function() {
            var overlay = $('#overlay-wrapper');
            overlay.show();
            overlay.css({
                height: $('#sell_content_container').outerHeight(true) + 'px',
                top: $('#sell_bet_desc').outerHeight() + 'px', // appending pixel because this height is already generated
            });
        },
        show_popup: function(trans_id) {
            var contract_id = (/trading/i).test(window.location.pathname) ? 
                $('div.button button.open_contract_detailsws').attr('contract_id') :
                $('td').filter(function() {return $(this).text() == trans_id;}).parents('tr').find('button.open_contract_detailsws').attr('contract_id');
            this.get_analyse_contract(contract_id);
        },
    }; // BetSell
}();
