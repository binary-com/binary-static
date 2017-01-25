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
        responseID,
        contract,
        request,
        min_point,
        max_point;

    let start_time,
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

    let is_initialized,
        is_chart_delayed,
        is_chart_subscribed,
        is_chart_forget,
        is_contracts_for_send,
        is_history_send,
        is_entry_tick_barrier_selected;

    const init_once = function() {
        chart = options = responseID = contract = request = min_point = max_point = '';

        is_initialized = is_chart_delayed = is_chart_subscribed = is_chart_forget =
        is_contracts_for_send = is_history_send = is_entry_tick_barrier_selected = false;
    };

    // since these values are used in almost every function, make them easy to call
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

    // initialize the chart only once with ticks or candles data
    const init_chart = function(init_options) {
        let data = [],
            type = '',
            i;

        const push_ticks = function(time, price) {
            // we need to add the marker as we are pushing the data points
            // since for large arrays, data doesn't get pushed to series[0].data
            // and we can't update markers if data is empty
            time = parseInt(time);
            const is_match_entry = time === entry_tick_time,
                is_match_exit = time === exit_tick_time,
                tick_type = is_match_entry ? 'entry' : 'exit';
            data.push({
                x     : time * 1000,
                y     : price * 1,
                marker: is_match_entry || is_match_exit ? HighchartUI.get_marker_object(tick_type) : '',
            });
        };

        let history = '',
            candles = '';
        if (init_options.history) { // indicates line chart
            type = 'line';
            history = init_options.history;
            const times = history.times;
            const prices = history.prices;
            if (is_chart_delayed) {
                for (i = 0; i < times.length; ++i) {
                    push_ticks(times[i], prices[i]);
                }
            } else if (min_point && max_point) {
                let current_time;
                for (i = 0; i < times.length; ++i) {
                    current_time = parseInt(times[i]);
                    // only display the first tick before entry spot and one tick after exit spot
                    // as well as the set of ticks between them
                    if (current_time >= min_point && current_time <= max_point) {
                        push_ticks(current_time, prices[i]);
                    }
                }
            }
        } else if (init_options.candles) { // indicates candle chart
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
        HighchartUI.set_labels(is_chart_delayed);
        HighchartUI.set_chart_options({
            height    : el.parentElement.offsetHeight,
            title     : localize(init_options.title),
            JPClient  : JPClient,
            decimals  : history ? history.prices[0] : candles[0].open,
            type      : type,
            data      : data,
            entry_time: entry_tick_time ? entry_tick_time * 1000 : start_time * 1000,
            exit_time : exit_time ? exit_time * 1000 : null,
            user_sold : user_sold(),
        });
        Highcharts.setOptions(HighchartUI.get_highchart_options(JPClient));

        if (!el) return null;
        const new_chart = Highcharts.StockChart(el, HighchartUI.get_chart_options());
        is_initialized = true;
        return new_chart;
    };

    // type 'x' is used to draw lines such as start and end times
    // type 'y' is used to draw lines such as barrier
    const addPlotLine = function(params, type) {
        chart[(type + 'Axis')][0].addPlotLine(HighchartUI.get_plotline_options(params, type));
        if (user_sold()) {
            HighchartUI.replace_exit_label_with_sell(chart.subtitle.element);
        }
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
            delayed_chart(response);
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
                if (!chart && !is_initialized) {
                    chart = init_chart(options);
                    if (!chart) return;

                    if (purchase_time !== start_time) draw_line_x(purchase_time, localize('Purchase Time'), '', '', '#7cb5ec');

                    // second condition is used to make sure contracts that have purchase time
                    // but are sold before the start time don't show start time
                    if (!is_sold || (is_sold && sell_time && sell_time > start_time)) {
                        draw_line_x(start_time);
                    }
                }
            } else if ((tick || ohlc) && !is_chart_forget) {
                if (chart && chart.series) {
                    update_chart(options);
                }
            }
            if (entry_tick_time && !is_entry_tick_barrier_selected) {
                select_entry_tick_barrier();
            }
            if ((is_sold || is_settleable)) {
                update_zone('exit');
                end_contract();
            }
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
        if (!chart && !is_history_send) {
            request_data(update || '');
        } else if (chart && entry_tick_time && !is_entry_tick_barrier_selected) {
            select_entry_tick_barrier();
        }
        if (chart && (is_sold || is_settleable)) {
            update_zone('exit');
            end_contract();
        }
    };

    const request_data = function(update) {
        const calculateGranularity = calculate_granularity();
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

        if (!is_settleable && !sell_spot_time && (window.time.valueOf() / 1000) < end_time && !is_chart_subscribed) {
            request.subscribe = 1;
        }

        const contracts_response = State.get('is_mb_trading') ? MBContract.getContractsResponse() : window.contracts_for,
            stored_delay = sessionStorage.getItem('license.' + underlying);

        if (contracts_response && contracts_response.echo_req.contracts_for === underlying) {
            delayed_chart(contracts_response);
        } else if (stored_delay) {
            handle_delay(stored_delay);
            show_entry_error();
        } else if (!is_contracts_for_send && update === '') {
            socketSend({ contracts_for: underlying });
            is_contracts_for_send = true;
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
        if (!entry_tick_time && !is_chart_delayed && start_time && window.time.unix() >= parseInt(start_time)) {
            HighchartUI.show_error('', localize('Waiting for entry tick.'));
        } else if (!is_history_send) {
            is_history_send = true;
            if (request.subscribe) is_chart_subscribed = true;
            socketSend(request);
        }
    };

    const handle_delay = function(feed_license) {
        if (feed_license !== 'realtime') {
            if (!is_settleable) {
                request.end = 'latest';
            }
            delete request.subscribe;
            is_chart_delayed = true;
        }
    };

    // update the color zones with the correct entry_tick_time and draw barrier
    const select_entry_tick_barrier = function() {
        if (chart && entry_tick_time && !is_entry_tick_barrier_selected) {
            is_entry_tick_barrier_selected = true;
            draw_barrier();
            update_zone('entry');
            select_tick(entry_tick_time, 'entry');
        }
    };

    const update_zone = function (type) {
        if (chart && type && !user_sold()) {
            const value = type === 'entry' ? entry_tick_time : exit_time;
            chart.series[0].zones[(type === 'entry' ? 0 : 1)].value = value * 1000;
        }
    };

    const draw_barrier = function() {
        if (chart.yAxis[0].plotLinesAndBands.length === 0) {
            const barrier = contract.barrier,
                high_barrier = contract.high_barrier,
                low_barrier = contract.low_barrier;
            if (barrier) {
                addPlotLine({ id: 'barrier',      value: barrier * 1,      label: template(localize('Barrier ([_1])'), [barrier]),           dashStyle: 'Dot' }, 'y');
            } else if (high_barrier && low_barrier) {
                addPlotLine({ id: 'high_barrier', value: high_barrier * 1, label: template(localize('High Barrier ([_1])'), [high_barrier]), dashStyle: 'Dot' }, 'y');
                addPlotLine({ id: 'low_barrier',  value: low_barrier * 1,  label: template(localize('Low Barrier ([_1])'), [low_barrier]),   dashStyle: 'Dot' }, 'y');
            }
        }
    };

    // set an orange circle on the entry/exit tick
    const select_tick = function(value, tick_type) {
        if (chart && value && tick_type && (options.tick || options.history) &&
            chart.series[0].data.length !== 0) {
            const data = chart.series[0].data;
            if (!data || data.length === 0) return;
            let current_data;
            for (let i = data.length - 1; i >= 0; i--) {
                current_data = data[i];
                if (current_data && current_data.x && value * 1000 === current_data.x) {
                    current_data.update({ marker: HighchartUI.get_marker_object(tick_type) });
                }
            }
        }
    };

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
        if (is_chart_delayed) {
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
            addPlotLine({
                value    : valueTime * 1000,
                label    : labelName || '',
                textLeft : textLeft === 'textLeft',
                dashStyle: dash || '',
                color    : color || '',
            }, 'x');
        }
    };

    // draw the last line, mark the exit tick, and forget the streams
    const end_contract = function() {
        if (chart) {
            draw_line_x((user_sold() ? sell_time : end_time), '', 'textLeft', 'Dash');
            if (exit_tick_time) {
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
        if (!is_chart_forget) {
            forget_streams();
        }
    };

    const forget_streams = function() {
        if (
            chart &&
            (is_sold || is_settleable) &&
            responseID &&
            chart.series &&
            chart.series[0].options.data.length > 0
        ) {
            const data = chart.series[0].options.data;
            const last_data = data[data.length - 1];
            const last = parseInt(last_data.x || last_data[0]);
            if (last > (end_time * 1000) || last > (sell_time * 1000)) {
                socketSend({ forget: responseID });
                is_chart_forget = true;
            }
        }
    };

    const calculate_granularity = function() {
        const duration = Math.min(exit_time, now_time) - (purchase_time || start_time);
        let granularity;
              // days * hours * minutes * seconds
        if      (duration <=            60 * 60) granularity = 0;     // less than 1 hour
        else if (duration <=        2 * 60 * 60) granularity = 120;   // 2 hours
        else if (duration <=        6 * 60 * 60) granularity = 600;   // 6 hours
        else if (duration <=       24 * 60 * 60) granularity = 900;   // 1 day
        else if (duration <=   5 * 24 * 60 * 60) granularity = 3600;  // 5 days
        else if (duration <=  30 * 24 * 60 * 60) granularity = 14400; // 30 days
        else                                     granularity = 86400; // more than 30 days

        return [granularity, duration];
    };

    // add new data points to the chart
    const update_chart = function(update_options) {
        const granularity = calculate_granularity()[0];
        const series = chart.series[0];
        if (granularity === 0) {
            const data = update_options.tick;
            chart.series[0].addPoint({ x: data.epoch * 1000, y: data.quote * 1 });
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
