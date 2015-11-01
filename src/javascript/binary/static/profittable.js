
pjax_config_page("profit_tablews", function(){
    return {
        onLoad: function() {
            Content.populate();
            TradeSocket.init();
            ProfitTableWS.init();
        },
        onUnload: function(){
            TradeSocket.close();
            ProfitTableWS.clean();
        }
    };
});