pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            TradeSocket.init();
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
            TradeSocket.close();
        }
    };
});

