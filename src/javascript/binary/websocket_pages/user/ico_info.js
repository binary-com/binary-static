const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;
const localize         = require('../../base/localize').localize;

const COLOR_ORANGE = '#E98024';
const COLOR_GRAY = '#C2C2C2';
const BAR_HAS_VALUE = 'bar-has-value';
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
                    {offset: '0%', 'stop-color': COLOR_ORANGE},
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

    const init = (ico_status) => {
        if (is_initialized) return;

        const final_price = ico_status.ico_status !== 'open' ? +ico_status.final_price : 0;

        const bucket_size = +ico_status.histogram_bucket_size;

        const keys = Object.keys(ico_status.histogram)
            .map(key => +key)
            .sort((a,b) => a - b);
        const allValues = [];
        if (keys.length > 0) {
            const max = Math.min(keys[keys.length - 1] + 1, MAX_BID_PRICE);
            const min = final_price ? Math.max(Math.min(keys[0], final_price) - 1, 1) : Math.max(keys[0] - 1, 1);
            for(let key = max - bucket_size; key >= min; key -= bucket_size ) {
                key = +key.toFixed(2);
                const value = keys.indexOf(key) !== -1 ? ico_status.histogram[`${key}`] : 0;
                const color = key >= final_price ? COLOR_ORANGE : COLOR_GRAY;
                allValues.unshift({
                    y        : value,
                    x        : key,
                    band     : [key, key + bucket_size - 0.01],
                    className: value ? BAR_HAS_VALUE : '',
                    color,
                });
            }

            const aboveMaxPrice = keys.filter(key => key >= MAX_BID_PRICE)
                .map(key => ico_status.histogram[`${key}`])
                .reduce((a,b) => a + b, 0);
            if (aboveMaxPrice !== 0) {
                const maxKey = keys[keys.length - 1];
                const color = MAX_BID_PRICE >= final_price ? 'url(#gradient-0)' : 'url(#gradient-1)';
                allValues.push({
                    y        : aboveMaxPrice,
                    x        : MAX_BID_PRICE,
                    band     : [MAX_BID_PRICE, maxKey],
                    className: BAR_HAS_VALUE,
                    color,
                });
            }

            const config = chartConfig({
                min            : Math.min(min - bucket_size, MAX_BID_PRICE - 1),
                finalPrice     : final_price,
                values         : allValues,
                finalPriceLabel: `${localize('Final Price')} ($${final_price})`,
                callback       : () => {
                    const $bars = $root.find('.barChart svg .highcharts-column-series > rect');
                    $bars.each((inx, bar) => {
                        const $bar = $(bar);
                        if ($bar.hasClass(BAR_HAS_VALUE)) {
                            const dy = +$bar.attr('height') ? 1 : 2;

                            if(dy === 2) {
                                $bar.attr('height', '1');
                            }

                            const y = +$bar.attr('y');
                            $bar.attr('y', `${+y - dy}`);
                        }
                    });
                    $loading.hide();
                    $labels.setVisibility(1);
                },
            });

            const $chart = $root.find('.barChart');
            chart = Highcharts.chart($chart[0],  config);
            is_initialized = true;
        } else {
            $('#no_bids_to_show').setVisibility(1);
            $loading.hide();
            $root.hide();
        }
    };

    const onLoad = () => {
        $root = $('#ico_info');
        $loading = $('#ico_info_loading');
        $labels = $root.find('.x-label,.y-label');
        showLoadingImage($loading[0]);

        getHighstock((Highstock) => {
            Highcharts = Highstock;
            BinarySocket.send({ico_status: 1}).then((response) => {
                if(response.error) {
                    $('#ico_status_error').setVisibility(1).text(response.error.message);
                    $loading.hide();
                    $root.setVisibility(0);
                } else {
                    $root.setVisibility(1);
                    init(response.ico_status);
                }
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
