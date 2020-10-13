const getAllSymbols    = require('../symbols').getAllSymbols;
const getElementById   = require('../../../../_common/common_functions').getElementById;
const getLanguage      = require('../../../../_common/language').get;
const localize         = require('../../../../_common/localize').localize;
const State            = require('../../../../_common/storage').State;
const getPropertyValue = require('../../../../_common/utility').getPropertyValue;
const Config           = require('../../../../config');

const WebtraderChart = (() => {
    let chart,
        WebtraderCharts,
        is_initialized;

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
        if (typeof getPropertyValue(chart, ['actions', 'destroy']) === 'function') {
            chart.actions.destroy();
        }
        chart = undefined;
    };

    const setChart = () => {
        const new_underlying = getElementById('underlying').value;
        if ($('#tab_graph').hasClass('active') &&
            (!chart || chart.data().instrumentCode !== new_underlying)
        ) {
            cleanupChart();
            initChart();
        }
        $('#chart-error').hide();
        $('#trade_live_chart').show();
    };

    const initChart = () => {
        if (!State.get('is_chart_allowed')) return;
        if (!is_initialized) {
            require.ensure(['highstock-release'], () => {
                require.ensure([], (require) => {
                    WebtraderCharts = require('@binary-com/webtrader-charts');
                    WebtraderCharts.init({
                        server: Config.getSocketURL(),
                        appId : Config.getAppId(),
                        brand : 'binary',
                        lang  : getLanguage().toLowerCase(),
                    });
                    is_initialized = true;
                    addChart();
                }, 'webtrader-charts');
            }, 'highstock');
        } else {
            addChart();
        }
    };

    const addChart = () => {
        const $underlying      = $('#underlying');
        const $underlying_code = $underlying.val();
        const $underlying_name = getAllSymbols()[$underlying_code];

        const chart_config = {
            instrumentCode    : $underlying_code,
            instrumentName    : $underlying_name,
            showInstrumentName: true,
            timePeriod        : getChartSettings().time_frame,
            type              : getChartSettings().chart_type,
            lang              : getLanguage().toLowerCase(),
            showShare         : true,
        };

        chart = WebtraderCharts.chartWindow.addNewChart($('#webtrader_chart'), chart_config);
    };

    const redrawChart = () => {
        if (typeof getPropertyValue(chart, ['actions', 'reflow']) === 'function') {
            chart.actions.reflow();
        }
    };

    const getChartSettings = () => ({ time_frame: '1t', chart_type: 'line' });

    return {
        showChart,
        cleanupChart,
        setChart,
        redrawChart,
    };
})();

module.exports = WebtraderChart;
