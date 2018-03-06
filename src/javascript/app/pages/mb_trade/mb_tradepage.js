const MBContract          = require('./mb_contract');
const MBDisplayCurrencies = require('./mb_currency');
const MBDefaults          = require('./mb_defaults');
const MBTradingEvents     = require('./mb_event');
const MBPrice             = require('./mb_price');
const MBProcess           = require('./mb_process');
const cleanupChart        = require('../trade/charts/webtrader_chart').cleanupChart;
const BinaryPjax          = require('../../base/binary_pjax');
const Client              = require('../../base/client');
const BinarySocket        = require('../../base/socket');
const jpClient            = require('../../common/country_base').jpClient;
const JapanPortfolio      = require('../../japan/portfolio');
const getLanguage         = require('../../../_common/language').get;
const localize            = require('../../../_common/localize').localize;
const State               = require('../../../_common/storage').State;
const urlFor              = require('../../../_common/url').urlFor;

const MBTradePage = (() => {
    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);
        BinarySocket.wait('authorize').then(init);
    };

    const init = () => {
        if (/^(malta|iom)$/.test(Client.get('landing_company_shortcode'))) {
            if (getLanguage() === 'JA') {
                $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: localize('This page is not available in the selected language.') })));
            } else {
                BinaryPjax.load(urlFor('trading'));
            }
            return;
        }
        if (jpClient()) {
            disableTrading();
            $('#panel').find('.ja-hide').remove();
        } else {
            MBDefaults.set('disable_trading', 0);
            $('#panel').find('.ja-show').remove();
        }

        if (events_initialized === 0) {
            events_initialized = 1;
            MBTradingEvents.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            MBDisplayCurrencies();
            MBProcess.getSymbols();
        });

        $('#tab_portfolio').find('a').text(localize('Portfolio'));
        $('#tab_graph').find('a').text(localize('Chart'));
        $('#tab_explanation').find('a').text(localize('Explanation'));
        State.set('is_chart_allowed', true);
        State.set('ViewPopup.onDisplayed', MBPrice.hidePriceOverlay);
        $('.container').css('max-width', '1200px');
    };

    const disableTrading = () => {
        MBDefaults.set('disable_trading', 1);
        $('#allow').removeClass('selected');
        $('#disallow').addClass('selected');
    };

    const reload = () => {
        window.location.reload();
    };

    const onUnload = () => {
        cleanupChart();
        State.set('is_chart_allowed', false);
        JapanPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        BinarySocket.clear('active_symbols');
        State.remove('ViewPopup.onDisplayed');
        $('.container').css('max-width', '');
    };

    const onDisconnect = () => {
        MBPrice.showPriceOverlay();
        cleanupChart();
        onLoad();
    };

    return {
        onLoad,
        reload,
        onUnload,
        onDisconnect,
    };
})();

module.exports = MBTradePage;
