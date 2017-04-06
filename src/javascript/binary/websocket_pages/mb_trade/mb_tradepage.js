const MBContract           = require('./mb_contract');
const MBDisplayCurrencies  = require('./mb_currency');
const MBTradingEvents      = require('./mb_event');
const MBMessage            = require('./mb_message');
const MBNotifications      = require('./mb_notifications');
const MBPrice              = require('./mb_price');
const MBProcess            = require('./mb_process');
const MBSymbols            = require('./mb_symbols');
const TradingAnalysis      = require('../trade/analysis');
const chartFrameCleanup    = require('../trade/common').chartFrameCleanup;
const forgetTradingStreams = require('../trade/process').forgetTradingStreams;
const localize             = require('../../base/localize').localize;
const State                = require('../../base/storage').State;
const JapanPortfolio       = require('../../../binary_japan/trade_japan/portfolio');

const MBTradePage = (() => {
    'use strict';

    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = () => {
        State.set('is_mb_trading', true);
        BinarySocket.init({
            onmessage: (msg) => {
                MBMessage.process(msg);
            },
            onopen: () => {
                MBNotifications.hide('CONNECTION_ERROR');
            },
        });

        if (events_initialized === 0) {
            events_initialized = 1;
            MBTradingEvents.init();
        }

        BinarySocket.send({ payout_currencies: 1 }).then(() => {
            MBDisplayCurrencies('', false);
            MBSymbols.getSymbols(1);
        });

        TradingAnalysis.bindAnalysisTabEvent();
        $('#tab_portfolio').find('a').text(localize('Portfolio'));
        $('#tab_graph').find('a').text(localize('Chart'));
        $('#tab_explanation').find('a').text(localize('Explanation'));
        $('#remaining-time-label').text(localize('Remaining time'));
        window.chartAllowed = true;
    };

    const reload = () => {
        window.location.reload();
    };

    const onUnload = () => {
        chartFrameCleanup();
        window.chartAllowed = false;
        JapanPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        forgetTradingStreams();
        BinarySocket.clear();
    };

    const onDisconnect = () => {
        MBPrice.showPriceOverlay();
        chartFrameCleanup();
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
