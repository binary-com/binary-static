var LiveChartConfig = function(params) {
    params = params || {};
    this.renderTo = params['renderTo'] || 'live_chart_div';
    this.renderHeight = params['renderHeight'] || 450;
    this.shift = typeof params['shift'] !== 'undefined' ? params['shift'] : 1;
    this.with_trades = typeof params['with_trades'] !== 'undefined' ? params['with_trades'] : 1;
    this.streaming_server = page.settings.get('streaming_server');
    this.with_marker = typeof params['with_marker'] !== 'undefined' ? params['with_marker'] : 0;
    this.force_tick = typeof params['force_tick'] !== 'undefined' ? params['force_tick'] : 0;

    this.indicators = [];
    this.resolutions = {
        'tick': {seconds: 0, interval: 3600},
        '1m': {seconds: 60, interval: 86400},
        '5m': {seconds: 300, interval: 7*86400},
        '30m': {seconds: 1800, interval: 31*86400},
        '1h': {seconds: 3600, interval: 62*86400},
        '8h': {seconds: 8*3600, interval: 183*86400},
        '1d': {seconds: 86400, interval: 366*3*86400}
    };
    this.resolution = 'tick';
    this.with_markers = typeof params['with_markers'] !== 'undefined' ? params['with_markers'] : false;

    var res,
        symbol,
        hash = window.location.hash;

    res = hash.match(/^#([A-Za-z0-9_]+):(10min|1h|1d|1w|1m|3m|1y)$/);
    if (res) {
        symbol = markets.by_symbol(res[1]);
        if (symbol) {
            this.symbol = symbol.underlying;
            this.market = symbol.market;
            this.live = res[2];
        }
    } else {
        res = hash.match(/^#([A-Za-z0-9_]+):([0-9]+)-([0-9]+)$/);
        if (res) {
            symbol = markets.by_symbol(res[1]);
            if (symbol) {
                this.symbol = symbol.underlying;
                this.market = symbol.market;
                this.from = parseInt(res[2]);
                this.to = parseInt(res[3]);
                this.resolution = this.best_resolution(this.from, this.to);
            }
        } else {
            symbol = markets.by_symbol(params['symbol']) || markets.by_symbol(LocalStore.get('live_chart.symbol')) || markets.by_symbol('frxAUDJPY');
            this.symbol = symbol.underlying;
            this.market = symbol.market;
            var from = params['from'] || LocalStore.get('live_chart.from');
            var to = params['to'] || LocalStore.get('live_chart.to');
            if (from && to && from != 'null' && to != 'null') {
                this.from = from;
                this.to = to;
                this.resolution = this.best_resolution(this.from, this.to);
            } else {
                this.live = params['live'] || LocalStore.get('live_chart.live') || '10min';
            }
        }
    }

    if (this.live) {
        this.from = this.calculate_from(this.live);
        this.resolution = this.best_resolution(this.from, new Date().getTime()/1000);
    }
};

LiveChartConfig.prototype = {
    add_indicator: function(indicator) {
        this.indicators.push(indicator);
    },
    remove_indicator: function(name) {
        var deleted_indicator;
        var indicator = this.indicators.length;
        while(indicator--) {
            if(this.indicators[indicator].name == name) {
                deleted_indicator = this.indicators[indicator];
                this.indicators.splice(indicator, 1);
            }
        }
        return deleted_indicator;
    },
    has_indicator: function(name) {
        var indicator = this.indicators.length;
        while(indicator--) {
            if(this.indicators[indicator].name == name) {
                return true;
            }
        }
        return false;
    },
    repaint_indicators: function(chart) {
        var indicator = this.indicators.length;
        while(indicator--) {
            this.indicators[indicator].repaint(chart);
        }
    },
    calculate_from: function(len) {
        var now = new Date();
        var epoch = Math.floor(now.getTime() / 1000);
        var units = { min: 60, h: 3600, d: 86400, w: 86400 * 7, m: 86400 * 31, y: 86400 * 366 };
        var res = len.match(/^([0-9]+)([hdwmy]|min)$/);
        
        return res ? epoch - parseInt(res[1]) * units[res[2]] : undefined;
    },
    update: function(opts) {
        if (opts.interval) {
            var from = parseInt(opts.interval.from.getTime() / 1000);
            var to = parseInt(opts.interval.to.getTime() / 1000);
            var length = to - from;
            this.resolution = this.best_resolution(from, to);
            delete opts.interval;
            this.from = from;
            this.to = to;
            delete this.live;
        }
        if (opts.live) {
            delete this.to;
            LocalStore.remove('live_chart.to');
            LocalStore.remove('live_chart.from');
            this.from = this.calculate_from(opts.live);
            this.live = opts.live;
            LocalStore.set('live_chart.live', opts.live);
            this.resolution = this.best_resolution(this.from, new Date().getTime()/1000);
        }
        if (opts.symbol) {
            var symbol = markets.by_symbol(opts.symbol);
            if(symbol) {
                this.symbol = symbol.underlying;
                this.market = symbol.market;
                LocalStore.set('live_chart.symbol', symbol.symbol);
            }
        }

        if(opts.update_url) {
            var hash = "#";

            if (this.from && this.to) {
                hash += this.symbol.symbol + ":" + this.from + "-" + this.to;
            } else {
                hash += this.symbol.symbol + ":" + this.live;
            }

            var url = window.location.pathname + window.location.search + hash;
            page.url.update(url);
        }
        if(opts.shift) {
            this.shift = opts.shift;
        }
        if(opts.with_trades) {
            this.with_trades = opts.with_trades;
        }
        if(opts.with_markers) {
            this.with_markers = opts.with_markers;
        }
        if(opts.force_tick) {
            this.force_tick = opts.force_tick;
        }
    },
    best_resolution: function(from, to) {
        if(this.force_tick) {
            return 'tick';
        }
        var length = parseInt(to - from);
        for(var resolution in this.resolutions) {
            if (this.resolutions[resolution].interval >= length) {
                return resolution;
            }
        }
        return '1d';
    },
    resolution_seconds: function(resolution) {
        resolution = typeof resolution !== 'undefined' ? resolution : this.resolution;
        return this.resolutions[resolution]['seconds'];

    },
};

var configured_livechart = false;
var configure_livechart = function () {
    if(!configured_livechart) {
        Highcharts.setOptions({
            lang: {
                loading:      text.localize('loading...'),
                printChart:   text.localize('Print chart'),
                downloadJPEG: text.localize('Save as JPEG'),
                downloadPNG:  text.localize('Save as PNG'),
                downloadSVG:  text.localize('Save as SVG'),
                downloadPDF:  text.localize('Save as PDF'),
                downloadCSV:  text.localize('Save as CSV'),
                rangeSelectorFrom: text.localize('From'),
                rangeSelectorTo:   text.localize('To'),
                rangeSelectorZoom: text.localize('Zoom'),
                months: [
                    text.localize('January'), text.localize('February'), text.localize('March'), text.localize('April'), text.localize('May'), text.localize('June'),
                    text.localize('July'), text.localize('August'), text.localize('September'), text.localize('October'), text.localize('November'), text.localize('December')
                ],
                shortMonths: [
                    text.localize('Jan'), text.localize('Feb'), text.localize('Mar'), text.localize('Apr'), text.localize('May'), text.localize('Jun'),
                    text.localize('Jul'), text.localize('Aug'), text.localize('Sep'), text.localize('Oct'), text.localize('Nov'), text.localize('Dec')
                ],
                weekdays: [
                    text.localize('Sunday'), text.localize('Monday'), text.localize('Tuesday'), text.localize('Wednesday'),
                    text.localize('Thursday'), text.localize('Friday'), text.localize('Saturday')
                ],
            },
            navigator: {
                series: {
                    includeInCSVExport: false
                }
            }
        });
    }
    configured_livechart = true;
};
