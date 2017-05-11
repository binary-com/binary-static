const Highcharts    = require('highcharts');
const moment        = require('moment');
const commonTrading = require('../common');
const Tick          = require('../tick');
const BinarySocket  = require('../../socket');
const ViewPopupUI   = require('../../user/view_popup/view_popup.ui');
const localize      = require('../../../base/localize').localize;
const isVisible     = require('../../../common_functions/common_functions').isVisible;
require('highcharts/modules/exporting')(Highcharts);

const TickDisplay_Beta = (() => {
    'use strict';

    let number_of_ticks,
        display_symbol,
        contract_start_ms,
        contract_category,
        set_barrier,
        barrier,
        abs_barrier,
        display_decimals,
        show_contract_result,
        is_trading_page,
        contract_sentiment,
        price,
        payout,
        ticks_needed,
        x_indicators,
        chart,
        applicable_ticks,
        contract_barrier,
        contract_start_moment,
        counter,
        spots_list;

    let tick_underlying,
        tick_count,
        tick_longcode,
        tick_display_name,
        tick_date_start,
        absolute_barrier,
        tick_shortcode,
        contract_type,
        tick_init,
        subscribe,
        responseID;

    const initialize = (data) => {
        // setting up globals
        number_of_ticks      = parseInt(data.number_of_ticks);
        display_symbol       = data.display_symbol;
        contract_start_ms    = parseInt(data.contract_start * 1000);
        contract_category    = data.contract_category;
        set_barrier          = !contract_category.match('digits');
        barrier              = data.barrier;
        abs_barrier          = data.abs_barrier;
        display_decimals     = data.display_decimals || 2;
        show_contract_result = data.show_contract_result;
        is_trading_page      = data.is_trading_page;
        contract_sentiment   = data.contract_sentiment;

        if (data.show_contract_result) {
            price = parseFloat(data.price);
            payout = parseFloat(data.payout);
        }

        const minimize = data.show_contract_result;

        setXIndicators();
        initializeChart({
            plot_from: data.previous_tick_epoch * 1000,
            plot_to  : new Date((parseInt(data.contract_start) +
                parseInt((number_of_ticks + 2) * 5)) * 1000).getTime(),
            minimize: minimize,
            width   : data.width ? data.width : undefined,
        });

        // add tooltip events to highcharts
        Highcharts.wrap(Highcharts.Tooltip.prototype, 'hide', function(proceed) {
            const tooltip = this.chart.options.tooltip;

            // Run the original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            if (!this.isHidden && tooltip.events && tooltip.events.hide) {
                tooltip.events.hide();
            }
        });

        Highcharts.wrap(Highcharts.Tooltip.prototype, 'refresh', function(proceed) {
            const tooltip = this.chart.options.tooltip;

            // Run the original proceed method
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));

            if (tooltip.events && tooltip.events.show) {
                tooltip.events.show(this.chart.hoverPoints);
            }
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

    const initializeChart = (config) => {
        const is_start_on_first_tick = contract_category.match('digits|asian');

        const chart_options = {
            chart: {
                type           : 'line',
                renderTo       : 'tick_chart',
                width          : config.width ? config.width : (config.minimize ? 394 : null),
                height         : config.minimize ? 120 : null,
                backgroundColor: null,
                events         : { load: plot(config.plot_from, config.plot_to) },
                marginLeft     : 20,
            },
            credits: { enabled: false },
            tooltip: {
                formatter: function() {
                    const new_y = this.y.toFixed(display_decimals);
                    const mom = moment.utc(applicable_ticks[this.x].epoch * 1000).format('dddd, MMM D, HH:mm:ss');
                    return `${mom}<br/>${display_symbol} ${new_y}`;
                },
                crosshairs: [true],
            },
            xAxis: {
                type          : 'linear',
                min           : 0,
                max           : ticks_needed - 0.5,
                tickInterval  : 1,
                showFirstLabel: !!is_start_on_first_tick,

                labels: {
                    autoRotation: false,
                    formatter   : function() { return this.value + (is_start_on_first_tick ? 1 : 0); },
                },
                crosshair: {
                    color : '#E98024',
                    zIndex: 1,
                },
                title: {
                    text: localize('Tick'),
                },
            },
            yAxis: {
                opposite: false,
                title   : '',

                labels: {
                    align: 'left',
                    x    : 0,
                },
            },
            series: [{
                data: [],
            }],
            title    : '',
            exporting: { enabled: false, enableImages: false },
            legend   : { enabled: false },
        };
        // Trading page's chart
        const showValues = (tick, time, this_price) => {
            $('#contract_purchase_profit_list').find('#chart-values')
                .css('display', 'flex').end()
                .find('#contract-values')
                .css('display', 'none');
            $('#chart_values_tick_value').text(tick);
            $('#chart_values_time_value').text(time);
            $('#chart_values_price_value').text(this_price);
        };
        if (is_trading_page) {
            $.extend(true, chart_options, {
                chart: {
                    marginBottom: 25,
                },
                tooltip: {
                    style: { display: 'none' },

                    formatter: function() {
                        const time = moment.utc(applicable_ticks[this.x].epoch * 1000).format('HH:mm:ss');
                        const this_price = this.y;
                        showValues(+this.x + (is_start_on_first_tick ? 1 : 0), time, this_price);
                    },
                    events: {
                        hide: () => {
                            $('#contract_purchase_profit_list').find('#chart-values').hide().end()
                                .find(' #contract-values')
                                .show();
                        },
                    },
                },
                xAxis: {
                    title: {
                        text: '',
                    },
                    crosshair: {
                        width: 30,
                    },
                    tickWidth: 0,
                },
                yAxis: {
                    gridLineWidth: 0,
                    labels       : {
                        enabled: false,
                    },
                },
                series: [{
                    color    : '#2a3052',
                    lineWidth: 1,
                }],
            });
        }
        chart = new Highcharts.Chart(chart_options);
        Highcharts.setOptions({
            lang: { thousandsSep: ',' },
        });
    };

    const applyChartBackgroundColor = (tick) => {
        if (!show_contract_result) {
            return;
        }
        const chart_container = $('#tick_chart');
        if (contract_sentiment === 'up') {
            if (tick.quote > contract_barrier) {
                chart_container.css('background-color', 'rgba(46,136,54,0.198039)');
            } else {
                chart_container.css('background-color', 'rgba(204,0,0,0.098039)');
            }
        } else if (contract_sentiment === 'down') {
            if (tick.quote < contract_barrier) {
                chart_container.css('background-color', 'rgba(46,136,54,0.198039)');
            } else {
                chart_container.css('background-color', 'rgba(204,0,0,0.098039)');
            }
        }
    };

    const addBarrier = () => {
        if (!set_barrier) {
            return;
        }

        const barrier_type = contract_category.match('asian') ? 'asian' : 'static';
        const line_color   = is_trading_page ? '#6b8fb9' : 'green';
        const line_width   = is_trading_page ? 1 : 2;

        if (barrier_type === 'static') {
            const barrier_tick = applicable_ticks[0];

            if (barrier) {
                let final_barrier = barrier_tick.quote + parseFloat(barrier);
                // sometimes due to rounding issues, result is 1.009999 while it should
                // be 1.01
                final_barrier = Number(`${Math.round(`${final_barrier}e${display_decimals}`)}e-${display_decimals}`);

                barrier_tick.quote = final_barrier;
            } else if (abs_barrier) {
                barrier_tick.quote = parseFloat(abs_barrier);
            }

            chart.yAxis[0].addPlotLine({
                id    : 'tick-barrier',
                value : barrier_tick.quote,
                color : line_color,
                width : line_width,
                zIndex: 2,
                label : {
                    text : is_trading_page ? '' : `Barrier (${barrier_tick.quote})`,
                    align: 'center',
                },
            });

            contract_barrier = barrier_tick.quote;
            set_barrier = false;
        }

        if (barrier_type === 'asian') {
            let total = 0;
            for (let i = 0; i < applicable_ticks.length; i++) {
                total += parseFloat(applicable_ticks[i].quote);
            }
            let calc_barrier =  total / applicable_ticks.length;
            calc_barrier = calc_barrier.toFixed(parseInt(display_decimals) + 1); // round calculated barrier

            chart.yAxis[0].removePlotLine('tick-barrier');
            chart.yAxis[0].addPlotLine({
                id    : 'tick-barrier',
                value : calc_barrier,
                color : line_color,
                width : line_width,
                zIndex: 2,
                label : {
                    text : is_trading_page ? '' : `Average (${calc_barrier})`,
                    align: 'center',
                },
            });
            contract_barrier = calc_barrier;
        }
        const purchase_barrier = document.getElementById('contract_purchase_barrier');
        if (contract_barrier && purchase_barrier) {
            commonTrading.labelValue(purchase_barrier, localize('Barrier'), contract_barrier, true);
        }
    };

    const add = (indicator) => {
        chart.xAxis[0].addPlotLine({
            value : indicator.index,
            id    : indicator.id,
            label : { text: indicator.label, x: /start_tick|entry_tick/.test(indicator.id) ? -15 : 5 },
            color : '#e98024',
            width : 2,
            zIndex: 2,
        });
    };

    const evaluateContractOutcome = () => {
        if (!contract_barrier) {
            return; // can't do anything without barrier
        }

        const exit_tick_index = applicable_ticks.length - 1;
        const exit_spot = applicable_ticks[exit_tick_index].quote;

        if (contract_sentiment === 'up') {
            if (exit_spot > contract_barrier) {
                win();
            } else {
                lose();
            }
        } else if (contract_sentiment === 'down') {
            if (exit_spot < contract_barrier) {
                win();
            } else {
                lose();
            }
        }
    };

    const win = () => {
        const profit = payout - price;
        updateUI(payout, profit, localize('This contract won'));
    };

    const lose = () => {
        updateUI(0, -price, localize('This contract lost'));
    };

    const plot = () => {
        contract_start_moment = moment(contract_start_ms).utc();
        counter = 0;
        applicable_ticks = [];
    };

    const updateUI = (final_price, pnl, contract_status) => {
        commonTrading.updatePurchaseStatus_Beta(final_price, final_price - pnl, contract_status);
    };

    const dispatch = (data) => {
        const tick_chart = document.getElementById('tick_chart');

        if (!tick_chart || !isVisible(tick_chart) || !data || (!data.tick && !data.history)) {
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
            if (data.tick && document.getElementById('sell_content_wrapper')) {
                Tick.details(data);
                if (!chart_display_decimals) {
                    chart_display_decimals = data.tick.quote.split('.')[1].length || 2;
                }
            } else if (data.history && document.getElementById('sell_content_wrapper')) {
                if (!chart_display_decimals) {
                    chart_display_decimals = data.history.prices[0].split('.')[1].length || 2;
                }
            }
            if (!tick_init || tick_init === '') {
                initialize({
                    symbol              : tick_underlying,
                    number_of_ticks     : tick_count,
                    contract_category   : ((/asian/i).test(tick_shortcode) ? 'asian' : (/digit/i).test(tick_shortcode) ? 'digits' : 'callput'),
                    longcode            : tick_longcode,
                    display_symbol      : tick_display_name,
                    contract_start      : tick_date_start,
                    abs_barrier         : absolute_barrier,
                    display_decimals    : chart_display_decimals,
                    contract_sentiment  : contract_type === 'CALL' || contract_type === 'ASIANU' ? 'up' : 'down',
                    show_contract_result: 0,
                });
                spots_list = {};
                tick_init = 'initialized';
            }
        }
        if (data.tick) {
            spots2 = Tick.spots();
            epoches = Object.keys(spots2).sort((a, b) => a - b);
        } else if (data.history) {
            epoches = data.history.times;
        }
        if (applicable_ticks && ticks_needed && applicable_ticks.length >= ticks_needed) {
            evaluateContractOutcome();
            if (responseID) {
                BinarySocket.send({ forget: responseID });
            }
        } else {
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
                if (tick.epoch > contract_start_moment.unix() && !spots_list[tick.epoch]) {
                    if (!chart || !chart.series) return;
                    chart.series[0].addPoint([counter, tick.quote], true, false);
                    applicable_ticks.push(tick);
                    spots_list[tick.epoch] = tick.quote;
                    const indicator_key = `_${counter}`;
                    if (typeof x_indicators[indicator_key] !== 'undefined') {
                        x_indicators[indicator_key].index = counter;
                        add(x_indicators[indicator_key]);
                    }
                    addBarrier();
                    applyChartBackgroundColor(tick);
                    counter++;
                }
            }

            if (is_trading_page) {
                const is_up   = contract_sentiment === 'up';
                const min     = chart.yAxis[0].getExtremes().min;
                const max     = chart.yAxis[0].getExtremes().max;
                chart.yAxis[0].removePlotBand('win-area');
                chart.yAxis[0].addPlotBand({
                    id   : 'win-area',
                    from : is_up ? contract_barrier : min,
                    to   : is_up ? max : contract_barrier,
                    color: '#f5f8fb',
                });
                chart.yAxis[0].removePlotBand('lose-area');
                chart.yAxis[0].addPlotBand({
                    id   : 'lose-area',
                    from : is_up ? min : contract_barrier,
                    to   : is_up ? contract_barrier : max,
                    color: '#ffffff',
                });
            }
        }
    };

    const updateChart = (data, contract) => {
        subscribe = 'false';
        if (contract) {
            tick_underlying = contract.underlying;
            tick_count = contract.tick_count;
            tick_longcode = contract.longcode;
            tick_display_name = contract.display_name;
            tick_date_start = contract.date_start;
            absolute_barrier = contract.barrier;
            tick_shortcode = contract.shortcode;
            contract_type = contract.contract_type;
            tick_init = '';
            const request = {
                ticks_history: contract.underlying,
                start        : contract.date_start,
                end          : 'latest',
            };
            if (contract.current_spot_time < contract.date_expiry) {
                request.subscribe = 1;
                subscribe  = 'true';
            } else {
                request.end = contract.date_expiry;
            }
            BinarySocket.send(request, { callback: dispatch });
        } else {
            dispatch(data);
        }
    };

    return {
        init       : initialize,
        updateChart: updateChart,
        resetSpots : () => { spots_list = {}; },
    };
})();

module.exports = TickDisplay_Beta;
