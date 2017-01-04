const localize = require('../../../base/localize').localize;

const HighchartUI = (function() {
    let common_time_style,
        common_spot_style,
        txt,
        chartOptions;

    const init_labels = function () {
        common_time_style = 'margin-bottom: 3px; margin-left: 10px; height: 0; width: 20px; border: 0; border-bottom: 2px; border-color: #e98024; display: inline-block;';
        common_spot_style = 'margin-left: 10px; display: inline-block; border-radius: 6px;';
    };

    const get_labels = function(option) {
        if (!common_time_style || !common_spot_style) {
            init_labels();
        }
        switch (option) {
            case 'start_time':
                return '<div style="' + common_time_style + 'border-style: solid;"></div> ' + localize('Start time') + ' ';
            case 'entry_spot':
                return '<div style="' + common_spot_style + 'border: 3px solid orange; width: 4px; height: 4px;"></div> ' + localize('Entry spot') + ' ';
            case 'exit_spot':
                return '<div style="' + common_spot_style + 'background-color: orange; width:10px; height: 10px;"></div> ' + localize('Exit spot') + ' ';
            case 'end_time':
                return '<div style="' + common_time_style + 'border-style: dashed;"></div> ' + localize('End time') + ' ';
            case 'delay':
                return '<span class="chart-delay"> ' + localize('Charting for this underlying is delayed') + ' </span>';
            default:
                return null;
        }
    };

    const set_labels = function (chart_delayed) {
        // display a guide for clients to know how we are marking entry and exit spots
        txt = (chart_delayed ? get_labels('delay') : '') +
            get_labels('start_time') +
            (history ? get_labels('entry_spot') + get_labels('exit_spot') : '') +
            get_labels('end_time');
    };

    const set_chart_options = function (params) {
        chartOptions = {
            chart: {
                backgroundColor: null, /* make background transparent */
                height         : Math.max(params.height, 450),
                renderTo       : params.el,
            },
            title: {
                text : params.title,
                style: { fontSize: '16px' },
            },
            credits: { enabled: false },
            tooltip: {
                xDateFormat  : (params.JPClient ? '%Y/%m/%d, %H:%M:%S' : '%A, %b %e, %H:%M:%S GMT'),
                valueDecimals: params.decimals.split('.')[1].length || 3,
            },
            subtitle: {
                text   : txt,
                useHTML: true,
            },
            xAxis: {
                labels: { overflow: 'justify', format: '{value:%H:%M:%S}' },
            },
            series: [{
                type : params.type,
                name : params.title,
                data : params.data,
                // zones are used to display color of the line
                zones: [{
                    // make the line grey until it reaches entry time or start time if entry spot time is not yet known
                    value: params.entry_time,
                    color: '#ccc',
                }, {
                    // make the line default color until exit time is reached
                    value: params.exit_time,
                    color: '',
                }, {
                    // make the line grey again after trade ended
                    color: '#ccc',
                }],
                zoneAxis      : 'x',
                cropThreshold : 5000,
                softThreshold : false,
                TurboThreshold: 5000,
                animationLimit: Infinity,
            }],
            exporting  : { enabled: false },
            plotOptions: {
                line: {
                    marker: { radius: 2, enabled: true },
                },
                candlestick: {
                    lineColor  : 'black',
                    color      : 'red',
                    upColor    : 'green',
                    upLineColor: 'black',
                    shadow     : true,
                },
            },
            rangeSelector: { enabled: false },
        };
    };

    const get_highchart_options = function (JPClient) {
        return {
            lang  : { thousandsSep: ',' },
            global: {
                timezoneOffset: JPClient ? -9 * 60 : 0, // Converting chart time to JST.
            },
        };
    };

    const replace_exit_label_with_sell = function(subtitle) {
        const subtitle_length = subtitle.childNodes.length,
            textnode = document.createTextNode(' '  + localize('Sell time') + ' ');
        for (let i = 0; i < subtitle_length; i++) {
            const item = subtitle.childNodes[i];
            if (/End time/.test(item.nodeValue)) {
                subtitle.replaceChild(textnode, item);
            }
        }
    };

    const get_plotline_options = function(params, type) {
        const is_plotx = type === 'x';
        const options = {
            value    : params.value,
            id       : params.id || (is_plotx ? params.value : params.label),
            label    : { text: params.label || '' },
            color    : params.color || (is_plotx ? '#e98024' : 'green'),
            zIndex   : is_plotx ? 2 : 1,
            width    : params.width || 2,
            dashStyle: params.dashStyle || 'Solid',
        };

        if (is_plotx) {
            options.label.x = params.textLeft ? -15 : 5;
        } else {
            options.label.align = 'center';
        }

        return options;
    };

    const show_error = function(type, message) {
        const el = document.getElementById('analysis_live_chart');
        if (!el) return;
        el.innerHTML = '<p class="error-msg">' + (type === 'missing' ? localize('Ticks history returned an empty array.') : message) + '</p>';
    };

    return {
        set_labels                  : set_labels,
        get_labels                  : get_labels,
        set_chart_options           : set_chart_options,
        get_chart_options           : function() { return chartOptions; },
        get_highchart_options       : get_highchart_options,
        replace_exit_label_with_sell: replace_exit_label_with_sell,
        get_plotline_options        : get_plotline_options,
        show_error                  : show_error,
    };
})();

module.exports = {
    HighchartUI: HighchartUI,
};
