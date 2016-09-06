var TickDisplay_Beta = function() {
    return {
        initialize: function(data) {
            var $self = this;

            // setting up globals
            $self.number_of_ticks = parseInt(data.number_of_ticks);
            $self.symbol = data.symbol;
            $self.display_symbol = data.display_symbol;
            $self.contract_start_ms = parseInt(data.contract_start * 1000);
            $self.contract_category = data.contract_category;
            $self.set_barrier = ($self.contract_category.match('digits')) ? false : true;
            $self.barrier = data.barrier;
            $self.abs_barrier = data.abs_barrier;
            $self.display_decimals = data.display_decimals || 2;
            $self.show_contract_result = data.show_contract_result;
            $self.is_trading_page = data.is_trading_page;
            $self.contract_sentiment = data.contract_sentiment;
            var tick_frequency = 5;

            if (data.show_contract_result) {
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
            var $self = this,
                is_start_on_first_tick = $self.contract_category.match('digits|asian');

            var chart_options = {
                chart: {
                    type: 'line',
                    renderTo: 'tick_chart',
                    width: config.width ? config.width : (config.minimize ? 394 : null),
                    height: config.minimize ? 120 : null,
                    backgroundColor: null,
                    events: { load: $self.plot(config.plot_from, config.plot_to) },
                    marginLeft: 20,
                },
                credits: {enabled: false},
                tooltip: {
                    formatter: function () {
                        var that = this;
                        var new_y = that.y.toFixed($self.display_decimals);
                        var mom = moment.utc($self.applicable_ticks[that.x].epoch*1000).format("dddd, MMM D, HH:mm:ss");
                        return mom + "<br/>" + $self.display_symbol + " " + new_y;
                    },
                    crosshairs: [true],
                },
                xAxis: {
                    type: 'linear',
                    min: 0,
                    max: $self.ticks_needed - 0.5,
                    tickInterval: 1,
                    labels: {
                      formatter: function() { return this.value + (is_start_on_first_tick ? 1 : 0); }
                    },
                    showFirstLabel: is_start_on_first_tick ? true : false,
                    crosshair: {
                        color: '#E98024',
                        zIndex: 1
                    },
                    title: {
                        text: text.localize('Tick')
                    }
                },
                yAxis: {
                    opposite: false,
                    labels: {
                        align: 'left',
                        x: 0,
                    },
                    title: '',
                },
                series: [{
                    data: [],
                }],
                title: '',
                exporting: {enabled: false, enableImages: false},
                legend: {enabled: false},
            };
            // Trading page's chart
            function show_values(tick, time, price) {
                $('#contract_purchase_profit_list .chart-values').css('display', 'flex');
                $('#chart_values_tick_value').text(tick);
                $('#chart_values_time_value').text(time);
                $('#chart_values_price_value').text(addComma(price));
            }
            if($self.is_trading_page) {
                $.extend(true, chart_options, {
                    chart: {
                        marginBottom: 25
                    },
                    tooltip: {
                        style: {'display': 'none'},
                        formatter: function () {
                            var that = this;
                            var time = moment.utc($self.applicable_ticks[that.x].epoch*1000).format('HH:mm:ss');
                            show_values(+that.x + (is_start_on_first_tick ? 1 : 0), time, that.y);
                        },
                        events: {
                            hide: function () {
                                $('#contract_purchase_profit_list .chart-values').hide();
                            }
                        }
                    },
                    xAxis: {
                        title: {
                            text: ''
                        },
                        crosshair: {
                            width: 30,
                        },
                        tickWidth: 0
                    },
                    yAxis: {
                        gridLineWidth: 0,
                        labels: {
                            enabled: false,
                        }
                    },
                    series: [{
                        color: '#2a3052',
                        lineWidth: 1,
                    }],
                });
            }
            $self.chart = new Highcharts.Chart(chart_options);
            Highcharts.setOptions({
              lang: {thousandsSep: ','}
            });
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

            var barrier_type = $self.contract_category.match('asian') ? 'asian' : 'static',
                line_color   = $self.is_trading_page ? '#6b8fb9' : 'green',
                line_width   = $self.is_trading_page ? 1 : 2;

            if (barrier_type === 'static') {
                var barrier_tick = $self.applicable_ticks[0];

                if ( $self.barrier ) {
                  var final_barrier = barrier_tick.quote + parseFloat($self.barrier);
                  //sometimes due to rounding issues, result is 1.009999 while it should
                  //be 1.01
                  final_barrier = Number(Math.round(final_barrier+'e'+$self.display_decimals)+'e-'+$self.display_decimals);

                  barrier_tick.quote = final_barrier;
                }
                else if ( $self.abs_barrier ) {
                  barrier_tick.quote = parseFloat($self.abs_barrier);
                }

                $self.chart.yAxis[0].addPlotLine({
                    id: 'tick-barrier',
                    value: barrier_tick.quote,
                    label: {
                        text: $self.is_trading_page ? '' : 'Barrier (' + barrier_tick.quote + ')',
                        align: 'center'
                    },
                    color: line_color,
                    width: line_width,
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
                    label: {
                        text: $self.is_trading_page ? '' : 'Average (' + calc_barrier + ')',
                        align: 'center'
                    },
                    color: line_color,
                    width: line_width,
                    zIndex: 2,
                });
                $self.contract_barrier = calc_barrier;
            }
            var barrier = document.getElementById('contract_purchase_barrier');
            if ($self.contract_barrier && barrier) {
                label_value(barrier, Content.localize().textBarrier, addComma($self.contract_barrier), true);
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
        to_monetary_format: function(number) {
            return number.toFixed(2);
        }
    };
}();

var WSTickDisplay_Beta = Object.create(TickDisplay_Beta);
WSTickDisplay_Beta.plot = function(plot_from, plot_to) {
    var $self = this;
    $self.contract_start_moment = moment($self.contract_start_ms).utc();
    $self.counter = 0;
    $self.applicable_ticks = [];
};
WSTickDisplay_Beta.update_ui = function(final_price, pnl, contract_status) {
    var $self = this;
    updatePurchaseStatus_Beta(final_price, final_price - pnl, contract_status);
};
WSTickDisplay_Beta.socketSend = function(req) {
    if(!req.hasOwnProperty('passthrough')) {
        req.passthrough = {};
    }
    req.passthrough['dispatch_to'] = 'ViewTickDisplayWS';
    BinarySocket.send(req);
};
WSTickDisplay_Beta.dispatch = function(data) {
  var $self = this;
  var chart = document.getElementById('tick_chart');

  if (!chart || !isVisible(chart) || !data || (!data.tick && !data.history)) {
      return;
  }

  if (window.subscribe && data.tick && document.getElementById('sell_content_wrapper')) {
      if (data.echo_req.hasOwnProperty('passthrough') && data.echo_req.passthrough.dispatch_to === 'ViewChartWS') return;
      window.responseID = data.tick.id;
      ViewPopupWS.storeSubscriptionID(window.responseID);
  }

  var epoches, spots2, display_decimals;
  if (document.getElementById('sell_content_wrapper')) {
    if (data.tick && document.getElementById('sell_content_wrapper')) {
      Tick.details(data);
      if (!display_decimals) {
        display_decimals = data.tick.quote.split('.')[1].length || 2;
      }
    } else if (data.history && document.getElementById('sell_content_wrapper')) {
      if (!display_decimals) {
        display_decimals = data.history.prices[0].split('.')[1].length || 2;
      }
    }
    if (!window.tick_init || window.tick_init === '') {
      WSTickDisplay_Beta.initialize({
          "symbol"              : window.tick_underlying,
          "number_of_ticks"     : window.tick_count,
          "contract_category"   : ((/asian/i).test(window.tick_shortcode) ? 'asian' : (/digit/i).test(window.tick_shortcode) ? 'digits' : 'callput'),
          "longcode"            : window.tick_longcode,
          "display_symbol"      : window.tick_display_name,
          "contract_start"      : window.tick_date_start,
          "abs_barrier"         : window.abs_barrier,
          "display_decimals"    : display_decimals,
          "contract_sentiment"  : window.contract_type === 'CALL' || window.contract_type === 'ASIANU' ? 'up' : 'down',
          "show_contract_result": 0
      });
      WSTickDisplay_Beta.spots_list = {};
      window.tick_init = 'initialized';
    }
  }
  if (data.tick) {
    spots2 = Tick.spots();
    epoches = Object.keys(spots2).sort(function(a, b) {
        return a - b;
    });
  } else if (data.history) {
    epoches = data.history.times;
  }

  if ($self.applicable_ticks && $self.ticks_needed && $self.applicable_ticks.length >= $self.ticks_needed) {
      $self.evaluate_contract_outcome();
      if (window.responseID) {
        BinarySocket.send({'forget':window.responseID});
      }
      return;
  } else {
      for (var d = 0; d < epoches.length; d++) {
          var tick;
          if (data.tick) {
            tick = {
                epoch: parseInt(epoches[d]),
                quote: parseFloat(spots2[epoches[d]])
            };
          } else if (data.history) {
            tick = {
                epoch: parseInt(data.history.times[d]),
                quote: parseFloat(data.history.prices[d])
            };
          }

          if (tick.epoch > $self.contract_start_moment.unix() && !$self.spots_list[tick.epoch]) {
              if (!$self.chart) return;
              if (!$self.chart.series) return;
              $self.chart.series[0].addPoint([$self.counter, tick.quote], true, false);
              $self.applicable_ticks.push(tick);
              $self.spots_list[tick.epoch] = tick.quote;
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

      if ($self.is_trading_page) {
          var is_up   = $self.contract_sentiment === 'up',
              min     = $self.chart.yAxis[0].getExtremes().min,
              max     = $self.chart.yAxis[0].getExtremes().max,
              barrier = $self.contract_barrier;
          $self.chart.yAxis[0].removePlotBand('win-area');
          $self.chart.yAxis[0].addPlotBand({
              id: 'win-area',
              from: is_up ? barrier : min,
              to:   is_up ? max : barrier,
              color: '#f5f8fb'
          });
          $self.chart.yAxis[0].removePlotBand('lose-area');
          $self.chart.yAxis[0].addPlotBand({
              id: 'lose-area',
              from: is_up ? min : barrier,
              to:   is_up ? barrier : max,
              color: '#ffffff'
          });
      }
  }
};
WSTickDisplay_Beta.updateChart = function(data, contract) {
    window.subscribe = 'false';
    if (contract) {
      window.tick_underlying = contract.underlying;
      window.tick_count = contract.tick_count;
      window.tick_longcode = contract.longcode;
      window.tick_display_name = contract.display_name;
      window.tick_date_start = contract.date_start;
      window.abs_barrier = contract.barrier;
      window.tick_shortcode = contract.shortcode;
      window.contract_type = contract.contract_type;
      window.tick_init = '';
      var request = {
        ticks_history: contract.underlying,
        start: contract.date_start,
        end: 'latest'
      };
      if (contract.current_spot_time < contract.date_expiry) {
        request.subscribe = 1;
        window.subscribe = 'true';
      } else {
        request.end = contract.date_expiry;
      }
      WSTickDisplay_Beta.socketSend(request);
      return;
    } else {
      WSTickDisplay_Beta.dispatch(data);
    }
};

// add tooltip events to highcharts
(function (Highcharts) {
    Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function (proceed) {
        var tooltip = this.chart.options.tooltip;

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        if (!this.isHidden && tooltip.events && tooltip.events.hide) {
            tooltip.events.hide();
        }
    });

    Highcharts.wrap(Highcharts.Tooltip.prototype, 'refresh', function (proceed) {
        var tooltip = this.chart.options.tooltip;

        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        if (tooltip.events && tooltip.events.show) {
            tooltip.events.show(this.chart.hoverPoints);
        }
    });
}(Highcharts));
