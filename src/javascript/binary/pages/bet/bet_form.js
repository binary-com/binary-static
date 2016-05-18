var BetForm = function () {
    return {
        init: function() {
            this.time = (typeof this.time === 'undefined') ? new BetForm.Time() : this.time;
            this.barriers = (typeof this.barriers === 'undefined') ? new BetForm.Barriers() : this.barriers;
            this.actions.init();
            this.actions.register();
        },
        unregister_actions: function() {
            this.actions.unregister();
        },
        restore: function () {
            var bet_type_tab = this.attributes.model.form_name();

            showLoadingImage($('#betInputBox'));
            MenuContent.trigger({
                'tab_id': bet_type_tab
            });
        },
        update_content: function (data, event) {
            var betInputBox = $('#betInputBox');
            betInputBox.get(0).innerHTML = '<div class="toggle-content">' + data + '</div>';
        },
        bom_gmt_time: function() {
            return moment.utc(page.header.time_now);
        },
        error_message: function () {
            BetPrice.error_handler();
        },
        actions: function() {
            var tab_change_registered = false;
            var betform_request = null;
            return {
                init: function() {
                    this.on_bet_type_change();
                },
                register: function() {
                    $(BetForm.spot).on('change', function(event, spot) {
                        BetForm.barriers.spot_changed(spot);
                    });

                    $(BetForm.time).on('change', function(event, time) {
                        SessionStore.remove('live_chart_duration');
                        BetForm.barriers.time_changed(time);
                        BetPrice.container().hide();
                    });


                    $(BetForm.barriers).on('change', function(event, barrier) {
                        BetPrice.container().hide();
                        BetAnalysis.tab_live_chart.render();
                    });


                    var that = this;

                    var when_enter_pressed = function() {
                        //This is required to avoid key bounce causing 3 different enter pressed event
                        if(!that.propagating_enter_pressed) {
                            that.propagating_enter_pressed = setInterval(function(){
                                BetPrice.get_price();
                                clearInterval(that.propagating_enter_pressed);
                                that.propagating_enter_pressed = undefined;
                            }, 100);
                        }
                    };

                    BetForm.attributes.form().on('keydown', function(e) {
                        if(e.which == 13) {
                            when_enter_pressed();
                        }
                    });

                    $(BetForm.time).on('enter_pressed', when_enter_pressed);
                },
                unregister: function() {
                    BetForm.attributes.form().off('keydown');
                    $('#bet_underlying').off('change');
                    $('#submarket').off('change');
                    $('#bet_currency').off('change');
                    $('#atleast').off('change');
                    $(BetForm.spot).off('change');
                    $(BetForm.time).off('change');
                    $(BetForm.time).off('enter_pressed');
                    $(BetForm.barriers).off('change');

                    BetForm.time.unregister();
                    BetForm.barriers.unregister();
                    BetForm.attributes.form().off('submit');
                },
                on_bet_type_change: function() {
                    var that = this;
                    if(tab_change_registered) {
                        return;
                    }

                    tab_change_registered = true;
                    MenuContent.listen_click(function (info) {
                        if (info.menu.attr('id') == 'betsTab') {
                            if(BetForm.attributes.model.form_name() != info.id) {
                                BetForm.attributes.model.form_name(info.id);
                                //If we are already seeing a form, i.e. we are switching forms
                                if(typeof BetForm.attributes.form_name() !== "undefined") {
                                    page.url.invalidate();
                                }
                            }
                            that.get_form_by_name(info.id);
                            BetAnalysis.bet_type_changed();
                        }
                    });
                },
                get_form_by_name: function(form_name) {
                    if(betform_request) {
                        betform_request.abort();
                    }

                    var that = this;
                    betform_request = $.ajax({
                            url     : this.form_url(form_name),
                            success : function (data) {
                                    that.unregister();
                                    BetForm.update_content(data);
                                    betform_request = null;
                                    BetForm.underlying_drop_down.init();
                                    BetForm.attributes.restore.all();
                                    that.on_form_load();
                                },
                    }).fail( function ( jqXHR, textStatus ) {
                        BetForm.error_message();
                    });
                },
                get_form_by_underlying: function (underlying) {
                    if(betform_request) {
                        betform_request.abort();
                    }

                    var that = this;
                    betform_request = $.ajax({
                        url     : this.form_url('', underlying),
                        success : function (data) {
                            that.unregister();
                            BetForm.update_content(data);
                            betform_request = null;
                            BetForm.underlying_drop_down.init();
                            BetForm.attributes.restore.all_but_underlying();
                            that.on_form_load();
                        }
                    }).fail( function ( jqXHR, textStatus ) {
                        BetForm.error_message();
                    });
                },
                on_form_load: function() {
                    this.correct_selected_tab();
                    BetPrice.clear_buy_results();
                    BetForm.time.init();
                    BetForm.barriers.init();

                    BetForm.amount.update_calculation_value();

                    this.show_or_hide_analysis_tabs();

                    this.on_form_submit();
                    this.on_underlying_change();
                    this.on_submarket_change();
                    this.on_amount_change();
                    this.on_amount_type_change();
                    this.on_other_input_change();

                    $('#bet_calculate').focus(); //Focus on the Get Prices button.
                    this.hide_sub_trade();

                    this.register();
                    if(!BetForm.attributes.no_bets()) {
                        BetPrice.get_price();
                    }
                    BetAnalysis.restore();
                },
                hide_sub_trade: function () {
                    var sub_trade_menu = $('#betsTab').children().find('.tm-ul-2');
                    var len = sub_trade_menu.length;
                    for (var i=0; i<len; i++) {
                        var sub_menu_child = sub_trade_menu.eq(i).children();
                        if(sub_menu_child.length == 1) {
                            sub_menu_child.hide();
                        }
                    }
                },
                on_underlying_change: function () {
                    var that = this;
                    if (MenuContent.is_tab_selected($('#tab_graph')) && document.getElementById('underlying')) {
                        setUnderlyingTime();
                    }
                    $('#bet_underlying').on('change', function (event) {
                        BetForm.attributes.model.underlying($(this).val());
                        that.update_for_underlying($(this).val());
                    }).addClass('unbind_later');
                },
                on_submarket_change: function () {
                    var that = this;
                    $('#submarket').on('change', function (event) {
                        BetForm.attributes.model.submarket(this.value);
                        BetForm.underlying_drop_down.update_for_submarket(this.value);
                        //If Underlying Changed because of submarket
                        if (BetForm.attributes.model.underlying() != BetForm.attributes.underlying()) {
                            BetForm.attributes.model.underlying(BetForm.attributes.underlying());
                            that.update_for_underlying(BetForm.attributes.underlying());
                        }
                    }).addClass('unbind_later');
                },
                update_for_underlying: function (underlying_symbol) {
                    BetPrice.streaming.stop();
                    BetForm.spot.clear();
                    this.get_form_by_underlying(underlying_symbol);
                    BetAnalysis.underlying_changed();
                },
                on_other_input_change: function () {
                    $('#bet_currency').on('change', function (event) {
                        BetForm.attributes.model.currency(this.value);
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                    $('#atleast').on('change', function () {
                        var selected = this.value;
                        BetForm.attributes.model.start_time(selected);
                        BetForm.time.update_for_start_time_change();
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                    $('#stop_type').on('change', function (e) {
                        var selected = $(this).val();
                        $('#stop_type_2').val(selected);
                        BetForm.attributes.model.stop_type(selected);
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                    $('#stop_profit').on('change', function (e) {
                        var target = $(this);
                        var selected = BetPrice.spread.validate_change(target);
                        target.val(selected);
                        BetForm.attributes.model.stop_profit(selected);
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                    $('#stop_loss').on('change', function (e) {
                        var target = $(this);
                        var selected = BetPrice.spread.validate_change(target);
                        target.val(selected);
                        BetForm.attributes.model.stop_loss(selected);
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                    $('#amount_per_point').on('change', function (e) {
                        var target = $(this);
                        var selected = BetPrice.spread.validate_change(target);
                        target.val(selected);
                        BetForm.attributes.model.amount_per_point(selected);
                        $('#bet_calculation_container').hide();
                    }).addClass('unbind_later');
                },
                on_form_submit: function() {
                    BetForm.attributes.form().on('submit', function (event) {
                        event.preventDefault();
                        BetPrice.clear_buy_results();
                        BetPrice.get_price();
                    }).addClass('unbind_later');
                },
                show_or_hide_analysis_tabs: function() {
                    var analysis_tab = BetForm.attributes.extratab();
                    if(analysis_tab == 'last_digit') {
                        // We should show exactly one of these
                        $('#tab_last_digit').removeClass("invisible");
                    } else {
                        // Hide them all if none selected
                        MenuContent.hide_tab($('#tab_last_digit'));
                        MenuContent.trigger({'tab_id': 'tab_explanation'});
                    }
                },
                on_amount_change: function() {
                    BetPrice.clear_buy_results();
                    $('input#amount', BetForm.attributes.form_selector()).on('keyup', BetForm.amount.keyup).addClass('unbind_later');
                    $('input#amount', BetForm.attributes.form_selector()).on('change', BetForm.amount.lost_focus).addClass('unbind_later');
                },
                on_amount_type_change: function() {
                    //Force recalculate minimumss and update price boxes
                    $('#amount_type').on('change', function() {
                        BetForm.amount.lost_focus();
                        BetForm.attributes.model.amount_type(this.value);
                    }).addClass('unbind_later');
                },
                correct_selected_tab: function() {
                    //Wrong tab selected? Select the right one.
                    //Whe wrong tab? Caching, we build the frame before we build the form and sometimes there is no formname attribute in the url.
                    var form_name = BetForm.attributes.form_name();
                    if($('#bets_tab_' + form_name).length > 0 && $('#bets_tab_' + form_name + '.active.tm-li').length === 0) {
                        $('#betsTab .active.tm-li').removeClass('active');
                        $('#bets_tab_' + form_name + '.tm-li').addClass('active');
                    }
                },
                form_url: function (form_name, underlying_symbol) {
                    var params = 'controller_action=bet_form';
                    var market = BetForm.attributes.model.market();
                    if(market != 'null') {
                        params += '&market=' + market;
                    }

                    form_name = form_name ? form_name : BetForm.attributes.model.form_name();
                    if (form_name) {
                        params += '&form_name=' + form_name;
                    }


                    underlying_symbol = underlying_symbol || BetForm.attributes.model.underlying();
                    if (underlying_symbol && markets.by_symbol(underlying_symbol).market.name == market) {
                        params += '&underlying_symbol=' + underlying_symbol;
                    }

                    var time = BetForm.attributes.model.time();
                    if(time) {
                        params += '&time=' + time;
                    }

                    var barrier_1 = BetForm.attributes.model.barrier_1();
                    if(barrier_1) {
                        params += '&H=' + barrier_1;
                    }

                    var barrier_2 = BetForm.attributes.model.barrier_2();
                    if(barrier_2) {
                        params += '&L=' + barrier_2;
                    }

                    var date_start = BetForm.attributes.model.start_time();
                    if(date_start) {
                        params += '&date_start=' + date_start;
                    }

                    var type = page.url.param_if_valid('type');
                    if(type) {
                        params += '&type=' + type;
                    }

                    var expiry_type = BetForm.attributes.model.expiry_type();
                    if (expiry_type) {
                        params += '&expiry_type=' + expiry_type;
                    }

                    var stop_profit = BetForm.attributes.model.stop_profit();
                    if (stop_profit) {
                        params += '&stop_profit=' + stop_profit;
                    }

                    var stop_loss = BetForm.attributes.model.stop_loss();
                    if (stop_loss) {
                        params += '&stop_loss=' + stop_loss;
                    }

                    var amount_per_point = BetForm.attributes.model.amount_per_point();
                    if (amount_per_point) {
                        params += '&amount_per_point=' + amount_per_point;
                    }

                    return page.url.url_for('trade_get.cgi', params);
               },
                disable: function (elements) {
                    var form_ = $(BetForm.attributes.form_selector());
                    form_.find('input[type="submit"]').each(function () {this.disabled = true;});
                    form_.find('button[type="submit"]').each(function () {this.disabled = true;});
                    if (elements) {
                        form_.find('input').each(function () {this.disabled = true;});
                        form_.find('select').each(function () {this.disabled = true;});
                        form_.find('textarea').each(function () {this.disabled = true;});
                        form_.find('button').each(function () {this.disabled = true;});
                    }
                },
                enable: function (elements) {
                    var form_ = $(BetForm.attributes.form_selector());
                    form_.find('input[type="submit"]').each(function () {this.disabled = false;});
                    form_.find('button[type="submit"]').each(function () {this.disabled = false;});
                    if (elements) {
                        form_.find('input').each(function () {this.disabled = false;});
                        form_.find('select').each(function () {this.disabled = false;});
                        form_.find('textarea').each(function () {this.disabled = false;});
                        form_.find('button').each(function () {this.disabled = false;});
                    }
                },
            };
        }(),
        spot: function() {
            var spots = [];
            return {
                update: function(spot) {
                    spots.push(spot);
                    if (spots.length >= 30) {
                        spots.shift();
                    }

                    this.show_spot(spot);
                    $('#spot_spark').sparkline(spots, this.spark_line_config);

                    $(this).trigger('change', [ spot ]);
                },
                show_spot: function(spot) {
                    var spot_container = $('#spot');
                    if(spot && parseFloat(spot) == spot) {
                        var pre_spot = spot;

                        var pre_spot_text = spot_container.text();
                        if (pre_spot_text) {
                            pre_spot = parseFloat(pre_spot_text);
                        }

                        price_moved(spot_container, pre_spot, spot);
                    }
                    spot_container.html(spot);
                },
                clear: function() {
                    this.clear_sparkline();
                    this.show_spot('');
                },
                clear_sparkline: function () {
                    spots = [];
                    $('#spot_spark').sparkline(spots, this.spark_line_config);
                },
                value: function() {
                    return parseFloat(spots[spots.length - 1]);
                },
                spark_line_config: {
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
        }(),
        underlying_drop_down: function() {
            var underlyings_info = [];
            return {
                init: function() {
                    underlyings_info = [];
                    $('#bet_underlying > option').each(function(){
                        var underlying = {};
                        underlying.className = $(this).attr('class');
                        underlying.value = $(this).val();
                        underlying.label = $(this).text();
                        underlyings_info.push(underlying);
                    });
                },
                has: function(underlying_symbol) {
                    for ( var index in underlyings_info ) {
                        if(underlyings_info[index].value == underlying_symbol) {
                            return true;
                        }
                    }

                    return false;
                },
                update_for_submarket: function (submarket) {
                    var index;

                    if (submarket) {
                        var old_value = $('#bet_underlying').val();
                        this.clear();
                        if ( submarket == 'all' ) {
                            var len = underlyings_info.length;
                            for ( index = 0; index < len; index++ ) {
                                this.add(underlyings_info[index]);
                            }
                        } else {
                            var regex_sub_market = new RegExp('\\b'+submarket+'\\b');
                            for ( index in underlyings_info ) {
                                if ( regex_sub_market.test(underlyings_info[index].className) ) {
                                    this.add(underlyings_info[index]);
                                }
                            }
                        }

                        //If nothing was selected try to select the default from backend.
                        if($('#bet_underlying').val() === null) {
                            $('#bet_underlying').val(old_value);
                        }
                    }

                    //If nothing was sent selected by the backend then select the first one.
                    if($('#bet_underlying').val() === null) {
                        $('#bet_underlying').val($('#bet_underlying option:eq(0)').val());
                    }
                },
                clear: function() {
                    $('#bet_underlying option').remove();
                },
                add: function(underlying_info) {
                    var option = this.create_option(underlying_info);
                    var drop_down = document.getElementById("bet_underlying");
                    try {
                        // for IE version less than 8
                        drop_down.add(option, drop_down.options[null]);
                    } catch (e) {
                        drop_down.add(option, null);
                    }
                },
                create_option: function(underlying_info) {
                    var selected_underlying = BetForm.attributes.model.underlying();
                    var option = document.createElement("option");

                    option.className = underlying_info.className;
                    option.value = underlying_info.value;

                    if ( selected_underlying && selected_underlying == underlying_info.value) {
                        option.selected = "selected";
                    }

                    option.text = underlying_info.label;

                    return option;
                }
            };
        }(),
        amount: function() {
            return {
                payout_max:    100000,
                stake_min:    0.5,
                error:    undefined,
                calculation_value: undefined,
                keyup: function(event) {
                    var me = BetForm.amount;
                    me.update_calculation_value();
                    BetForm.attributes.model.amount(me.calculation_value);
                    BetPrice.order_form.update();
                    //No need to panic unless the user actually entered a ','(188).
                    if(event.keyCode == 188) {
                        var amount = $(this).val();
                        $(this).val(amount.replace(',', '.'));
                    }
                },
                lost_focus: function(event) {
                    var me = BetForm.amount;
                    me.update_calculation_value();
                    BetForm.attributes.model.amount(me.calculation_value);
                    BetPrice.order_form.update();
                    $('#amount').val(me.calculation_value);
                },
                update_calculation_value: function() {
                    var amount = BetForm.attributes.amount();
                    if ( this.valid(amount) ) {
                        this.calculation_value = amount;
                    }
                },
                valid: function(amount) {
                    if (isNaN(amount)) {
                        return false;
                    }
                    return true;
                },
                update_settings: function() {
                    this.stake_min = parseFloat($('#staking_context #stake_min').html());
                    this.payout_max = parseFloat($('#staking_context #payout_max').html());
                    this.error = $('#staking_context #error').html();
                },
            };
        }(),
    };
}();
