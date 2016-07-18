var JPTradePage = (function() {

  var isJapan = true;
  var documentReady = false;

  var onLoad = function() {
    isJapan = true;
    
    $(function(){
      JapanTrading.start();
      documentReady = true;
    });

    if(documentReady){
      JapanTrading.start();
    }

    Content.populate();
    TradingAnalysis.bindAnalysisTabEvent();
    $('#tab_portfolio a').text(text.localize('Portfolio'));
    $('#tab_graph a').text(text.localize('Chart'));
    $('#tab_explanation a').text(text.localize('Explanation'));
    $('#tab_last_digit a').text(text.localize('Last Digit Stats'));
    $('#tab_japan_info a').text(text.localize('Prices'));

    window.chartAllowed = true;
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
    window.location.reload();
  };

  var onUnload = function() {
    window.chartAllowed = false;
    isJapan = false;
    JapanTrading.stop();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload: onUnload,
    isJapan: function() {
      return isJapan;
    }
  };
})();
