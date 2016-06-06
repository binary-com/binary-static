var TradePage = (function(){

  var trading_page = 0;

  var onLoad = function(){
    if(page.language() === 'JA' && /\/trading\.html/i.test(window.location.pathname)) {
        window.location.href = page.url.url_for('jptrading');
        return;
    }
    trading_page = 1;
    if(sessionStorage.getItem('currencies')){
      displayCurrencies();
    }
    BinarySocket.init({
      onmessage: function(msg){
        Message.process(msg);
      },
      onclose: function(){
        processMarketUnderlying();
      }
    });
    Price.clearFormId();
    TradingEvents.init();
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
    $('#tab_portfolio a').text(text.localize('Portfolio'));
    $('#tab_graph a').text(text.localize('Chart'));
    $('#tab_explanation a').text(text.localize('Explanation'));
    $('#tab_last_digit a').text(text.localize('Last Digit Stats'));
    $('#tab_japan_info a').text(text.localize('Prices'));
    handleChart();
  };

  var handleChart = function() {
    $('#time_duration').text(Content.localize().textDuration + ':');
    $('#time_period option[value="1t"]').text('1 ' + Content.localize().textTickResultLabel.toLowerCase());
    $('#time_period option[value="1m"]').text('1 ' + text.localize("minute").toLowerCase());
    $('#time_period option[value="2m"]').text('2 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="3m"]').text('3 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="5m"]').text('5 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="10m"]').text('10 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="15m"]').text('15 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="30m"]').text('30 ' + Content.localize().textDurationMinutes.toLowerCase());
    $('#time_period option[value="1h"]').text('1 ' + text.localize('hour').toLowerCase());
    $('#time_period option[value="2h"]').text('2 ' + Content.localize().textDurationHours.toLowerCase());
    $('#time_period option[value="4h"]').text('4 ' + Content.localize().textDurationHours.toLowerCase());
    $('#time_period option[value="8h"]').text('8 ' + Content.localize().textDurationHours.toLowerCase());
    $('#time_period option[value="1d"]').text('1 ' + text.localize('day').toLowerCase());

    document.getElementById('time_period').addEventListener("change", function() {
      setChartSource();
    });
  };

  var reload = function() {
    sessionStorage.removeItem('underlying');
    window.location.reload();
  };

  var onUnload = function(){
    trading_page = 0;
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
