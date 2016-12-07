var MBContract  = require('../../mb_trade/mb_contract').MBContract;
var japanese_client = require('../../../common_functions/country_base').japanese_client;
var ViewPopupUI = require('../../user/view_popup/view_popup_ui').ViewPopupUI;
var State = require('../../../base/storage').State;
require('../../../../lib/highstock/highstock.js');
require('../../../../lib/highstock/highstock-exporting.js');
require('../../../../lib/highstock/export-csv.js');

var Highchart = (function() {
    var chart,
        options,
        chart_forget,
        responseID,
        contract,
        contract_ended,
        contracts_for_send,
        history_send,
        entry_tick_barrier_drawn,
        initialized,
        chart_delayed,
        chart_subscribed,
        request,
        min_point,
        max_point,
        start_time,
        purchase_time,
        now_time,
        end_time,
        entry_tick_time,
        is_sold,
        sell_time,
        sell_spot_time,
        is_settleable,
        exit_tick_time,
        // entry_spot,
        exit_time,
        underlying;
        // i;
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
    function init_chart(init_options) {
        var data = [];
        var type = '';
        var i;

        var lbl_start_time = '<div style="margin-bottom:3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:solid;border-color:#E98024;display:inline-block"></div> ' + page.text.localize('Start time') + ' ';
        var lbl_entry_spot = '<div style="margin-left:10px;display:inline-block;border:3px solid orange;border-radius:6px;width:4px;height:4px;"></div> ' + page.text.localize('Entry spot') + ' ';
        var lbl_exit_spot = '<div style="margin-left:10px;display:inline-block;background-color:orange;border-radius:6px;width:10px;height:10px;"></div> ' + page.text.localize('Exit spot') + ' ';
        var lbl_end_time = '<div style="margin-bottom: 3px;margin-left:10px;height:0;width:20px;border:0;border-bottom:2px;border-style:dashed;border-color:#E98024;display:inline-block"></div> ' + page.text.localize('End time') + ' ';
        var lbl_delay = '<span style="display:block;text-align:center;margin-bottom:0.2em;color:red"> ' + page.text.localize('Charting for this underlying is delayed') + ' </span>';
      // init_options.history indicates line chart
        if (init_options.history) {
            type = 'line';
            var history = init_options.history;
            var times = history.times;
            var prices = history.prices;
            if (chart_delayed) {
                for (i = 0; i < times.length; ++i) {
                    data.push([parseInt(times[i]) * 1000, prices[i] * 1]);
                }
            } else if (min_point && max_point) {
                for (i = 0; i < times.length; ++i) {
                    if (parseInt(times[i]) >= min_point && parseInt(times[i]) <= max_point) {
              // only display the first tick before entry spot and one tick after exit spot
              // as well as the set of ticks between them
                        data.push([parseInt(times[i]) * 1000, prices[i] * 1]);
                    }
                }
            }
        }
      // init_options.candles indicates candle chart
        if (init_options.candles) {
            type = 'candlestick';
            data = init_options.candles.map(function(c) {
                return [c.epoch * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1];
            });
        }
        var title = page.text.localize(init_options.title);
      // element where chart is to be displayed
        var el = document.getElementById('analysis_live_chart');
        if (!el) return null;

        var chartOptions = {
            chart: {
                type           : 'line',
                renderTo       : el,
                backgroundColor: null, /* make background transparent */
                height         : el.parentElement.offsetHeight > 450 ? el.parentElement.offsetHeight : 450,
            },
            title: {
                text : title,
                style: { fontSize: '16px' },
            },
            credits: {
                enabled: false,
            },
            tooltip: {
                xDateFormat: (japanese_client() ? '%Y/%m/%d, %H:%M:%S' : '%A, %b %e, %H:%M:%S GMT'),
            },
            xAxis: {
                type       : 'datetime',
                categories : null,
                startOnTick: false,
                endOnTick  : false,
          // min indicates where to start displaying the chart
                min        : min_point ? min_point * 1000 : null,
          // max indicates where to stop displaying the chart
                max        : max_point ? max_point * 1000 : null,
                labels     : { overflow: 'justify', format: '{value:%H:%M:%S}' },
            },
            yAxis: {
                labels: { align: 'left', x: 0, y: -2 },
                title : '',
            },
            series: [{
                name : title,
                data : data,
                type : type,
          // zones are used to display color of the line
                zones: [{
              // make the line grey until it reaches entry time or start time if entry spot time is not yet known
                    value: entry_tick_time ? entry_tick_time * 1000 : start_time * 1000,
                    color: '#ccc',
                }, {
              // make the line default color until exit time is reached
                    value: exit_time * 1000 || null,
                    color: '',
                }, {
              // make the line grey again after trade ended
                    color: '#ccc',
                }],
                zoneAxis: 'x',
            }],
            exporting  : { enabled: false, enableImages: false },
            legend     : { enabled: false },
            navigator  : { enabled: true },
            plotOptions: {
                line: {
                    marker: { radius: 2 },
                },
                candlestick: {
                    lineColor  : 'black',
                    color      : 'red',
                    upColor    : 'green',
                    upLineColor: 'black',
                    shadow     : true,
                },
            },
            rangeSelector: { enabled: false },
        };

      // display comma after every three digits instead of space
        Highcharts.setOptions({
            global: {
                timezoneOffset: japanese_client() ? -9 * 60 : 0, // Converting chart time to JST.
            },
            lang: { thousandsSep: ',' },
        });

      // display a guide for clients to know how we are marking entry and exit spots
        if (init_options.history) {
            var txt = lbl_start_time + lbl_entry_spot + lbl_exit_spot + lbl_end_time;
            chartOptions.subtitle = {
                text   : (chart_delayed ? lbl_delay : '') + txt,
                align  : 'center',
                useHTML: true,
            };
            chartOptions.tooltip.valueDecimals = init_options.history.prices[0].split('.')[1].length || 3;
        } else if (init_options.candles) {
            chartOptions.subtitle = {
                text   : chart_delayed ? lbl_delay + lbl_start_time + lbl_end_time : lbl_start_time + lbl_end_time,
                align  : 'center',
                useHTML: true,
            };
            chartOptions.tooltip.valueDecimals = init_options.candles[0].open.split('.')[1].length || 3;
        }

        if (!el) return null;
        var new_chart = new Highcharts.Chart(chartOptions);
        initialized = true;

      // this is used to draw lines such as start and end times
        new_chart.addPlotLineX = function(params) {
            new_chart.xAxis[0].addPlotLine({
                value    : params.value,
                id       : params.id || params.value,
                label    : { text: params.label || '', x: params.text_left ? -15 : 5 },
                color    : params.color || '#e98024',
                zIndex   : 2,
                width    : params.width || 2,
                dashStyle: params.dashStyle || 'Solid',
            });
            var subtitle = new_chart.subtitle.element;
            var subtitle_length = subtitle.childNodes.length;
            if (sell_time && sell_time < end_time) {
                var textnode = document.createTextNode(' '  + page.text.localize('Sell time') + ' ');
                for (i = 0; i < subtitle_length; i++) {
                    if (/End time/.test(subtitle.childNodes[i].nodeValue)) {
                        var item = subtitle.childNodes[i];
                        subtitle.replaceChild(textnode, item);
                    }
                }
            }
        };

      // this is used to draw lines such as barrier
        new_chart.addPlotLineY = function(params) {
            new_chart.yAxis[0].addPlotLine({
                id       : params.id || params.label,
                value    : params.value,
                label    : { text: params.label, align: 'center' },
                color    : params.color || 'green',
                zIndex   : 1,
                width    : 2,
                dashStyle: params.dashStyle || 'Solid',
            });
        };

        el.chart = new_chart;

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
        is_settleable   = contract.is_settleable;
        exit_tick_time  = parseInt(contract.exit_tick_time);
        exit_time       = is_sold && sell_time < end_time ? sell_spot_time : exit_tick_time || end_time;
        underlying      = contract.underlying;
    }

  // use this instead of BinarySocket.send to avoid overriding the on-message function of trading page
    var socketSend = function(req) {
        if (!req) return;
        if (!req.hasOwnProperty('passthrough')) {
            req.passthrough = {};
        }
      // send dispatch_to to help socket.js forward the correct response back to here
        req.passthrough.dispatch_to = 'ViewChartWS';
        BinarySocket.send(req);
    };

    var dispatch = function(response) {
        var type = response.msg_type,
            error = response.error,
            i;
        if (type === 'contracts_for' && (!error || (error && error.code && error.code === 'InvalidSymbol'))) {
            if (response.contracts_for && response.contracts_for.feed_license) {
                handle_delay(response.contracts_for.feed_license);
                save_feed_license(response.echo_req.contracts_for, response.contracts_for.feed_license);
            }
            show_entry_error();
        } else if ((type === 'history' || type === 'candles' || type === 'tick' || type === 'ohlc') && !error) {
            responseID = response[type].id;
      // send view popup the response ID so view popup can forget the calls if it's closed before contract ends
            if (responseID) ViewPopupUI.storeSubscriptionID(responseID, 'chart');
            options = { title: contract.display_name };
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
                                min_point = parseInt(response.history.times[(i === 0 ? i : i - 1)]);
                                break;
                            } else if (
                                (
                                 purchase_time &&
                                 start_time > parseInt(purchase_time) &&
                                 parseInt(response.history.times[i]) === parseInt(purchase_time)
                                )
                                ||
                                (
                                 parseInt(response.history.times[i]) < parseInt(purchase_time) &&
                                 parseInt(response.history.times[
                                     (i === response.history.times.length - 1 ? i : i + 1)
                                 ]) > parseInt(purchase_time)
                                )
                            ) {
                // set the chart to display from the tick before purchase_time
                                min_point = parseInt(response.history.times[(i === 0 ? i : i - 1)]);
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
                    for (i = 1; i < response.candles.length; i++) {
                        if (
                            entry_tick_time && response.candles[i] &&
                            parseInt(response.candles[i].epoch) <= parseInt(entry_tick_time) &&
                            response.candles[
                                (i === response.candles.length - 1 ? i : i + 1)
                             ].epoch > parseInt(entry_tick_time)
                        ) {
              // set the chart to display from the candle before entry_tick_time
                            min_point = parseInt(response.candles[i - 1].epoch);
                            break;
                        } else if (
                            purchase_time &&
                            response.candles[i] &&
                            parseInt(response.candles[i].epoch) <= parseInt(purchase_time) &&
                            response.candles[
                                (i === response.candles.length - 1 ? i : i + 1)
                             ].epoch > parseInt(purchase_time)
                        ) {
              // set the chart to display from the candle before purchase_time
                            min_point = parseInt(response.candles[i - 1].epoch);
                            break;
                        }
                    }
                    get_max_candle(response);
                }
        // only initialize chart if it hasn't already been initialized
                if (!chart && !initialized) {
                    chart = init_chart(options);
                    if (!chart) return;

                    if (purchase_time !== start_time) draw_line_x(purchase_time, page.text.localize('Purchase Time'), '', '', '#7cb5ec');

          // second condition is used to make sure contracts that have purchase time
          // but are sold before the start time don't show start time
                    if (!is_sold || (is_sold && sell_time && sell_time > start_time)) {
                        draw_line_x(start_time);
                    }

          // var duration = calculate_granularity(end_time, now_time, purchase_time, start_time)[1];

          // show end time before contract ends if duration of contract is less than one day
          // second OR condition is used so we don't draw end time again if there is sell time before
                    if (
                        end_time - (start_time || purchase_time) <= 24 * 60 * 60 &&
                        (!is_sold || (is_sold && sell_time && sell_time >= end_time))
                    ) {
                        draw_line_x(end_time, '', 'textLeft', 'Dash');
                    }
                }
                if (is_sold || is_settleable) {
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
            if (entry_tick_time) {
                select_entry_tick_barrier();
            }
            forget_streams();
        } else if (type === 'ticks_history' && error) {
            show_error('', error.message);
        }
    };

    function show_chart(proposal_contract, update) {
        contract = proposal_contract;
        initialize_values();
        if (!update) {
            init_once();
        }
        if (!chart && !history_send) {
            request_data(update || '');
        } else if (entry_tick_time && chart) {
            select_entry_tick_barrier();
        }
        if ((is_sold || is_settleable) && chart) {
            reset_max();
            reselect_exit_time();
            end_contract();
        }
        forget_streams();
    }

    function show_error(type, message) {
        var el = document.getElementById('analysis_live_chart');
        if (!el) return;
        if (type === 'missing') {
            el.innerHTML = '<p class="error-msg">' + page.text.localize('Ticks history returned an empty array.') + '</p>';
        } else {
            el.innerHTML = '<p class="error-msg">' + message + '</p>';
        }
    }

    function request_data(update) {
        var calculateGranularity = calculate_granularity(exit_time, now_time, purchase_time, start_time);
        var granularity = calculateGranularity[0],
            duration    = calculateGranularity[1],
            margin      = 0; // time margin
        margin = granularity === 0 ? Math.max(300, (30 * duration) / (60 * 60) || 0) : 3 * granularity;

        request = {
            ticks_history    : underlying,
            start            : (parseInt(purchase_time || start_time) - margin).toFixed(0), /* load more ticks first */
            end              : end_time ? (parseInt(end_time) + margin).toFixed(0) : 'latest',
            style            : 'ticks',
            count            : 4999, /* maximum number of ticks possible */
            adjust_start_time: 1,
        };

        if (is_sold && sell_time < end_time) {
            request.end = sell_spot_time ? (parseInt(sell_spot_time) + margin).toFixed(0) : 'latest';
        }

        if (granularity !== 0) {
            request.granularity = granularity;
            request.style = 'candles';
        }

        if (!is_settleable && !sell_spot_time && (window.time.valueOf() / 1000) < end_time && !chart_subscribed) {
            request.subscribe = 1;
        }

        var contracts_response = State.get('is_mb_trading') ? MBContract.getContractsResponse() : window.contracts_for;

        if (contracts_response && contracts_response.echo_req.contracts_for === underlying) {
            var license = contracts_response.contracts_for.feed_license;
            if (contracts_response.contracts_for && license) {
                handle_delay(license);
                save_feed_license(contracts_response.echo_req.contracts_for, license);
            }
            show_entry_error();
        } else if (sessionStorage.getItem('license.' + underlying)) {
            handle_delay(sessionStorage.getItem('license.' + underlying));
            show_entry_error();
        } else if (!contracts_for_send && update === '') {
            socketSend({ contracts_for: underlying });
            contracts_for_send = true;
        }
    }

    function show_entry_error() {
        if (!entry_tick_time && chart_delayed === false && start_time && window.time.unix() >= parseInt(start_time)) {
            show_error('', page.text.localize('Waiting for entry tick.'));
        } else if (!history_send) {
            history_send = true;
            if (request.subscribe) chart_subscribed = true;
            socketSend(request);
        }
    }

    function handle_delay(feed_license) {
        if (feed_license !== 'realtime') {
            if (!is_settleable) {
                request.end = 'latest';
            }
            delete request.subscribe;
            chart_delayed = true;
        }
    }

  // we have to update the color zones with the correct entry_tick_time
  // and barrier value
    function select_entry_tick_barrier() {
        if (entry_tick_time && chart && !entry_tick_barrier_drawn) {
            select_entry_tick(entry_tick_time);
            if (chart) {
                draw_barrier();
                chart.series[0].zones[0].value = parseInt(entry_tick_time) * 1000;
        // force to redraw:
                chart.isDirty = true;
                chart.redraw();
            }
            entry_tick_barrier_drawn = true;
        }
    }

  // update color zone of exit time
    function reselect_exit_time() {
        if (chart && exit_time) {
            chart.series[0].zones[1].value = parseInt(exit_time) * 1000;
      // force to redraw:
            chart.isDirty = true;
            chart.redraw();
        }
    }

  // function to set an orange circle on the entry tick
    function select_entry_tick(value) {
        var i;
        value = parseInt(value);
        if (value && (options.history || options.tick) && chart) {
            var firstIndex = Object.keys(chart.series[0].data)[0];
            for (i = firstIndex; i < chart.series[0].data.length; i++) {
                if (value * 1000 === chart.series[0].data[i].x) {
                    chart.series[0].data[i].update({ marker: { fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4, states: { hover: { fillColor: '#fff', lineColor: 'orange', lineWidth: 3, radius: 4 } } } });
                    return;
                }
            }
        }
    }

    function draw_barrier() {
        if (chart.yAxis[0].plotLinesAndBands.length === 0) {
            if (contract.barrier) {
                chart.addPlotLineY({ id: 'barrier', value: contract.barrier * 1, label: page.text.localize('Barrier ([_1])').replace('[_1]', contract.barrier), dashStyle: 'Dot' });
            } else if (contract.high_barrier && contract.low_barrier) {
                chart.addPlotLineY({ id: 'high_barrier', value: contract.high_barrier * 1, label: page.text.localize('High Barrier ([_1])').replace('[_1]', contract.high_barrier), dashStyle: 'Dot' });
                chart.addPlotLineY({ id: 'low_barrier', value: contract.low_barrier * 1, label: page.text.localize('Low Barrier ([_1])').replace('[_1]', contract.low_barrier), dashStyle: 'Dot' });
            }
        }
    }

  // function to set an orange circle on the exit tick
    function select_exit_tick(value) {
        var i;
        value = parseInt(value);
        if (value && (options.tick || options.history)) {
            for (i = chart.series[0].data.length - 1; i >= 0; i--) {
                if (value * 1000 === chart.series[0].data[i].x) {
                    chart.series[0].data[i].update({ marker: { fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4, states: { hover: { fillColor: 'orange', lineColor: 'orange', lineWidth: 3, radius: 4 } } } });
                    return;
                }
            }
        }
    }

    function reset_max() {
        if (sell_time && sell_time < end_time && chart) {
            chart.xAxis[0].setExtremes(min_point ? min_point * 1000 : null, (parseInt(sell_time) + 3) * 1000);
        }
    }

  // calculate where to display the maximum value of the x-axis of the chart for line chart
    function get_max_history(response) {
        var end,
            i;
        if (sell_spot_time && sell_time < end_time) {
            end = sell_spot_time;
        } else if (exit_tick_time) {
            end = exit_tick_time;
        } else {
            end = end_time;
        }
        if (response.history && response.history.times && (is_settleable || is_sold)) {
            for (i = response.history.times.length - 1; i >= 0; i--) {
                if (parseInt(response.history.times[i]) === parseInt(end)) {
                    max_point = parseInt(response.history.times[i === response.history.times.length - 1 ? i : i + 1]);
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
    }

  // calculate where to display the maximum value of the x-axis of the chart for candle
    function get_max_candle(response) {
        var end,
            i;
        if (sell_spot_time && sell_time < end_time) { end = sell_spot_time; } else { end = end_time; }
        if (is_settleable || is_sold) {
            for (i = response.candles.length - 2; i >= 0; i--) {
                if (
                    response.candles[i] &&
                    parseInt(response.candles[i].epoch) <= end &&
                    parseInt(response.candles[i + 1].epoch) > end
                ) {
                    max_point = parseInt(response.candles[i + 1].epoch);
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
    }

    function draw_line_x(valueTime, labelName, textLeft, dash, color) {
        if (!chart) return;
        var req = {
            value: valueTime * 1000,
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
    }

    function forget_streams() {
        if (
            chart &&
            chart.series &&
            chart.series[0].data.length >= 1 &&
            !chart_forget &&
            (is_sold || is_settleable) &&
            responseID
        ) {
            var last = chart.series[0].data[chart.series[0].data.length - 1];
            if (parseInt(last.x) > end_time * 1000 || parseInt(last.x) > sell_time * 1000) {
                socketSend({ forget: responseID });
                chart_forget = true;
            }
        }
    }

    function calculate_granularity(end, now, purchase, start) {
        var duration = Math.min(end * 1, now) - (purchase || start);
        var granularity = 0;
        if (duration <= 60 * 60) { // 1 hour
            granularity = 0;
        } else if (duration <= 2 * 60 * 60) { // 2 hours
            granularity = 120;
        } else if (duration <= 6 * 60 * 60) { // 6 hours
            granularity = 600;
        } else if (duration <= 24 * 60 * 60) { // 1 day
            granularity = 900;
        } else if (duration <= 24 * 5 * 60 * 60) { // 5 days
            granularity = 3600;
        } else if (duration <= 24 * 30 * 60 * 60) { // 30 days
            granularity = 14400;
        } else { // more than 30 days
            granularity = 86400;
        }
        return [granularity, duration];
    }

  // add the new data to the chart
    function update_chart(update_options) {
        var granularity = calculate_granularity(exit_time, now_time, purchase_time, start_time)[0];
        var series = chart.series[0];
        var last = series.data[series.data.length - 1];
        if (granularity === 0) {
            chart.series[0].addPoint([update_options.tick.epoch * 1000, update_options.tick.quote * 1]);
        } else {
            var c = update_options.ohlc;
            if (!c) return;
            var ohlc = [c.open_time * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1];

            if (last.x !== ohlc[0]) {
                series.addPoint(ohlc, true, true);
            } else {
                last.update(ohlc, true);
            }
        }
    }

    function save_feed_license(save_contract, license) {
        var regex = new RegExp('license.' + contract),
            match_found = false,
            i;

        for (i = 0; i < sessionStorage.length; i++) {
            if (regex.test(sessionStorage.key(i))) {
                match_found = true;
                break;
            }
        }

        if (!match_found) {
            sessionStorage.setItem('license.' + save_contract, license);
        }
    }

    return {
        show_chart: show_chart,
        dispatch  : dispatch,
    };
})();

module.exports = {
    Highchart: Highchart,
};
