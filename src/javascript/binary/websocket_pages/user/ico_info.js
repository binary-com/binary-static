const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;

const tooltipFormatter = function () {
    return `$${this.y.toFixed(2)}`;
};
const chartDefs = ({color}) => `
<linearGradient id="gradient-0" x1="0" x2="1" y2="0" y1="0">
  <stop offset="0%" stop-opacity="0" stop-color="${color}"></stop>
  <stop offset="70%" stop-color="${color}" stop-opacity="1"></stop>
</linearGradient>
`;
// svg:   the owning <svg> element
// id:    an id="..." attribute for the gradient
// stops: an array of objects with <stop> attributes
function createGradient(svg, id, stops) {
    const namespace = svg.namespaceURI;
    const grad = document.createElementNS(namespace, 'linearGradient');
    grad.setAttribute('id', id);
    for (let i = 0; i < stops.length; i++) {
        const attrs = stops[i];
        const stop = document.createElementNS(namespace, 'stop');
        Object.keys(attrs).forEach(attr => {
            stop.setAttribute(attr, attrs[attr]);
        });
        grad.appendChild(stop);
    }

    const defs = svg.querySelector('defs') ||
        svg.insertBefore(document.createElementNS(namespace, 'defs'), svg.firstChild);
    return defs.appendChild(grad);
}
const chartConfig = ({categories, values, plotLineIndex, plotLineLabel, callback}) => ({
    chart: {
        type  : 'column',
        events: {
            load: () => {
                const $svg = $('#ico_info .highcharts-container > svg');
                createGradient($svg[0],'gradient-0', [
                    {offset: '0%', 'stop-opacity': 0, 'stop-color': '#E98024'},
                    {offset: '75%', 'stop-opacity': 1, 'stop-color': '#E98024'},
                ]);
                callback();
            },
        },
    },
    title: { text: '', enabled: false },
    xAxis: {
        categories,
        crosshair: true,
        labels   : {
            style: { color: '#C2C2C2' },
        },
        plotLines: !!plotLineIndex && [{
            color    : '#E98024',
            width    : 2,
            dashStyle: 'ShortDash',
            value    : plotLineIndex,
            label    : { text: plotLineLabel },
        }],
    },
    yAxis: {
        min   : 0,
        title : { enabled: false },
        labels: {
            style: { color: '#C2C2C2' },
        },
    },
    tooltip: {
        formatter: tooltipFormatter,
        shared   : true,
        useHTML  : true,
    },
    plotOptions: {
        column: {
            color       : '#E98024',
            pointPadding: 0,
            borderWidth : 0,
        },
    },
    legend : false,
    credits: false,
    series : [{
        data: values,
    }],
});

const ICOInfo = (() => {
    let is_initialized,
        Highcharts,
        $loading,
        $labels,
        $root,
        chart;

    const init = (ico_info) => {
        if (is_initialized) return;

        $root.find('.finalPrice').text(ico_info.final_price);
        const final_price = 3;// +ico_info.final_price;
        let plotLineIndex = 0;

        const BUCKET_COUNT = 40;;
        const bucket_size = ico_info.histogram_bucket_size;

        const keys = Object.keys(ico_info.histogram)
                           .map(key => +key)
                           .sort((a,b) => a - b);
        const allKeys = [];
        const allValues = [];
        let categories = [];
        if (keys.length > 0) {
            const max = keys[keys.length - 1];
            const min = Math.max(
                +(max - BUCKET_COUNT * bucket_size).toFixed(2), 1
            );
            for(let key = max; key >= min; key -= bucket_size ) {
                key = +key.toFixed(2);
                allKeys.unshift(key);
                const value = keys.indexOf(key) !== -1 ? ico_info.histogram[`${key}`] : 0;
                const color = key >= final_price ? '#E98024' : '#C2C2C2';
                allValues.unshift({ y: value, color });
            }

            const lessThanMin = keys.filter(key => key < min)
                .map(key => ico_info.histogram[`${key}`])
                .reduce((a,b) => a+b, 0);
            if (lessThanMin !== 0) {
                allKeys.unshift(0);
                const color = min >= final_price ? 'url(#gradient-0)' : '#C2C2C2';
                allValues.unshift({ y: lessThanMin, color});
            }
            let inx = lessThanMin !== 0 ? 1 : 0;
            for (; inx < allKeys.length; ++inx) {
                if (final_price === allKeys[inx]) {
                    plotLineIndex = inx;
                } else if (final_price > allKeys[inx]) {
                    plotLineIndex = inx + 0.5;
                }
            }
            categories = allKeys.map(key => key ===  0 ? `< ${min}` : `$${key}`);
        }
        const config = chartConfig({
            categories,
            plotLineIndex,
            values       : allValues,
            plotLineLabel: `Final Price ($${final_price})`,
            callback     : () => {
                $loading.hide();
                $labels.setVisibility(1);
            },
        });

        if (keys.length > 0) {
            const $chart = $root.find('.barChart');
            chart = Highcharts.chart($chart[0],  config);
            is_initialized = true;
        } else {
            $root.hide();
        }
    };

    const onLoad = () => {
        $root = $('#ico_info');
        $loading = $root.find('> .loading');
        $labels = $root.find('.x-label,.y-label');
        $loading.show();
        showLoadingImage($loading[0]);

        getHighstock((Highstock) => {
            Highcharts = Highstock;
            BinarySocket.wait('website_status').then((response) => {
                init(response.website_status.ico_info);
            });
        });
    };

    const onUnload = () => {
        if (is_initialized) {
            chart.destroy();
            chart = null;
        }
        is_initialized = false;
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = ICOInfo;
