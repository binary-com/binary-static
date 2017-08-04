const MBContract          = require('./mb_contract');
const MBDisplayCurrencies = require('./mb_currency');
const MBDefaults          = require('./mb_defaults');
const MBTradingEvents     = require('./mb_event');
const MBPrice             = require('./mb_price');
const MBProcess           = require('./mb_process');
const BinarySocket        = require('../socket');
const cleanupChart        = require('../trade/charts/webtrader_chart').cleanupChart;
const localize            = require('../../base/localize').localize;
const State               = require('../../base/storage').State;
const JapanPortfolio      = require('../../../binary_japan/trade_japan/portfolio');

const MBTradePage = (() => {
    'use strict';

    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);
        disableTrading();

        if (events_initialized === 0) {
            events_initialized = 1;
            MBTradingEvents.init();
        }

        BinarySocket.wait('authroize').then(() => {
            BinarySocket.send({ payout_currencies: 1 }).then(() => {
                MBDisplayCurrencies();
                MBProcess.getSymbols();
            });
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
        onLoad      : onLoad,
        reload      : reload,
        onUnload    : onUnload,
        onDisconnect: onDisconnect,
    };
})();

module.exports = MBTradePage;
