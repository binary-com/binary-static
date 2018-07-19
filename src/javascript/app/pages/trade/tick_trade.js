const moment               = require('moment');
const requireHighstock     = require('./common').requireHighstock;
const Lookback             = require('./lookback');
const Tick                 = require('./tick');
const updatePurchaseStatus = require('./update_values').updatePurchaseStatus;
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
        should_set_barrier,
        barrier,
        display_decimals,
        show_contract_result,
        price,
        payout,
        ticks_needed,
        x_indicators,
        chart,
        Highcharts,
        applicable_ticks,
        contract_start_moment,
        counter,
        spots_list,
        tick_init,
        subscribe,
        response_id,
        contract,
        selected_tick,
        prev_barriers;

    let id_render = 'tick_chart';

    const winning_color = 'rgba(46, 136, 54, 0.2)';
    const losing_color  = 'rgba(204, 0, 0, 0.1)';

    const selected_tick_style = 'margin-left: 10px; display: inline-block; border-radius: 6px; background-color: orange; width:10px; height: 10px;';

    const color  = 'orange';
    const marker = {
        fillColor: color,
        lineColor: color,
        lineWidth: 3,
        radius   : 4,
        states   : { hover: { fillColor: color, lineColor: color, lineWidth: 3, radius: 4 } },
    };

    const initialize = (data, options) => {
        // setting up globals
        applicable_ticks     = [];
        number_of_ticks      = parseInt(data.number_of_ticks);
        display_symbol       = data.display_symbol;
        contract_start_ms    = parseInt(data.contract_start) * 1000;
        contract_category    = data.contract_category;
        should_set_barrier   = !contract_category.match('digits');
        barrier              = data.barrier;
        display_decimals     = data.display_decimals || 2;
        show_contract_result = data.show_contract_result;
        prev_barriers        = []; // For checking if barrier was updated

        if (data.id_render) {
            id_render = data.id_render;
        }

        if (data.show_contract_result) {
            price  = parseFloat(data.price);
            payout = parseFloat(data.payout);
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
                _0: { label: localize('Entry Spot'), id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label    : localize('Exit Spot'),
                id       : 'exit_tick',
                dashStyle: 'Dash',
            };
        } else if (contract_category.match(/callput|reset|lookback/i)) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'entry_tick' },
            };
            x_indicators[`_${number_of_ticks}`] = {
                label    : localize('Exit Spot'),
                id       : 'exit_tick',
                dashStyle: 'Dash',
            };
            if (contract_category.match('reset')) {
                const reset_time_index = Math.floor(number_of_ticks / 2); // use index to draw ticks reset_time
                x_indicators[`_${reset_time_index}`] = {
                    index: reset_time_index,
                    label: localize('Reset Time'),
                    id   : 'reset_tick',
                    color: '#000',
                };
            }
        } else if (contract_category.match('touchnotouch')) {
            ticks_needed = number_of_ticks + 1;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'entry_tick' },
            };
        } else if (contract_category.match('digits')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: localize('Tick [_1]', ['1']), id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label    : localize('Tick [_1]', [number_of_ticks]),
                id       : 'last_tick',
                dashStyle: 'Dash',
            };
        } else if (contract_category.match('highlowticks')) {
            ticks_needed = number_of_ticks;
            x_indicators = {
                _0: { label: localize('Entry Spot'), id: 'start_tick' },
            };
            x_indicators[`_${exit_tick_index}`] = {
                label: localize('Exit Spot'),
                id   : 'exit_tick',
            };
        } else {
            x_indicators = {};
        }
    };

    const initializeChart = (config, data) => {
        Highcharts.setOptions({
            lang: { thousandsSep: ',' },
        });
        chart = new Highcharts.Chart({
            chart: {
                type           : 'line',
                renderTo       : id_render,
                width          : config.width || (config.minimize ? 394 : null),
                height         : config.minimize ? 143 : null,
                backgroundColor: null,
                events         : { load: () => plot(config.plot_from, config.plot_to) },
                marginLeft     : 50,
            },
            credits: { enabled: false },
            tooltip: {
                formatter() {
                    const new_y = addComma(this.y.toFixed(display_decimals));
                    const mom   = moment.utc(applicable_ticks[this.x].epoch * 1000).format('dddd, MMM D, HH:mm:ss');
                    return `${mom}<br/>${display_symbol} ${new_y}`;
                },
            },
            title: {
                text : show_contract_result ? '' : display_symbol,
                style: { fontSize: '16px' },
            },
            ...(contract_category === 'highlowticks' && { subtitle: { text: `<div style="${selected_tick_style}"></div> ${localize('Selected Tick')}`, useHTML: true } }),
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
                    formatter() {
                        return addComma(this.value.toFixed(display_decimals));
                    },
                },
                title: '',
            },
            series: [{
                data: [],
            }],
            exporting: { enabled: false, enableImages: false },
            legend   : { enabled: false },
        });
        if (data) {
            dispatch(data);
        }
    };

    const isRelativeBarrier = (barrier_str) => (/\+|-/.test(barrier_str));

    const getContractBarrierLabel = (text, value) => `${localize(`${text}`)}: ${value}`;

    const addBarrier = () => {
        if (!should_set_barrier) {
            return;
        }

        const barrier_type = /^(asian|highlowticks|reset|lookback)$/.test(contract_category) ? contract_category : 'static';

        let contract_barrier_label = '';
        if (barrier_type === 'static') {
            const first_quote = applicable_ticks[0].quote;
            let barrier_quote = first_quote;

            if (barrier) {
                let final_barrier = Number(barrier).toFixed(parseInt(display_decimals));
                if (isRelativeBarrier(barrier)) {
                    // sometimes due to rounding issues, result is 1.009999 while it should be 1.01
                    final_barrier = Number(`${Math.round(`${barrier_quote + parseFloat(barrier)}e${display_decimals}`)}e-${display_decimals}`);
                }
                barrier_quote = final_barrier;
            } else if (contract && contract.barrier) {
                barrier_quote = parseFloat(contract.barrier);
            }

            drawBarrier({ value: barrier_quote, text: 'Barrier' });
            contract_barrier_label = getContractBarrierLabel('Barrier', barrier_quote);
            should_set_barrier = false;
        }

        if (barrier_type === 'asian') {
            let total = 0;
            for (let i = 0; i < applicable_ticks.length; i++) {
                total += parseFloat(applicable_ticks[i].quote);
            }
            // round calculated barrier
            const calc_barrier = (total / applicable_ticks.length).toFixed(parseInt(display_decimals) + 1);
            drawBarrier({ value: calc_barrier, text: 'Average' });
            contract_barrier_label = getContractBarrierLabel('Average', calc_barrier);
        }

        if (barrier_type === 'highlowticks') {
            if (/^(won|lost)$/.test(contract.status)) {
                // for contracts that won, highest/lowest tick will be the quote of the selected tick
                // for contracts that lost, API will send sell spot to mark highest/lowest spot
                const high_low_barrier = contract.status === 'won' ? ((applicable_ticks[+selected_tick - 1] || {}).quote) : +contract.sell_spot;

                if (high_low_barrier) {
                    should_set_barrier = false;
                    const barrier_text = /^tickhigh_/i.test(contract.shortcode) ? 'Highest Tick' : 'Lowest Tick';
                    drawBarrier({ value: high_low_barrier, text: barrier_text, dashStyle: 'dash', color: '#e98024' });
                }

            }
        }

        if (barrier_type === 'reset') {
            const { status } = contract;

            let { barrier: current_barrier, entry_spot: entry_barrier } = contract;
            if (!entry_barrier || !current_barrier) {
                entry_barrier = current_barrier = applicable_ticks[0].quote;
            }

            if (entry_barrier && current_barrier) {
                const width        = ($('.highcharts-markers')[0].getBoundingClientRect() || {}).width;
                const x            = status === 'open' ? 60 : (chart.chartWidth - width - 45);
                const is_resetcall = contract.contract_type === 'RESETCALL';
                const has_reset    = current_barrier !== entry_barrier;

                drawBarrier({ id: 'tick-barrier', value: entry_barrier, text: 'Barrier', label: { align: 'right',  x: -x }, dashStyle: has_reset ? 'dot' : 'default', textBottom: has_reset && !is_resetcall });
                contract_barrier_label = getContractBarrierLabel('Barrier', entry_barrier);
                if (has_reset) {
                    drawBarrier({ id: 'tick-reset-barrier', value: current_barrier, text: 'Reset Barrier', label: { align: 'right', x: -x }, textBottom: is_resetcall });
                    contract_barrier_label = getContractBarrierLabel('Reset Barrier', current_barrier);
                }
            }
        }

        if (barrier_type === 'lookback') {
            const { barrier: current_barrier, high_barrier, low_barrier, contract_type } = contract;
            if (current_barrier && prev_barriers[0] !== current_barrier) { // draw High or Low barrier
                prev_barriers[0] = current_barrier; // store previous barrier

                const current_barrier_text = Lookback.getBarrierLabel(contract_type);
                drawBarrier({ value: current_barrier, text: current_barrier_text });
                contract_barrier_label = getContractBarrierLabel(current_barrier_text, current_barrier);
            } else if (high_barrier && low_barrier
                && (high_barrier !== prev_barriers[1] || low_barrier !== prev_barriers[0])) { // draw High and Low barriers
                prev_barriers[1] = high_barrier; // store previous barriers
                prev_barriers[0] = low_barrier;

                const [high_barrier_text, low_barrier_text] = Lookback.getBarrierLabel(contract_type);
                drawBarrier({ id: 'tick-high-barrier', value: high_barrier, text: high_barrier_text });
                drawBarrier({ id: 'tick-low-barrier',  value: low_barrier,  text: low_barrier_text, textBottom: true });
                contract_barrier_label = `${getContractBarrierLabel(high_barrier_text, high_barrier)}, ${getContractBarrierLabel(low_barrier_text, low_barrier)}`;
            }
        }

        if (contract_barrier_label) {
            CommonFunctions.elementInnerHtml(CommonFunctions.getElementById('contract_purchase_barrier'), contract_barrier_label);
        }
    };

    /*
     * Draw barrier
     */
    const drawBarrier = ({ id, color: barrier_color, value, text, label, dashStyle, width, zIndex, textBottom }) => {
        chart.yAxis[0].removePlotLine(id || 'tick-barrier');
        chart.yAxis[0].addPlotLine({
            id   : id || 'tick-barrier',
            value,
            color: barrier_color || 'green',
            label: {
                text : `${localize(text)} (${addComma(value)})`,
                align: label ? label.align : 'center',
                x    : label ? label.x : 0,
                y    : textBottom ? 15 : -5,
            },
            width    : width || 2,
            zIndex   : zIndex || 2,
            dashStyle: dashStyle || 'default',
        });
    };

    const add = (indicator) => {
        chart.xAxis[0].addPlotLine({
            value    : indicator.index,
            id       : indicator.id,
            label    : { text: indicator.label, x: /start_tick|entry_tick/.test(indicator.id) ? -15 : 5 },
            color    : indicator.color || '#e98024',
            width    : 2,
            zIndex   : 2,
            dashStyle: indicator.dashStyle || '',
        });
    };

    const evaluateContractOutcome = () => {
        if (contract.status && contract.status !== 'open') {
            if (contract.status === 'won') {
                if (show_contract_result) {
                    $(`#${id_render}`).css('background-color', winning_color);
                }
                updatePurchaseStatus(payout, price, contract.profit, localize('This contract won'));
            } else if (contract.status === 'lost') {
                if (show_contract_result) {
                    $(`#${id_render}`).css('background-color', losing_color);
                }
                updatePurchaseStatus(0, -price, contract.profit, localize('This contract lost'));
            }

            addSellSpot();
        }
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
            response_id = data.tick.id;
            ViewPopupUI.storeSubscriptionID(response_id);
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
            if (!tick_init && contract) {
                let category = 'callput';
                if (/asian/i.test(contract.shortcode)) {
                    category = 'asian';
                } else if (/digit/i.test(contract.shortcode)) {
                    category = 'digits';
                } else if (/touch/i.test(contract.shortcode)) {
                    category = 'touchnotouch';
                } else if (/reset/i.test(contract.shortcode)) {
                    category = 'reset';
                } else if (/^(tickhigh|ticklow)_/i.test(contract.shortcode)) {
                    category = 'highlowticks';
                } else if (/^(lbfloatput|lbfloatcall|lbhighlow)_/i.test(contract.shortcode)) {
                    category = 'lookback';
                }
                initialize({
                    symbol              : contract.underlying,
                    number_of_ticks     : contract.tick_count,
                    contract_category   : category,
                    longcode            : contract.longcode,
                    display_symbol      : contract.display_name,
                    contract_start      : contract.date_start,
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
        const has_sold     = contract && contract.sell_spot_time && applicable_ticks
            && applicable_ticks.find(({ epoch }) => +epoch === +contract.sell_spot_time) !== undefined;

        if (!has_finished && !has_sold && (!data.tick || !contract.status || contract.status === 'open')) {
            let should_show_all_ticks = true;
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

                const current_tick_count = applicable_ticks.length + 1;
                // for contracts that lost, sell spot time will have the value of the highest/lowest tick
                // if current tick is selected tick and current tick occurs after sell spot time (highest/lowest tick), then don't show it
                if (contract.status === 'lost' && current_tick_count > +selected_tick && tick.epoch > +contract.sell_spot_time) {
                    should_show_all_ticks = false;
                }

                if (contract_start_moment && tick.epoch > contract_start_moment.unix() &&
                    !spots_list[tick.epoch] && should_show_all_ticks) {
                    if (!chart || !chart.series) return;
                    chart.series[0].addPoint([counter, tick.quote], true, false);

                    if (+selected_tick === current_tick_count) {
                        const points = chart.series[0].points;
                        points[points.length - 1].update({ marker });
                    }

                    applicable_ticks.push(tick);
                    spots_list[tick.epoch] = tick.quote;
                    const indicator_key    = `_${counter}`;

                    const exit_time = contract ? (Math.min(+contract.sell_spot_time, +contract.exit_tick_time) ||
                        +contract.sell_spot_time || +contract.exit_tick_time) : '';

                    if (!x_indicators[indicator_key] && tick.epoch === exit_time && contract_category !== 'highlowticks') {
                        x_indicators[indicator_key] = {
                            index    : counter,
                            label    : localize('Exit Spot'),
                            dashStyle: 'Dash',
                        };
                    }

                    if (typeof x_indicators[indicator_key] !== 'undefined') {
                        x_indicators[indicator_key].index = counter;
                        add(x_indicators[indicator_key]);
                    }

                    addBarrier();
                    counter++;
                }
            }
        }
    };

    const addSellSpot = () => {
        if (!applicable_ticks || !contract) return;

        if (contract_category === 'highlowticks') {
            addBarrier();
            return;
        }

        let index = applicable_ticks.findIndex(({ epoch }) => epoch === +contract.sell_spot_time);

        // if sell spot time is later than exit tick time, use that instead
        if (index === -1) {
            index = applicable_ticks.findIndex(({ epoch }) => epoch === +contract.exit_tick_time);
        }

        if (index === -1) return;

        const indicator_key = `_${index}`;

        if (x_indicators[indicator_key]) return;

        x_indicators[indicator_key] = {
            index,
            label    : localize('Exit Spot'),
            dashStyle: 'Dash',
        };
        
        add(x_indicators[indicator_key]);
    };

    const updateContract = (proposal_open_contract) => {
        contract = proposal_open_contract;

        if (/^(tickhigh|ticklow)_/i.test(contract.shortcode)) {
            const arr_shortcode = contract.shortcode.split('_');
            selected_tick = arr_shortcode[arr_shortcode.length - 1];
        } else {
            selected_tick = '';
        }
    };

    const updateChart = (data, proposal_open_contract) => {
        subscribe = 'false';
        if (proposal_open_contract) {
            updateContract(proposal_open_contract);
        }

        if (data.is_sold) {
            addSellSpot();
        } else if (proposal_open_contract) {
            if (data.id_render) {
                id_render = data.id_render;
            }

            const request     = {
                ticks_history: contract.underlying,
                start        : contract.date_start,
                end          : 'latest',
            };
            if (contract.current_spot_time < contract.date_expiry) {
                request.subscribe = 1;
                subscribe         = 'true';
            } else if (!/^(tickhigh|ticklow)_/i.test(contract.shortcode) && contract.sell_spot_time && +contract.sell_spot_time < +contract.date_expiry) {
                request.end = contract.sell_spot_time;
            } else {
                request.end = contract.date_expiry;
            }
            if (data.request_ticks) { // we shouldn't send this multiple times on every update
                tick_init = '';
                BinarySocket.send(request, { callback: dispatch });
            }
        } else {
            dispatch(data);
        }
    };

    return {
        updateChart,
        init      : initialize,
        resetSpots: () => { spots_list = {}; updateContract({}); $(`#${id_render}`).css('background-color', '#F2F2F2'); },
        setStatus : (proposal_open_contract) => {
            updateContract(proposal_open_contract);
            evaluateContractOutcome();
        },
    };
})();

module.exports = TickDisplay;
