const MBContract           = require('./mb_contract').MBContract;
const MBDisplayCurrencies  = require('./mb_currency').MBDisplayCurrencies;
const MBTradingEvents      = require('./mb_event').MBTradingEvents;
const MBMessage            = require('./mb_message').MBMessage;
const MBNotifications      = require('./mb_notifications').MBNotifications;
const MBPrice              = require('./mb_price').MBPrice;
const MBProcess            = require('./mb_process').MBProcess;
const MBSymbols            = require('./mb_symbols').MBSymbols;
const TradingAnalysis      = require('../trade/analysis').TradingAnalysis;
const chartFrameCleanup    = require('../trade/common').chartFrameCleanup;
const localize             = require('../../base/localize').localize;
const State                = require('../../base/storage').State;
const JapanPortfolio       = require('../../../binary_japan/trade_japan/portfolio').JapanPortfolio;

const MBTradePage = (function() {
    let events_initialized = 0;
    State.remove('is_mb_trading');

    const onLoad = function() {
        State.set('is_mb_trading', true);
        if (sessionStorage.getItem('currencies')) {
            MBDisplayCurrencies('', false);
        }
        BinarySocket.init({
            onmessage: function(msg) {
                MBMessage.process(msg);
            },
            onopen: function() {
                MBNotifications.hide('CONNECTION_ERROR');
            },
        });

        if (events_initialized === 0) {
            events_initialized = 1;
            MBTradingEvents.init();
        }

        if (sessionStorage.getItem('currencies')) {
            MBDisplayCurrencies('', false);
            MBSymbols.getSymbols(1);
        } else {
            BinarySocket.send({ payout_currencies: 1 });
        }

        TradingAnalysis.bindAnalysisTabEvent();
        $('#tab_portfolio').find('a').text(localize('Portfolio'));
        $('#tab_graph').find('a').text(localize('Chart'));
        $('#tab_explanation').find('a').text(localize('Explanation'));
        $('#remaining-time-label').text(localize('Remaining time'));
        window.chartAllowed = true;
    };

    const reload = function() {
        window.location.reload();
    };

    const onUnload = function() {
        chartFrameCleanup();
        window.chartAllowed = false;
        JapanPortfolio.hide();
        State.remove('is_mb_trading');
        events_initialized = 0;
        MBContract.onUnload();
        MBPrice.onUnload();
        MBProcess.onUnload();
        BinarySocket.clear();
    };

    const onDisconnect = function() {
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
