const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;

const currencyFormatter = function () {
    return `$${this.value.toFixed(2)}`;
};
const tooltipFormatter = function () {
    return `$${this.y.toFixed(2)}`;
};
const chartConfig = ({keys, values, callback}) => ({
    chart: {
        type  : 'column',
        events: {
            load: callback,
        },
    },
    title: { text: '', enabled: false },
    xAxis: {
        categories: keys,
        crosshair : true,
        labels    : {
            formatter: currencyFormatter,
            style    : { color: '#C2C2C2' },
        },
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

        const keys = Object.keys(ico_info.histogram).map(key => +key).sort();
        const values = keys.map((key) => ico_info.histogram[`${key}`]);
        const config = chartConfig({
            keys,
            values,
            callback: () => {
                $loading.hide();
                $labels.setVisibility(1);
            },
        });

        // --------------- DEBUGING --------------
        const end = (Math.random() * 1000);
        for(let i = 0; i < end; ++i) {
            let key = (Math.random() * 5).toFixed(2);
            key = Math.round(+key / .2) * .2;
            const value = (Math.random() * 25).toFixed(2);
            if(keys.indexOf(+key) === -1) {
                keys.push(+key);
                values.push(+(+value).toFixed(2));
            }
        }
        keys.sort();
        console.warn(values);
        // --------------- DEBUGING END --------------

        

        if (keys.length > 0) {
            const $chart = $root.find('.barChart');
            chart = Highcharts.chart($chart[0],  config);
            is_initialized = true;
        } else {
            $root.hide();
        }

        console.warn(ico_info);
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
