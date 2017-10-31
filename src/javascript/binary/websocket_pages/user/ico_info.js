const BinarySocket     = require('../socket');
const showLoadingImage = require('../../base/utility').showLoadingImage;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;

const currencyFormatter = function () {
    const value = this.axis.defaultLabelFormatter.call(this);
    return `$${value}`;
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
        shared : true,
        useHTML: true,
    },
    plotOptions: {
        column: {
            color       : '#E98024',
            pointPadding: 0,
            borderWidth : 0,
        },
    },
    credits: false,
    series : [{
        name: 'Name',
        data: values,
    }],
});

const ICOInfo = (() => {
    let is_initialized,
        Highcharts,
        $loading,
        $root,
        chart;

    const init = (ico_info) => {
        if (is_initialized) return;
        is_initialized = true;

        $root.find('.finalPrice').text(ico_info.final_price);

        const keys = Object.keys(ico_info.histogram).sort();
        const values = keys.map((key) => ico_info.histogram[key]);
        const config = chartConfig({
            keys,
            values,
            callback: () => $loading.hide(),
        });

        const $chart = $root.find('.barChart');
        chart = Highcharts.chart($chart[0],  config);

        console.warn(ico_info);
    };

    const onLoad = () => {
        $root = $('#ico_info');
        $loading = $root.find('> .loading');
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
