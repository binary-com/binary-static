var live_chart;
var chart_closed;
var ticks_array = [];


function updateLiveChart(config) {
    if (live_chart) {
        if (!chart_closed) {
            live_chart.close_chart();
        }
        live_chart = null;
    }

    if (config.resolution == 'tick') {
        live_chart = new LiveChartTick(config);
    } else {
        live_chart = new LiveChartOHLC(config);
    }
    live_chart.show_chart();
    chart_closed = false;
}

var LiveChart = function(config) {
    //Required for inheritence.
    if (!config) return;

    this.config = config;
    this.shift = false;
    if (!config.trade_visualization) {
        this.on_duration_change();
        this.highlight_duration();
    }
};

LiveChart.prototype = {
    show_chart: function() {
        $('.notice').hide();
        this.chart = new Highcharts.StockChart(this.chart_params());
        this.chart.showLoading();
    },
    close_chart: function() {
        $(".live_charts_stream_button").off('click');
        if (this.ev) {
            this.ev.close();
        }

        if (!chart_closed && live_chart) {
            if (this.chart) {
                this.chart.destroy();
            }
            chart_closed = true;
            live_chart = null;
        }
    },
    add_indicator: function(indicator) {
        this.config.add_indicator(indicator);
        indicator.paint(this);
    },
    remove_indicator: function(name) {
        var indicator = this.config.remove_indicator(name);
        if(indicator) {
            indicator.remove(this);
        }
    },
    exporting_menu: function() {
        var $self = this;
        var menuItems = [];

        var defaultOptions = Highcharts.getOptions();
        var defaultMenu = defaultOptions.exporting.buttons.contextButton.menuItems;
        for (var i=0; i<defaultMenu.length; i++) {
            menuItems.push(defaultMenu[i]);
        }

        return menuItems;
    },
    connect_to_stream: function() {
        var $self = this;
        var url = window.location.protocol + "//" + this.config.streaming_server;
        var end = this.config.to ? "/" + this.config.to : "";
        url += "/stream/ticks/" + this.config.symbol.symbol + "/" + this.config.from + end + "?adjust_start_time=1&with_trades=" + this.config.with_trades;
        if (this.config.resolution != 'tick') {
            url += "&ohlc=" + this.config.resolution;
        }
        this.ev = new EventSource(url, { withCredentials: true });
        this.ev.onmessage = function(msg) {
            $self.process_message(msg);
        };
        this.ev.onerror = function() { $self.ev.close(); };
    },
    process_contract: function(trade) {
        if (!this.tradeSeries) {
            this.tradeSeries = this.chart.addSeries({
                name: "Contracts",
                type: "flags",
                data: [],
                onSeries: 'primary_series',
                shape: "circlepin",
                includeInCSVExport: false,
            }, false, false);
        }
        var epoch = 1000 * parseInt(trade.start_time);
        var text = "Contract ID: " + trade.buy_id + "<br>" + trade.long_code;
        var color = "white";
        if (trade.is_sold) {
            if (trade.won) {
                text += "<br>Result: Won";
                color = "green";
            } else {
                text += "<br>Result: Lost";
                color = "red";
            }
        }
        var cpoint = {
            x: epoch,
            title: "C",
            fillColor: color,
            text: text
        };
        this.tradeSeries.addPoint(cpoint, false, false, false);
    },
    chart_params: function() {
        var $self = this;
        var chart_params = {
            chart: {
                height: this.config.renderHeight,
                renderTo: this.config.renderTo,
                events: {
                    load: function() { $self.connect_to_stream(); }
                }
            },
            credits: {
                enabled: false
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: this.exporting_menu()
                    }
                },
                enabled: true
            },
            plotOptions: {
                series: {
                    dataGrouping: {
                        dateTimeLabelFormats: {
                            millisecond: ['%A, %b %e, %H:%M:%S.%L GMT', '%A, %b %e, %H:%M:%S.%L', '-%H:%M:%S.%L GMT'],
                            second: ['%A, %b %e, %H:%M:%S GMT', '%A, %b %e, %H:%M:%S', '-%H:%M:%S GMT'],
                            minute: ['%A, %b %e, %H:%M GMT', '%A, %b %e, %H:%M', '-%H:%M GMT'],
                            hour: ['%A, %b %e, %H:%M GMT', '%A, %b %e, %H:%M', '-%H:%M GMT'],
                            day: ['%A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            week: ['Week from %A, %b %e, %Y', '%A, %b %e', '-%A, %b %e, %Y'],
                            month: ['%B %Y', '%B', '-%B %Y'],
                            year: ['%Y', '%Y', '-%Y']
                        },
                        turboThreshold: 3000
                    },
                    marker: {
                        enabled: this.config.with_markers,
                        radius: 2,
                    },
                },
                candlestick: {
                    turboThreshold: 4000
                }
            },
            xAxis: {
                type: 'datetime',
                min: this.config.from * 1000,
            },
            yAxis: {
                opposite: false,
                labels: {
                    align: 'left',
                    x: 0,
                    formatter: function() { return this.value; }
                },
                title: {
                    text: null
                }
            },
            rangeSelector: {
                enabled: false,
            },
            title: {
                text: this.config.symbol.translated_display_name(),
            },
        };

        if (this.config.with_marker) {
            chart_params.plotOptions.line = {marker: {enabled: true}};
        }

        this.configure_series(chart_params);
        return chart_params;
    },
    process_message: function(message) {
        var data = JSON.parse(message.data);
        if (data.error) {
            this.ev.close();
            return;
        }
        if (data.notice) {
            $("#" + data.notice + "_notice").show();
            return;
        }
        if (!(data[0] instanceof Array)) {
            data = [ data ];
        }

        var data_length = data.length;
        for (var i = 0; i < data_length; i++) {
            this.process_data(data[i]);
        }

        if (data_length > 0 && this.spot) {
            this.config.repaint_indicators(this);
            this.chart.redraw();
            if (!this.navigator_initialized) {
                this.navigator_initialized = true;
                var xData = this.chart.series[0].xData;
                var xDataLen = xData.length;
                if (xDataLen) {
                    this.chart.xAxis[0].setExtremes(xData[0], xData[xDataLen - 1], true, false);
                }
            }
            this.chart.hideLoading();
            this.shift = this.config.shift == 1 ? true : false;
        }
    },
    highlight_duration: function() {
        $('#live_chart_duration').find('.live_charts_stream_button').each( function () {
            $(this).find('span').removeClass('current');
        });

         $('#live_chart_duration li[data-live=' + this.config.live + '] span').addClass('current');
    },
    on_duration_change: function() {
        var that = this;
        $(".live_charts_stream_button").on('click', function() {
            that.config.update({
                live: $(this).data("live"),
                update_url: 1
            });
            that.highlight_duration();
            updateLiveChart(that.config); //Will cause this object to unload.
            var duration_changed = jQuery.Event( "duration_change", { target: this, config: that.config } );
            $('#live_chart_duration').trigger(duration_changed);
        });
    }
};

