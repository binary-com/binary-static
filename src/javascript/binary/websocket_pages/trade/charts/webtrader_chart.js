const WTCharts    = require('webtrader-charts');
const getLanguage = require('../../../base/language').get;
const localize    = require('../../../base/localize').localize;
const State       = require('../../../base/storage').State;
const jpClient    = require('../../../common_functions/country_base').jpClient;
const Config      = require('../../../../config');

const WebtraderChart = (() => {
    'use strict';

    let chart;

    const showChart = () => {
        if (State.get('is_chart_allowed')) {
            setChart();
        } else {
            cleanupChart();
            $('#trade_live_chart').hide();
            $('#chart-error').text(localize('Chart is not available for this underlying.')).show();
        }
    };

    const cleanupChart = () => {
        if (chart && typeof chart.actions.destroy === 'function') {
            chart.actions.destroy();
            chart = undefined;
        }
    };

    const setChart = () => {
        const new_underlying = document.getElementById('underlying').value;
        if ($('#tab_graph').hasClass('active') && (!chart || chart.data().instrumentCode !== new_underlying)) {
            cleanupChart();
            initChart();
        }
        $('#chart-error').hide();
        $('#trade_live_chart').show();
    };

    const initChart = () => {
        WTCharts.init({
            server: Config.getSocketURL(),
            appId : Config.getAppId(),
            lang  : getLanguage().toLowerCase(),
        });
        const $underlying = $('#underlying');
        const chart_config = {
            instrumentCode: $underlying.val(),
            instrumentName: $underlying.find('option:selected').text(),
            timePeriod    : '1t',
            type          : 'line',
            delayAmount   : 0,
            lang          : getLanguage().toLowerCase(),
            timezone      : `GMT+${jpClient() ? '9' : '0'}`,
        };
        chart = WTCharts.chartWindow.addNewChart($('#webtrader_chart'), chart_config);
    };

    return {
        showChart   : showChart,
        cleanupChart: cleanupChart,
        setChart    : setChart,
    };
})();

module.exports = WebtraderChart;
