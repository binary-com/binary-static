var BetPrice = function() {
    var price_request = null;
    var _buy_response_container = null;
    return {
        deregister: function() {
            $('#content button.buy_bet_button').off('click');
        },
        container: function() {
            return $('#bet_calculation_container');
        },
        price_url: function() {
            var url = BetForm.attributes.form_selector() ? BetForm.attributes.form_selector().action : '';
            if (url) {
                return url;
            } else {
                return '';
            }
        },
        params: function() {
            var params = getFormParams(BetForm.attributes.form_selector());
            params += '&st=' + BetForm.attributes.underlying();
            params += '&expiry=' + BetForm.attributes.duration_string();
            params += '&'+Math.floor(Math.random()*83720);
            params += '&ajax_only=1&price_only=1';
            return params;
        },
        cancel_previous_request: function() {
            if (price_request) {
                price_request.abort();
            }
        },
        get_price: function() {
            var that = this;
            this.cancel_previous_request();
            this.show_loading();
            var url = this.price_url();
            if (url) {
                price_request = $.ajax(ajax_loggedin({
                  url     : url,
                  dataType: 'html',
                  data    : this.params(),
                  success : function(data) { that.price_update(data); },
                })).fail(function ( jqXHR, textStatus ) {
                    that.error_handler();
                });
            } else {
                that.error_handler();
            }
        },
        error_handler: function() {
            this.container().find('div.rbox-lowpad:first').html(text.localize("There was a problem accessing the server."));
            this.streaming.stop();
        },
        price_update: function(data) {
            price_request = null;
            this.deregister();
            var price_container = BetPrice.container().find('div.rbox-lowpad:first');
            price_container.hide().html(data);
            this.on_buy();
            var sendBetUrl = $('#sendBetUrlLink').attr('href');
            if (sendBetUrl){
                page.url.update(sendBetUrl);
            }
            price_container.show();
            BetForm.amount.update_settings();
            this.streaming.start();
        },
        on_buy: function() {
            var that = this;
            $('#content button.buy_bet_button').on('click', function (e) {
                e = e || window.event;
                if (typeof e.preventDefault == 'function') {
                    e.preventDefault();
                }
                BetPrice.order_form.disable_buy_buttons();
                that.hide_buy_buttons();
                var form = $(e.target).parents('form');
                that.buy_bet(form);
                return false;
            }).addClass('unbind_later');
            $('a.spread_250, a.spread_260').on('click', function (e) {
                e = e || window.event;
                if (typeof e.preventDefault == 'function') {
                    e.preventDefault();
                }
                var target = $(e.target);
                var button = target.parents('a[class^="spread"]');
                that.spread.disable(button);
                var form = $(e.target).parents('form');
                that.buy_bet(form);
                return false;
            }).addClass('unbind_later');
        },
        buy_bet: function (form) {
            var that = this;
            var timeout = 60000;

            if(page.client.show_login_if_logout(false)) {
                return;
            }

            // pass the DOM form object wrapped in jQuery form object to getFormParams
            var data = getFormParams(form.get(0)) + '&ajax_only=1';
            $.ajax(ajax_loggedin({
                url     : form.attr('action'),
                type    : 'POST',
                async   : true,
                data    : data,
                timeout : timeout,
                success : function (resp, resp_status, jqXHR) { that.on_buy_bet_success(form, resp, resp_status, jqXHR); },
                error   : function (jqXHR, resp_status, exp) { that.on_buy_bet_error(form, jqXHR, resp_status, exp); },
            }));
            $('.price_box').fadeTo(200, 0.6);
        },
        on_buy_bet_success: function (form, resp, resp_status, jqXHR) {
            var data = {};
            if (typeof resp == 'object') {
               data = resp;
            } else {
                try {
                    data = (JSON && JSON.parse(resp)) || $.parseJSON(resp) || {};
                } catch (e) {
                    var width = this.container().width() || 300; // since the error message could be any size, set the continer size to a good value
                    return;
                }
            }
            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            } else if (data.error) {
                var width = this.container().width(); // since the error message could be any size, set the continer size to a good value
                this.display_buy_error(data.error);
            } else if (data.display) {
                this.display_buy_results(data);
            } else {
                throw new Error("Invalid server response: " + data);
            }
            $('.price_box').fadeTo(0, 1);
            BetPrice.order_form.enable_buy_buttons();
            this.display_buy_buttons();
        },
        on_buy_bet_error: function (form, jqXHR, resp_status, exp) {
            var details = '' + exp;
            if (jqXHR.responseText) {
                details += jqXHR.responseText;
            } else if (document.location.href.match(/^http:/) && (!details || details.match(/access/i))) {
                details += '<ul>Please <a href="' + document.location.href.replace('http://', 'https://') + '">continue browsing using HTTPS secure protocol</a></ul>';
            } else {
                details += text.localize('There was a problem accessing the server during purchase.');
            }
            var width = this.container().width(); // since the error message could be any size, set the continer size to a good value
            this.display_buy_error('<div style="width: ' + width + 'px;"><h3>Error</h3><p>' + details + ' </p></div>', 1);
            $('.price_box').fadeTo(0, 1);
            BetPrice.order_form.enable_buy_buttons();
            this.display_buy_buttons();
        },
        buy_response_container: function () {
            if (!_buy_response_container) {
                var price_container = this.container();
                _buy_response_container = $('<div id="buy_confirm_container" class="trade_confirm_container ajax_response"><a class="close">x</a><div></div></div>');
                _buy_response_container.hide();
                _buy_response_container.height('100%');
                price_container.append(_buy_response_container);
            }
            return _buy_response_container;
        },
        display_buy_results: function (data) {
            var that = this;

            var display_html = data.display;
            var con = this.buy_response_container();
            con.children('div').first().html(display_html);

            if ($('#tick_chart').length > 0) {
                data['show_contract_result'] = 1;
                TickDisplay.initialize(data);
            }

            if ($('#is-digit').data('is-digit')) {
                var start_moment = moment(data.contract_start*1000).utc();
                that.digit.process(start_moment);
            }

            con.show();
            // push_data_layer();
            var _clear_results = function () { that.clear_buy_results(); };
            con.find('a.close').on('click', _clear_results).css('cursor', 'pointer').addClass('unbind_later');
        },
        spread: function() {
            var that = this;
            return {
                reset: function() {
                    if (typeof this._stream !== 'undefined') {
                        this._stream.close();
                        this._stream.onmessage = function() {};
                    }
                },
                validate_change: function(target) {
                    var current = target.attr('value');
                    var new_value = target.val();
                    if (!new_value.toString().match(/^[0-9.]*$/)) {
                        new_value = current;
                    }

                    return new_value;
                },
                disable: function(target) {
                    var that = this;
                    target.unbind('click');
                },
                on_sell: function(form) {
                    var that = this;
                    $('button.close_position').on('click', function (e) {
                        e = e || window.event;
                        if (typeof e.preventDefault == 'function') {
                            e.preventDefault();
                        }
                        var target = $(e.target);
                        BetSell.model.reload_page_on_close($('trading_socket_container') ? false : true);
                        that.spread_con().find('#sell_level').parent().hide();
                        that.sell_bet(target);
                        return false;
                    }).addClass('unbind_later');
                },
                sell_bet: function(target) {
                    var that = this;
                    that.reset();
                    target.attr('disabled','disabled').hide();
                    var form = target.parents('form');
                    var timeout = 60000;

                    if(page.client.show_login_if_logout(false)) {
                        return;
                    }

                    // pass the DOM form object wrapped in jQuery form object to getFormParams
                    var data = getFormParams(form.get(0)) + '&ajax_only=1';
                    $.ajax(ajax_loggedin({
                        url     : form.attr('action'),
                        type    : 'POST',
                        async   : true,
                        data    : data,
                        timeout : timeout,
                        success : function (resp, resp_status, jqXHR) { that.on_sell_success(form, resp, resp_status, jqXHR); },
                        error   : function (jqXHR, resp_status, exp) { that.on_sell_error(form, jqXHR, resp_status, exp); },
                    }));
                    $('.price_box').fadeTo(200, 0.6);
                },
                on_sell_error: function(form, resp, resp_status, jqXHR) {
                    var that = this;

                    if (typeof(resp.error) !== 'undefined') {
                        that.err_con().find('p').text(resp.error);
                        that.err_con().show();
                    }
                },
                on_sell_success: function(form, resp, resp_status, jqXHR) {
                    var that = this;

                    var con = that.spread_con();
                    if (typeof(resp.error) !== 'undefined') {
                        that.err_con().find('p').text(resp.error);
                        that.err_con().show();
                    } else {
                        con.find('#status').addClass('loss').text(text.localize('Closed'));
                        that.paint_it(resp.value.dollar, con.find('#pnl_value').text(resp.value.dollar));
                        con.find('#pnl_point').text(resp.value.point);
                        con.find('#exit_level').text(resp.exit_level).parents('tr').show();
                    }
                },
                paint_it: function(value, target) {
                    var color = value > 0 ? 'profit' : 'loss';
                    $(target).removeClass().addClass(color);
                },
                stream: function(channel) {
                    var that = this;
                    that.on_sell();
                    var url = window.location.protocol + '//' + page.settings.get('streaming_server')+'/push/price/'+channel;
                    that._stream = new EventSource(url, { withCredentials: true });
                    that._stream.onmessage = function(e) {
                        var data = JSON.parse(e.data);
                        var prices = data.prices;
                        var con = that.spread_con();
                        var err_con = that.err_con();
                        for (var i = 0; i < prices.length; i++) {
                            var id = prices[i].id;
                            var level = parseFloat(prices[i].level);

                            if (typeof(prices[i].value) !== 'undefined') {
                                if (prices[i].err !== null) {
                                    con.find('.close_position').hide();
                                    err_con.find('p').text(prices[i].err);
                                    err_con.show();
                                    break;
                                } else {
                                    err_con.hide();
                                    con.find('.close_position').show();
                                    con.find('#sell_level').text(level);
                                    var current_value = that.round(parseFloat(prices[i].value.dollar),2);
                                    that.paint_it(current_value, con.find('#pnl_value').text(current_value));
                                    con.find('#pnl_point').text(prices[i].value.point);
                                }
                            }

                            var higher_stop_level;
                            var lower_stop_level;
                            if (that.stop_loss_level() > that.stop_profit_level()) {
                                higher_stop_level = that.stop_loss_level();
                                lower_stop_level = that.stop_profit_level();
                            } else {
                                lower_stop_level = that.stop_loss_level();
                                higher_stop_level = that.stop_profit_level();
                            }

                            if (level >= higher_stop_level || level <= lower_stop_level) {
                                var sell_button = con.find('.close_position');
                                sell_button.click();
                                break;
                            }
                        }
                    };
                    that._stream.onerror = function() {
                        that._stream.close();
                    };
                },
                err_con: function() {
                    var that = this;
                    return that.spread_con().find('#error_box');
                },
                spread_con: function() {
                    return $('#sell_content_wrapper');
                },
                split_level: function(level) {
                    var that = this;
                    var matches = level.toString().match(/[0-9]+/g);
                    var point_val = matches[0];
                    var cents_val = matches[1] || '00';

                    return {
                        point: point_val,
                        decimal: cents_val,
                    };
                },
                stop_loss_level: function() {
                    var that = this;
                    return parseFloat(that.spread_con().find('#stop_loss_level').text());
                },
                stop_profit_level: function() {
                    var that = this;
                    return parseFloat(that.spread_con().find('#stop_profit_level').text());
                },
                round: function(number,number_after_dec) {
                    var result = Math.round(number * Math.pow(10,number_after_dec)) / Math.pow(10,number_after_dec);
                    result = result.toFixed(number_after_dec);
                    return result;
                },
            };
        }(),
        digit: function() {
            return {
                reset: function() {
                    var $self = this;

                    $self.ev.close();
                    $self.digit_tick_count = 0;
                    $self.applicable_ticks = [];
                    $self.info_for_display = [];
                },
                process: function(start_moment) {
                    var $self = this;

                    $self.digit_tick_count = 0;
                    $self.applicable_ticks = [];
                    $self.info_for_display = [];
                    var symbol = BetForm.attributes.underlying();
                    var how_many_ticks = $('#tick-count').data('count');
                    var stream_url = window.location.protocol + '//' + page.settings.get('streaming_server');
                    stream_url += "/stream/ticks/" + symbol + "/" + start_moment.unix();
                    $self.ev = new EventSource(stream_url, { withCredentials: true });

                    $self.ev.onmessage = function(msg) {
                        var data = JSON.parse(msg.data);
                                if (!(data[0] instanceof Array)) {
                                    data = [ data ];
                                }
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i][0] === 'tick') {
                                        var tick = {
                                            epoch: data[i][1],
                                            quote: data[i][2]
                                        };
                                        if (tick.epoch > start_moment.unix() && $self.digit_tick_count < how_many_ticks) {
                                            // checking for duplicate entries and skip them if they exists
                                            if ($self.applicable_ticks.length > 0) {
                                                var previous_tick_epoch = $self.info_for_display[$self.info_for_display.length-1][1];
                                                if (previous_tick_epoch === tick.epoch) {
                                                    continue;
                                                }
                                            }

                                            $self.applicable_ticks.push(tick.quote);
                                            $self.digit_tick_count++;
                                            $self.info_for_display.push([$self.digit_tick_count,tick.epoch,tick.quote]);
                                            $self.update_display();

                                            if ($('#digit-contract-details').css('display') === 'none') {
                                                $('#digit-contract-details').show();
                                            }
                                        }

                                        if ($self.applicable_ticks.length === how_many_ticks) {
                                            $self.evaluate_digit_outcome();
                                            $self.reset();
                                            break; // need to break the loop else it will keep on processing the extra tick
                                        }
                                    }
                                }
                    };
                    $self.ev.onerror = function() { $self.ev.close(); };
                },
                update_display: function(data) {
                    var $self = this;

                    var ticks_to_display = $self.info_for_display.slice(-5);
                    for (var i=0;i<5;i++) {
                        if (typeof ticks_to_display[i] !== 'undefined') {
                            var tick_number = ticks_to_display[i][0];
                            var tick_time = moment.utc(ticks_to_display[i][1]*1000).format("hh:mm:ss");
                            var tick_string = ticks_to_display[i][2].toString();
                            $('#count-'+i).text('Tick '+tick_number);
                            $('#time-'+i).text(tick_time);
                            var shorten = tick_string.substr(0,tick_string.length-1);
                            var last = tick_string.substr(-1);
                            $('#tick-'+i+' span#latest-shorten').text(shorten);
                            $('#tick-'+i+' span#latest-last').text(last);
                        }
                    }
                },
                evaluate_digit_outcome: function() {
                    var $self = this;

                    var prediction = $('#contract-sentiment').data('contract-sentiment');
                    var client_prediction = $('#client-prediction').data('client-prediction');
                    var last_tick = $self.applicable_ticks[$self.applicable_ticks.length-1];
                    var last_digit = parseInt(last_tick.toString().substr(-1));
                    var potential_payout = parseFloat($('#outcome-payout').data('payout').toString().replace(',',''));
                    var cost = parseFloat($('#outcome-buyprice').data('buyprice').toString().replace(',',''));

                    // buy price
                    $('#contract-outcome-buyprice').text($('#outcome-buyprice').data('buyprice'));

                    var final_price;

                    if (prediction === 'match') {
                        final_price = (last_digit === client_prediction) ? potential_payout : 0;
                    } else if (prediction === 'differ') {
                        final_price = (last_digit !== client_prediction) ? potential_payout : 0;
                    }

                    $('#confirmation_table').hide();
                    $('#contract-outcome-payout').text($self.round(final_price,2));

                    if (final_price !== 0) {
                        $('#bet-confirm-header').text(text.localize('This contract won'));
                        $('#contract-outcome-profit').removeClass('standin').addClass('standout profit').text($self.round(potential_payout - cost,2));
                        $('#digit-contract-details').css('background', 'rgba(46,136,54,0.198039)');
                    } else {
                        $('#bet-confirm-header').text(text.localize('This contract lost'));
                        $('#contract-outcome-label').removeClass('standout profit').addClass('standin loss').text(text.localize('Loss'));
                        $('#contract-outcome-profit').removeClass('standout profit').addClass('standin loss').text($self.round(cost,2));
                        $('#digit-contract-details').css('background', 'rgba(204,0,0,0.098039)');
                    }

                    $('#contract-outcome-details').show();
                },
                round: function(number,number_after_dec) {
                    var result = Math.round(number * Math.pow(10,number_after_dec)) / Math.pow(10,number_after_dec);
                    result = result.toFixed(number_after_dec);
                    return result;
                },
            };
        }(),
        display_buy_error: function (data, extra_info) {
            var that = this;
            var con = this.buy_response_container();
            con.addClass('bet_confirm_error');
            if (extra_info) {
                data += '<p>' + text.localize('Please confirm the trade on your statement before proceeding.') + '</p>';
            }
            data = '<p>' + data + '</p>';
            con.children('div').first().html(data);
            con.show();
            var _clear_results = function () { that.clear_buy_results(); };
            con.find('a.close').on('click', _clear_results).css('cursor', 'pointer').addClass('unbind_later');
        },
        clear_buy_results: function () {
            var con = this.buy_response_container();
            if ($('#tick_chart').length > 0) {
                TickDisplay.reset();
            }

            if ($('#is-digit').data('is-digit')) {
                this.digit.reset();
            }

            if ($('a[class^=spread]').length > 0) {
                this.spread.reset();
            }

            con.hide().remove();
            _buy_response_container = null;
        },
        hide_buy_buttons: function() {
            this.deregister();
            this.order_form.hide_buy_button();
        },
        display_buy_buttons: function() {
            this.on_buy();
            this.order_form.show_buy_button();
        },
        show_loading: function() {
            var image_link = page.settings.get('image_link');
            var loading_html = '<p id="loading-price">'+text.localize('loading...')+'<br /><img src="'+image_link['hourglass']+'" /></p>';
            this.container().find('div.rbox-lowpad:first').show().html('<div class="rbox rbox-bg-alt"><div class="rbox-wrap"><div class="rbox-content">'+loading_html+'</div></div><span class="tl">&nbsp;</span><span class="tr">&nbsp;</span><span class="bl">&nbsp;</span><span class="br">&nbsp;</span></div></div>');
            this.container().show();
        },
        streaming: function() {
            var price_stream = null;
            var update_from_stream = false;
            return {
                start: function() {
                    BetForm.spot.clear_sparkline();
                    this.stop();
                    update_from_stream = true;
                    var stream_channel = this.stream_channel();
                    var url = window.location.protocol + '//' + page.settings.get('streaming_server')+'/push/price/'+stream_channel;
                    if(url && typeof (EventSource) !== "undefined") {
                        price_stream = new EventSource(url, { retry: 18000000 });
                        var that = this;
                        price_stream.onmessage = function(e) {
                            that.process_message(e.data);
                        };
                        price_stream.addEventListener("ping", function(e) { return true; });
                    } else {
                        $('#spot_spark').html("<span title=\"" + text.localize("We are not able to stream live prices at the moment. To enjoy live streaming of prices try refreshing the page, if you get this issue after repeated attempts try a different browser") + "\">" + text.localize("No Live price update") + "</span>");
                    }
                },
                stop: function() {
                    if (price_stream !== null) {
                        price_stream.close();
                        price_stream = null;
                    }
                },
                ignore_updates: function() {
                    update_from_stream = false;
                },
                stream_channel: function() {
                    return $('#stream_channel').html();
                },
                process_message: function(data) {
                    if(data == 'stop_bet') {
                        BetPrice.order_form.hide_buy_button();
                    } else {
                        BetPrice.order_form.show_buy_button();
                    }

                    if(update_from_stream) {
                        var bet = JSON.parse(data);
                        BetForm.spot.update(bet.spot);
                        BetPrice.order_form.update_from_stream(bet);
                    }
                },
            };
        }(),
        order_form: function() {
            return {
                forms: function() {
                    return $('form[name=orderform]');
                },
                form_by_id: function(id) {
                    return $('#orderform_' + id);
                },
                verify_display_id: function(id) {
                    var display_id = $('input[name="display_id"]', this.form_by_id(id));
                    return (display_id && display_id.val() == id);
                },
                hide_buy_button: function() {
                    return $('button[name^="btn_buybet"]').parent().hide();
                },
                show_buy_button: function() {
                    return $('button[name^="btn_buybet"]').parent().show();
                },
                disable_buy_buttons: function() {
                    $('button[name^="btn_buybet"]').attr('disabled','disabled');
                },
                enable_buy_buttons: function() {
                    $('a[id^="spread"]').removeAttr('disabled');
                    $('button[name^="btn_buybet"]').removeAttr('disabled');
                },
                update_from_stream: function(stream) {
                    var type = stream.type;
                    if (type === 'spread') {
                        this.update_spread_ui(stream.prices);
                    } else if (type === 'price') {
                        var prices = this.prices_from_stream(stream.prices);
                        this.update_form(prices);
                        this.update_ui(prices);
                    }
                },
                update: function(prices) {
                    prices = typeof prices !== 'undefined' ? prices : this.prices_from_form();
                    this.update_form(prices);
                    this.update_ui(prices);
                },
                prices_from_stream: function(stream) {
                    var prices = [];
                    for (var i = 0; i < stream.length; i++) {
                        var id = stream[i].id || undefined;
                        var prob = stream[i].value || undefined;
                        if (!id || prob === undefined) {
                            continue;
                        }
                        prices.push(this.calculate_price(id, prob, stream[i].err));
                    }

                    return prices;
                },
                prices_from_form: function () {
                    var prices = [],
                        order_forms = $('.orderform'),
                        order_forms_count = order_forms ? order_forms.length : 0,
                        i,
                        id,
                        prob,
                        error;
                    if (order_forms_count > 0 ) {
                        for (i = 0; i < order_forms_count; i++) {
                            id = $('input[name="display_id"]', form).val();
                            prob = $('input[name="prob"]', form).val();
                            var form = $(order_forms[i]),
                                error_box_html = form.parent().parent().parents().siblings(".bet-error-box").html();
                            // We handle payout messages locally and after recalculation
                            if (error_box_html.length > 0 &&
                                error_box_html != BetForm.amount.payout_err &&
                                error_box_html != BetForm.amount.stake_err) {
                                error = error_box_html;
                            }
                            prices.push(this.calculate_price(id, prob, error));
                        }
                    } else {
                        var error_boxes = $('#bet_calculation_container').find('.bet-error-box');
                        var count = error_boxes.length;
                        for (i = 0; i < count; i++) {
                            var error_box = $(error_boxes[i]);
                            id = error_box.find('#error_display_id').val();
                            if(!id) {
                                continue;
                            }
                            prob = error_box.find('#error_probability_' + id).val();
                            error = undefined;
                            if(error_box.html().length > 0) {
                                error = error_box.html();
                            }
                            prices.push(this.calculate_price(id, prob, error));
                        }
                    }
                    return prices;
                },
                calculate_price: function(id, prob, error) {
                    var form = this.form_by_id(id);
                    var amount = BetForm.amount.calculation_value;
                    var price;
                    var payout;
                    var profit;
                    var roi;
                    if(BetForm.attributes.is_amount_stake()) {
                        payout = this.virgule_amount(Math.round((amount / prob) * 100));
                        price = this.virgule_amount(amount * 100);
                    } else if(BetForm.attributes.is_amount_payout()) {
                        price = this.virgule_amount(Math.round((amount * prob) * 100));
                        payout = this.virgule_amount(amount * 100);
                    }

                    var prev_price = $('input[name="price"]', form).length ? parseFloat($('input[name="price"]', form).val()) : 0;
                    var prev_payout = $('input[name="payout"]', form).length ? parseFloat($('input[name="payout"]', form).val()) : 0;

                    if (payout && price) {
                        profit =  this.virgule_amount(payout.raw - price.raw);
                        roi = Math.round(profit.raw / price.raw * 100);
                    } else {
                        profit = this.virgule_amount(0);
                        roi = this.virgule_amount(0);
                    }

                    payout = payout ? payout : this.virgule_amount(0);
                    price = price ? price : this.virgule_amount(0);

                    return {
                        type: 'price',
                        id: id,
                        prob: prob,
                        err: error,
                        price: price,
                        payout: payout,
                        profit: profit,
                        roi: roi,
                        prev_price: this.virgule_amount(prev_price * 100),
                        prev_payout: this.virgule_amount(prev_payout * 100)
                    };
                },
                update_form: function(prices) {
                    for (var i = 0; i < prices.length; i++) {
                        var form = this.form_by_id(prices[i].id);
                        $('input[name="prob"]', form).val(prices[i].prob);
                        $('input[name="price"]', form).val(prices[i].price.raw/100);
                        $('input[name="payout"]', form).val(prices[i].payout.raw/100);
                        $('input[name="amount_type"]', form).val(BetForm.attributes.amount_type());
                    }
                },
                update_ui: function(prices) {
                    for (var i = 0; i < prices.length; i++) {
                        var form = this.form_by_id(prices[i].id);
                        var err = prices[i].err;
                        var bf_amount = BetForm.amount;
                        var epsilon = 0.001; // Outside the visible range of a price.
                        // We're intentionally making payout errors have highest priority
                        // it's something they can fix immediately on this web interface.

                        if (prices[i].payout.raw/100  - epsilon > bf_amount.payout_max ||
                            prices[i].payout.raw/100 + epsilon < bf_amount.payout_min) {
                            err = bf_amount.payout_err;
                        } else if (prices[i].price.raw/100 - epsilon > bf_amount.stake_max ||
                            prices[i].price.raw/100 + epsilon < bf_amount.stake_min) {
                            // You probably think there should be two conditions above, but too high stake just
                            // makes for "too high payout" or "no return" errors.
                            err = bf_amount.stake_err;
                        }
                        this.show_error(form, err);
                        this.update_price(prices[i].id, prices[i].price, prices[i].prev_price);
                        this.update_description(prices[i].id, prices[i].payout, prices[i].prev_payout);
                        this.update_profit_roi(prices[i].id, prices[i].profit, prices[i].roi);
                    }
                },
                update_spread_ui: function(spread) {
                    var that = this;

                    for (var i = 0; i < spread.length; i++) {
                        var id = spread[i].id;
                        var level = spread[i].level;
                        var chunks = BetPrice.spread.split_level(level);

                        var con = $('.spread_'+id);
                        con.find('.spread_point_' + id).text(chunks.point);
                        con.find('.spread_decimal_' + id).text('.'+chunks.decimal);
                    }
                },
                update_price: function(id, price, old_price) {
                    var units_box = $('#units_for_' + id);
                    var cents_box = $('#cents_for_' + id);
                    var amount_box = $('#amount_for_' + id);

                    price_moved(amount_box, old_price.raw, price.raw);

                    units_box.text(price.units);
                    cents_box.text(price.cents);
                },
                update_description: function(id, payout, old_payout) {
                    $('#amount_for_' + id).siblings('.bet_description').each(function () {
                            var elm = $(this);
                            if (elm) {
                                var desc = elm.text();
                                if (desc) {
                                    desc = desc.trim();
                                    if(/^([A-Z]{3}) [\d+,]*\d+\.\d+/.test(desc)) {
                                        desc = desc.replace(/[\d+,]*\d+\.\d+/, payout.value);
                                        elm.text(desc);
                                    }
                                }
                            }
                    });
                },
                update_profit_roi: function(id, profit, roi) {
                    $("#id_" + id + "_profit").text(profit.value);
                    $("#id_" + id + "_roi").text(roi);
                },
                show_error: function(form, error) {
                    var buy_button= form.parent();
                    var error_box = buy_button.parents().siblings(".bet-error-box");
                    if (!error) {
                        error_box.hide();
                        buy_button.show();
                    } else {
                        error_box.html(error);
                        error_box.show();
                        buy_button.hide();
                    }
                },
                virgule_amount: function (big_amount) {
                    var amount_string = big_amount.toFixed(0).toString();

                    while (amount_string.length < 3)  {
                        amount_string = '0' + amount_string;
                    }

                    var amount_break = amount_string.length - 2;

                    var units =  virgule(amount_string.substr(0, amount_break));
                    var cents =  '.' + amount_string.substr(amount_break);

                    return {
                        units: units,
                        cents: cents,
                        value: units + cents,
                        raw: big_amount
                    };
                },
            };
        }(),
    };
}();
