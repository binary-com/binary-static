const Callputspread = (() => {
    const state = {
        slider: {
            el: null,
        },
        interval: {
            el: null,
            x : undefined,
            y0: undefined,
            y1: undefined,
            cap_width: 10,
            stroke: '#2a3052',
            strokeWidth: 2,
        },
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
        const { x, y0, y1, cap_width, stroke, strokeWidth } = state.interval;
        state.interval.el = chart.renderer
            .path(getVerticalIntervalPath(x, y0, y1, cap_width))
            .attr({
                stroke,
                'stroke-width': strokeWidth,
            })
            .add();
    };

    const redrawHandler = (e) => {
        window.chart = e.target;
        if (!e.target) return;

        // TODO: vertical line can be series added with .addSeries and removed with .destroy
        // or SVG added with renderer

        const chart = e.target;
        // TODO: point slider to calculated Y point
        // pass from highcharts.js in params

        const plot_end_x = chart.plotWidth + chart.plotLeft;

        const [high_plot_y, low_plot_y] = chart.series
            .find(series => series.name === 'barrier_points')
            .data
            .map(point => point.plotY + chart.plotTop);

        if (high_plot_y !== state.interval.y0 || low_plot_y !== state.interval.y1) {
            state.interval.x  = plot_end_x;
            state.interval.y0 = high_plot_y;
            state.interval.y1 = low_plot_y;
            redrawVerticalInterval(chart);
        }
    };

    const isCallputspread = (contract_type) => (
        /^(CALLSPREAD|PUTSPREAD)$/.test(contract_type)
    );

    const augmentChartOptions = (chart_options) => {
        chart_options.marginRight = 60;
        chart_options.redrawHandler = redrawHandler;
    };

    const alwaysShowBarriers = (chart, high_barrier, low_barrier) => {
        // Add invisible points to barriers,
        // so barriers are always visible on the chart
        const x0 = chart.series[0].data[0].x;
        chart.addSeries({
            name: 'barrier_points',
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

    return {
        augmentChartOptions,
        isCallputspread,
        alwaysShowBarriers,
    };
})();

module.exports = Callputspread;