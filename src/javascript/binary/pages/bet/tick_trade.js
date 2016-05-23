var TickDisplay = function() {
    return {
        reset: function() {
            var $self = this;
            $self.contract_barrier = null;
            $self.applicable_ticks = [];
            $self.number_of_ticks = null;
            $self.ev.close();
            $self.chart.destroy();
        },
        initialize: function(data) {
            var $self = this;

            // setting up globals
            $self.number_of_ticks = parseInt(data.number_of_ticks);
            $self.symbol = data.symbol;
            $self.display_symbol = data.display_symbol;
            $self.contract_start_ms = parseInt(data.contract_start * 1000);
            $self.contract_category = data.contract_category;
            $self.set_barrier = ($self.contract_category.match('digits')) ? false : true;
            $self.display_decimals = data.display_decimals || 2;
            $self.show_contract_result = data.show_contract_result;
            var tick_frequency = 5;

            if (data.show_contract_result) {
                $self.contract_sentiment = data.contract_sentiment;
                $self.price = parseFloat(data.price);
                $self.payout = parseFloat(data.payout);
            }

            var minimize = data.show_contract_result;

            $self.set_x_indicators();
            $self.initialize_chart({
                plot_from: data.previous_tick_epoch * 1000,
                plot_to: new Date((parseInt(data.contract_start) + parseInt(($self.number_of_ticks+2)*tick_frequency)) * 1000).getTime(),
                minimize: minimize,
                width: data.width ? data.width : undefined
            });
        },
        set_x_indicators: function() {
            var $self = this;

            var exit_tick_index = $self.number_of_ticks - 1;
            if ($self.contract_category.match('asian')) {
                $self.ticks_needed = $self.number_of_ticks;
                $self.x_indicators = {
                    '_0': { label: 'Entry Spot', id: 'start_tick'},
                };
                $self.x_indicators['_' + exit_tick_index] = {
                    label: 'Exit Spot',
                    id: 'exit_tick',
                };
            } else if ($self.contract_category.match('callput')) {
                $self.ticks_needed = $self.number_of_ticks + 1;
                $self.x_indicators = {
                    '_0': { label: 'Entry Spot', id: 'entry_tick'},
                };
                $self.x_indicators['_' + $self.number_of_ticks] = {
                    label: 'Exit Spot',
                    id: 'exit_tick',
                };
            } else if ($self.contract_category.match('digits')) {
                $self.ticks_needed = $self.number_of_ticks;
                $self.x_indicators = {
                    '_0': { label: 'Tick 1', id: 'start_tick'},
                };
                $self.x_indicators['_' + exit_tick_index] = {
                    label:  'Tick ' + $self.number_of_ticks,
                    id: 'last_tick',
                };
            } else {
                $self.x_indicators = {};
            }
        },
        initialize_chart: function(config) {
            var $self = this;

            $self.chart = new Highcharts.Chart({
                chart: {
                    type: 'line',
                    renderTo: 'tick_chart',
                    width: config.width ? config.width : (config.minimize ? 394 : null),
                    height: config.minimize ? 143 : null,
                    backgroundColor: null,
                    events: { load: $self.plot(config.plot_from, config.plot_to) },
                    marginLeft: 100
                },
                credits: {enabled: false},
                tooltip: {
                    formatter: function () {
                        var that = this;
                        var new_y = that.y.toFixed($self.display_decimals);
                        var mom = moment.utc($self.applicable_ticks[that.x].epoch*1000).format("dddd, MMM D, HH:mm:ss");
                        return mom + "<br/>" + $self.display_symbol + " " + new_y;
                    },
                },
                xAxis: {
                    type: 'linear',
                    min: 0,
                    max: $self.number_of_ticks + 1,
                    labels: { enabled: false, }
                },
                yAxis: {
                    opposite: false,
                    labels: {
                        align: 'left',
                        x: 0,
                    },
                    title: ''
                },
                series: [{
                    data: [],
                }],
                title: '',
                exporting: {enabled: false, enableImages: false},
                legend: {enabled: false},
            });
        },
        plot: function(plot_from, plot_to) {
            var $self = this;

            var plot_from_moment = moment(plot_from).utc();
            var plot_to_moment = moment(plot_to).utc();
            var contract_start_moment = moment($self.contract_start_ms).utc();
            $self.counter = 0;
            $self.applicable_ticks = [];

            var symbol = $self.symbol;
            var stream_url = window.location.protocol + '//' + page.settings.get('streaming_server');
            stream_url += "/stream/ticks/" + symbol + "/" + plot_from_moment.unix() + "/" + plot_to_moment.unix();
            $self.ev = new EventSource(stream_url, { withCredentials: true });

            $self.ev.onmessage = function(msg) {
                if ($self.applicable_ticks.length >= $self.ticks_needed) {
                    $self.ev.close();
                    $self.evaluate_contract_outcome();
                    return;
                }

                var data = JSON.parse(msg.data);
                if (data && !(data[0] instanceof Array)) {
                    data = [ data ];
                }
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][0] === 'tick') {
                            var tick = {
                                epoch: parseInt(data[i][1]),
                                quote: parseFloat(data[i][2])
                            };

                            if (tick.epoch > contract_start_moment.unix()) {
                                if ($self.applicable_ticks.length >= $self.ticks_needed) {
                                    $self.ev.close();
                                    $self.evaluate_contract_outcome();
                                    return;
                                } else {
                                    if (!$self.chart) return;
                                    if (!$self.chart.series) return;
                                    $self.chart.series[0].addPoint([$self.counter, tick.quote], true, false);
                                    $self.applicable_ticks.push(tick);
                                    var indicator_key = '_' + $self.counter;
                                    if (typeof $self.x_indicators[indicator_key] !== 'undefined') {
                                        $self.x_indicators[indicator_key]['index'] = $self.counter;
                                        $self.add($self.x_indicators[indicator_key]);
                                    }

                                    $self.add_barrier();
                                    $self.apply_chart_background_color(tick);
                                    $self.counter++;
                                }
                            }

                        }
                    }
                }
            };
            $self.ev.onerror = function(e) {$self.ev.close(); };
        },
        apply_chart_background_color: function(tick) {
            var $self = this;
            if(!$self.show_contract_result) {
                return;
            }
            var chart_container = $('#tick_chart');
            if ($self.contract_sentiment === 'up') {
                if (tick.quote > $self.contract_barrier) {
                    chart_container.css('background-color', 'rgba(46,136,54,0.198039)');
                } else {
                    chart_container.css('background-color', 'rgba(204,0,0,0.098039)');
                }
            } else if ($self.contract_sentiment === 'down') {
                if (tick.quote < $self.contract_barrier) {
                    chart_container.css('background-color', 'rgba(46,136,54,0.198039)');
                } else {
                    chart_container.css('background-color', 'rgba(204,0,0,0.098039)');
                }
            }
        },
        add_barrier: function() {
            var $self = this;

            if (!$self.set_barrier) {
                return;
            }

            var barrier_type = $self.contract_category.match('asian') ? 'asian' : 'static';

            if (barrier_type === 'static') {
                var barrier_tick = $self.applicable_ticks[0];
                $self.chart.yAxis[0].addPlotLine({
                    id: 'tick-barrier',
                    value: barrier_tick.quote,
                    label: {text: 'Barrier ('+barrier_tick.quote+')', align: 'center'},
                    color: 'green',
                    width: 2,
                    zIndex: 2,
                });
                $self.contract_barrier = barrier_tick.quote;
                $self.set_barrier = false;
            }

            if (barrier_type === 'asian') {
                var total = 0;
                for (var i=0; i < $self.applicable_ticks.length; i++) {
                    total += parseFloat($self.applicable_ticks[i].quote);
                }
                var calc_barrier =  total/$self.applicable_ticks.length;
                calc_barrier = calc_barrier.toFixed(parseInt($self.display_decimals) + 1); // round calculated barrier

                $self.chart.yAxis[0].removePlotLine('tick-barrier');
                $self.chart.yAxis[0].addPlotLine({
                    id: 'tick-barrier',
                    value: calc_barrier,
                    color: 'green',
                    label: {
                        text: 'Average ('+calc_barrier+')',
                        align: 'center'
                    },
                    width: 2,
                    zIndex: 2,
                });
                $self.contract_barrier = calc_barrier;
            }
        },
        add: function(indicator) {
            var $self = this;

            $self.chart.xAxis[0].addPlotLine({
               value: indicator.index,
               id: indicator.id,
               label: {text: indicator.label, x: /start_tick|entry_tick/.test(indicator.id) ? -15 : 5},
               color: '#e98024',
               width: 2,
               zIndex: 2,
            });
        },
        evaluate_contract_outcome: function() {
            var $self = this;

            if (!$self.contract_barrier) {
                return; // can't do anything without barrier
            }

            var exit_tick_index = $self.applicable_ticks.length - 1;
            var exit_spot = $self.applicable_ticks[exit_tick_index].quote;

            if ($self.contract_sentiment === 'up') {
                if (exit_spot > $self.contract_barrier) {
                    $self.win();
                } else {
                    $self.lose();
                }
            } else if ($self.contract_sentiment === 'down') {
                if (exit_spot < $self.contract_barrier) {
                    $self.win();
                } else {
                    $self.lose();
                }
            }
        },
        win: function() {
            var $self = this;

            var profit = $self.payout - $self.price;
            $self.update_ui($self.payout, profit, text.localize('This contract won'));
        },
        lose: function() {
            var $self = this;
            $self.update_ui(0, -$self.price, text.localize('This contract lost'));
        },
        update_ui: function(final_price, pnl, contract_status) {
            var $self = this;

            $('#bet-confirm-header').text(text.localize(contract_status));
            $('#contract-outcome-buyprice').text($self.to_monetary_format($self.price));
            $('#contract-outcome-payout').text($self.to_monetary_format(final_price));

            if (pnl > 0) {
                $('#contract-outcome-label').removeClass('standin loss').addClass('standout profit').text(text.localize('Profit'));
                $('#contract-outcome-profit').removeClass('standin loss').addClass('standout profit').text($self.to_monetary_format(pnl));
            } else {
                $('#contract-outcome-label').removeClass('standout profit').addClass('standin loss').text(text.localize('Loss'));
                $('#contract-outcome-profit').removeClass('standout profit').addClass('standin loss').text($self.to_monetary_format(pnl));
            }
            $('#confirmation_table').hide();
            $('#contract-outcome-details').show();
        },
        to_monetary_format: function(number) {
            return number.toFixed(2);
        }
    };
}();
