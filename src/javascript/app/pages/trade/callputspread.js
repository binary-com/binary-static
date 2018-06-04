const constants = {
    slider: {
        width: 45,
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
            offsetX: 10,
            offsetY: 4,
        }
    },
    chart: {
        marginRight: 60,
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
        contract: {
            type: undefined,
            maximum_payout: undefined,
            price: undefined,
            display_price: undefined,
        }
    };

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

    const redrawVerticalInterval = (chart) => {
        if (state.interval.el) {
            state.interval.el.destroy();
        }
        const { x, y0, y1 } = state.interval;
        const { cap_width, stroke, strokeWidth } = constants.interval;

        state.interval.el = chart.renderer
            .path(getVerticalIntervalPath(x, y0, y1, cap_width))
            .attr({
                stroke,
                'stroke-width': strokeWidth,
            })
            .add();

        const { color, fontSize, offsetX, offsetY } = constants.interval.label;
        const label_styles = {
            color,
            fontSize,
            'z-index': -1,
        };
        
        state.interval.top_label.el = chart.renderer
            .text(state.contract.display_price, x + offsetX, y0 - offsetY, true)
            .css(label_styles)
            .add();

        state.interval.bottom_label.el = chart.renderer
            .text(state.contract.display_price, x + offsetX, y1 + offsetY + 9, true)
            .css(label_styles)
            .add();
    };

    const redrawSlider = (chart) => {
        if (state.slider.el) {
            state.slider.el.destroy();
        }
        const { el, x, y } = state.slider;
        const { width, height, fill } = constants.slider;

        state.slider.el = chart.renderer
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
        
        state.slider.label.el = chart.renderer
            .text(state.contract.display_price, x + offsetX, y + offsetY, true)
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

    const redrawHandler = (e) => {
        if (!e.target) return;

        const chart = e.target;
        const plot_end_x = chart.plotWidth + chart.plotLeft;
        const [high_plot_y, low_plot_y] = chart.series
            .find(series => series.name === constants.barrier_series_name)
            .data
            .map(point => point.plotY + chart.plotTop);

        if (plot_end_x !== state.interval.x
                || high_plot_y !== state.interval.y0
                || low_plot_y  !== state.interval.y1) {
            state.interval.x  = plot_end_x;
            state.interval.y0 = high_plot_y;
            state.interval.y1 = low_plot_y;
            redrawVerticalInterval(chart);
        }

        if (!state.contract.maximum_payout || !state.contract.price) return;

        const { type, maximum_payout, price } = state.contract;

        const k = type === 'CALLSPREAD'
            ? 1 - (price / maximum_payout)
            :      price / maximum_payout;

        const price_y = high_plot_y + (low_plot_y - high_plot_y) * k;

        if (plot_end_x !== state.slider.x
                || price_y !== state.slider.y) {
            const x_offset = (constants.interval.cap_width + constants.interval.strokeWidth) / 2;
            state.slider.x = plot_end_x + x_offset;
            state.slider.y = price_y;
            redrawSlider(chart);
        }

    };

    const isCallputspread = (contract_type) => (
        /^(CALLSPREAD|PUTSPREAD)$/.test(contract_type)
    );

    const augmentChartOptions = (chart_options) => {
        chart_options.marginRight = constants.chart.marginRight;
        chart_options.redrawHandler = redrawHandler;
    };

    const alwaysShowBarriers = (chart, high_barrier, low_barrier) => {
        // Adds invisible points with barrier coordinates,
        // so barriers are always visible on the chart
        const x0 = chart.series[0].data[0].x;
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
    };

    const updateContractState = (new_contract_state) => {
        $.extend(state.contract, new_contract_state);
    };

    return {
        augmentChartOptions,
        isCallputspread,
        alwaysShowBarriers,
        updateContractState,
    };
})();

module.exports = Callputspread;