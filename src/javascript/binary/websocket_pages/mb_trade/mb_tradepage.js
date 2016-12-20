var MBContract          = require('./mb_contract').MBContract;
var MBDisplayCurrencies = require('./mb_currency').MBDisplayCurrencies;
var MBTradingEvents     = require('./mb_event').MBTradingEvents;
var MBMessage           = require('./mb_message').MBMessage;
var MBSymbols           = require('./mb_symbols').MBSymbols;
var TradingAnalysis     = require('../trade/analysis').TradingAnalysis;
var forgetTradingStreams = require('../trade/process').forgetTradingStreams;
var JapanPortfolio      = require('../../../binary_japan/trade_japan/portfolio').JapanPortfolio;
var State               = require('../../base/storage').State;
var Content             = require('../../common_functions/content').Content;
var MBProcess           = require('./mb_process').MBProcess;
var MBNotifications     = require('./mb_notifications').MBNotifications;
var MBPrice             = require('./mb_price').MBPrice;
var chartFrameCleanup   = require('../trade/common').chartFrameCleanup;

var MBTradePage = (function() {
    var events_initialized = 0;
    State.remove('is_mb_trading');

    var onLoad = function() {
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
        Content.populate();

        if (sessionStorage.getItem('currencies')) {
            MBDisplayCurrencies('', false);
            MBSymbols.getSymbols(1);
        } else {
            BinarySocket.send({ payout_currencies: 1 });
        }

        TradingAnalysis.bindAnalysisTabEvent();
        $('#tab_portfolio a').text(page.text.localize('Portfolio'));
        $('#tab_graph a').text(page.text.localize('Chart'));
        $('#tab_explanation a').text(page.text.localize('Explanation'));
        $('#remaining-time-label').text(page.text.localize('Remaining time'));
        window.chartAllowed = true;
    };

    var reload = function() {
        window.location.reload();
    };

    var onUnload = function() {
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

    var onDisconnect = function() {
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

module.exports = {
    MBTradePage: MBTradePage,
};
