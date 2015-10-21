BetAnalysis.DigitInfo = function() {
    this.chart_config = {
        chart: {
                renderTo:'last_digit_histo',
                defaultSeriesType:'column',
                backgroundColor:'#eee',
                borderWidth:1,
                borderColor:'#ccc',
                plotBackgroundColor:'#fff',
                plotBorderWidth:1,
                plotBorderColor:'#ccc',
                height:225 // This is "unresponsive", but so is leaving it empty where it goes to 400px.
        },
        title:{text:''},
        credits:{enabled:false},
        exporting:{enabled:false},
        legend:{
            enabled:false
        },
        tooltip:{
            borderWidth:1,
            formatter:function() {
                var that = this;
                var total = $("select[name='tick_count']").val();
                var percentage = that.y/total*100;
                return '<b>Digit:</b> '+ that.x +'<br/>'+
                '<b>Percentage:</b> '+ percentage.toFixed(1) + " %";
            }
        },
        plotOptions:{
            column:{
                shadow:false,
                borderWidth:0.5,
                borderColor:'#666',
                pointPadding:0,
                groupPadding:0,
                color: '#e1f0fb',
            },
            series: {
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                        var total = $("select[name='tick_count']").val();
                        var percentage = this.point.y/total*100;
                        return percentage.toFixed(2) + ' %';
                    },
                },
            },
        },
        xAxis:{
            categories: ['0','1','2','3','4','5','6','7','8','9'],
            lineWidth:0,
            lineColor:'#999',
            tickLength:10,
            tickColor:'#ccc',
        },
        yAxis:{
            title:{text:''},
            maxPadding:0,
            gridLineColor:'#e9e9e9',
            tickWidth:1,
            tickLength:3,
            tickColor:'#ccc',
            lineColor:'#ccc',
            endOnTick:true,
            opposite: false,
            labels: {
                align: 'left',
                x: 0,
                enabled: false,
                formatter: function() {
                    var total = $("select[name='tick_count']").val();
                    var percentage = parseInt(this.value/total*100);
                    return percentage + " %";
                },
            },
        },
    };

    this.spots = [];
};

BetAnalysis.DigitInfo.prototype = {
    render: function(tab) {
        this.id = tab.id;
        var that = this;
        $.get(this.url(tab), function (texts) {
            tab.content.html(texts);
        }).done(function () {
            that.on_latest();
            that.show_chart(BetForm.attributes.underlying());
        });
    },
    url: function() {
        var existing_link = $('#tab_last_digit').find('a');
        var url = existing_link.attr('href').replace(/underlying=\w+/,'underlying='+ BetForm.attributes.underlying());
        existing_link.attr('href', url);
        return url;
    },
    on_latest: function() {
        var that = this;
        var tab = $('#tab_last_digit-content');
        var form = tab.find('form:first');
        form.on('submit', function(event) {
            event.preventDefault();
            return false;
        }).addClass('unbind_later');

        var get_latest = function() {
            var action = form.attr('action');
            $.ajax({
                url     : action,
                async   : true,
                data    : form.serialize(),
                success : function (texts) {
                    that.chart.destroy();
                    tab.html(texts);
                    that.on_latest();
                    var underlying = $('[name=underlying]', form).val();
                    that.show_chart(underlying);
                }
            });
        };
        $('[name=underlying]', form).on('change',  get_latest ).addClass('unbind_later');
        $('[name=tick_count]', form).on('change',  get_latest ).addClass('unbind_later');
    },
    show_chart: function(underlying) {
        this.chart_config.xAxis.title = {
            text: $('#last_digit_title').html(),
        };
        this.spots = $.parseJSON($('#last_digit_data').html());
        this.chart = new Highcharts.Chart(this.chart_config);
        this.chart.addSeries({name : underlying, data: []});

        this.update();
    },
    update: function(symbol, latest_spot) {
        if(typeof this.chart === "undefined") {
            return;
        }

        var series = this.chart.series[0]; // Where we put the final data.

        if (series.name != symbol) {
            latest_spot = undefined; // This simplifies the logic a bit later.
        }

        if (typeof latest_spot !== "undefined") { // This is a bit later. :D
            this.spots.unshift(latest_spot.slice(-1)); // Only last digit matters
            this.spots.pop();
        }

        // Always recompute and draw, even if theres no new data.
        // This is especially useful on first reuqest, but maybe in other ways.
        var filtered_spots = [];
        var digit = 10,
            filterFunc = function (el) { return el == digit; };
        var min_max_counter = [];
        while(digit--) {
            var val = this.spots.filter(filterFunc).length;
            filtered_spots[digit] = val;
            if (typeof min_max_counter[val] === 'undefined') {
                min_max_counter[val] = 0;
            }
            min_max_counter[val]++;
        }
        var min = Math.min.apply(null, filtered_spots);
        var max = Math.max.apply(null, filtered_spots);
        var min_index = filtered_spots.indexOf(min);
        var max_index = filtered_spots.indexOf(max);
        // changing color
        if (min_max_counter[min] === 1) {
            filtered_spots[min_index] = {y: min, color: '#CC0000'};
        }

        if (min_max_counter[max] === 1) {
            filtered_spots[max_index] = {y: max, color: '#2E8836'};
        }
        return series.setData(filtered_spots);
    },
    show_tab: function() {
        var tab_last_digit = $('#tab_last_digit');
        MenuContent.show_tab(tab_last_digit);
        var saved_anaysis_tab = SessionStore.get('bet_page.selected_analysis_tab');
        if(saved_anaysis_tab == 'tab_last_digit') {
            MenuContent.trigger({
                'tab_id': saved_anaysis_tab
            });
        }
    },
    hide_tab: function() {
        var tab_last_digit = $('#tab_last_digit');
        MenuContent.hide_tab(tab_last_digit);
        if(typeof this.chart !== "undefined") {
            this.chart.destroy();
        }
        this.chart = undefined;
        this.spots = [];
    }
};

BetAnalysis.tab_last_digit = new BetAnalysis.DigitInfo();
