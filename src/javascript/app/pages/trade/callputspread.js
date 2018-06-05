const formatMoney = require('../../common/currency').formatMoney;

const constants = {
    slider: {
        width: 60,
        height: 14,
        fill: '#e98024',
        label: {
            color: '#fff',
            fontSize: '9px',
            offsetY: 4,
            offsetX: 7,
        }
    },
    interval: {
        cap_width: 10,
        stroke: '#2a3052',
        strokeWidth: 2,
        label: {
            color: '#000',
            fontSize: '12px',
            offsetX: 2,
            offsetY: 4,
        }
    },
    barrier_series_name: 'barrier_points',
};


const Callputspread = (() => {
    const state = {
        slider: {
            el: null,
            x: undefined,
            y: undefined,
            label: {
                el: null,
            }
        },
        interval: {
            el: null,
            x : undefined,
            y0: undefined,
            y1: undefined,
            top_label: {
                el: null,
            },
            bottom_label: {
                el: null,
            },
        },
        chart: null,
        contract: null,
    };

    const redrawVerticalInterval = () => {
        if (state.interval.el) {
            state.interval.el.destroy();
        }
        const { x, y0, y1 } = state.interval;
        const { cap_width, stroke, strokeWidth } = constants.interval;

        state.interval.el = state.chart.renderer
            .path(getVerticalIntervalPath(x, y0, y1, cap_width))
            .attr({
                stroke,
                'stroke-width': strokeWidth,
            })
            .add();

        if (state.interval.top_label.el) {
            state.interval.top_label.el.destroy();
        }
        if (state.interval.bottom_label.el) {
            state.interval.bottom_label.el.destroy();
        }

        const { color, fontSize, offsetX, offsetY } = constants.interval.label;
        const label_styles = {
            color,
            fontSize,
            'z-index': -1,
        };

        const [display_maximum_payout, display_minimum_payout] = [state.contract.payout, 0]
            .map(payout => formatMoney(state.contract.currency, payout));

        const [top_label, bottom_label] = state.contract.contract_type === 'CALLSPREAD'
            ? [display_maximum_payout, display_minimum_payout]
            : [display_minimum_payout, display_maximum_payout];
        
        state.interval.top_label.el = state.chart.renderer
            .text(top_label, x + offsetX, y0 - offsetY, true)
            .css(label_styles)
            .add();

        state.interval.bottom_label.el = state.chart.renderer
            .text(bottom_label, x + offsetX, y1 + offsetY + 9, true)
            .css(label_styles)
            .add();
    };

    const redrawSlider = () => {
        if (state.slider.el) {
            state.slider.el.destroy();
        }
        const { el, x, y } = state.slider;
        const { width, height, fill } = constants.slider;

        state.slider.el = state.chart.renderer
            .path(getSliderPath(x, y, width, height))
            .attr({
                fill,
                'stroke-width': 0,
            })
            .add();

        if (state.slider.label.el) {
            state.slider.label.el.destroy();
        }

        const { color, fontSize, offsetX, offsetY } = constants.slider.label;
        
        state.slider.label.el = state.chart.renderer
            .text(formatMoney(state.contract.currency, state.contract.bid_price), x + offsetX, y + offsetY, true)
            .css({
                color,
                fontSize,
                // OUTRAGEOUS, WIDTH IS IGNORED!!!
                // display: 'block',
                // width: '50px',
                // textAlign: 'center',
            })
            .add();
    };

    const updateSliderState = () => {
        // Calculates new X Y coordinates for slider based on state
        const plot_end_x = state.chart.plotWidth + state.chart.plotLeft;
        const [high_plot_y, low_plot_y] = state.chart.series
            .find(series => series.name === constants.barrier_series_name)
            .data
            .map(point => point.plotY + state.chart.plotTop);

        const { contract_type, payout, bid_price } = state.contract;

        const k = contract_type === 'CALLSPREAD'
            ? 1 - (bid_price / payout)
            :      bid_price / payout;

        const price_y = high_plot_y + (low_plot_y - high_plot_y) * k;

        const x_offset = (constants.interval.cap_width + constants.interval.strokeWidth) / 2;
        state.slider.x = plot_end_x + x_offset;
        state.slider.y = price_y;
    };

    const updateVerticalIntervalState = () => {
        // Calculates new X Y coordinates for interval based on state
        const plot_end_x = state.chart.plotWidth + state.chart.plotLeft;
        const [high_plot_y, low_plot_y] = state.chart.series
            .find(series => series.name === constants.barrier_series_name)
            .data
            .map(point => point.plotY + state.chart.plotTop);

        state.interval.x  = plot_end_x;
        state.interval.y0 = high_plot_y;
        state.interval.y1 = low_plot_y;
    };

    const redrawHandler = (e) => {
        // Called on Highcharts 'redraw' event
        updateState(e.target, null);
        redrawVerticalInterval();
        redrawSlider();
    };

    const isCallputspread = (contract_type) => (
        /^(CALLSPREAD|PUTSPREAD)$/.test(contract_type)
    );

    const getChartOptions = (chart_options) => {
        const formatted_max_payout = formatMoney(null, state.contract.payout, true);
        const marginRight = 10 + 7.5 * formatted_max_payout.length;
        return {
            marginRight,
            redrawHandler,
        };
    };

    const init = (chart, contract) => {
        // Adds invisible points with barrier coordinates,
        // so barriers are always visible on the chart
        const x0 = chart.series[0].data[0].x;
        const { high_barrier, low_barrier } = contract;
        chart.addSeries({
            name: constants.barrier_series_name,
            type: 'scatter',
            marker: { enabled: false },
            data: [
                {
                    y: +high_barrier,
                    x: x0,
                },
                {
                    y: +low_barrier,
                    x: x0,
                },
            ],
        });
        updateState(chart, contract);
    };

    const updateState = (chart, contract) => {
        state.chart = chart || state.chart;
        state.contract = contract || state.contract;
        if (!state.chart || !state.contract) return;
        updateSliderState();
        updateVerticalIntervalState();
    };

    return {
        init,
        isCallputspread,
        getChartOptions,
        updateState,
    };
})();


/* HELPER FUNCTIONS THAT RETURN SVG PATH: */

const getSliderPath = (x, y, width, height) => {
    const half = height / 2;
    return [
        'M', x, y,
        'l', half, -half,
        'h', width,
        'v', height,
        'h', -width,
        'z',
    ];
};

const getVerticalIntervalPath = (x, y0, y1, cap_width) => {
    const half_cap = cap_width / 2;
    return [
        'M', x, y0,
        'h', cap_width,
        'm', -half_cap, 0,
        'v', (y1 - y0),
        'm', -half_cap, 0,
        'h', cap_width,
    ];
};

module.exports = Callputspread;