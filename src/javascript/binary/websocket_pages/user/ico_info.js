const BinarySocket     = require('../socket');
// const localize         = require('../../base/localize').localize;
// const Client           = require('../../base/client');
// const showLoadingImage = require('../../base/utility').showLoadingImage;
// const getPropertyValue = require('../../base/utility').getPropertyValue;
// const formatMoney      = require('../../common_functions/currency').formatMoney;
const getHighstock     = require('../../common_functions/common_functions').requireHighstock;

const chartConfig = (keys, values) => ({
    chart: {
        type: 'column',
    },
    title: { text: '', enabled: false },
    xAxis: {
        categories: keys,
        crosshair : true,
    },
    yAxis: {
        min  : 0,
        title: { enabled: false },
    },
    tooltip: {
        shared : true,
        useHTML: true,
    },
    plotOptions: {
        column: {
            color       : '#2A3052',
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
    // const currency = Client.get('currency') || '';
    let is_initialized,
        Highcharts,
        chart;

    const init = (ico_info) => {
        if (is_initialized) return;
        is_initialized = true;

        const $root = $('#ico_info');
        $root.find('.finalPrice').text(ico_info.final_price);

        const $chart = $root.find('.barChart');
        const keys = Object.keys(ico_info.histogram).sort();
        const values = keys.map((key) => ico_info.histogram[key]);
        const config = chartConfig(keys, values);
        chart = Highcharts.chart($chart[0], config);

        console.warn(ico_info);
    };

    const onLoad = () => {
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
