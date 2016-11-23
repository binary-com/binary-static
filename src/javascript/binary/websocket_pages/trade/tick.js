/*
 * Tick object handles all the process/display related to tick streaming
 *
 * We request tick stream for particular underlying to update current spot
 *
 *
 * Usage:
 * use `Tick.detail` to populate this object
 *
 * then use
 *
 * `Tick.quote()` to get current spot quote
 * `Tick.id()` to get the unique for current stream
 * `Tick.epoch()` to get the tick epoch time
 * 'Tick.display()` to display current spot
 */

var Tick = (function() {
    'use strict';

    var id = '',
        quote = '',
        epoch = '',

        errorMessage = '',
        spots = [],
        symbol = '',

        keep_number = 100;

    var clean = function() {
        id = quote = epoch = symbol = '';
        spots = [];
        $('#spot').fadeOut(200, function(){
            // resets spot movement coloring, will continue on the next tick responses
            $(this).removeClass('price_moved_down price_moved_up').text('');
        });
    };

    var details = function(data) {
        errorMessage = '';

        if (data) {
            if (data['error']) {
                errorMessage = data['error']['message'];
            } else {
                var tick = {
                    id: data['tick'].id,
                    quote: parseFloat(data['tick'].quote),
                    epoch: parseInt(data['tick'].epoch)
                };

                if (add_tick(tick)) {
                    sort_spots();
                    id = tick.id;
                    quote = tick.quote;
                    epoch = tick.epoch;
                }
            }
        }
    };

    var add_tick = function(tick) {
        // if tick exists
        if (get_tick(tick.epoch)) {
            return false;
        }

        spots.push(tick);
        if (spots.length > keep_number) {
            spots.shift();
        }
        return true;
    };

    var get_tick = function(epoch) {
        return spots.find(function(spot) {
            return spot.epoch === epoch;
        });
    };

    var sort_spots = function() {
        spots.sort(function(a, b) {
            return a.epoch - b.epoch;
        });
    };

    var display = function() {
        $('#spot').fadeIn(200);
        var spotElement = document.getElementById('spot');
        if (!spotElement) return;
        var message = '';
        if (errorMessage) {
            message = errorMessage;
        } else {
            message = quote;
        }

        if (parseFloat(message) != message) {
            spotElement.className = 'error';
        } else {
            spotElement.classList.remove('error');
            displayPriceMovement(spotElement, spotElement.textContent, message);
            displayIndicativeBarrier();
        }

        spotElement.textContent = message;
    };

    var request = function(symbol) {
        BinarySocket.send({
            "ticks_history": symbol,
            "style": "ticks",
            "end": "latest",
            "count": keep_number,
            "subscribe": 1
        });
    };

    var processHistory = function(res) {
        var ticks;
        clean();
        if (res.history && res.history.times && res.history.prices) {
            ticks = history2ticks(res.history);
            ticks.forEach(function(tick) {
               add_tick(tick);
            });
            sort_spots();
            symbol = res.echo_req.ticks_history;
        }
    };

    var history2ticks = function(history) {
        var result = [];
        history.times.forEach(function(time, index) {
            result.push({
                epoch: parseInt(time),
                quote: parseFloat(history.prices[index])
            });
        });
        return result;
    };

    return {
        details: details,
        display: display,
        quote: function() {
            return quote;
        },
        id: function() {
            return id;
        },
        epoch: function() {
            return epoch;
        },
        errorMessage: function() {
            return errorMessage;
        },
        clean: clean,
        spots: function(limit) {
            return limit ? spots.slice(-limit) : spots;
        },
        request: request,
        processHistory: processHistory,
        history2ticks: history2ticks
    };
})();

module.exports = {
    Tick: Tick
};
