var TradingAnalysis   = require('./analysis').TradingAnalysis;
var displayCurrencies = require('./currency').displayCurrencies;
var Defaults          = require('./defaults').Defaults;
var TradingEvents     = require('./event').TradingEvents;
var Message           = require('./message').Message;
var Notifications     = require('./notifications').Notifications;
var Price             = require('./price').Price;
var Symbols           = require('./symbols').Symbols;
var Content         = require('../../common_functions/content').Content;
var Guide           = require('../../common_functions/guide').Guide;
var japanese_client = require('../../common_functions/country_base').japanese_client;
var State = require('../../base/storage').State;

var TradePage = (function(){

  var events_initialized = 0;
  State.remove('is_trading');

  var onLoad = function(){
    if(japanese_client() && /\/trading\.html/i.test(window.location.pathname)) {
        window.location.href = page.url.url_for('multi_barriers_trading');
        return;
    } else if (!japanese_client() && /\/multi_barriers_trading\.html/.test(window.location.pathname)) {
        window.location.href = page.url.url_for('trading');
        return;
    }
    State.set('is_trading' , true);
    if(sessionStorage.getItem('currencies')){
      displayCurrencies();
    }
    BinarySocket.init({
      onmessage: function(msg){
        Message.process(msg);
      },
      onopen: function() {
        Notifications.hide('CONNECTION_ERROR');
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
    }

    // Walktrough Guide
    Guide.init({
      script : 'trading'
    });
    TradingAnalysis.bindAnalysisTabEvent();
    $('#tab_portfolio a').text(page.text.localize('Portfolio'));
    $('#tab_graph a').text(page.text.localize('Chart'));
    $('#tab_explanation a').text(page.text.localize('Explanation'));
    $('#tab_last_digit a').text(page.text.localize('Last Digit Stats'));
  };

  var reload = function() {
    sessionStorage.removeItem('underlying');
    window.location.reload();
  };

  var onUnload = function(){
    State.remove('is_trading');
    events_initialized = 0;
    forgetTradingStreams();
    BinarySocket.clear();
    Defaults.clear();
    chartFrameCleanup();
  };

  var onDisconnect = function() {
    showPriceOverlay();
    showFormOverlay();
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
    TradePage: TradePage,
};
