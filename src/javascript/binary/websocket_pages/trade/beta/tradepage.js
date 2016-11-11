var TradingAnalysis_Beta = require('./analysis').TradingAnalysis_Beta;
var TradingEvents_Beta   = require('./event').TradingEvents_Beta;
var Message_Beta         = require('./message').Message_Beta;
var displayCurrencies = require('../currency').displayCurrencies;
var Defaults          = require('../defaults').Defaults;
var Guide = require('../../../common_functions/guide').Guide;
var japanese_client = require('../../../common_functions/country_base').japanese_client;
var PortfolioWS = require('../../user/account/portfolio/portfolio.init').PortfolioWS;
var ResizeSensor = require('../../../../lib/resize-sensor');

var TradePage_Beta = (function(){

  var trading_page = 0, events_initialized = 0;

  var onLoad = function(){
    var is_japanese_client = japanese_client();
    if(is_japanese_client && /\/trading(|_beta)\.html/i.test(window.location.pathname)) {
        window.location.href = page.url.url_for('multi_barriers_trading');
        return;
    } else if (!is_japanese_client && /\/multi_barriers_trading\.html/.test(window.location.pathname)) {
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
    chartFrameCleanup();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload : onUnload,
    is_trading_page: function(){return trading_page;}
  };
})();

module.exports = {
    TradePage_Beta: TradePage_Beta,
};
