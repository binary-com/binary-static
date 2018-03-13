const localize = require('../../../../_common/localize').localize;

const HighchartUI = (() => {
    let common_time_style,
        common_spot_style,
        txt,
        chart_options;

    const initLabels = () => {
        common_time_style = 'margin-bottom: 3px; margin-left: 10px; height: 0; width: 20px; border: 0; border-bottom: 2px; border-color: #e98024; display: inline-block;';
        common_spot_style = 'margin-left: 10px; display: inline-block; border-radius: 6px;';
    };

    const getLabels = (option) => {
        if (!common_time_style || !common_spot_style) {
            initLabels();
        }
        switch (option) {
            case 'start_time':
                return `<div style="${common_time_style} border-style: solid;"></div> ${localize('Start time')} `;
            case 'entry_spot':
                return `<div style="${common_spot_style} border: 3px solid orange; width: 4px; height: 4px;"></div> ${localize('Entry spot')} `;
            case 'exit_spot':
                return `<div style="${common_spot_style} background-color: orange; width:10px; height: 10px;"></div> ${localize('Exit spot')} `;
            case 'end_time':
                return `<div style="${common_time_style} border-style: dashed;"></div> ${localize('End time')} `;
            case 'delay':
                return `<span class="chart-delay"> ${localize('Charting for this underlying is delayed')} </span>`;
            default:
                return null;
        }
    };

    const setLabels = (chart_delayed) => {
        // display a guide for clients to know how we are marking entry and exit spots
        txt = (chart_delayed ? getLabels('delay') : '') +
            getLabels('start_time') +
            (history ? getLabels('entry_spot') + getLabels('exit_spot') : '') +
            getLabels('end_time');
    };

    const setChartOptions = (params) => {
        chart_options = {
            chart: {
                backgroundColor: null, /* make background transparent */
                height         : Math.max(params.height, 450),
                renderTo       : params.el,
                animation      : false,
                marginLeft     : 30,
                marginRight    : 30,
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
            yAxis: {
                opposite: false,
                labels  : { align: 'left' },
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
                cropThreshold : Infinity,
                softThreshold : false,
                turboThreshold: Infinity,
                connectNulls  : true,
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
        if (params.user_sold) {
            chart_options.series[0].zones.pop();
        }
    };

    const getHighchartOptions = JPClient => (
        {
            // use comma as separator instead of space
            lang  : { thousandsSep: ',' },
            global: {
                timezoneOffset: JPClient ? -9 * 60 : 0, // Converting chart time to JST.
            },
        }
    );

    const replaceExitLabelWithSell = (subtitle) => {
        const subtitle_length = subtitle.childNodes.length;
        const textnode        = document.createTextNode(` ${localize('Sell time')} `);
        for (let i = 0; i < subtitle_length; i++) {
            const item = subtitle.childNodes[i];
            if (/End time/.test(item.nodeValue)) {
                subtitle.replaceChild(textnode, item);
            }
        }
    };

    const getPlotlineOptions = (params, type) => {
        const is_plotx = type === 'x';
        const options  = {
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
            options.label.y = params.textBottom ? 15 : -5;
            options.label.align = 'center';
        }

        return options;
    };

    const showError = (type, message) => {
        $('#analysis_live_chart').html($('<p/>', { class: 'error-msg', text: (type === 'missing' ? localize('Ticks history returned an empty array.') : message) }));
    };

    const getMarkerObject = (type) => {
        const color = type === 'entry' ? 'white' : 'orange';
        return { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4, states: { hover: { fillColor: color, lineColor: 'orange', lineWidth: 3, radius: 4 } } };
    };

    return {
        setLabels,
        setChartOptions,
        getHighchartOptions,
        replaceExitLabelWithSell,
        getPlotlineOptions,
        showError,
        getMarkerObject,
        getChartOptions: () => chart_options,
    };
})();

module.exports = HighchartUI;
