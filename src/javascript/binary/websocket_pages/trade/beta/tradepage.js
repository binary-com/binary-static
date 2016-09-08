var TradePage_Beta = (function(){

  var trading_page = 0, events_initialized = 0;

  var onLoad = function(){
    var is_japanese_client = japanese_client();
    if(is_japanese_client && /\/trading(|_beta)\.html/i.test(window.location.pathname)) {
        window.location.href = page.url.url_for('jptrading');
        return;
    } else if (!is_japanese_client && /jp/.test(window.location.pathname)) {
        window.location.href = page.url.url_for('trading');
        return;
    }
    trading_page = 1;
    if(sessionStorage.getItem('currencies')){
      displayCurrencies();
    }
    BinarySocket.init({
      onmessage: function(msg){
        Message_Beta.process(msg);
      }
    });
    Price_Beta.clearFormId();
    if (events_initialized === 0) {
        events_initialized = 1;
        TradingEvents_Beta.init();
    }
    Content.populate();

    if(sessionStorage.getItem('currencies')){
      displayCurrencies();
      Symbols.getSymbols(1);
    }
    else {
      BinarySocket.send({ payout_currencies: 1 });
    }

    if (document.getElementById('websocket_form')) {
        addEventListenerForm();
        if(!is_japanese_client) {
          new ResizeSensor($('.col-left .content-tab-container, #contract_prices_container'), adjustAnalysisColumnHeight);
          new ResizeSensor($('.col-right'), moreTabsHandler);
        }
    }

    // Walktrough Guide
    Guide.init({
      script : 'trading'
    });
    TradingAnalysis_Beta.bindAnalysisTabEvent();
  };

  var reload = function() {
    sessionStorage.removeItem('underlying');
    window.location.reload();
  };

  var onUnload = function(){
    trading_page = 0;
    events_initialized = 0;
    forgetTradingStreams_Beta();
    BinarySocket.clear();
    Defaults.clear();
    PortfolioWS.onUnload();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload : onUnload,
    is_trading_page: function(){return trading_page;}
  };
})();
