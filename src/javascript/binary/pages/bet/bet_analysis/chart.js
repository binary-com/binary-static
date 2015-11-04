BetAnalysis.tab_chart = function () {
    var chart_initialized = false;
    var invoked_for_websocket  = false;
    return {
        reset: function() {
            if(typeof chart !== "undefined") {
                if(chart !== null) {
                    chart.close_chart();
                    chart = null;
                }
            }
        },
        render: function(calledForWebsocketTrading) {
            invoked_for_websocket = calledForWebsocketTrading || false;
            this.get_chart();
        },
        get_chart: function() {
            $.ajax(ajax_loggedin({
                url     : '/d/trade_chart.cgi?l=' + page.language(),
                dataType: 'html',
                success : function (data) {
                            document.getElementById('trade_chart').innerHTML = data;
                            setUnderlyingTime();
                          },
            }));
        },
        add_barrier: function(barrier) {
            if(chart.config.has_indicator(barrier.component_id)) {
                chart.remove_indicator(barrier.component_id);
            }

            barrier = new ChartIndicator.Barrier({ name: barrier.component_id, value: barrier.value(), color: 'green'});
            chart.add_indicator(barrier);
        },
        chart_config: undefined,
    };
}();
