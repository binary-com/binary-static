var Highchart = (function() {
  var chart, options, chart_forget, responseID, contract, contract_ended, contracts_for_send, history_send, entry_tick_barrier_drawn, initialized, chart_delayed, chart_subscribed, request, min_point, max_point, start_time, purchase_time, now_time, end_time, entry_tick_time, is_sold, sell_time, sell_spot_time, is_expired, exit_tick_time, exit_time;
  function init_once() {
      chart = '';
      initialized = false;
      chart_delayed = false;
      chart_subscribed = false;
      chart_forget = false;
      contract_ended = false;
      contracts_for_send = false;
      history_send = false;
      entry_tick_barrier_drawn = false;
  }

  // initiate the chart for the first time only, send it ticks or candles data
  function init_chart(options) {
      var data = [];
      var type = '';
      var lbl_start_time = '<div style="margin-bottom:3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:solid;border-color:#E98024;display:inline-block"></div> Start time ';
      var lbl_entry_spot = '<div style="margin-left:10px;display:inline-block;border:3px solid orange;border-radius:6px;width:4px;height:4px;"></div> Entry spot ';
      var lbl_exit_spot = '<div style="margin-left:10px;display:inline-block;background-color:orange;border-radius:6px;width:10px;height:10px;"></div> Exit spot ';
      var lbl_end_time = '<div style="margin-bottom: 3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:dashed;border-color:#E98024;display:inline-block"></div> End time ';
      var lbl_delay = '<span style="display:block;text-align:center;margin-bottom:0.2em;color:red">Charting for this underlying is delayed </span>';
      // options.history indicates line chart
      if(options.history){
        type = 'line';
        var history = options.history;
        var times = history.times;
        var prices = history.prices;
        var i;
        if (chart_delayed) {
          for(i = 0; i < times.length; ++i) {
              data.push([parseInt(times[i])*1000, prices[i]*1]);
          }
        } else if (min_point && max_point) {
          for(i = 0; i < times.length; ++i) {
            if (parseInt(times[i]) >= min_point && parseInt(times[i]) <= max_point) {
              // only display the first tick before entry spot and one tick after exit spot
              // as well as the set of ticks between them
              data.push([parseInt(times[i])*1000, prices[i]*1]);
            }
          }
        }
      }
      // options.candles indicates candle chart
      if(options.candles) {
        type = 'candlestick';
        data = options.candles.map(function(c){
          return [c.epoch*1000, c.open*1, c.high*1, c.low*1, c.close*1];
        });
      }
      var title = options.title;
      // element where chart is to be displayed
      var el = document.getElementById('analysis_live_chart');

      var chartOptions = {
        chart: {
          type: 'line',
          renderTo: el,
          backgroundColor: null, /* make background transparent */
          height: 450
        },
        title:{
          text: title,
          style: { fontSize:'16px' }
        },
        credits:{
          enabled: false
        },
        tooltip: {
          xDateFormat:'%A, %b %e, %H:%M:%S GMT'
        },
        xAxis: {
          type: 'datetime',
          categories:null,
          startOnTick: false,
          endOnTick: false,
          // min indicates where to start displaying the chart
          min: min_point ? min_point*1000 : null,
          // max indicates where to stop displaying the chart
          max: max_point ? max_point*1000 : null,
          labels: { overflow:"justify", format:"{value:%H:%M:%S}" }
        },
        yAxis: {
          labels: { align: 'left', x: 0, y: -2 },
          title: ''
        },
        series: [{
          name: title,
          data: data,
          type: type,
          // zones are used to display color of the line
          zones: [{
              // make the line grey until it reaches entry time or start time if entry spot time is not yet known
              value: entry_tick_time ? entry_tick_time*1000 : start_time*1000,
              color: '#ccc'
          }, {
              // make the line default color until exit time is reached
              value: exit_time*1000 || null,
              color: ''
          }, {
              // make the line grey again after trade ended
              color: '#ccc'
          }],
          zoneAxis: 'x'
        }],
        exporting: {enabled: false, enableImages: false},
        legend: {enabled: false},
        navigator: { enabled: true },
        plotOptions: {
          line: {
            marker: { radius: 2 }
          },
          candlestick: {
            lineColor: 'black',
            color: 'red',
            upColor: 'green',
            upLineColor: 'black',
            shadow: true
          },
        },
        rangeSelector: { enabled: false },
      };

      // display comma after every three digits instead of space
      Highcharts.setOptions({
        lang: {thousandsSep: ','}
      });

      // display a guide for clients to know how we are marking entry and exit spots
      if (options.history) {
        chartOptions.subtitle = {
          text: chart_delayed ? lbl_delay + lbl_start_time + lbl_entry_spot + lbl_exit_spot + lbl_end_time : lbl_start_time + lbl_entry_spot + lbl_exit_spot + lbl_end_time,
          align: 'center',
          useHTML: true
        };
        chartOptions.tooltip.valueDecimals = options.history.prices[0].split('.')[1].length || 3;
      } else if (options.candles) {
        chartOptions.subtitle = {
          text: chart_delayed ? lbl_delay + lbl_start_time + lbl_end_time : lbl_start_time + lbl_end_time,
          align: 'center',
          useHTML: true
        };
        chartOptions.tooltip.valueDecimals = options.candles[0].open.split('.')[1].length || 3;
      }

      if(!el) return;
      var chart = new Highcharts.Chart(chartOptions);
      initialized = true;

      // this is used to draw lines such as start and end times
      chart.addPlotLineX = function(chartOptions) {
        chart.xAxis[0].addPlotLine({
           value: chartOptions.value,
           id: chartOptions.id || chartOptions.value,
           label: {text: chartOptions.label || '', x: chartOptions.text_left ? -15 : 5},
           color: chartOptions.color || '#e98024',
           zIndex: 4,
           width: chartOptions.width || 2,
           dashStyle: chartOptions.dashStyle || 'Solid'
        });
        var subtitle = chart.subtitle.element;
        var subtitle_length = chart.subtitle.element.childNodes.length;
        if (sell_time && sell_time < end_time) {
          var textnode = document.createTextNode(" Sell time ");
          for (i = 0; i < chart.subtitle.element.childNodes.length; i++) {
            if (/End time/.test(chart.subtitle.element.childNodes[i].nodeValue)) {
              var item = chart.subtitle.element.childNodes[i];
              chart.subtitle.element.replaceChild(textnode, item);
            }
          }
        }
      };

      // this is used to draw lines such as barrier
      chart.addPlotLineY = function(chartOptions) {
        chart.yAxis[0].addPlotLine({
          id: chartOptions.id || chartOptions.label,
          value: chartOptions.value,
          label: {text: chartOptions.label, align: 'center'},
          color: chartOptions.color || 'green',
          zIndex: 4,
          width: 2,
          dashStyle: chartOptions.dashStyle || 'Solid'
        });
      };

      el.chart = chart;

      return el.chart;
  }

  // since these values are used in almost every function, make them easy to initialize
  function initialize_values() {
    start_time      = parseInt(contract.date_start);
    purchase_time   = parseInt(contract.purchase_time);
    now_time        = parseInt(contract.current_spot_time);
    end_time        = parseInt(contract.date_expiry);
    entry_tick_time = parseInt(contract.entry_tick_time);
    is_sold         = contract.is_sold;
    sell_time       = parseInt(contract.sell_time);
    sell_spot_time  = parseInt(contract.sell_spot_time);
    is_expired      = contract.is_expired;
    exit_tick_time  = parseInt(contract.exit_tick_time);
    entry_spot      = contract.entry_spot;
    exit_time       = is_sold && sell_time < end_time ? sell_spot_time : exit_tick_time || end_time;
    underlying      = contract.underlying;
  }

  // use this instead of BinarySocket.send to avoid overriding the on-message function of trading page
  var socketSend = function(req) {
      if(!req) return;
      if(!req.hasOwnProperty('passthrough')) {
          req.passthrough = {};
      }
      // send dispatch_to to help socket.js forward the correct response back to here
      req.passthrough['dispatch_to'] = 'ViewChartWS';
      BinarySocket.send(req);
  };

  var dispatch = function(response) {
    if(response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.dispatch_to === 'ViewChartWS') {
      var type = response.msg_type,
          error = response.error;
      if (type === 'contracts_for' && (!error || (error && error.code && error.code === 'InvalidSymbol'))) {
          if (response.contracts_for && response.contracts_for.feed_license && response.contracts_for.feed_license === 'delayed') {
            handle_delay();
          }
          show_entry_error();
      } else if ((type === 'history' || type === 'candles' || type === 'tick' || type === 'ohlc') && !error){
          responseID = response[type].id;
          // send view popup the response ID so view popup can forget the calls if it's closed before contract ends
          ViewPopupWS.storeSubscriptionID(responseID, 'chart');
          options = { 'title' : contract.display_name };
          if (response.history || response.candles) {
            if (response.history) {
                options.history = response.history;
                if (options.history.times.length === 0) {
                  show_error('missing');
                  return;
                }
                if (response.history.times) {
                  for (i = 0; i < response.history.times.length; i++) {
                      if (entry_tick_time && parseInt(response.history.times[i]) === parseInt(entry_tick_time)) {
                          // set the chart to display from the tick before entry_tick_time
                          min_point = parseInt(response.history.times[i-1]);
                          break;
                      } else if (purchase_time && start_time > parseInt(purchase_time) && parseInt(response.history.times[i]) === parseInt(purchase_time) || (parseInt(response.history.times[i]) < parseInt(purchase_time) && parseInt(response.history.times[i+1]) > parseInt(purchase_time))) {
                          // set the chart to display from the tick before purchase_time
                          min_point = parseInt(response.history.times[i-1]);
                          break;
                      }
                  }
                  if (!min_point) min_point = parseInt(response.history.times[0]);
                }
                get_max_history(response);
            } else if (response.candles) {
                options.candles = response.candles;
                if (options.candles.length === 0) {
                  show_error('missing');
                  return;
                }
                for (i = 0; i < response.candles.length; i++) {
                    if (entry_tick_time && response.candles[i] && parseInt(response.candles[i].epoch) <= parseInt(entry_tick_time) && response.candles[i+1].epoch > parseInt(entry_tick_time)) {
                        // set the chart to display from the candle before entry_tick_time
                        min_point = parseInt(response.candles[i-1].epoch);
                        break;
                    } else if (purchase_time && response.candles[i] && parseInt(response.candles[i].epoch) <= parseInt(purchase_time) && response.candles[i+1].epoch > parseInt(purchase_time)) {
                        // set the chart to display from the candle before purchase_time
                        min_point = parseInt(response.candles[i-1].epoch);
                        break;
                    }
                }
                get_max_candle(response);
            }
            // only initialize chart if it hasn't already been initialized
            if (!chart && !initialized) {
              chart = init_chart(options);
              if(!chart) return;

              if (purchase_time !== start_time) draw_line_x(purchase_time, 'Purchase Time', '', '', '#7cb5ec');

              // second condition is used to make sure contracts that have purchase time
              // but are sold before the start time don't show start time
              if (!is_sold || (is_sold && sell_time && sell_time > start_time)) {
                draw_line_x(start_time);
              }

              var duration = calculate_granularity(end_time, now_time, purchase_time, start_time)[1];

              // show end time before contract ends if duration of contract is less than one day
              // second OR condition is used so we don't draw end time again if there is sell time before
              if (end_time - (start_time || purchase_time) <= 24*60*60 && (!is_sold || (is_sold && sell_time && sell_time >= end_time))) {
                draw_line_x(end_time, '', 'textLeft', 'Dash');
              }
            }
            if (is_sold || is_expired) {
              reset_max();
              reselect_exit_time();
              end_contract();
            }
          } else if ((response.tick || response.ohlc) && !chart_forget) {
            if (response.tick) {
              options.tick = response.tick;
            } else if (response.ohlc) {
              options.ohlc = response.ohlc;
            }
            if (chart && chart.series) {
              update_chart(options);
            }
          }
          if (entry_tick_time){
            select_entry_tick_barrier();
          }
          forget_streams();
      } else if (type === 'ticks_history' && error) {
          show_error('', error.message);
      }
    }
  };

  function show_chart(proposal_contract, update) {
      contract = proposal_contract;
      initialize_values();
      if (!update) {
        init_once();
      }
      if (!chart && !chart_subscribed) {
        request_data(update || '');
      } else if (entry_tick_time && chart) {
        select_entry_tick_barrier();
      }
      if ((is_sold || is_expired) && chart) {
        reset_max();
        reselect_exit_time();
        end_contract();
      }
      forget_streams();
      return;
  }

  function show_error(type, message) {
    var el = document.getElementById('analysis_live_chart');
    if(!el) return;
    if (type === 'missing') {
      el.innerHTML = '<p class="error-msg">' + text.localize('Ticks history returned an empty array.') + '</p>';
    } else {
      el.innerHTML = '<p class="error-msg">' + message + '</p>';
    }
  }

  function request_data(update) {
    var calculateGranularity = calculate_granularity(exit_time, now_time, purchase_time, start_time);
    var granularity = calculateGranularity[0],
        duration    = calculateGranularity[1],
        margin      = 0; // time margin
    margin = granularity === 0 ? Math.max(300, 30*duration/(60*60) || 0) : 3*granularity;

    request = {
      ticks_history: underlying,
      start: ((purchase_time || start_time)*1 - margin).toFixed(0), /* load more ticks before start */
      end: end_time ? (end_time*1 + margin).toFixed(0) : 'latest',
      style: 'ticks',
      count: 4999, /* maximum number of ticks possible */
      adjust_start_time: 1
    };

    if (is_sold && sell_time < end_time) {
      request.end = sell_spot_time ? (sell_spot_time*1 + margin).toFixed(0) : 'latest';
    }

    if(granularity !== 0) {
      request.granularity = granularity;
      request.style = 'candles';
    }

    if(!is_expired && !sell_spot_time && parseInt(window.time._i)/1000 < end_time && !chart_subscribed) {
        chart_subscribed = true;
        request.subscribe = 1;
    }

    var contracts_response = window.contracts_for;

    if (contracts_response && contracts_response.echo_req.contracts_for === underlying) {
      if (contracts_response.contracts_for.feed_license === 'delayed') {
        handle_delay();
      }
      show_entry_error();
    } else if(!contracts_for_send && update === '') {
      socketSend({'contracts_for': underlying});
      contracts_for_send = true;
    }
  }

  function show_entry_error() {
    if (!entry_tick_time && chart_delayed === false && start_time && parseInt((window.time._i/1000)) >= parseInt(start_time)) {
      show_error('', text.localize('Waiting for entry tick.'));
    } else if (!history_send){
      history_send = true;
      socketSend(request);
    }
    return;
  }

  function handle_delay() {
    if (!is_expired) {
      request.end = 'latest';
    }
    delete request.subscribe;
    chart_delayed = true;
  }

  // we have to update the color zones with the correct entry_tick_time
  // and barrier value
  function select_entry_tick_barrier() {
    if (entry_tick_time && chart && !entry_tick_barrier_drawn) {
      select_entry_tick(entry_tick_time);
      if (chart) {
        draw_barrier();
        chart.series[0].zones[0].value = parseInt(entry_tick_time)*1000;
        // force to redraw:
        chart.isDirty = true;
        chart.redraw();
      }
      entry_tick_barrier_drawn = true;
    }
    return;
  }

  // update color zone of exit time
  function reselect_exit_time() {
    if (chart && exit_time) {
      chart.series[0].zones[1].value = parseInt(exit_time)*1000;
      // force to redraw:
      chart.isDirty = true;
      chart.redraw();
    }
    return;
  }

  // function to set an orange circle on the entry tick
  function select_entry_tick(value) {
    value = parseInt(value);
    if (value && (options.history || options.tick) && chart) {
      var firstIndex = Object.keys(chart.series[0].data)[0];
      for (i = firstIndex; i < chart.series[0].data.length; i++) {
        if (value*1000 === chart.series[0].data[i].x) {
          chart.series[0].data[i].update({marker: {fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4, states: {hover: {fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4}}}});
          return;
        }
      }
    }
  }

  function draw_barrier() {
    if (chart.yAxis[0].plotLinesAndBands.length === 0) {
      if (contract.barrier) {
          chart.addPlotLineY({id: 'barrier', value: contract.barrier*1, label: 'Barrier (' + contract.barrier + ')', dashStyle: 'Dot'});
      } else if (contract.high_barrier && contract.low_barrier) {
          chart.addPlotLineY({id: 'high_barrier', value: contract.high_barrier*1, label: 'High Barrier (' + contract.high_barrier + ')', dashStyle: 'Dot'});
          chart.addPlotLineY({id: 'low_barrier', value: contract.low_barrier*1, label: 'Low Barrier (' + contract.low_barrier + ')', dashStyle: 'Dot'});
      }
    }
  }

  // function to set an orange circle on the exit tick
  function select_exit_tick(value) {
    value = parseInt(value);
    if (value && (options.tick || options.history)) {
      for (i = chart.series[0].data.length - 1; i >= 0; i--) {
        if (value*1000 === chart.series[0].data[i].x) {
          chart.series[0].data[i].update({marker: {fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4, states: {hover: {fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4}}}});
          return;
        }
      }
    }
  }

  function reset_max() {
    if (sell_time && sell_time < end_time) {
      if (chart) chart.xAxis[0].setExtremes(min_point ? min_point*1000 : null, (sell_time*1 + 3)*1000);
    }
    return;
  }

  // calculate where to display the maximum value of the x-axis of the chart for line chart
  function get_max_history(response) {
    var end;
    if (sell_spot_time && sell_time < end_time) {end = sell_spot_time;}
    else if (exit_tick_time) {end = exit_tick_time;}
    else {end = end_time;}
    if (response.history && response.history.times && (is_expired || is_sold)) {
      for (i = response.history.times.length; i >= 0; i--) {
          if (parseInt(response.history.times[i]) === parseInt(end)) {
              max_point = parseInt(response.history.times[i+1]);
              break;
          }
      }
    } else if (chart_delayed) {
      if (parseInt(response.history.times[response.history.times.length - 1]) > start_time) {
        max_point = parseInt(response.history.times[response.history.times.length - 1]);
      } else {
        max_point = start_time;
      }
    } else {
      max_point = end_time;
    }
    return;
  }

  // calculate where to display the maximum value of the x-axis of the chart for candle
  function get_max_candle(response) {
    if (sell_spot_time && sell_time < end_time) {end = sell_spot_time;}
    else {end = end_time;}
    if (is_expired || is_sold) {
      for (i = response.candles.length - 2; i >= 0; i--) {
          if (response.candles[i] && parseInt(response.candles[i].epoch) <= end && parseInt(response.candles[i+1].epoch) > end) {
              max_point = parseInt(response.candles[i+1].epoch);
              break;
          }
      }
    } else if (chart_delayed) {
      if (parseInt(response.candles[response.candles.length - 1].epoch) > start_time) {
        max_point = parseInt(response.candles[response.candles.length - 1].epoch);
      } else {
        max_point = start_time;
      }
    } else {
      max_point = end_time;
    }
    return;
  }

  function draw_line_x(valueTime, labelName, textLeft, dash, color) {
    if(!chart) return;
    var req = {
      value : valueTime*1000
    };
    if (labelName && labelName !== '') req.label = labelName;
    if (textLeft === 'textLeft') req.text_left = true;
    if (dash && dash !== '') req.dashStyle = dash;
    if (color) req.color = color;
    chart.addPlotLineX(req);
  }

  // function to draw the last line needed and forget the streams
  // also sets the exit tick
  function end_contract() {
    if (chart) {
      if (sell_time && sell_time < end_time) {
        draw_line_x(sell_time, '', 'textLeft', 'Dash');
      } else if (sell_time && sell_time >= end_time) {
        draw_line_x(end_time, '', 'textLeft', 'Dash');
      }
      if (sell_spot_time && sell_spot_time < end_time && sell_spot_time >= start_time) {
        select_exit_tick(sell_spot_time);
      } else if (exit_tick_time) {
        select_exit_tick(exit_tick_time);
      }
    }
    if (!contract_ended) {
      forget_streams();
      contract_ended = true;
    }
    return;
  }

  function forget_streams() {
    if (chart && chart.series && chart.series[0].data.length >= 1 && !chart_forget && (is_sold || is_expired) && responseID) {
      var last = chart.series[0].data[chart.series[0].data.length - 1];
      if (parseInt(last.x) > end_time*1000 || parseInt(last.x) > sell_time*1000) {
        socketSend({'forget':responseID});
        chart_forget = true;
      }
    }
    return;
  }

  function calculate_granularity(end_time, now_time, purchase_time, start_time) {
    var duration = Math.min(end_time*1, now_time) - (purchase_time || start_time);
    var granularity = 0;
    if(duration <= 60*60) { granularity = 0; } // 1 hour
    else if(duration <= 2*60*60) { granularity = 120; } // 2 hours
    else if(duration <= 6*60*60) { granularity = 600; } // 6 hours
    else if(duration <= 24*60*60) { granularity = 900; } // 1 day
    else if(duration <= 24*5*60*60) { granularity = 3600; } // 5 days
    else if(duration <= 24*30*60*60) { granularity = 14400; } // 30 days
    else { granularity = 86400; } // more than 30 days
    return [granularity, duration];
  }

  // add the new data to the chart
  function update_chart(options){
    var granularity = calculate_granularity(exit_time, now_time, purchase_time, start_time)[0];
    var series = chart.series[0];
    var last = series.data[series.data.length - 1];
    if(granularity === 0) {
      chart.series[0].addPoint([options.tick.epoch*1000, options.tick.quote*1]);
    } else {
      var c = options.ohlc;
      var ohlc = [c.open_time*1000, c.open*1, c.high*1, c.low*1, c.close*1];

      if(last.x !== ohlc[0]) {
        series.addPoint(ohlc, true, true);
      }
      else {
        last.update(ohlc,true);
      }
    }
    return;
  }

  return {
    show_chart   : show_chart,
    dispatch     : dispatch
  };
}());