function LiveChartTick(params) {
    LiveChart.call(this, params);
}

LiveChartTick.prototype = new LiveChart();

LiveChartTick.prototype.constructor = LiveChartTick;
LiveChartTick.prototype.configure_series = function(chart_params) {
        chart_params.chart.type = 'line';

        chart_params.xAxis.labels = { format: "{value:%H:%M:%S}" };
        chart_params.series = [{
            name: this.config.symbol.translated_display_name(),
            data: [],
            dataGrouping: {
                enabled: false
            },
            id: 'primary_series',
            tooltip: {
                xDateFormat: "%A, %b %e, %H:%M:%S GMT"
            },
            type: 'line'
        }];
};

LiveChartTick.prototype.process_data = function(point) {
    if (point[0] == 'tick') {
        var tick = {
            epoch: parseInt(point[1]),
            quote: parseFloat(point[2])
        };

        if (!this.chart) return;
        if (!this.chart.series) return;

        this.chart.series[0].addPoint(
            [tick.epoch * 1000, tick.quote], false, this.shift, false
        );
        this.spot = tick.quote;
        // for tick trade charting purposes
        if (tick.epoch > this.config.contract_start_time && ticks_array.length < this.config.how_many_ticks) {
                ticks_array.push(tick);
        }
    } else if (point[0] == 'contract') {
        this.process_contract(point[1]);
    }
};


