const getLanguage = require('../../../base/language').get;
const localize    = require('../../../base/localize');
const Url         = require('../../../base/url');
const jpClient    = require('../../../common_functions/country_base').jpClient;

const ChartFrame = (() => {
    const showHighchart = () => {
        if (window.chartAllowed) {
            chartFrameSource();
        } else {
            chartFrameCleanup();
            $('#trade_live_chart').hide();
            $('#chart-error').text(localize('Chart is not available for this underlying.')).show();
        }
    };

    const chartFrameCleanup = () => {
        /*
         * Prevent IE memory leak (http://stackoverflow.com/questions/8407946).
         */
        const chart_frame = document.getElementById('chart_frame');
        if (chart_frame) {
            chart_frame.src = 'about:blank';
        }
    };

    const chartFrameSource = () => {
        const new_underlying = document.getElementById('underlying').value;
        const chart_source   = $('#chart_frame').attr('src');
        if ($('#tab_graph').hasClass('active') && (Url.paramsHash(chart_source).instrument !== new_underlying || /^(|about:blank)$/.test(chart_source))) {
            chartFrameCleanup();
            setChartSource();
        }
        $('#chart-error').hide();
        $('#trade_live_chart').show();
    };

    const setChartSource = () => {
        const is_ja = !!jpClient();
        document.getElementById('chart_frame').src = `https://webtrader.binary.com?affiliates=true&instrument=${document.getElementById('underlying').value}&timePeriod=1t&gtm=true&lang=${getLanguage().toLowerCase()}&hideOverlay=${is_ja}&hideShare=${is_ja}&timezone=GMT+${(is_ja ? '9' : '0')}`;
    };

    return {
        showHighchart    : showHighchart,
        chartFrameCleanup: chartFrameCleanup,
        chartFrameSource : chartFrameSource,
    };
})();

module.exports = ChartFrame;
