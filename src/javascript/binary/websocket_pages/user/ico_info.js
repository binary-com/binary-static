const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;
const localize         = require('../../base/localize').localize;

const BLUE_ORANGE = '#2A3052';
const COLOR_GRAY = '#C2C2C2';
const MAX_BID_PRICE = 10;

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
    if (!this.y) {
        return false;
    }
    let band = [this.x.toFixed(2)];
    if (this.points[0] && this.points[0].point && this.points[0].point.band) {
        const [a, b] = this.points[0].point.band;
        band = [a.toFixed(2), b.toFixed(2)];
    }
    band = band.map(e => `$${e}`);
    const totalBids = localize('Total Bids');
    const priceBand = localize('Price Band');
    return `
    <span>${totalBids}: <b>$${this.y.toFixed(2)}</b></span><br/>
    <span>${priceBand}: <b>${band.join(' - ')}</b></span><br/>
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
                    {offset: '0%', 'stop-color': BLUE_ORANGE},
                    {offset: '100%', 'stop-color': 'white'},
                ]);
                createGradient($svg[0],'gradient-1', [
                    {offset: '0%', 'stop-color': COLOR_GRAY},
                    {offset: '100%', 'stop-color': 'white'},
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
            color       : BLUE_ORANGE,
            pointPadding: 0,
            borderWidth : 0,
            groupPadding: 0.05,
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

    const init = (ico_status) => {
        if (is_initialized) return;
        ico_status.ico_status = ico_status.ico_status || 'open'; // backend will add this field.
        const final_price = ico_status.ico_status !== 'open' ? +ico_status.final_price_usd : 0;
        const bucket_size = +ico_status.histogram_bucket_size;
        const minimum_bid = ico_status.minimum_bid_usd;

        const keys = Object.keys(ico_status.histogram)
                           .map(key => +key)
                           .sort((a,b) => a - b);
        const allValues = [];
        if (keys.length > 0) {
            const max = Math.min(keys[keys.length - 1] + 1, MAX_BID_PRICE);
            const min = final_price ?
                        Math.max(Math.min(keys[0], final_price) - bucket_size, 1) :
                        Math.max(keys[0] - 1, 1);

            for(let key = max - bucket_size; key >= min; key -= bucket_size ) {
                key = +key.toFixed(2);
                const value = keys.indexOf(key) !== -1 ? ico_status.histogram[`${key}`] : 0;
                const color = key >= final_price ? BLUE_ORANGE : COLOR_GRAY;

                allValues.unshift({
                    y   : value,
                    x   : Math.max(key, minimum_bid),
                    band: [Math.max(key, minimum_bid), key + bucket_size - 0.01],
                    color,
                });
                if (key < minimum_bid) {
                    break;
                }
            }

            const aboveMaxPrice = keys.filter(key => key >= MAX_BID_PRICE)
                    .map(key => ico_status.histogram[`${key}`])
                    .reduce((a,b) => a + b, 0);
            if (aboveMaxPrice !== 0) {
                const maxKey = keys[keys.length - 1];
                const color = MAX_BID_PRICE >= final_price ? 'url(#gradient-0)' : 'url(#gradient-1)';
                allValues.push({
                    y   : aboveMaxPrice,
                    x   : MAX_BID_PRICE,
                    band: [MAX_BID_PRICE, maxKey],
                    color,
                });
            }

            const config = chartConfig({
                min            : Math.max(Math.min(min - bucket_size, MAX_BID_PRICE - 1), minimum_bid),
                finalPrice     : final_price,
                values         : allValues,
                finalPriceLabel: `${localize('Final Price')} ($${final_price})`,
                callback       : () => {
                    $loading.hide();
                    $labels.setVisibility(1);
                },
            });

            const $chart = $root.find('.barChart');
            chart = Highcharts.chart($chart[0],  config);
            is_initialized = true;
        } else {
            $('#no_bids_to_show').setVisibility(1);
            $root.hide();
        }
    };

    const onLoad = () => {
        $root = $('#ico_info');
        $loading = $root.find('> .loading');
        $labels = $root.find('.x-label,.y-label');
        $root.setVisibility(1);
        $loading.show();
        showLoadingImage($loading[0]);

        getHighstock((Highstock) => {
            Highcharts = Highstock;
            BinarySocket.send({ico_status: 1}, {forced: true}).then((response) => {
                init(response.ico_status);
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
