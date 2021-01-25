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

        // Combination of deriv-app + Highcharts default colours.
        const line_colours = ['var(--brand-secondary)', '#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce','#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'];

        const custom_highcharts_opts = {
            webtrader: {
                currentPrice: {
                    stroke: 'var(--brand-red-coral)',
                },
            },
            colors   : line_colours,
            navigator: {
                maskFill: 'rgba(255, 255, 255, 0)',
                series  : {
                    // TODO: Dark theme -- fillOpacity cannot be applied to
                    // CSS vars and is dependent on this value.
                    color      : '#85acb0',
                    lineWidth  : 1,
                    fillOpacity: 0.1,
                },
                xAxis: {
                    labels: {
                        style: {
                            color: 'var(--text-prominent)',
                        },
                    },
                },
            },
            plotOptions: {
                candlestick: {
                    color    : '#f95454',
                    upColor  : '#4caf50',
                    lineWidth: 0,
                },
                ohlc: {
                    color  : '#f95454',
                    upColor: '#4caf50',
                },
            },
            xAxis: {
                color : 'var(--text-prominent)',
                labels: {
                    style: {
                        color: 'var(--text-prominent)',
                    },
                },
            },
            yAxis: [{
                labels: {
                    style: {
                        color: 'var(--text-prominent)',
                    },
                },
            }],
            tooltip: {
                borderWidth: 0,
                shadow     : false,
            },
        };

        chart = WebtraderCharts.chartWindow.addNewChart($('#webtrader_chart'), chart_config, custom_highcharts_opts);
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
