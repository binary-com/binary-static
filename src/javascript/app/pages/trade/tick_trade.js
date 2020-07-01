const moment               = require('moment');
const HighchartUI          = require('./charts/highchart.ui');
const requireHighstock     = require('./common').requireHighstock;
const Reset                = require('./reset');
const getUnderlyingPipSize = require('./symbols').getUnderlyingPipSize;
const updatePurchaseStatus = require('./update_values').updatePurchaseStatus;
const ChartSettings        = require('../../common/chart_settings');
const addComma             = require('../../../_common/base/currency_base').addComma;
const CommonFunctions      = require('../../../_common/common_functions');
const localize             = require('../../../_common/localize').localize;

const TickDisplay = (() => {
    let display_decimals,
        show_contract_result,
        chart,
        contract,
        reset_time_index,
        selected_tick_index,
        id_render,
        is_chart_init;

    const winning_color = 'rgba(46, 136, 54, 0.2)';
    const losing_color  = 'rgba(204, 0, 0, 0.1)';
    const brand_color   = 'orange';

    const marker = {
        fillColor: brand_color,
        lineColor: brand_color,
        lineWidth: 3,
        radius   : 4,
        states   : { hover: { fillColor: brand_color, lineColor: brand_color, lineWidth: 3, radius: 4 } },
    };

    // setting up globals
    const init = (id_to_render, should_show_contract_result) => {
        id_render            = id_to_render;
        show_contract_result = should_show_contract_result;

        selected_tick_index = undefined;
        reset_time_index    = undefined;
        display_decimals    = undefined;
        is_chart_init       = false;
    };

    const initializeChart = () => new Promise(async (resolve) => {
        is_chart_init = true;

        display_decimals = await getUnderlyingPipSize(contract.underlying);

        if (/reset/i.test(contract.shortcode)) {
            reset_time_index = Math.floor(contract.tick_count / 2); // use index to draw ticks reset_time
        } else if (/tickhigh|ticklow/i.test(contract.shortcode)) {
            const arr_shortcode = contract.shortcode.split('_');
            selected_tick_index = +arr_shortcode[arr_shortcode.length - 1] - 1; // index will be one lower than the selection
        }

        requireHighstock((Highstock) => {
            const is_small_width     = window.innerWidth < 480;
            const overlay_margin_top = is_small_width ? 70 : 40;
            const overlay_height     = is_small_width ? 200 : 170;
            const config = {
                display_decimals,
                data         : [],
                el           : id_render,
                margin_top   : show_contract_result ? overlay_margin_top : null,
                has_animation: show_contract_result,
                height       : show_contract_result ? overlay_height : null,
                radius       : 4,
                title        : show_contract_result ? '' : contract.display_name,
                tooltip      : {
                    formatter() {
                        const tick = contract.tick_stream.find((data) => data.tick === this.y).tick_display_value;
                        const date = moment.utc(contract.tick_stream[this.x].epoch * 1000).format('dddd, MMM D, HH:mm:ss');
                        return `<div class='tooltip-body'>${date}<br/>${contract.display_name} ${tick}</div>`;
                    },
                },
                type  : 'line',
                width : show_contract_result ? ($('#confirmation_message').width() || 394) : null,
                x_axis: { labels: { enabled: false }, ...(show_contract_result && { max: contract.tick_count + 1, min: 0, type: 'linear' }) },
            };

            Highstock.setOptions({
                lang: { thousandsSep: ',' },
            });
            ChartSettings.setChartOptions(config);
            chart = new Highstock.Chart(ChartSettings.getChartOptions());

            let resize_timeout;
            const el_chart_container = CommonFunctions.getElementById(id_render);
            window.addEventListener('resize', (e) => {
                e.stopPropagation();
                if (!CommonFunctions.isVisible(el_chart_container)) return;
                clearTimeout(resize_timeout);
                resize_timeout = setTimeout(() => {
                    const { offsetWidth, offsetHeight } = el_chart_container;
                    chart.setSize(offsetWidth, offsetHeight);
                }, 250);
            });

            if (show_contract_result) {
                $(`#${id_render}`).css('background-color', '#F2F2F2');
            }

            updateLabels();

            resolve();
        });
    });

    const setBarrier = (config) => {
        chart.yAxis[0].addPlotLine({
            id    : config.id || 'tick-barrier',
            value : config.value || contract.barrier,
            color : 'green',
            label : config.label,
            width : 2,
            zIndex: 2,
            ...(config.dashStyle && { dashStyle: config.dashStyle }),
        });
    };

    const addBarrier = () => {
        const is_reset                 = Reset.isReset(contract.contract_type);
        const shoud_draw_reset_barrier = is_reset && Reset.isNewBarrier(contract.entry_spot, contract.barrier) &&
            !chart.yAxis[0].plotLinesAndBands.find((plotLine) => plotLine.id === 'tick-reset-barrier');
        const should_recalculate_barrier = /asian/i.test(contract.contract_type) || shoud_draw_reset_barrier;

        if (!contract.barrier || (chart.yAxis[0].plotLinesAndBands.length && !should_recalculate_barrier)) {
            return;
        }

        const barrier_type = /asian|tickhigh|ticklow/i.test(contract.contract_type) ? contract.contract_type : 'static';

        if (shoud_draw_reset_barrier) {
            removePlotLine('tick-barrier');
            const is_resetcall  = contract.contract_type === 'RESETCALL';
            setBarrier({
                label: { text: `${localize('Reset Barrier')} (${addComma(contract.barrier, display_decimals)})`, align: 'right', x: -60, y: is_resetcall ? 15 : -5 },
                id   : 'tick-reset-barrier',
            });
            setBarrier({
                value    : contract.entry_spot,
                label    : { text: `${localize('Barrier')} (${addComma(contract.entry_spot, display_decimals)})`, align: 'right', x: -60, y: is_resetcall ? 15 : -5 },
                dashStyle: 'dot',
            });
            setBarrierValue(localize('Reset Barrier'));
            updateLabels();

        } else if (barrier_type === 'static') {
            // even if type is reset, we will draw a normal barrier until we have to draw a reset barrier
            setBarrier({ text: `${localize('Barrier')} (${addComma(contract.barrier, display_decimals)})`, align: is_reset ? 'right' : 'center', x: is_reset ? -60 : 0 });
            setBarrierValue(localize('Barrier'));

        } else if (/asian/i.test(barrier_type)) {
            removePlotLine('tick-barrier');
            setBarrier({ text: `${localize('Average')} (${addComma(contract.barrier, display_decimals)})`, align: 'center' });
            setBarrierValue(localize('Barrier'));
        }
    };

    const setBarrierValue = (lbl_barrier) => {
        CommonFunctions.elementInnerHtml(CommonFunctions.getElementById('contract_purchase_barrier'), `${lbl_barrier}: ${addComma(contract.barrier, display_decimals)}`);
    };

    const evaluateContractOutcome = () => {
        if (show_contract_result && contract.status !== 'open') {
            if (contract.status === 'won') {
                $(`#${id_render}`).css('background-color', winning_color);
                updatePurchaseStatus(contract.payout, contract.buy_price, contract.profit, localize('This contract won'));
            } else if (contract.status === 'lost') {
                $(`#${id_render}`).css('background-color', losing_color);
                updatePurchaseStatus(0, -contract.buy_price, contract.profit, localize('This contract lost'));
            }
        }
    };

    const removePlotLine = (id, type = 'y') => {
        chart[(`${type}Axis`)][0].removePlotLine(id);
    };

    const setIndicator = (config) => {
        chart.xAxis[0].addPlotLine({
            value : config.value,
            id    : config.id,
            label : { text: config.label, x: /entry_tick/.test(config.id) ? -15 : 5 },
            color : config.color || '#e98024',
            width : 2,
            zIndex: 2,
            ...(config.dashStyle && { dashStyle: config.dashStyle }),
        });
    };

    const updateLabels = () => {
        // update labels based on the latest values
        HighchartUI.updateLabels(chart, {
            contract_type   : contract.contract_type,
            has_barrier     : !contract.contract_type.match(/digits|runhigh|runlow|tickhigh|ticklow/i),
            is_tick_trade   : true,
            shortcode       : contract.shortcode,
            show_end_time   : true,
            is_reset_barrier: Reset.isReset(contract.contract_type) &&
                Reset.isNewBarrier(contract.entry_spot, contract.barrier),
        });
    };

    const updateChart = async (proposal_open_contract) => {
        contract = proposal_open_contract;

        if (!is_chart_init) {
            await initializeChart();
        }

        if (!CommonFunctions.isVisible(CommonFunctions.getElementById(id_render)) ||
            !contract || !contract.tick_stream || !chart || !chart.series) {
            return;
        }

        contract.tick_stream.forEach((data, idx) => {
            const points = chart.series[0].points;
            // check point is not already added in previous proposal_open_contract responses
            if (!points[idx]) {
                // add new point to chart
                chart.series[0].addPoint({
                    x: idx,
                    y: data.tick,
                    // highlight point if it's the selected tick index in highlowticks
                    ...(selected_tick_index === idx && { marker }),
                }, true, false);

                // add any indicator lines on this spot that is needed
                // entry line
                if (data.epoch === +contract.entry_tick_time) {
                    setIndicator({
                        value: idx,
                        label: localize('Entry Spot'),
                        id   : 'entry_tick',
                    });
                }

                // reset line
                if (reset_time_index === idx) {
                    setIndicator({
                        value: idx,
                        label: localize('Reset Time'),
                        id   : 'reset_tick',
                        color: '#000',
                    });
                }

                // exit line
                if (data.epoch === +contract.exit_tick_time) {
                    setIndicator({
                        value    : idx,
                        label    : localize('Exit Spot'),
                        id       : 'exit_tick',
                        dashStyle: 'Dash',
                    });
                }
            }

        });

        addBarrier();
        evaluateContractOutcome();
    };

    return {
        init,
        updateChart,
    };
})();

module.exports = TickDisplay;
