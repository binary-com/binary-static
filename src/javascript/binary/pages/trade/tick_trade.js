var WSTickDisplay = Object.create(TickDisplay);
WSTickDisplay.plot = function(plot_from, plot_to) {
    var $self = this;
    $self.contract_start_moment = moment($self.contract_start_ms).utc();
    $self.counter = 0;
    $self.applicable_ticks = [];
};
WSTickDisplay.update_ui = function(final_price, pnl, contract_status) {
    var $self = this;
    updatePurchaseStatus(final_price, final_price - pnl, contract_status);
};
WSTickDisplay.socketSend = function(req) {
    if(!req.hasOwnProperty('passthrough')) {
        req.passthrough = {};
    }
    req.passthrough['dispatch_to'] = 'ViewTickDisplayWS';
    BinarySocket.send(req);
};
WSTickDisplay.dispatch = function(data) {
  var $self = this;
  var chart = document.getElementById('tick_chart');

  if (window.subscribe && data.tick && document.getElementById('sell_content_wrapper')) {
      if (data.echo_req.hasOwnProperty('passthrough') && data.echo_req.passthrough.dispatch_to === 'ViewChartWS') return;
      window.responseID = data.tick.id;
      ViewPopupWS.storeSubscriptionID(window.responseID);
  }

  if (!chart || !isVisible(chart) || !data || (!data.tick && !data.history)) {
      return;
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
      WSTickDisplay.initialize({
          "symbol"              : window.tick_underlying,
          "number_of_ticks"     : window.tick_count,
          "contract_category"   : ((/asian/i).test(window.tick_shortcode) ? 'asian' : (/digit/i).test(window.tick_shortcode) ? 'digits' : 'callput'),
          "longcode"            : window.tick_longcode,
          "display_symbol"      : window.tick_display_name,
          "contract_start"      : window.tick_date_start,
          "display_decimals"    : display_decimals,
          "show_contract_result": 0
      });
      WSTickDisplay.spots_list = {};
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

  if ($self.applicable_ticks.length >= $self.ticks_needed) {
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
  }
};
WSTickDisplay.updateChart = function(data, contract) {
    window.subscribe = 'false';
    if (contract) {
      window.tick_underlying = contract.underlying;
      window.tick_count = contract.tick_count;
      window.tick_longcode = contract.longcode;
      window.tick_display_name = contract.display_name;
      window.tick_date_start = contract.date_start;
      window.tick_shortcode = contract.shortcode;
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
      WSTickDisplay.socketSend(request);
      return;
    } else {
      WSTickDisplay.dispatch(data);
    }
};
