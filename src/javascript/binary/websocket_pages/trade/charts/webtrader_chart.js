const getLanguage      = require('../../../base/language').get;
const localize         = require('../../../base/localize').localize;
const State            = require('../../../base/storage').State;
const getPropertyValue = require('../../../base/utility').getPropertyValue;
const jpClient         = require('../../../common_functions/country_base').jpClient;
const Config           = require('../../../../config');

const WebtraderChart = (() => {
    'use strict';

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
        const is_mb_trading = State.get('is_mb_trading');
        const new_underlying = is_mb_trading ? $('#underlying').attr('value') : document.getElementById('underlying').value;
        if (($('#tab_graph').hasClass('active') || is_mb_trading) && (!chart || chart.data().instrumentCode !== new_underlying)) {
            cleanupChart();
            initChart(is_mb_trading);
        }
        $('#chart-error').hide();
        $('#trade_live_chart').show();
    };

    const initChart = (is_mb_trading) => {
        if (!State.get('is_chart_allowed')) return;
        if (!is_initialized) {
            require.ensure(['highstock-release'], () => {
                require.ensure([], (require) => {
                    WebtraderCharts = require('webtrader-charts');
                    WebtraderCharts.init({
                        server: Config.getSocketURL(),
                        appId : Config.getAppId(),
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
        const $underlying = $('#underlying');
        const $underlying_code = is_mb_trading ? $underlying.attr('value') : $underlying.val();
        const $underlying_name = is_mb_trading ? $underlying.find('.current .name').text() : $underlying.find('option:selected').text();
        const chart_config = {
            instrumentCode    : $underlying_code,
            instrumentName    : $underlying_name,
            showInstrumentName: true,
            timePeriod        : '1t',
            type              : 'line',
            lang              : getLanguage().toLowerCase(),
            timezone          : `GMT+${jpClient() ? '9' : '0'}`,
        };
        chart = WebtraderCharts.chartWindow.addNewChart($('#webtrader_chart'), chart_config);
    };

    const redrawChart = () => {
        if (typeof getPropertyValue(chart, ['actions', 'reflow']) === 'function') {
            chart.actions.reflow();
        }
    };

    return {
        showChart   : showChart,
        cleanupChart: cleanupChart,
        setChart    : setChart,
        redrawChart : redrawChart,
    };
})();

module.exports = WebtraderChart;