function LiveChartOHLC(params) {
    LiveChart.call(this, params);
    this.candlestick = {};
    this.candlestick.period = this.config.resolution_seconds() * 1000;
}

LiveChartOHLC.prototype = new LiveChart();
LiveChartOHLC.prototype.constructor = LiveChartOHLC;

LiveChartOHLC.prototype.configure_series = function(chart_params) {
    chart_params.chart.type = 'candlestick';
    chart_params.series = [{
        name: this.config.symbol.translated_display_name(),
        data: [],
        color: 'red',
        upColor: 'green',
        id: 'primary_series',
        type: 'candlestick',
    }];
};

LiveChartOHLC.prototype.process_data = function(point) {
    var type = point.shift();
    if (type == 'ohlc') {
        this.process_ohlc(point);
    } else if (type == 'tick') {
        if (this.accept_ticks) {
                this.process_tick(point);
        }
    } else if (type == 'corp_action') {
        this.process_corp_action(point);
    } else if (type == 'contract') {
        this.process_contract(point[0]);
    }
};

LiveChartOHLC.prototype.process_corp_action = function(action) {
    if (!this.flagSeries) {
        this.flagSeries = this.chart.addSeries({
            name: "Events",
            type: "flags",
            data: [],
            shape: "flag"
        }, false, false);
    }

    var epoch = 1000 * parseInt(action[0].epoch);
    var text = action[0].description;
    var point = {
        x: epoch,
        title: "CA",
        text: text
    };

    this.flagSeries.addPoint(point, false, false, false);
};

LiveChartOHLC.prototype.process_ohlc = function(ohlc) {
    var epoch = parseInt(ohlc[0]);
    if (!this.chart) return;
    if (!this.chart.series) return;
    var ohlc_pt = {
        x:     epoch * 1000,
        open:  parseFloat(ohlc[1]),
        y:     parseFloat(ohlc[1]),
        high:  parseFloat(ohlc[2]),
        low:   parseFloat(ohlc[3]),
        close: parseFloat(ohlc[4])
    };
    this.chart.series[0].addPoint(ohlc_pt, false, false, false);
    this.spot = ohlc_pt.close;
    this.accept_ticks = true;
};

LiveChartOHLC.prototype.process_tick = function(tickInput) {
    var tick = {
        epoch: parseInt(tickInput[0]) * 1000,
        quote: parseFloat(tickInput[1]),
        squote: tickInput[1]
    };
    this.spot = tick.quote;

    if (!this.chart) return;
    if (!this.chart.series) return;

    var data = this.chart.series[0].options.data;
    if (data.length > 0 && data[data.length - 1].x > (tick.epoch - this.candlestick.period)) {
        var last_ohlc = data[data.length - 1];
        if (tick.quote != last_ohlc.close) {
            last_ohlc.close = tick.quote;
            if (last_ohlc.low > tick.quote)
                last_ohlc.low = tick.quote;
            if (last_ohlc.high < tick.quote)
                last_ohlc.high = tick.quote;

            this.chart.series[0].isDirty = true;
            this.chart.series[0].isDirtyData = true;
        }
    } else {
        /* add new Candlestick */
        var ohlc = {
            x:     tick.epoch,
            open:  tick.quote,
            y:     tick.quote,
            high:  tick.quote,
            low:   tick.quote,
            close: tick.quote
        };
        this.chart.series[0].addPoint(ohlc, false, false, false);
    }
};
