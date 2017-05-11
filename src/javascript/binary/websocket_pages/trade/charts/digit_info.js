const Highcharts   = require('highcharts');
const Symbols      = require('../symbols');
const BinarySocket = require('../../socket');
const localize     = require('../../../base/localize').localize;
require('highcharts/modules/exporting')(Highcharts);

const DigitInfo = (() => {
    'use strict';

    let spots = [],
        stream_id = null,
        chart,
        // To avoid too many greens and reds
        prev_min_index = -1,
        prev_max_index = -1;

    const chart_config = {
        chart: {
            renderTo           : 'last_digit_histo',
            defaultSeriesType  : 'column',
            backgroundColor    : '#eee',
            borderWidth        : 1,
            borderColor        : '#ccc',
            plotBackgroundColor: '#fff',
            plotBorderWidth    : 1,
            plotBorderColor    : '#ccc',
            height             : 225, // This is "unresponsive", but so is leaving it empty where it goes to 400px.
        },
        title    : { text: '' },
        credits  : { enabled: false },
        exporting: { enabled: false },
        legend   : {
            enabled: false,
        },
        tooltip: {
            borderWidth: 1,
            formatter  : function() {
                const total =  $('#tick_count').val();
                const percentage = (this.y / total) * 100;
                return `<b>${localize('Digit')}:</b> ${this.x}<br/><b>${localize('Percentage')}:</b> ${percentage.toFixed(1)}%`;
            },
        },
        plotOptions: {
            column: {
                shadow      : false,
                borderWidth : 0.5,
                borderColor : '#666',
                pointPadding: 0,
                groupPadding: 0.0,
                color       : '#e1f0fb',
            },
            series: {
                dataLabels: {
                    enabled: true,
                    style  : {
                        textShadow: false,
                    },
                    formatter: function() {
                        const total = $('#tick_count').val();
                        const percentage = (this.point.y / total) * 100;
                        return `${percentage.toFixed(2)}%`;
                    },
                },
            },
        },
        xAxis: {
            categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            lineWidth : 0,
            lineColor : '#999',
            tickLength: 10,
            tickColor : '#ccc',
        },
        yAxis: {
            title        : { text: '' },
            maxPadding   : 0,
            gridLineColor: '#e9e9e9',
            tickWidth    : 1,
            tickLength   : 3,
            tickColor    : '#ccc',
            lineColor    : '#ccc',
            endOnTick    : true,
            opposite     : false,
            labels       : {
                align    : 'left',
                x        : 0,
                enabled  : false,
                formatter: function() {
                    const total = $('#tick_count').val();
                    const percentage = parseInt((this.value / total) * 100);
                    return `${percentage}%`;
                },
            },
        },
    };

    const addContent = (underlying) => {
        const domain = document.domain.split('.').slice(-2).join('.');
        let underlyings = [];
        const symbols = Symbols.getAllSymbols();
        Object.keys(symbols).forEach((key) => {
            if (/^(R_|RD)/.test(key)) {
                underlyings.push(key);
            }
        });
        underlyings = underlyings.sort();
        let elem = '';
        for (let i = 0; i < underlyings.length; i++) {
            elem += `<option value="${underlyings[i]}">${localize(symbols[underlyings[i]])}</option>`;
        }
        $('#digit_underlying').html($(elem)).val(underlying);
        $('#digit_domain').text(domain.charAt(0).toUpperCase() + domain.slice(1));
        $('#digit_info_underlying').text($('#digit_underlying option:selected').text());
    };

    const onLatest = () => {
        const getLatest = () => {
            const $digit_underlying_option = $('#digit_underlying option:selected');
            const symbol = $digit_underlying_option.val();
            const count = $('#tick_count').val();
            $('#digit_info_underlying').text($digit_underlying_option.text());
            $('#digit_info_count').text(count);
            const request = {
                ticks_history: symbol,
                end          : 'latest',
                count        : count,
            };
            if (chart.series[0].name !== symbol) {
                if ($('#underlying').find('option:selected').val() !== $('#digit_underlying').val()) {
                    request.subscribe = 1;
                    request.style     = 'ticks';
                }
                if (stream_id !== null) {
                    BinarySocket.send({ forget: stream_id });
                    stream_id = null;
                }
            }
            BinarySocket.send(request, {
                callback: (response) => {
                    const type = response.msg_type;
                    if (type === 'tick') {
                        updateChart(response);
                    } else if (type === 'history') {
                        showChart(response.echo_req.ticks_history, response.history.prices);
                    }
                },
            });
        };
        $('#digit_underlying, #tick_count').off('change').on('change', getLatest);
    };

    const showChart = (underlying, underlying_spots) => {
        if (typeof underlying_spots === 'undefined' || underlying_spots.length <= 0) {
            console.log('Unexpected error occured in the charts.');
            return;
        }
        const dec = underlying_spots[0].split('.')[1].length;
        for (let i = 0; i < underlying_spots.length; i++) {
            const val = parseFloat(underlying_spots[i]).toFixed(dec);
            underlying_spots[i] = val.substr(val.length - 1);
        }

        const getTitle = () => (
            {
                text: localize($('#last_digit_title').html(), [underlying_spots.length, $('#digit_underlying option:selected').text()]),
            }
        );

        spots = underlying_spots;
        if (chart && $('#last_digit_histo').html()) {
            chart.xAxis[0].update({ title: getTitle() }, true);
            chart.series[0].name = underlying;
        } else {
            addContent(underlying); // this creates #last_digit_title
            chart_config.xAxis.title = getTitle();
            chart = new Highcharts.Chart(chart_config);
            chart.addSeries({ name: underlying, data: [] });
            onLatest();
            stream_id = null;
        }
        update();
    };

    const update = (symbol, latest_spot) => {
        if (typeof chart === 'undefined') {
            return null;
        }

        const series = chart.series[0]; // Where we put the final data.
        if (series.name !== symbol) {
            latest_spot = undefined; // This simplifies the logic a bit later.
        }

        if (typeof latest_spot !== 'undefined') { // This is a bit later. :D
            spots.unshift(latest_spot.slice(-1)); // Only last digit matters
            spots.pop();
        }

        // Always recompute and draw, even if theres no new data.
        // This is especially useful on first reuqest, but maybe in other ways.
        const filtered_spots = [];
        const filterFunc = el => +el === digit;
        let digit = 10;
        const min_max_counter = [];
        while (digit--) {
            const val = spots.filter(filterFunc).length;
            filtered_spots[digit] = val;
            if (typeof min_max_counter[val] === 'undefined') {
                min_max_counter[val] = 0;
            }
            min_max_counter[val]++;
        }
        const min = Math.min.apply(null, filtered_spots);
        const max = Math.max.apply(null, filtered_spots);
        const min_index = filtered_spots.indexOf(min);
        const max_index = filtered_spots.indexOf(max);
        // changing color
        if (min_max_counter[min] >= 1) {
            filtered_spots[min_index] = { y: min, color: '#CC0000' };
            if (prev_min_index === -1) {
                prev_min_index = min_index;
            } else if (prev_min_index !== min_index) {
                if (typeof filtered_spots[prev_min_index] === 'object') {
                    filtered_spots[prev_min_index] = { y: filtered_spots[prev_min_index].y, color: '#e1f0fb' };
                } else {
                    filtered_spots[prev_min_index] = { y: filtered_spots[prev_min_index], color: '#e1f0fb' };
                }
                prev_min_index = min_index;
            }
        }

        if (min_max_counter[max] >= 1) {
            filtered_spots[max_index] = { y: max, color: '#2E8836' };
            if (prev_max_index === -1) {
                prev_max_index = max_index;
            } else if (prev_max_index !== max_index) {
                if (typeof filtered_spots[prev_max_index] === 'object') {
                    filtered_spots[prev_max_index] = { y: filtered_spots[prev_max_index].y, color: '#e1f0fb' };
                } else {
                    filtered_spots[prev_max_index] = { y: filtered_spots[prev_max_index], color: '#e1f0fb' };
                }
                prev_max_index = max_index;
            }
        }
        return series.setData(filtered_spots);
    };

    const updateChart = (tick) => {
        if (stream_id) {
            if (chart.series[0].name === tick.tick.symbol) {
                stream_id = tick.tick.id || null;
                update(tick.tick.symbol, tick.tick.quote);
            } else {
                BinarySocket.send({ forget: (tick.tick.id).toString() });
            }
        } else {
            update(tick.tick.symbol, tick.tick.quote);
        }
    };

    return {
        showChart  : showChart,
        updateChart: updateChart,
    };
})();

module.exports = DigitInfo;
