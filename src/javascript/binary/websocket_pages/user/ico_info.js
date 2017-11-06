const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;

const COLOR_ORANGE = '#E98024';
const COLOR_GRAY = '#C2C2C2';

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

const tooltipFormatter = function () {
    let band = [this.x.toFixed(2)];
    if (this.points[0] && this.points[0].point && this.points[0].point.band) {
        const [a, b] = this.points[0].point.band;
        band = [a.toFixed(2), b.toFixed(2)];
    }
    band = band.map(e => `$${e}`);
    return `
    <span>Total Bids: <b>$${this.y.toFixed(2)}</b></span><br/>
    <span>Price Band: <b>${band.join(' - ')}</b></span><br/>
    `;
};
const labelFormatter = function () {
    return `$${this.value}`;
};
const chartConfig = ({min, values, finalPrice, finalPriceLabel, callback}) => ({
    chart: {
        type  : 'column',
        events: {
            load: () => {
                const $svg = $('#ico_info .highcharts-container > svg');
                createGradient($svg[0],'gradient-0', [
                    {offset: '0%', 'stop-color': 'white'},
                    {offset: '100%', 'stop-color': COLOR_ORANGE},
                ]);
                createGradient($svg[0],'gradient-1', [
                    {offset: '0%', 'stop-color': 'white'},
                    {offset: '100%', 'stop-color': COLOR_GRAY},
                ]);
                callback();
            },
        },
    },
    title: { text: '', enabled: false },
    xAxis: {
        crosshair: true,
        min,
        labels   : {
            style    : { color: COLOR_GRAY },
            formatter: labelFormatter,
        },
        plotLines: !!finalPrice && [{
            color    : '#000000',
            width    : 2,
            dashStyle: 'ShortDash',
            zIndex   : 5,
            value    : finalPrice,
            label    : { text: finalPriceLabel },
        }],
    },
    yAxis: {
        title : { enabled: false },
        labels: {
            style: { color: COLOR_GRAY },
        },
    },
    tooltip: {
        formatter: tooltipFormatter,
        shared   : true,
        useHTML  : false,
    },
    plotOptions: {
        column: {
            color       : COLOR_ORANGE,
            pointPadding: 0,
            borderWidth : 0,
            groupPadding: 0.05,
            pointRange  : 0.2,
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

        const final_price = +ico_info.final_price;

        const BUCKET_COUNT = 40;;
        const bucket_size = +ico_info.histogram_bucket_size;

        const keys = Object.keys(ico_info.histogram)
                           .map(key => +key)
                           .sort((a,b) => a - b);
        const allValues = [];
        if (keys.length > 0) {
            const max = keys[keys.length - 1];
            const min = Math.max(
                +(max - BUCKET_COUNT * bucket_size).toFixed(2), 1
            );
            for(let key = max; key >= min; key -= bucket_size ) {
                key = +key.toFixed(2);
                const value = keys.indexOf(key) !== -1 ? ico_info.histogram[`${key}`] : 0;
                if (value !== 0) {
                    const color = key >= final_price ? COLOR_ORANGE : COLOR_GRAY;
                    allValues.unshift({
                        y   : value,
                        x   : key,
                        band: [key, key + bucket_size],
                        color,
                    });
                }
            }

            const lessThanMin = keys.filter(key => key < min)
                .map(key => ico_info.histogram[`${key}`])
                .reduce((a,b) => a+b, 0);
            if (lessThanMin !== 0) {
                const color = min >= final_price ? 'url(#gradient-0)' : 'url(#gradient-1)';
                allValues.unshift({
                    y   : lessThanMin,
                    x   : min - bucket_size,
                    band: [1, min],
                    color,
                });
            }

            const chartMin = allValues[0].x;
            const config = chartConfig({
                min            : chartMin,
                finalPrice     : final_price,
                values         : allValues,
                finalPriceLabel: `Final Price ($${final_price})`,
                callback       : () => {
                    $loading.hide();
                    $labels.setVisibility(1);
                },
            });

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
