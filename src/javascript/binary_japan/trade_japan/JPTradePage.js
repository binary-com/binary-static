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
