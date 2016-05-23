BetAnalysis.tab_live_chart = function () {
    var live_chart_initialized = false;
    var invoked_for_websocket  = false;
    return {
        reset: function() {
            if(typeof live_chart !== "undefined") {
                if(live_chart !== null) {
                    live_chart.close_chart();
                    live_chart = null;
                }
            }
        },
        render: function(calledForWebsocketTrading) {
            invoked_for_websocket = calledForWebsocketTrading || false;
            if (live_chart_initialized && $('#live_chart_div').length > 0) {
                this.update_live_chart();
            } else {
                this.get_live_chart();
            }
        },
        get_live_chart: function() {
            if (document.getElementById('underlying')){
                showHighchart();
            } else {
                var that = this;
                $.ajax(ajax_loggedin({
                    url     : '/d/trade_livechart.cgi?l=' + page.language(),
                    dataType: 'html',
                    success : function (data) {
                          that.set_live_chart(data);
                        },
                }));
            }
        },
        set_live_chart: function (data) {
            $('#trade_live_chart').html(data);
            var that = this;
            if(this.load_timer)
                return;

            showLoadingImage($('#live_chart_div'));
            //Waiting for Highcharts to get loaded.
            this.load_timer = setInterval(function(){
                if(typeof Highcharts !== "undefined") {
                    configure_livechart();
                    that.update_live_chart();
                    live_chart_initialized = true;
                    clearInterval(that.load_timer);
                    that.load_timer = undefined;
                }
            }, 80); //Its scientifically proven that humans cannot visualize what they see before 80ms.
        },
        update_live_chart: function () {
            if(this.update_chart_config()) {
                updateLiveChart(this.live_chart_config);
            }

            this.add_spot();
            var that = this;
            if (!invoked_for_websocket) {
                BetForm.barriers.each(function(barrier) { that.add_barrier(barrier); });
            }
        },
        update_chart_config: function() {
            var symbol = invoked_for_websocket ? sessionStorage.getItem('underlying') : BetForm.attributes.underlying();
            var live = SessionStore.get('live_chart_duration') || this.get_duration() || '10min';
            if(!this.live_chart_config) {
                this.live_chart_config = new LiveChartConfig({ renderTo: 'live_chart_div', symbol: symbol, live: live});
                return true;
            }

            var update = {};
            var update_config = false;
            if(this.live_chart_config.live != live) {
                update['live'] = live;
                update_config = true;
            }

            if(this.live_chart_config.symbol.symbol != symbol) {
                update['symbol'] = symbol;
                update_config = true;
            }

            if(update_config) {
                this.live_chart_config.update(update);
            }
            if (!live_chart) {
                update_config = true;
            }
            return update_config;
        },
        add_spot: function() {
            if(live_chart.config.has_indicator('spot')) {
                live_chart.remove_indicator('spot');
            }

            var barrier = new LiveChartIndicator.Barrier({ name: "spot", value: '+0', color: 'blue'});
            live_chart.add_indicator(barrier);
        },
        add_barrier: function(barrier) {
            if(live_chart.config.has_indicator(barrier.component_id)) {
                live_chart.remove_indicator(barrier.component_id);
            }

            barrier = new LiveChartIndicator.Barrier({ name: barrier.component_id, value: barrier.value(), color: 'green'});
            live_chart.add_indicator(barrier);
        },
        get_duration: function () {
            var duration_in_seconds = invoked_for_websocket ? '600' : BetForm.attributes.duration_seconds();
            return $('#live_chart_duration').find('#' + this.corrected_hours_to_chart(duration_in_seconds)).data('live');
        },
        corrected_hours_to_chart: function(chart_duration) {
            var hours, available_hours = [];
            $('.live_charts_stream_button').each(function(){
                available_hours.push(parseInt($(this).attr("id")));
            });
            available_hours.sort(function(a,b) { return a - b; });
            for(hours in available_hours) {
                if(chart_duration <= available_hours[hours]) {
                    return available_hours[hours];
                }
            }
            return 1;
        },
        get_duration_seconds: function (selected_duration) {
           var duration;
           if (selected_duration) {
               duration = selected_duration.replace(/[a-zA-Z]/g, '');
               var duration_unit = selected_duration.replace(/\d+/g, '');

               if(duration_unit == 'min') {
                   return duration * 60;
               } else if(duration_unit == 'h') {
                   return duration * 3600;
               } else if(duration_unit == 'd') {
                   return duration * 86400;
               } else if(duration_unit == 'w') {
                   return duration * 604800;
               } else if(duration_unit == 'm') {
                   return duration * 2592000;
               } else if(duration_unit == 'y') {
                   return duration * 31536000;
               }
           }
           return duration;
        },
        live_chart_config: undefined,
        load_timer: undefined,
    };
}();
