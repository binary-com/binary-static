var Highchart = (function() {
  var initialized;
  // initiate the chart for the first time only, send it ticks or candles data
  function init_chart(options) {
      var data = [];
      var type = '';
      var start_time = '<div style="margin-bottom:3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:solid;border-color:#E98024;display:inline-block"></div> Start time ';
      var entry_spot = '<div style="margin-left:10px;display:inline-block;border:3px solid orange;border-radius:6px;width:4px;height:4px;"></div> Entry spot ';
      var exit_spot = '<div style="margin-left:10px;display:inline-block;background-color:orange;border-radius:6px;width:10px;height:10px;"></div> Exit spot ';
      var end_time = '<div style="margin-bottom: 3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:dashed;border-color:#E98024;display:inline-block"></div> End time ';
      var delay = '<span style="color:red">Charting for this underlying is delayed </span>';
      // options.history indicates line chart
      if(options.history){
        type = 'line';
        var history = options.history;
        var times = history.times;
        var prices = history.prices;
        var i;
        if (window.delayed) {
          for(i = 0; i < times.length; ++i) {
              data.push([times[i]*1000, prices[i]*1]);
          }
        } else if (window.min && window.max) {
          for(i = 0; i < times.length; ++i) {
            if (times[i] >= parseInt(window.min) && times[i] <= parseInt(window.max)) {
              // only display the first tick before entry spot and one tick after exit spot
              // as well as the set of ticks between them
              data.push([times[i]*1000, prices[i]*1]);
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
      // underlying name displayed on top of the chart
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
          min: window.min ? parseInt(window.min)*1000 : null,
          // max indicates where to stop displaying the chart
          max: window.max ? parseInt(window.max)*1000 : null,
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
              // make the line grey until it reaches entry_time or start_time if entry spot time is not yet known
              value: window.entry_time ? window.entry_time*1000 : window.start_time*1000,
              color: '#ccc'
          }, {
              // make the line default color until exit_time is reached
              value: window.exit_time*1000 || null,
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
          text: window.delayed ? delay + start_time + entry_spot + exit_spot + end_time : start_time + entry_spot + exit_spot + end_time,
          align: 'right',
          useHTML: true
        };
        chartOptions.tooltip.valueDecimals = options.history.prices[0].split('.')[1].length || 3;
      } else if (options.candles) {
        chartOptions.subtitle = {
          text: window.delayed ? delay + start_time + end_time : start_time + end_time,
          align: 'right',
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
        var subtitle = window.chart.subtitle.element;
        var subtitle_length = window.chart.subtitle.element.childNodes.length;
        if (window.is_sold) {
          var textnode = document.createTextNode(" Sell time ");
          for (i = 0; i < window.chart.subtitle.element.childNodes.length; i++) {
            if (/End time/.test(window.chart.subtitle.element.childNodes[i].nodeValue)) {
              var item = window.chart.subtitle.element.childNodes[i];
              window.chart.subtitle.element.replaceChild(textnode, item);
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
        });
      };

      el.chart = chart;

      return el.chart;
  }

  var start_time, purchase_time, now_time, end_time, entry_tick_time, is_sold, sell_time, sell_spot_time, is_expired, exit_tick_time, exitTime;

  // since these values are used in almost every function, make them easy to initialize
  function initialize_values(contract) {
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
    exitTime        = is_sold && sell_time < end_time ? sell_spot_time : end_time;
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
      var contract = window.contract;
      initialize_values(contract);
      if (type === 'contracts_for' && (!error || (error && error.code && error.code === 'InvalidSymbol'))) {
          if (response.contracts_for && response.contracts_for.feed_license && response.contracts_for.feed_license === 'delayed') {
            if (!window.contract.is_expired) {
              window.request.end = 'latest';
            }
            delete window.request.subscribe;
            window.delayed = true;
          } else {
            window.delayed = false;
          }
          if (!contract.entry_tick_time && window.delayed === false && contract.date_start && parseInt((window.time._i/1000)) >= parseInt(contract.date_start)) {
            show_error('', text.localize('Waiting for entry tick.'));
          } else {
            if (request.subscribe === 1) window.chart_subscribed = true;
            socketSend(window.request);
          }
      } else if ((type === 'history' || type === 'candles' || type === 'tick' || type === 'ohlc') && !error){
          window.responseID = response[type].id;
          // send view popup the response ID so view popup can forget the calls if it's closed before contract ends
          ViewPopupWS.storeSubscriptionID(window.responseID);
          var options  = { 'title' : contract.display_name };
          if (response.history || response.candles) {
            if (response.history) {
                window.tick_type = 'history';
                options.history = response.history;
                if (options.history.times.length === 0) {
                  show_error('missing');
                  return;
                }
                if (response.history.times) {
                  for (i = 0; i < response.history.times.length; i++) {
                      if (contract.entry_tick_time && parseInt(response.history.times[i]) === parseInt(contract.entry_tick_time)) {
                          // set the chart to display from the tick before entry_tick_time
                          window.min = parseInt(response.history.times[i-1]);
                          break;
                      } else if (contract.purchase_time && start_time > parseInt(contract.purchase_time) && (parseInt(response.history.times[i]) === parseInt(contract.purchase_time) || (parseInt(response.history.times[i]) < parseInt(contract.purchase_time) && parseInt(response.history.times[i+1]) > parseInt(contract.purchase_time)))) {
                          // set the chart to display from the tick before purchase_time
                          window.min = parseInt(response.history.times[i-1]);
                          break;
                      }
                  }
                  if (!window.min || window.min === '') {
                    window.min = response.history.times[0];
                  }
                }
                get_max_history(contract, response);
            } else if (response.candles) {
                window.tick_type = 'candles';
                options.candles = response.candles;
                if (options.candles.length === 0) {
                  show_error('missing');
                  return;
                }
                for (i = 0; i < response.candles.length; i++) {
                    if (contract.entry_tick_time && response.candles[i] && parseInt(response.candles[i].epoch) <= parseInt(contract.entry_tick_time) && response.candles[i+1].epoch > parseInt(contract.entry_tick_time)) {
                        // set the chart to display from the candle before entry_tick_time
                        window.min = response.candles[i-1].epoch;
                        break;
                    } else if (contract.purchase_time && response.candles[i] && parseInt(response.candles[i].epoch) <= parseInt(contract.purchase_time) && response.candles[i+1].epoch > parseInt(contract.purchase_time)) {
                        // set the chart to display from the candle before purchase_time
                        window.min = response.candles[i-1].epoch;
                        break;
                    }
                }
                get_max_candle(contract, response);
            }
            window.entry_time = entry_tick_time;
            // start_time and exit_time are used in displaying the color zones
            window.start_time = start_time;
            if (is_sold && sell_time && sell_time < end_time) {
              window.exit_time = sell_spot_time;
            } else if (exit_tick_time) {
              window.exit_time = exit_tick_time;
            } else {
              window.exit_time = end_time;
            }
            // only initialize chart if it hasn't already been initialized
            if (!window.chart && !initialized) {
              window.chart = init_chart(options);
              if(!window.chart) return;

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
              if (contract.barrier) {
                  window.chart.addPlotLineY({id: 'barrier', value: contract.barrier*1, label: 'Barrier (' + contract.barrier + ')'});
              } else if (contract.high_barrier && contract.low_barrier) {
                  window.chart.addPlotLineY({id: 'high_barrier', value: contract.high_barrier*1, label: 'High Barrier (' + contract.high_barrier + ')'});
                  window.chart.addPlotLineY({id: 'low_barrier', value: contract.low_barrier*1, label: 'Low Barrier (' + contract.low_barrier + ')'});
              }
            }
          } else if (response.tick || response.ohlc) {
            if (response.tick) {
              options.tick = response.tick;
            } else if (response.ohlc) {
              window.tick_type = 'candles';
              options.ohlc = response.ohlc;
            }
            if (!entry_tick_time) {
              update_barrier(options);
            }
            if (window.chart && window.chart.series) {
              update_chart(contract, options);
            }
          }
          if (window.entry_time) {
            select_entry_tick(window.entry_time);
            if (window.chart) {
              // now that we have the updated value of entry tick,
              // we have to update the color zones with the correct entry_tick_time value
              // instead of the vague start_time
              window.chart.series[0].zones[0].value = parseInt(window.entry_time)*1000;
              // force to redraw:
              window.chart.isDirty = true;
              window.chart.redraw();
            }
          }
          if (is_sold || is_expired) {
            if (sell_time && sell_time < end_time) {
              window.exit_time = sell_spot_time;
              window.is_sold = 'true';
              if (window.chart) window.chart.xAxis[0].setExtremes(window.min ? window.min*1000 : null, (sell_time*1 + 3)*1000);
            } else if (exit_tick_time) {
              window.exit_time = exit_tick_time;
            }
            if (window.chart) {
              // also update color zone of exit_time
              window.chart.series[0].zones[1].value = parseInt(window.exit_time)*1000;
              // force to redraw:
              window.chart.isDirty = true;
              window.chart.redraw();
            }
            end_contract(contract);
          }
      } else if (type === 'ticks_history' && error) {
          show_error('', error.message);
      }
    }
  };

  function show_chart(contract, update) {
      window.contract = contract;
      if (!update) {
        initialized = false;
      }
      if (!window.chart && (!window.chart_subscribed || window.chart_subscribed === '')) {
        request_data(window.contract);
      } else if (contract.entry_tick_time && window.chart) {
        select_entry_tick(contract.entry_tick_time);
        if (window.chart) {
          window.chart.series[0].zones[0].value = parseInt(contract.entry_tick_time)*1000;
          window.chart.isDirty = true;
          window.chart.redraw();
        }
      }
      if ((contract.sell_spot_time || contract.exit_tick_time) && window.chart) {
        if (contract.sell_time && contract.sell_time < contract.date_expiry) {
          window.exit_time = contract.sell_spot_time;
          window.is_sold = 'true';
          if (window.chart) window.chart.xAxis[0].setExtremes(window.min ? window.min*1000 : null, (contract.sell_time*1 + 3)*1000);
        } else if (contract.exit_tick_time) {
          window.exit_time = contract.exit_tick_time;
        }
        if (window.chart && window.exit_time) {
          // also update color zone of exit_time
          window.chart.series[0].zones[1].value = parseInt(window.exit_time)*1000;
          // force to redraw:
          window.chart.isDirty = true;
          window.chart.redraw();
        }
        end_contract(contract);
      }
      return;
  }

  function show_error(type, message) {
    var el = document.getElementById('analysis_live_chart');
    if(!el) return;
    if (type === 'missing') {
      el.innerHTML = '<p class="error-msg">' + text.localize('ticks history returned an empty array') + '</p>';
    } else {
      el.innerHTML = '<p class="error-msg">' + message + '</p>';
    }
  }

  function clear_values() {
    window.max = '';
    window.min = '';
    window.entry_time = '';
    window.exit_time = '';
    window.responseID = '';
    window.tick_type = '';
    window.start_time = '';
    window.chart = '';
    window.request = '';
    window.delayed = '';
    window.is_sold = '';
    window.chart_subscribed = '';
  }

  function request_data(contract) {
    initialize_values(contract);
    var calculateGranularity = calculate_granularity(exitTime, now_time, purchase_time, start_time);
    var granularity = calculateGranularity[0],
        duration    = calculateGranularity[1],
        margin      = 0; // time margin
    margin = granularity === 0 ? Math.max(300, 30*duration/(60*60) || 0) : 3*granularity;

    var request = {
      ticks_history: contract.underlying,
      start: ((purchase_time || start_time)*1 - margin).toFixed(0), /* load more ticks before start */
      end: end_time ? (end_time*1 + margin).toFixed(0) : 'latest',
      style: 'ticks',
      count: 4999, /* maximum number of ticks possible */
      adjust_start_time: 1
    };

    if (is_sold) {
      request.end = sell_spot_time ? (sell_spot_time*1 + margin).toFixed(0) : 'latest';
    }

    if(granularity !== 0) {
      request.granularity = granularity;
      request.style = 'candles';
    }

    if(!contract.is_expired && !contract.sell_spot_time && parseInt((window.time._i/1000)) < end_time && (!window.chart_subscribed || window.chart_subscribed === '')) {
        request.subscribe = 1;
    }

    window.request = request;
    var contracts_response = window.contracts_for;

    if (contracts_response && contracts_response.echo_req.contracts_for === contract.underlying) {
      if (contracts_response.contracts_for.feed_license === 'delayed') {
        if (!window.contract.is_expired) {
          window.request.end = 'latest';
        }
        delete window.request.subscribe;
        window.delayed = true;
      } else {
        window.delayed = false;
      }
      if (!contract.entry_tick_time && window.delayed === false && contract.date_start && parseInt((window.time._i/1000)) >= parseInt(contract.date_start)) {
        show_error('', text.localize('Waiting for entry tick.'));
      } else {
        if (request.subscribe === 1) window.chart_subscribed = true;
        socketSend(window.request);
      }
    } else {
      socketSend({'contracts_for': contract.underlying});
    }
  }

  function update_barrier(options) {
    if (window.chart) {
      if (window.contract.barrier) {
        var barrier;
        if (options.tick) {
          barrier = options.tick.quote;
        } else {
          barrier = window.contract.barrier;
        }
        window.chart.yAxis[0].removePlotLine('barrier');
        window.chart.addPlotLineY({id: 'barrier', value: barrier*1, label: 'Barrier (' + barrier + ')'});
      }
    }
    return;
  }

  // function to set an orange circle on the entry tick
  function select_entry_tick(value) {
    value = parseInt(value);
    if (value && window.tick_type === 'history' && window.chart) {
      var firstIndex = Object.keys(chart.series[0].data)[0];
      for (i = firstIndex; i < chart.series[0].data.length; i++) {
        if (value*1000 === chart.series[0].data[i].x) {
          chart.series[0].data[i].update({marker: {fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4, states: {hover: {fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4}}}});
          return;
        }
      }
    }
  }

  // function to set an orange circle on the exit tick
  function select_exit_tick(value) {
    value = parseInt(value);
    if (value && window.tick_type === 'history') {
      for (i = chart.series[0].data.length - 1; i >= 0; i--) {
        if (value*1000 === chart.series[0].data[i].x) {
          chart.series[0].data[i].update({marker: {fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4, states: {hover: {fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4}}}});
          return;
        }
      }
    }
  }

  // calculate where to display the maximum value of the x-axis of the chart for line chart
  function get_max_history(contract, response) {
    initialize_values(contract);
    var end;
    if (sell_spot_time && sell_time < end_time) {end = sell_spot_time;}
    else if (exit_tick_time) {end = exit_tick_time;}
    else {end = end_time;}
    if (response.history && response.history.times && (is_expired || is_sold)) {
      for (i = response.history.times.length; i >= 0; i--) {
          if (parseInt(response.history.times[i]) === parseInt(end)) {
              window.max = response.history.times[i+1];
              break;
          }
      }
    } else if (window.delayed) {
      if (parseInt(response.history.times[response.history.times.length - 1]) > start_time) {
        window.max = response.history.times[response.history.times.length - 1];
      } else {
        window.max = start_time;
      }
    } else {
      window.max = end_time.toString();
    }
    return;
  }

  // calculate where to display the maximum value of the x-axis of the chart for candle
  function get_max_candle(contract, response) {
    initialize_values(contract);
    if (sell_spot_time && sell_time < end_time) {end = sell_spot_time;}
    else {end = end_time;}
    if (contract.is_expired || contract.is_sold) {
      for (i = response.candles.length - 2; i >= 0; i--) {
          if (response.candles[i] && parseInt(response.candles[i].epoch) <= end && parseInt(response.candles[i+1].epoch) > end) {
              window.max = parseInt(response.candles[i+1].epoch);
              break;
          }
      }
    } else if (window.delayed) {
      if (parseInt(response.candles[response.candles.length - 1].epoch) > start_time) {
        window.max = parseInt(response.candles[response.candles.length - 1].epoch);
      } else {
        window.max = start_time;
      }
    } else {
      window.max = end_time;
    }
    return;
  }

  function draw_line_x(valueTime, labelName, textLeft, dash, color) {
    if(!window.chart) return;
    var req = {
      value : valueTime*1000
    };
    if (labelName && labelName !== '') req.label = labelName;
    if (textLeft === 'textLeft') req.text_left = true;
    if (dash && dash !== '') req.dashStyle = dash;
    if (color) req.color = color;
    window.chart.addPlotLineX(req);
  }

  // function to draw the last line needed and forget the streams
  // also sets the exit tick
  function end_contract(contract) {
    initialize_values(contract);
    if (window.chart) {
      if (exit_tick_time || is_expired || sell_time) {
        if (sell_time && sell_time < end_time) {
          window.is_sold = 'true';
          draw_line_x(sell_time, '', 'textLeft', 'Dash');
        } else if (sell_time && sell_time >= end_time) {
          draw_line_x(end_time, '', 'textLeft', 'Dash');
        }
      }
      if (sell_spot_time && sell_spot_time < end_time && sell_spot_time >= start_time) {
        select_exit_tick(sell_spot_time);
      } else if (exit_tick_time) {
        select_exit_tick(exit_tick_time);
      }
    }
    if (window.responseID) {
      BinarySocket.send({'forget':window.responseID});
    }
    if (sell_time) {
      clear_values();
    }
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
    window.granularity = granularity;
    return [granularity, duration];
  }

  // add the new data to the chart
  function update_chart(contract, options){
    initialize_values(contract);
    var granularity = calculate_granularity(exitTime, now_time, purchase_time, start_time)[0];
    var series = window.chart.series[0];
    var last = series.data[series.data.length - 1];
    if(granularity === 0) {
      window.chart.series[0].addPoint([options.tick.epoch*1000, options.tick.quote*1]);
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
    if (last.x > end_time*1000 || last.x > sell_time*1000) {
      end_contract(contract);
    }
    return;
  }

  return {
    show_chart   : show_chart,
    dispatch     : dispatch,
    clear_values : clear_values
  };
}());
