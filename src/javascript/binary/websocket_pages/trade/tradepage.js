var TradePage = (function(){

  var trading_page = 0, events_initialized = 0;

  var onLoad = function(){
    var is_japanese_client = japanese_client();
    if(is_japanese_client && /\/trading\.html/i.test(window.location.pathname)) {
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
        Message.process(msg);
      }
    });
    Price.clearFormId();
    if (events_initialized === 0) {
        events_initialized = 1;
        TradingEvents.init();
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
        new ResizeSensor($('.content-tab-container, #contract_prices_container'), adjustAnalysisColumnHeight);
    }

    // Walktrough Guide
    Guide.init({
      script : 'trading'
    });
    TradingAnalysis.bindAnalysisTabEvent();
    $('#tab_portfolio a').text(text.localize('Portfolio'));
    $('#tab_graph a').text(text.localize('Chart'));
    $('#tab_explanation a').text(text.localize('Explanation'));
    $('#tab_last_digit a').text(text.localize('Last Digit Stats'));
    if(!is_japanese_client) {
      $('#tab_asset_index').removeClass('invisible').find('a').text(text.localize('Asset Index'));
    }
    $('#tab_trading_times a').text(text.localize('Trading Times'));
  };

  var reload = function() {
    sessionStorage.removeItem('underlying');
    window.location.reload();
  };

  var onUnload = function(){
    trading_page = 0;
    events_initialized = 0;
    forgetTradingStreams();
    BinarySocket.clear();
    Defaults.clear();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload : onUnload,
    is_trading_page: function(){return trading_page;}
  };
})();
