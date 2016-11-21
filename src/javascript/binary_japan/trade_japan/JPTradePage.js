var JapanPortfolio = require('./portfolio').JapanPortfolio;
var TradingAnalysis = require('../../binary/websocket_pages/trade/analysis').TradingAnalysis;
var Content = require('../../binary/common_functions/content').Content;
var State   = require('../../binary/base/storage').State;

var JPTradePage = (function() {

  var scriptUrl = 'https://binary-com.github.io/japanui/bundle' + (/www\.binary\.com/i.test(window.location.hostname) ? '' : '_beta') + '.js';
  State.remove('is_jp_trading');
  var scriptReady = false;

  var getScript = function(cb) {
    var options = { dataType: 'script', cache: true, url: scriptUrl };

    if (!scriptReady) {
      $.ajax(options).done(function() {
        scriptReady = true;
        cb();
      });
    } else {
      cb();
    }
  };

  var onLoad = function() {
    State.set('is_jp_trading', true);

    Content.populate();
    getScript(function() {
      JapanTrading.start();
      TradingAnalysis.bindAnalysisTabEvent();
    });

    $('#tab_portfolio a').text(page.text.localize('Portfolio'));
    $('#tab_graph a').text(page.text.localize('Chart'));
    $('#tab_explanation a').text(page.text.localize('Explanation'));

    window.chartAllowed = true;
  };

  var reload = function() {
    window.location.reload();
  };

  var onUnload = function() {
    chartFrameCleanup();
    window.chartAllowed = false;
    JapanPortfolio.hide();
    State.remove('is_jp_trading');
    JapanTrading.stop();
  };

  return {
    onLoad: onLoad,
    reload: reload,
    onUnload: onUnload,
  };
})();

module.exports = {
    JPTradePage: JPTradePage,
};
