const japanese_client = require('../../../common_functions/country_base').japanese_client;
const MBContract      = require('../../mb_trade/mb_contract').MBContract;
const ViewPopupUI     = require('../../user/view_popup/view_popup_ui').ViewPopupUI;
const State           = require('../../../base/storage').State;
const localize        = require('../../../base/localize').localize;
const template        = require('../../../base/utility').template;
const HighchartUI     = require('./highchart_ui').HighchartUI;
const Highcharts      = require('highcharts/highstock');
require('highcharts/modules/exporting')(Highcharts);

const Highchart = (function() {
    let chart,
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
        exit_time,
        underlying;

    const init_once = function() {
        chart = '';
        initialized = false;
        chart_delayed = false;
        chart_subscribed = false;
        chart_forget = false;
        contract_ended = false;
        contracts_for_send = false;
        history_send = false;
        entry_tick_barrier_drawn = false;
    };

    // initiate the chart for the first time only, send it ticks or candles data
    const init_chart = function(init_options) {
        let data = [],
            type = '',
            i;

        const push_ticks = function(time, price) {
            time = parseInt(time);
            // if we are no longer streaming data (viewing historical contract)
            // we need to add the marker as we are pushing the data points
            // since for large arrays, data doesn't get pushed to series[0].data,
            // so we can't update marker consistently through that
            if (exit_tick_time) {
                const object = { x: time * 1000, y: price * 1 };
                if (time === entry_tick_time) {
                    object.marker = get_marker_object('white');
                } else if (time === exit_tick_time || (user_sold() && time === sell_spot_time)) {
                    object.marker = get_marker_object('orange');
                }
                data.push(object);
            } else {
                data.push([time * 1000, price * 1]);
            }
        };

        let history = '',
            candles = '';
        if (init_options.history) { // init_options.history indicates line chart
            type = 'line';
            history = init_options.history;
            const times = history.times;
            const prices = history.prices;
            if (chart_delayed) {
                for (i = 0; i < times.length; ++i) {
                    push_ticks(times[i], prices[i]);
                }
            } else if (min_point && max_point) {
                let current_time;
                for (i = 0; i < times.length; ++i) {
                    current_time = parseInt(times[i]);
                    if (current_time >= min_point && current_time <= max_point) {
                        // only display the first tick before entry spot and one tick after exit spot
                        // as well as the set of ticks between them
                        push_ticks(current_time, prices[i]);
                    }
                }
            }
        } else if (init_options.candles) { // init_options.candles indicates candle chart
            candles = init_options.candles;
            type = 'candlestick';
            data = candles.map(function(c) {
                return [c.epoch * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1];
            });
        }

        // element where chart is to be displayed
        const el = document.getElementById('analysis_live_chart');
        if (!el) return null;

        const JPClient = japanese_client();
        HighchartUI.set_labels(chart_delayed);
        HighchartUI.set_chart_options({
            height    : el.parentElement.offsetHeight,
            title     : localize(init_options.title),
            JPClient  : JPClient,
            decimals  : history ? history.prices[0] : candles[0].open,
            type      : type,
            data      : data,
            entry_time: entry_tick_time ? entry_tick_time * 1000 : start_time * 1000,
            exit_time : exit_time ? exit_time * 1000 : null,
        });

        // display comma after every three digits instead of space
        Highcharts.setOptions(HighchartUI.get_highchart_options(JPClient));

        if (!el) return null;

        const new_chart = new Highcharts.StockChart(el, HighchartUI.get_chart_options());
        initialized = true;

        return new_chart;
    };

    // this is used to draw lines such as start and end times
    const addPlotLineX = function(params) {
        chart.xAxis[0].addPlotLine(HighchartUI.get_plotline_options(params, 'x'));
        if (user_sold()) {
            HighchartUI.replace_exit_label_with_sell(chart.subtitle.element);
        }
    };

    // this is used to draw lines such as barrier
    const addPlotLineY = function(params) {
        chart.yAxis[0].addPlotLine(HighchartUI.get_plotline_options(params, 'y'));
    };

    // since these values are used in almost every function, make them easy to initialize
    const initialize_values = function() {
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
        exit_time       = parseInt(is_sold && sell_time < end_time ? sell_spot_time : exit_tick_time || end_time);
        underlying      = contract.underlying;
    };

    // use this instead of BinarySocket.send to avoid overriding the on-message function of trading page
    const socketSend = function(req) {
        if (!req) return;
        if (!req.hasOwnProperty('passthrough')) {
            req.passthrough = {};
        }
        // send dispatch_to to help socket.js forward the correct response back to here
        req.passthrough.dispatch_to = 'ViewChartWS';
        BinarySocket.send(req);
    };

    const dispatch = function(response) {
        const type  = response.msg_type,
            error = response.error;
        if (type === 'contracts_for' && (!error || (error.code && error.code === 'InvalidSymbol'))) {
            delayed_chart(response.contracts_for);
        } else if (/(history|candles|tick|ohlc)/.test(type) && !error) {
            responseID = response[type].id;
            // send view popup the response ID so view popup can forget the calls if it's closed before contract ends
            if (responseID) ViewPopupUI.storeSubscriptionID(responseID, 'chart');
            options = { title: contract.display_name };
            options[type] = response[type];
            const history = response.history,
                candles = response.candles,
                tick    = response.tick,
                ohlc    = response.ohlc;
            if (history || candles) {
                const length = (history ? history.times : candles).length;
                if (length === 0) {
                    HighchartUI.show_error('missing');
                    return;
                }
                if (history) {
                    const history_times = history.times;
                    get_min_history(history_times);
                    get_max_history(history_times);
                } else if (candles) {
                    get_min_candle(candles);
                    get_max_candle(candles);
                }
                // only initialize chart if it hasn't already been initialized
                if (!chart && !initialized) {
                    chart = init_chart(options);
                    if (!chart) return;

                    if (purchase_time !== start_time) draw_line_x(purchase_time, localize('Purchase Time'), '', '', '#7cb5ec');

                    // second condition is used to make sure contracts that have purchase time
                    // but are sold before the start time don't show start time
                    if (!is_sold || (is_sold && sell_time && sell_time > start_time)) {
                        draw_line_x(start_time);
                    }

                    // show end time before contract ends if duration of contract is less than one day
                    // second OR condition is used so we don't draw end time again if there is sell time before
                    // commenting this for now as max is not set as expected in new version of chart
                    /* if (
                        end_time - (start_time || purchase_time) <= 24 * 60 * 60 &&
                        (!is_sold || (is_sold && !user_sold()))
                    ) {
                        draw_line_x(end_time, '', 'textLeft', 'Dash');
                    } */
                }
                if (is_sold || is_settleable) {
                    // reset_max();
                    reselect_exit_time();
                    end_contract();
                }
            } else if ((tick || ohlc) && !chart_forget) {
                if (chart && chart.series) {
                    update_chart(options);
                }
            }
            if (entry_tick_time) {
                select_entry_tick_barrier();
            }
            forget_streams();
        } else if (type === 'ticks_history' && error) {
            HighchartUI.show_error('', error.message);
        }
    };

    const show_chart = function(proposal_contract, update) {
        contract = proposal_contract;
        initialize_values();
        if (!update) {
            init_once();
        }
        if (!chart && !history_send) {
            request_data(update || '');
        } else if (chart && entry_tick_time) {
            select_entry_tick_barrier();
        }
        if (chart && (is_sold || is_settleable)) {
            // reset_max();
            reselect_exit_time();
            end_contract();
        }
        forget_streams();
    };

    const request_data = function(update) {
        const calculateGranularity = calculate_granularity(exit_time, now_time, purchase_time, start_time);
        const granularity = calculateGranularity[0],
            duration    = calculateGranularity[1],
            margin      = granularity === 0 ? Math.max(300, (30 * duration) / (60 * 60) || 0) : 3 * granularity;

        request = {
            ticks_history    : underlying,
            start            : ((purchase_time || start_time) - margin).toFixed(0), /* load more ticks first */
            end              : end_time ? (end_time + margin).toFixed(0) : 'latest',
            style            : granularity === 0 ? 'ticks' : 'candles',
            count            : 4999, /* maximum number of ticks possible */
            adjust_start_time: 1,
        };

        if (is_sold && sell_time < end_time) {
            request.end = sell_spot_time ? (parseInt(sell_spot_time) + margin).toFixed(0) : 'latest';
        }

        if (granularity !== 0) {
            request.granularity = granularity;
        }

        if (!is_settleable && !sell_spot_time && (window.time.valueOf() / 1000) < end_time && !chart_subscribed) {
            request.subscribe = 1;
        }

        const contracts_response = State.get('is_mb_trading') ? MBContract.getContractsResponse() : window.contracts_for,
            stored_delay = sessionStorage.getItem('license.' + underlying);

        if (contracts_response && contracts_response.echo_req.contracts_for === underlying) {
            delayed_chart(contracts_response);
        } else if (stored_delay) {
            handle_delay(stored_delay);
            show_entry_error();
        } else if (!contracts_for_send && update === '') {
            socketSend({ contracts_for: underlying });
            contracts_for_send = true;
        }
    };

    const delayed_chart = function(contracts_response) {
        if (contracts_response.contracts_for && contracts_response.contracts_for.feed_license) {
            const license = contracts_response.contracts_for.feed_license;
            handle_delay(license);
            save_feed_license(contracts_response.echo_req.contracts_for, license);
        }
        show_entry_error();
    };

    const show_entry_error = function() {
        if (!entry_tick_time && !chart_delayed && start_time && window.time.unix() >= parseInt(start_time)) {
            HighchartUI.show_error('', localize('Waiting for entry tick.'));
        } else if (!history_send) {
            history_send = true;
            if (request.subscribe) chart_subscribed = true;
            socketSend(request);
        }
    };

    const handle_delay = function(feed_license) {
        if (feed_license !== 'realtime') {
            if (!is_settleable) {
                request.end = 'latest';
            }
            delete request.subscribe;
            chart_delayed = true;
        }
    };

    // we have to update the color zones with the correct entry_tick_time
    // and barrier value
    const select_entry_tick_barrier = function() {
        if (chart && entry_tick_time) {
            if (chart && !entry_tick_barrier_drawn) {
                draw_barrier();
                chart.series[0].zones[0].value = entry_tick_time * 1000;
                redraw_chart();
                entry_tick_barrier_drawn = true;
            }
            if (chart) {
                select_tick(entry_tick_time, 'entry');
            }
        }
    };

    // update color zone of exit time
    const reselect_exit_time = function() {
        if (chart && exit_time) {
            chart.series[0].zones[1].value = exit_time * 1000;
            redraw_chart();
        }
    };

    const redraw_chart = function() {
        // force to redraw:
        chart.isDirty = true;
        chart.redraw();
    };

    const draw_barrier = function() {
        if (chart.yAxis[0].plotLinesAndBands.length === 0) {
            const barrier = contract.barrier,
                high_barrier = contract.high_barrier,
                low_barrier = contract.low_barrier;
            if (barrier) {
                addPlotLineY({ id: 'barrier',      value: barrier * 1,      label: template(localize('Barrier ([_1])'), [barrier]),           dashStyle: 'Dot' });
            } else if (high_barrier && low_barrier) {
                addPlotLineY({ id: 'high_barrier', value: high_barrier * 1, label: template(localize('High Barrier ([_1])'), [high_barrier]), dashStyle: 'Dot' });
                addPlotLineY({ id: 'low_barrier',  value: low_barrier * 1,  label: template(localize('Low Barrier ([_1])'), [low_barrier]),   dashStyle: 'Dot' });
            }
        }
    };

    // function to set an orange circle on the entry/exit tick
    const select_tick = function(value, tick_type) {
        if (chart && value && tick_type && (options.tick || options.history)) {
            const data = chart.series[0].data;
            let current_data;
            for (let i = data.length - 1; i >= 0; i--) {
                current_data = data[i];
                update_marker(value, current_data, (tick_type === 'entry' ? 'white' : 'orange'));
            }
        }
    };

    const update_marker = function(value, current_data, color) {
        if (value * 1000 === current_data.x) {
            current_data.update({ marker: get_marker_object(color) });
        }
    };

    const get_marker_object = function(color) {
        return { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4, states: { hover: { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4 } } };
    };


    // commenting this for now as setting max does not work as expected with the new chart
    /* function reset_max() {
        if (chart && user_sold()) {
            chart.xAxis[0].setExtremes(min_point ? min_point * 1000 : null, (parseInt(sell_time) + 3) * 1000);
        }
    } */

    // calculate where to display the minimum value of the x-axis of the chart for line chart
    const get_min_history = function(history_times) {
        const history_times_length = history_times.length;
        let history_times_int;
        for (let i = 0; i < history_times_length; i++) {
            history_times_int = parseInt(history_times[i]);
            if (
                (
                    entry_tick_time && history_times_int === entry_tick_time
                ) ||
                (
                    purchase_time &&
                    start_time > purchase_time &&
                    history_times_int === purchase_time
                ) ||
                (
                    history_times_int < purchase_time &&
                    parseInt(history_times[(i === history_times_length - 1 ? i : i + 1)]) > purchase_time
                )
            ) {
                // set the chart to display from the tick before entry_tick_time or purchase_time
                min_point = parseInt(history_times[(i === 0 ? i : i - 1)]);
                break;
            }
        }
        if (!min_point) min_point = parseInt(history_times[0]);
    };

    // calculate where to display the maximum value of the x-axis of the chart for line chart
    const get_max_history = function(history_times) {
        let end = end_time;
        if (sell_spot_time && sell_time < end_time) {
            end = sell_spot_time;
        } else if (exit_tick_time) {
            end = exit_tick_time;
        }

        const history_times_length = history_times.length;
        if (is_settleable || is_sold) {
            for (let i = history_times_length - 1; i >= 0; i--) {
                if (parseInt(history_times[i]) === end) {
                    max_point = parseInt(history_times[i === history_times_length - 1 ? i : i + 1]);
                    break;
                }
            }
        }
        set_max_for_delayed_chart(history_times, history_times_length);
    };

    // calculate where to display the minimum value of the x-axis of the chart for candle
    const get_min_candle = function(candles) {
        const candle_before_time = function(value) {
            return (value && current_candle &&
                parseInt(current_candle.epoch) <= value &&
                candles[(i === candles_length - 1 ? i : i + 1)].epoch > value
            );
        };
        let i,
            current_candle;
        const candles_length = candles.length;
        for (i = 1; i < candles_length; i++) {
            current_candle = candles[i];
            if (candle_before_time(entry_tick_time) || candle_before_time(purchase_time)) {
                // set the chart to display from the candle before entry_tick_time or purchase_time
                min_point = parseInt(candles[i - 1].epoch);
                break;
            }
        }
    };

    // calculate where to display the maximum value of the x-axis of the chart for candle
    const get_max_candle = function(candles) {
        const end = sell_spot_time && sell_time < end_time ? sell_spot_time : end_time,
            candle_length = candles.length;
        let current_candle,
            next_candle;
        if (is_settleable || is_sold) {
            for (let i = candle_length - 2; i >= 0; i--) {
                current_candle = candles[i];
                next_candle = candles[i + 1];
                if (!current_candle) return;
                if (parseInt(next_candle.epoch) < end) {
                    max_point = end_time;
                    break;
                }
                if (parseInt(current_candle.epoch) <= end && parseInt(next_candle.epoch) > end) {
                    max_point = parseInt(next_candle.epoch);
                    break;
                }
            }
        }
        set_max_for_delayed_chart(candles, candle_length);
    };

    const set_max_for_delayed_chart = function(array, array_length) {
        if (chart_delayed) {
            const last_epoch = parseInt(array[array_length - 1].epoch);
            if (last_epoch > start_time) {
                max_point = last_epoch;
            } else {
                max_point = start_time;
            }
        }
        if (!max_point) max_point = end_time;
    };

    const draw_line_x = function(valueTime, labelName, textLeft, dash, color) {
        if (chart) {
            addPlotLineX({
                value    : valueTime * 1000,
                label    : labelName || '',
                textLeft : textLeft === 'textLeft',
                dashStyle: dash || '',
                color    : color || '',
            });
        }
    };

    // const to = function draw the last line needed and forget the streams
    // also sets the exit tick
    const end_contract = function() {
        if (chart) {
            draw_line_x((user_sold() ? sell_time : end_time), '', 'textLeft', 'Dash');
            if (sell_spot_time && sell_spot_time < end_time && sell_spot_time >= start_time) {
                select_tick(sell_spot_time, 'exit');
            } else if (exit_tick_time) {
                select_tick(exit_tick_time, 'exit');
            }
            if (!contract.sell_spot && !contract.exit_tick) {
                if ($('#waiting_exit_tick').length === 0) {
                    $('#trade_details_message').append('<div id="waiting_exit_tick">' + localize('Waiting for exit tick.') + '</div>');
                }
            } else {
                $('#waiting_exit_tick').remove();
            }
        }
        if (!contract_ended) {
            forget_streams();
            contract_ended = true;
        }
    };

    const forget_streams = function() {
        if (
            chart &&
            !chart_forget &&
            (is_sold || is_settleable) &&
            responseID &&
            chart.series &&
            chart.series[0].data.length >= 1
        ) {
            const data = chart.series[0].data;
            const last = parseInt(data[data.length - 1].x);
            if (last > (end_time * 1000) || last > (sell_time * 1000)) {
                socketSend({ forget: responseID });
                chart_forget = true;
            }
        }
    };

    const calculate_granularity = function(end, now, purchase, start) {
        const duration = Math.min(end, now) - (purchase || start);
        let granularity;
              // days * hours * minutes * seconds
        if      (duration <            60 * 60) granularity = 0;     // less than 1 hour
        else if (duration <        2 * 60 * 60) granularity = 120;   // 2 hours
        else if (duration <        6 * 60 * 60) granularity = 600;   // 6 hours
        else if (duration <       24 * 60 * 60) granularity = 900;   // 1 day
        else if (duration <   5 * 24 * 60 * 60) granularity = 3600;  // 5 days
        else if (duration <  30 * 24 * 60 * 60) granularity = 14400; // 30 days
        else                                    granularity = 86400; // more than 30 days

        return [granularity, duration];
    };

    // add the new data to the chart
    const update_chart = function(update_options) {
        const granularity = calculate_granularity(exit_time, now_time, purchase_time, start_time)[0];
        const series = chart.series[0];
        if (granularity === 0) {
            const data = update_options.tick;
            chart.series[0].addPoint([data.epoch * 1000, data.quote * 1]);
        } else {
            const c = update_options.ohlc;
            const last = series.data[series.data.length - 1];
            if (!c || !last) return;
            const ohlc = [c.open_time * 1000, c.open * 1, c.high * 1, c.low * 1, c.close * 1];

            if (last.x !== ohlc[0]) {
                series.addPoint(ohlc, true, true);
            } else {
                last.update(ohlc, true);
            }
        }
    };

    const save_feed_license = function(save_contract, license) {
        const regex = new RegExp('license.' + contract);
        let match_found = false;

        for (let i = 0; i < sessionStorage.length; i++) {
            if (regex.test(sessionStorage.key(i))) {
                match_found = true;
                break;
            }
        }

        if (!match_found) {
            sessionStorage.setItem('license.' + save_contract, license);
        }
    };

    const user_sold = function() {
        return sell_time && sell_time < end_time;
    };

    return {
        show_chart: show_chart,
        dispatch  : dispatch,
    };
})();

module.exports = {
    Highchart: Highchart,
};
