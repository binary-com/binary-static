var minDT = new Date();
minDT.setUTCFullYear(minDT.getUTCFullYear - 3);
var liveChartsFromDT, liveChartsToDT, liveChartConfig;

var updateDatesFromConfig = function(config) {
    var duration = $('#live_chart_duration li[data-live=' + config.live + ']').attr('id');
    var now = new Date();
    liveChartsFromDT.setDateTime(new Date(now.getTime() - (duration * 1000)));
    liveChartsToDT.setDateTime(now);
};

var show_chart_for_instrument = function() {
    var symb, disp_symb;
    $("#instrument_select .deleteme").remove();
    $("#instrument_select option:selected").each(function(){
        symb = $(this).val();
        disp_symb = $(this).text();
    });

    if (symb) {
        liveChartConfig.update({
            symbol: symb,
            update_url: 1
        });
        updateLiveChart(liveChartConfig);
    }
};

var remove_highlight_chart_duration = function () {
    $('#live_chart_duration').find('.live_charts_stream_button').each( function () {
        $(this).find('span').removeClass('current');
    });
};

var build_markets_select = function() {
    var market_select = $("#market_select");
    markets.each(function() {
        if (this.name == 'forex') {
            market_select.append("<option id='opt_" + this.name + "' value='" + this.name + "'>" + this.translated_display_name() + "</option>");
        } else {
            market_select.append("<option class='ja-hide' id='opt_" + this.name + "' value='" + this.name + "'>" + this.translated_display_name() + "</option>");
        }
    });

    $("#market_select").val(liveChartConfig.market.name);
    build_instrument_select();

    $("#market_select").change(build_instrument_select);
};

var build_instrument_select = function() {
    var instrument_select = $("#instrument_select");
    var market = markets.get($('#market_select').val());
    $("#instrument_span").hide();
    if(market) {
        $("#instrument_select option").remove();
        instrument_select.append("<option class='deleteme'></option>");
        market.each(function() {
            this.each(function() {
                instrument_select.append("<option value='" + this.symbol + "'>" + this.translated_display_name() + "</option>");
            });
        });
        $("#instrument_span").show();
        $("#instrument_select").change(show_chart_for_instrument);
        $("#instrument_select").val(liveChartConfig.symbol.symbol);
    }
};

var init_live_chart = function () {
    liveChartsFromDT = new DateTimePicker({
        id: "live_charts_from",
        onChange: function(date) { liveChartsToDT.setMinDateTime(date); }
    });

    liveChartsToDT = new DateTimePicker({
        id: "live_charts_to",
        onChange: function(date) { liveChartsFromDT.setMaxDateTime(date); }
    });


    liveChartConfig = new LiveChartConfig({
        renderTo: 'live_chart_div',
    });

    configure_livechart();
    build_markets_select();


    $(".notice").hide();
    $("#live_chart_extended_options").hide();
    $("#live_charts_show_extended_options").on('click', function(e){
        e.preventDefault();
        $("#live_chart_extended_options").toggle();
    });
    $("#live_charts_high_barrier").change(function(){
        var val = $(this).val();
        if(liveChartConfig.has_indicator('high') || !val) {
            live_chart.remove_indicator('high');
        }

        if (val) {
            var barrier = new LiveChartIndicator.Barrier({ name: "high", value: val, color: 'green'});
            live_chart.add_indicator(barrier);
        }
    });
    $("#live_charts_low_barrier").change(function(){
        var val = $(this).val();
        if(liveChartConfig.has_indicator('low') || !val) {
            live_chart.remove_indicator('low');
        }

        if (val) {
            var barrier = new LiveChartIndicator.Barrier({ name: "low", value: val, color: 'red'});
            live_chart.add_indicator(barrier);
        }
    });


    $('#live_charts_hide_spot').hide();
    $("#live_charts_show_spot").on('click', function(e){
        e.preventDefault();
        var barrier = new LiveChartIndicator.Barrier({ name: "spot", value: "+0"});
        live_chart.add_indicator(barrier);
        $(this).hide();
        $('#live_charts_hide_spot').show();
    });

    $("#live_charts_hide_spot").on('click', function(e){
        e.preventDefault();
        live_chart.remove_indicator('spot');
        $(this).hide();
        $('#live_charts_show_spot').show();
    });

    $("#live_charts_show_interval").on('click', function() {
        liveChartConfig.update({
            interval: {
                from: liveChartsFromDT.getDateTime(),
                to: liveChartsToDT.getDateTime()
            },
            update_url: 1
        });
        updateLiveChart(liveChartConfig);
    });

    $("#live_chart_duration").on('duration_change', function(e) {
        updateDatesFromConfig(e.config);
    });

    show_chart_for_instrument();
    updateDatesFromConfig(liveChartConfig);
};


pjax_config_page('livechart', function() {
    return {
        onLoad: function() {
            init_live_chart();
        },
        onUnload: function() {
            live_chart.close_chart();
            live_chart = null;
        }
    };
});

//The first time some one loads live chart in the session, the script might not have finished loading by the time onLoad.fire() was called.
//So we check if livechart was not configured when we loaded this script then we initialize it manually.
$(function() {
    if(!live_chart && /livechart/.test(window.location.pathname)) {
        init_live_chart();
    }

});
