const Callputspread = (() => {
    let el_slider, el_interval;

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

    const redrawHandler = (e) => {
        window.chart = e.target;
        if (!e.target) return;
        if (el_slider) el_slider.destroy();
        if (el_interval) el_interval.destroy();

        // TODO: vertical line can be series added with .addSeries and removed with .destroy
        // or SVG added with renderer

        const chart = e.target;
        // TODO: point slider to calculated Y point
        // pass from highcharts.js in params
        const points = chart.series[0].data;
        const last_point = points[points.length - 1];

        const plot_end_x = chart.plotWidth + chart.plotLeft;

        const [high_plot_y, low_plot_y] = chart.series
            .find(series => series.name === 'barrier_points')
            .data
            .map(point => point.plotY);

        el_slider = chart.renderer
            .path(getSliderPath(
                chart.plotWidth + chart.plotLeft + 5,
                last_point.plotY + chart.plotTop,
                40,
                15
            ))
            .attr({
                fill: '#FF0000',
                'stroke-width': 0,
            })
            .add();

        el_interval = chart.renderer
            .path(getVerticalIntervalPath(
                plot_end_x,
                high_plot_y + chart.plotTop,
                low_plot_y + chart.plotTop,
                10
            ))
            .attr({
                stroke: '#2a3052',
                'stroke-width': 1,
            })
            .add();
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