const moment               = require('moment');
const requireHighstock     = require('./common').requireHighstock;
const Tick                 = require('./tick');
const ViewPopupUI          = require('../user/view_popup/view_popup.ui');
const BinarySocket         = require('../../base/socket');
const addComma             = require('../../../_common/base/currency_base').addComma;
const CommonFunctions      = require('../../../_common/common_functions');
const localize             = require('../../../_common/localize').localize;

const TickDisplay = (() => {
    let number_of_ticks,
        display_symbol,
        contract_start_ms,
        contract_category,
        set_barrier,
        barrier,
        abs_barrier,
        display_decimals,
        show_contract_result,
        contract_sentiment,
        ticks_needed,
        x_indicators,
        chart,
        Highcharts,
        applicable_ticks,
        contract_barrier,
        contract_start_moment,
        counter,
        spots_list,
        tick_underlying,
        tick_count,
        tick_longcode,
        tick_display_name,
        tick_date_start,
        absolute_barrier,
        tick_shortcode,
        tick_init,
        subscribe,
        responseID,
        sell_spot_time,
        exit_tick_time;

    let id_render = 'tick_chart';

    const initialize = (data, options) => {
        // setting up globals
        number_of_ticks      = parseInt(data.number_of_ticks);
        display_symbol       = data.display_symbol;
        contract_start_ms    = parseInt(data.contract_start) * 1000;
        contract_category    = data.contract_category;
        set_barrier          = !contract_category.match('digits');
        barrier              = data.barrier;
        abs_barrier          = data.abs_barrier;
        display_decimals     = data.display_decimals || 2;
        show_contract_result = data.show_contract_result;
        if (options.id_render) {
            id_render = options.id_render;
        }

        if (data.show_contract_result) {
            contract_sentiment = data.contract_sentiment;
        }

        const minimize = data.show_contract_result;
        const end_time = parseInt(data.contract_start) + parseInt((number_of_ticks + 2) * 5);

        setXIndicators();
        requireHighstock((Highstock) => {
            Highcharts = Highstock;
            initializeChart({
                minimize,
                plot_from: data.previous_tick_epoch * 1000,
                plot_to  : new Date(end_time * 1000).getTime(),
                width    : data.width ? data.width : undefined,
            }, options);
        });
    };

    const setXIndicators = () => {
        const exit_tick_index = number_of_ticks - 1;
        if (contract_category.match('asian')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: 'Entry Spot', id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label: 'Exit Spot',
                id   : 'exit_tick',
            };
        } else if (contract_category.match('callput')) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: 'Entry Spot', id: 'entry_tick' },
            };
            x_indicators[`_${number_of_ticks}`] = {
                label: 'Exit Spot',
                id   : 'exit_tick',
            };
        } else if (contract_category.match('touchnotouch')) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: 'Entry Spot', id: 'entry_tick' },
            };
        } else if (contract_category.match('digits')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: 'Tick 1', id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label: `Tick ${number_of_ticks}`,
                id   : 'last_tick',
            };
        } else {
            x_indicators = {};
        }
    };

    const initializeChart = (config, data) => {
        chart = new Highcharts.Chart({
            chart: {
                type           : 'line',
                renderTo       : id_render,
                width          : config.width || (config.minimize ? 394 : null),
                height         : config.minimize ? 143 : null,
                backgroundColor: null,
                events         : { load: plot(config.plot_from, config.plot_to) },
                marginLeft     : 50,
            },
            credits: { enabled: false },
            tooltip: {
                formatter() {
                    const new_y = this.y.toFixed(display_decimals);
                    const mom   = moment.utc(applicable_ticks[this.x].epoch * 1000).format('dddd, MMM D, HH:mm:ss');
                    return `${mom}<br/>${display_symbol} ${new_y}`;
                },
            },
            xAxis: {
                type  : 'linear',
                min   : 0,
                max   : number_of_ticks + 1,
                labels: { enabled: false },
            },
            yAxis: {
                opposite: false,
                labels  : {
                    align: 'left',
                    x    : 0,
                },
                title: '',
            },
            series: [{
                data: [],
            }],
            title    : '',
            exporting: { enabled: false, enableImages: false },
            legend   : { enabled: false },
        });
        Highcharts.setOptions({
            lang: { thousandsSep: ',' },
        });
        if (data) {
            dispatch(data);
        }
    };

    const applyChartBackgroundColor = (tick) => {
        if (!show_contract_result) return;

        const chart_container = $(`#${id_render}`);

        const winning = contract_sentiment === 'up' && tick.quote > contract_barrier
            || contract_sentiment === 'down' && tick.quote < contract_barrier;

        chart_container.css('background-color', winning
            ? 'rgba(46,136,54,0.198039)'
            : 'rgba(204,0,0,0.098039)');
    };

    const addBarrier = () => {
        if (!set_barrier) {
            return;
        }

        const barrier_type = contract_category.match('asian') ? 'asian' : 'static';

        if (barrier_type === 'static') {
            const first_quote = applicable_ticks[0].quote;
            let barrier_quote = first_quote;

            if (barrier) {
                let final_barrier = barrier_quote + parseFloat(barrier);
                // sometimes due to rounding issues, result is 1.009999 while it should
                // be 1.01
                final_barrier = Number(`${Math.round(`${final_barrier}e${display_decimals}`)}e-${display_decimals}`);
                barrier_quote = final_barrier;
            } else if (abs_barrier) {
                barrier_quote = parseFloat(abs_barrier);
            }

            chart.yAxis[0].addPlotLine({
                id    : 'tick-barrier',
                value : barrier_quote,
                label : { text: `Barrier (${addComma(barrier_quote)})`, align: 'center' },
                color : 'green',
                width : 2,
                zIndex: 2,
            });
            contract_barrier = barrier_quote;
            set_barrier      = false;
        }

        if (barrier_type === 'asian') {
            let total = 0;
            for (let i = 0; i < applicable_ticks.length; i++) {
                total += parseFloat(applicable_ticks[i].quote);
            }
            // round calculated barrier
            const calc_barrier = (total / applicable_ticks.length).toFixed(parseInt(display_decimals) + 1);

            chart.yAxis[0].removePlotLine('tick-barrier');
            chart.yAxis[0].addPlotLine({
                id   : 'tick-barrier',
                value: calc_barrier,
                color: 'green',
                label: {
                    text : `Average (${addComma(calc_barrier)})`,
                    align: 'center',
                },
                width : 2,
                zIndex: 2,
            });
            contract_barrier = calc_barrier;
        }
        if (contract_barrier) {
            CommonFunctions.elementInnerHtml(CommonFunctions.getElementById('contract_purchase_barrier'), `${localize('Barrier')}: ${contract_barrier}`);
        }
    };

    const add = (indicator) => {
        chart.xAxis[0].addPlotLine({
            value    : indicator.index,
            id       : indicator.id,
            label    : { text: indicator.label, x: /start_tick|entry_tick/.test(indicator.id) ? -15 : 5 },
            color    : '#e98024',
            width    : 2,
            zIndex   : 2,
            dashStyle: indicator.dashStyle || '',
        });
    };

    const plot = () => {
        contract_start_moment = moment(contract_start_ms).utc();
        counter               = 0;
        applicable_ticks      = [];
    };

    const dispatch = (data) => {
        const tick_chart = CommonFunctions.getElementById(id_render);

        if (!CommonFunctions.isVisible(tick_chart) || !data || (!data.tick && !data.history)) {
            return;
        }

        if (subscribe && data.tick && document.getElementById('sell_content_wrapper')) {
            responseID = data.tick.id;
            ViewPopupUI.storeSubscriptionID(responseID);
        }

        let epoches,
            spots2,
            chart_display_decimals;
        if (document.getElementById('sell_content_wrapper')) {
            if (data.tick) {
                Tick.details(data);
                if (!chart_display_decimals) {
                    chart_display_decimals = data.tick.quote.split('.')[1].length || 2;
                }
            } else if (data.history) {
                if (!chart_display_decimals) {
                    chart_display_decimals = data.history.prices[0].split('.')[1].length || 2;
                }
            }
            if (!tick_init) {
                let category = 'callput';
                if (/asian/i.test(tick_shortcode)) {
                    category = 'asian';
                } else if (/digit/i.test(tick_shortcode)) {
                    category = 'digits';
                } else if (/touch/i.test(tick_shortcode)) {
                    category = 'touchnotouch';
                }
                initialize({
                    symbol              : tick_underlying,
                    number_of_ticks     : tick_count,
                    contract_category   : category,
                    longcode            : tick_longcode,
                    display_symbol      : tick_display_name,
                    contract_start      : tick_date_start,
                    abs_barrier         : absolute_barrier,
                    display_decimals    : chart_display_decimals,
                    show_contract_result: 0,
                }, data);
                spots_list = {};
                tick_init  = 'initialized';
                return;
            }
        }
        if (data.tick) {
            spots2  = Tick.spots();
            epoches = Object.keys(spots2).sort((a, b) => a - b);
        } else if (data.history) {
            epoches = data.history.times;
        }

        const has_finished = applicable_ticks && ticks_needed && applicable_ticks.length >= ticks_needed;
        const has_sold = sell_spot_time
            && applicable_ticks
            && applicable_ticks.find(({ epoch }) => epoch === sell_spot_time) !== undefined;

        if (!has_finished && !has_sold) {
            for (let d = 0; d < epoches.length; d++) {
                let tick;
                if (data.tick) {
                    tick = {
                        epoch: parseInt(epoches[d]),
                        quote: parseFloat(spots2[epoches[d]]),
                    };
                } else if (data.history) {
                    tick = {
                        epoch: parseInt(data.history.times[d]),
                        quote: parseFloat(data.history.prices[d]),
                    };
                }

                if (contract_start_moment && tick.epoch > contract_start_moment.unix() && !spots_list[tick.epoch]) {
                    if (!chart || !chart.series) return;
                    chart.series[0].addPoint([counter, tick.quote], true, false);
                    applicable_ticks.push(tick);
                    spots_list[tick.epoch] = tick.quote;
                    const indicator_key    = `_${counter}`;

                    if (!x_indicators[indicator_key] && tick.epoch === sell_spot_time) {
                        x_indicators[indicator_key] = {
                            index: counter,
                            label: sell_spot_time === exit_tick_time
                                ? 'Exit Spot'
                                : 'Sell Spot',
                            dashStyle: 'Dash',
                        };
                    }

                    if (typeof x_indicators[indicator_key] !== 'undefined') {
                        x_indicators[indicator_key].index = counter;
                        add(x_indicators[indicator_key]);
                    }

                    addBarrier();
                    applyChartBackgroundColor(tick);
                    counter++;
                }
            }
        }
    };

    const addSellSpot = (contract) => {
        if (!applicable_ticks) return;

        sell_spot_time = +contract.sell_spot_time;
        exit_tick_time = +contract.exit_tick_time;

        const index = applicable_ticks.findIndex(({ epoch }) => epoch === sell_spot_time);

        if (index === -1) return;

        const indicator_key = `_${index}`;

        if (x_indicators[indicator_key]) return;

        x_indicators[indicator_key] = {
            index,
            label: sell_spot_time === exit_tick_time
                ? 'Exit Spot'
                : 'Sell Spot',
            dashStyle: 'Dash',
        };

        add(x_indicators[indicator_key]);
    };

    const updateChart = (data, contract) => {
        subscribe = 'false';
        if (data.is_sold) {
            addSellSpot(contract);
        } else if (contract) {
            tick_underlying   = contract.underlying;
            tick_count        = contract.tick_count;
            tick_longcode     = contract.longcode;
            tick_display_name = contract.display_name;
            tick_date_start   = contract.date_start;
            absolute_barrier  = contract.barrier;
            tick_shortcode    = contract.shortcode;
            tick_init         = '';
            sell_spot_time    = +contract.sell_spot_time;
            exit_tick_time    = +contract.exit_tick_time;
            const request     = {
                ticks_history: contract.underlying,
                start        : contract.date_start,
                end          : 'latest',
            };
            if (contract.current_spot_time < contract.date_expiry) {
                request.subscribe = 1;
                subscribe         = 'true';
            } else if (sell_spot_time && sell_spot_time < contract.date_expiry) {
                request.end = sell_spot_time;
            } else {
                request.end = contract.date_expiry;
            }
            BinarySocket.send(request, { callback: dispatch });
        } else {
            dispatch(data);
        }
    };

    return {
        updateChart,
        init      : initialize,
        resetSpots: () => { spots_list = {}; },
    };
})();

module.exports = TickDisplay;
