/*
 * MBTick object handles all the process/display related to tick streaming
 *
 * We request tick stream for particular underlying to update current spot
 *
 *
 * Usage:
 * use `MBTick.detail` to populate this object
 *
 * then use
 *
 * `MBTick.quote()` to get current spot quote
 * `MBTick.id()` to get the unique for current stream
 * `MBTick.epoch()` to get the tick epoch time
 * 'MBTick.display()` to display current spot
 */

const MBTick = (function() {
    'use strict';

    let quote = '',
        id    = '',
        epoch = '',
        spots = {},
        errorMessage = '';
    const keep_number  = 60;

    const details = function(data) {
        errorMessage = '';

        if (data) {
            if (data.error) {
                errorMessage = data.error.message;
            } else {
                const tick = data.tick;
                quote = tick.quote;
                id    = tick.id;
                epoch = tick.epoch;

                spots[epoch] = quote;
                const epoches = Object.keys(spots).sort(function(a, b) {
                    return a - b;
                });
                if (epoches.length > keep_number) {
                    delete spots[epoches[0]];
                }
            }
        }
    };

    const display = function() {
        $('#spot').fadeIn(200);
        const spotElement = document.getElementById('spot');
        if (!spotElement) return;
        let message = '';
        if (errorMessage) {
            message = errorMessage;
        } else {
            message = quote;
        }

        if (parseFloat(message) !== +message) {
            spotElement.className = 'error';
        } else {
            spotElement.classList.remove('error');
            MBTick.displayPriceMovement(parseFloat(spotElement.textContent), parseFloat(message));
        }

        spotElement.textContent = message;
    };

    /*
     * Display price/spot movement variation to depict price moved up or down
     */
    const displayPriceMovement = function(oldValue, currentValue) {
        const className = (currentValue > oldValue) ? 'up' : (currentValue < oldValue) ? 'down' : 'still';
        $('#spot-dyn').attr('class', 'dynamics ' + className);
    };

    const updateWarmChart = function() {
        const $chart = $('#trading_worm_chart'),
            spots_array = Object.keys(MBTick.spots())
                .sort(function(a, b) { return a - b; })
                .map(function(v) { return MBTick.spots()[v]; }),
            chart_config = {
                type              : 'line',
                lineColor         : '#606060',
                fillColor         : false,
                spotColor         : '#00f000',
                minSpotColor      : '#0000f0',
                maxSpotColor      : '#f00000',
                highlightSpotColor: '#ffff00',
                highlightLineColor: '#000000',
                spotRadius        : 2,
                width             : 200,
                height            : 25,
            };
        if ($chart && typeof $chart.sparkline === 'function') {
            $chart.sparkline(spots_array, chart_config);
            if (spots_array.length) {
                $chart.show();
            } else {
                $chart.hide();
            }
        }
    };

    const request = function(symbol) {
        BinarySocket.send({
            ticks_history: symbol,
            style        : 'ticks',
            end          : 'latest',
            count        : keep_number,
            subscribe    : 1,
        });
    };

    const processHistory = function(res) {
        if (res.history && res.history.times && res.history.prices) {
            for (let i = 0; i < res.history.times.length; i++) {
                details({
                    tick: {
                        epoch: res.history.times[i],
                        quote: res.history.prices[i],
                    },
                });
            }
        }
    };

    return {
        details        : details,
        display        : display,
        updateWarmChart: updateWarmChart,
        request        : request,
        processHistory : processHistory,
        quote          : function() { return quote; },
        id             : function() { return id; },
        epoch          : function() { return epoch; },
        errorMessage   : function() { return errorMessage; },
        spots          : function() { return spots; },
        setQuote       : function(q) { quote = q; },
        clean          : function() {
            spots = {};
            quote = '';
            $('#spot').fadeOut(200, function() {
                // resets spot movement coloring, will continue on the next tick responses
                $('#spot-dyn').removeAttr('class').text('');
            });
        },
        displayPriceMovement: displayPriceMovement,
    };
})();

module.exports = {
    MBTick: MBTick,
};
