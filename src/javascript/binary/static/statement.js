pjax_config_page("statementws", function(){
    return {
        onLoad: function() {
            Content.populate();
            TradeSocket.init();
            StatementWS.init();
        },
        onUnload: function(){
            StatementWS.clean();
            TradeSocket.close();
        }
    };
});

