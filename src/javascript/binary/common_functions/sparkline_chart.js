const getHighstock = require('./common_functions').requireHighstock;

let Highcharts;
const sparkline_options = {
    chart: {
        type: 'spline',
        margin: [2, 0, 2, 0],
        width: 80,
        height: 20,
        style: { overflow: 'visible' },
    },
    title: { text: '' },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: { enabled: false },
    xAxis: {
        labels: { enabled: false },
        title: { text: null },
        startOnTick: false,
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        gridLineColor: 'transparent',
        endOnTick: false,
        tickPositions: [],
    },
    yAxis: {
        endOnTick: false,
        startOnTick: false,
        labels: { enabled: false },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        gridLineColor: 'transparent',
        title: { text: null },
        tickPositions: [0],
    },
    tooltip: {
        formatter() {
            return `<span>${this.y}</span>`;
        },
        backgroundColor: null,
        borderWidth: 0,
        shadow: false,
        useHTML: true,
        hideDelay: 1,
        shared: true,
        padding: 0,
        positioner(w, h, point) {
            return { x: point.plotX - (w / 2), y: point.plotY - h };
        },
    },
    plotOptions: {
        series: {
            animation: false,
            lineWidth: 1,
            shadow: false,
            states: {
                hover: { lineWidth: 1 },
            },
            marker: {
                radius: 2,
                enabled: false,
            },
            fillOpacity: 0.25,
        },
    },
    series: [{
        name: 'Price',
        data: [],
    }],
};

// Initialize Highcharts.
getHighstock((H) => {
    Highcharts = H;
    sparkline_options.chart.animation = Highcharts.svg;
});

/**
 * @param {*} ele : ele which needs to be updated or needs to have a sparkline chart.
 * @param {*} value : value of point to be added
 * @param {*} data_points : Maximum number of data points allowed.
 */
const showSparkline = (ele, val, data_points = 10) => {
    const value = parseFloat(val);
    const chart = typeof $(ele).highcharts === 'function' && $(ele).highcharts();
    if (value) {
        if (chart) { // Start adding point
            const series = chart.series[0];
            const data = series.data;
            let last_point = data.slice(-1)[0];
            // Hide last point marker.
            if (last_point) {
                last_point.update({
                    marker: { enabled: false }
                });
            }

            if (data.length < data_points) {
                series.addPoint({ y: value }, true);
            } else {
                series.addPoint({ y: value }, true, true);
            }
            // Show last_point marker
            setTimeout(() => {
                last_point = data.slice(-1)[0];
                last_point.update({
                    marker: { enabled: true }
                });
            }, 500);

        } else { // Highcharts has not yet been initialised.
            sparkline_options.series = [{
                name: 'Price',
                data: [{ y: value }],
            }];
            Highcharts.chart(ele, sparkline_options);
        }
    }
};

module.exports = {
    showSparkline
}
