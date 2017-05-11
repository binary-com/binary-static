const MBDefaults      = require('./mb_defaults');
const MBNotifications = require('./mb_notifications');
const BinarySocket    = require('../socket');

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

const MBTick = (() => {
    'use strict';

    let quote = '',
        id    = '',
        epoch = '',
        spots = {},
        error_message = '';
    const keep_number  = 60;

    const details = (data) => {
        error_message = '';

        if (data) {
            if (data.error) {
                error_message = data.error.message;
            } else {
                const tick = data.tick;
                quote = tick.quote;
                id    = tick.id;
                epoch = tick.epoch;

                spots[epoch] = quote;
                const epoches = Object.keys(spots).sort((a, b) => a - b);
                if (epoches.length > keep_number) {
                    delete spots[epoches[0]];
                }
            }
        }
    };

    const display = () => {
        $('#spot').fadeIn(200);
        const spot_element = document.getElementById('spot');
        if (!spot_element) return;
        let message = '';
        if (error_message) {
            message = error_message;
        } else {
            message = quote;
        }

        if (parseFloat(message) !== +message) {
            spot_element.className = 'error';
        } else {
            spot_element.classList.remove('error');
            MBTick.displayPriceMovement(parseFloat(spot_element.textContent), parseFloat(message));
        }

        spot_element.textContent = message;
    };

    /*
     * Display price/spot movement variation to depict price moved up or down
     */
    const displayPriceMovement = (old_value, current_value) => {
        const class_name = (current_value > old_value) ? 'up' : (current_value < old_value) ? 'down' : 'still';
        $('#spot-dyn').attr('class', `dynamics ${class_name}`);
    };

    const chart_config = {
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

    let $chart;

    const updateWarmChart = () => {
        $chart = $chart || $('#trading_worm_chart');
        const spots_array = Object.keys(MBTick.spots()).sort((a, b) => a - b).map(v => MBTick.spots()[v]);
        if ($chart && typeof $chart.sparkline === 'function') {
            $chart.sparkline(spots_array, chart_config);
            if (spots_array.length) {
                $chart.show();
            } else {
                $chart.hide();
            }
        }
    };

    const request = (symbol) => {
        BinarySocket.send({
            ticks_history: symbol,
            style        : 'ticks',
            end          : 'latest',
            count        : keep_number,
            subscribe    : 1,
        }, { callback: processTickHistory });
    };

    const processTickHistory = (response) => {
        if (response.msg_type === 'tick') {
            if (response.hasOwnProperty('error')) {
                MBNotifications.show({ text: response.error.message, uid: 'TICK_ERROR' });
                return;
            }
            const symbol = MBDefaults.get('underlying');
            if (response.echo_req.ticks === symbol || (response.tick && response.tick.symbol === symbol)) {
                MBTick.details(response);
                MBTick.display();
                MBTick.updateWarmChart();
            }
        } else if (response.history && response.history.times && response.history.prices) {
            for (let i = 0; i < response.history.times.length; i++) {
                details({
                    tick: {
                        epoch: response.history.times[i],
                        quote: response.history.prices[i],
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
        quote          : ()  => quote,
        id             : ()  => id,
        epoch          : ()  => epoch,
        errorMessage   : ()  => error_message,
        spots          : ()  => spots,
        setQuote       : (q) => { quote = q; },
        clean          : ()  => {
            spots = {};
            quote = '';
            $chart = null;
            $('#spot').fadeOut(200, () => {
                // resets spot movement coloring, will continue on the next tick responses
                $('#spot-dyn').removeAttr('class').text('');
            });
        },
        displayPriceMovement: displayPriceMovement,
        processTickHistory  : processTickHistory,
    };
})();

module.exports = MBTick;
