var trade_contract_back = function () {
    $('#find_another_contract').on('click', function (e) {
        if (page.url.history_supported) {
            e.preventDefault();
            window.history.back();
        }
    }).addClass('unbind_later');
};

var toggleStreaming = function() {
   if (document.hidden || document.webkitHidden) {
       BetForm.spot.clear();
       BetPrice.streaming.stop();
       BetPrice.order_form.hide_buy_button();
   } else {
       BetPrice.streaming.start();
   }
};

pjax_config_page('/trade.cgi', function() {
    return {
        onLoad: function() {
            trade_contract_back();
            BetForm.init();
            BetAnalysis.register_actions();
            BetForm.restore();
            if (typeof document.webkitHidden !== 'undefined') {
                if (document.addEventListener) {
                    document.addEventListener("webkitvisibilitychange", toggleStreaming, false);
                }
            } else if (typeof document.hidden !== 'undefined') {
                if (document.addEventListener) {
                    document.addEventListener("visibilitychange", toggleStreaming);
                }
            }

        },
        onUnload: function() {
            BetForm.unregister_actions();
            BetPrice.deregister();
            BetPrice.clear_buy_results();
            BetPrice.streaming.stop();
            BetAnalysis.reset();
            if (typeof document.webkitHidden !== 'undefined') {
                document.removeEventListener("webkitvisibilitychange", toggleStreaming);
            } else if (typeof document.hidden !== 'undefined') {
                document.removeEventListener("visibilitychange", toggleStreaming);
            }
        }
    };
});

pjax_config_page('rise_fall_table', function() {
    var duration_amount;
    var duration_unit;
    return {
        onLoad: function() {
            var trading_time = new BetForm.TradingTime();
            var duration = new BetForm.Time.Duration(trading_time);
            trading_time.init();
            //Perform as if we are pricing R_100 bets.
            trading_time.underlying = function() {
                return 'R_100';
            };

            var selected_duration;
            //We dont want to read/pollute our betform durations.
            trading_time.value = function(value) {
                if(value) {
                    selected_duration = value;
                }

                if(!selected_duration) {
                    var duration = page.url.param('duration_amount');
                    var units = page.url.param('duration_units');
                    if(typeof duration_amount === 'undefined' || typeof duration_amount === 'undefined') {
                        var min_unit = this.min_unit();
                        duration = min_unit.min;
                        unit = min_unit.units;
                    }

                    selected_duration = duration + unit;
                }

                return selected_duration;
            };

            duration.init();
            duration.register();
            duration.update_ui();

            $('#atleast').on('change', function () {
                duration.update_units_select();
                duration.update_ui();
            }).addClass('unbind_later');

            $('#rise_fall_calculate').on('click', function (event) {
                event.preventDefault();
                var calculate_button = this;
                $(this).hide();
                $('#rise_fall_calculating').show();
                var form = $('form[name=rise_fall]').get(0);
                var url = page.url.url_for('resources/rise_fall_table', getFormParams(form));
                $('#rise_fall_prices_div').html('');
                $.ajax({
                    url: url,
                    data: {
                            ajax_only: 1,
                            prices_only:  1,
                        },
                }).done(function(response) {
                    $('#rise_fall_prices_div').html(response);
                    page.url.update(url);
                    $('#rise_fall_calculating').hide();
                    $('#rise_fall_calculate').show();
                });
            }).addClass('unbind_later');
        },
    };
});

pjax_config_page('portfolio|trade.cgi|statement|f_manager_statement|f_manager_history|f_profit_table|profit_table|trading', function() {
    return {
        onLoad: function() {
            BetSell.register();
        },
        onUnload: function() {
            BetSell.cleanup();
        }
    };
});

pjax_config_page('chart_application', function () {
    return {
        onLoad: function () {
            load_chart_app();
        }
    };
});

pjax_config_page('trading', function () {
    return {
        onLoad: function () {
            TradingEvents.init();
            Content.populate();
            TradeSocket.init();
            Symbols.getSymbols(1);
            if (document.getElementById('websocket_form')) {
                addEventListenerForm();
            }
        },
        onUnload: function() {
            TradeSocket.setClosedFlag(true);
            TradeSocket.close();
        }
    };
});
