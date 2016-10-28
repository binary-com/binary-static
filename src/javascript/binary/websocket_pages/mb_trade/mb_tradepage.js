var MBTradePage = (function(){

  var trading_page = 0, events_initialized = 0;

  var onLoad = function(){
    trading_page = 1;
    if (sessionStorage.getItem('currencies')) {
      displayCurrencies('', false);
    }
    BinarySocket.init({
      onmessage: function(msg){
        MBMessage.process(msg);
      }
    });
    //Price.clearFormId();
    if (events_initialized === 0) {
      events_initialized = 1;
      MBTradingEvents.init();
    }
    Content.populate();

    if (sessionStorage.getItem('currencies')) {
      displayCurrencies('', false);
      MBSymbols.getSymbols(1);
    } else {
      BinarySocket.send({ payout_currencies: 1 });
    }

    /*if (document.getElementById('websocket_form')) {
        addEventListenerForm();
    }*/

    MBSymbols.getSymbols(1);

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
    trading_page = 0;
    events_initialized = 0;
    JapanPortfolio.hide();
    forgetTradingStreams();
    BinarySocket.clear();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload : onUnload,
    is_trading_page: function() { return trading_page; }
  };
})();

module.exports = {
    MBTradePage: MBTradePage,
};
