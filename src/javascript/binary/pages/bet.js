
pjax_config_page('openpositionsws|statement|f_manager_statement|f_manager_history|' +
    'f_profit_table|profit_table|trading', function() {
    return {
        onLoad: function() {
            BetSell.register();
        },
        onUnload: function() {
            BetSell.cleanup();
        }
    };
});

pjax_config_page('chart_application', function () {
    return {
        onLoad: function () {
            load_chart_app();
        }
    };
});

pjax_config_page('/trading', function () {
    return {
        onLoad: function(){TradePage.onLoad();},
        onUnload: function(){TradePage.onUnload();}
    };
});
