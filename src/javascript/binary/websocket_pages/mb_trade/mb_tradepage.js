var MBContract = require('./mb_contract').MBContract;
var MBDisplayCurrencies = require('./mb_currency').MBDisplayCurrencies;
var MBTradingEvents = require('./mb_event').MBTradingEvents;
var MBMessage = require('./mb_message').MBMessage;
var MBSymbols = require('./mb_symbols').MBSymbols;
var MBProcess = require('./mb_process').MBProcess;

var MBTradePage = (function(){

  var trading_page = 0, events_initialized = 0;

  var onLoad = function(){
    trading_page = 1;
    if (sessionStorage.getItem('currencies')) {
      MBDisplayCurrencies('', false);
    }
    BinarySocket.init({
      onmessage: function(msg){
        MBMessage.process(msg);
      }
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
    trading_page = 0;
    events_initialized = 0;
    MBContract.onUnload();
    MBPrice.onUnload();
    MBProcess.onUnload();
    forgetTradingStreams();
    BinarySocket.clear();
  };

  return {
    onLoad   : onLoad,
    reload   : reload,
    onUnload : onUnload,
    is_trading_page: function() { return trading_page; }
  };
})();

module.exports = {
    MBTradePage: MBTradePage,
};
