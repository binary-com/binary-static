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

    var quote = '',
        id = '',
        epoch = '',
        errorMessage = '',
        spots = {},
        keep_number = 20;

    var details = function(data) {
        errorMessage = '';

        if (data) {
            if (data['error']) {
                errorMessage = data['error']['message'];
            } else {
                var tick = data['tick'];
                quote = tick['quote'];
                id = tick['id'];
                epoch = tick['epoch'];

                spots[epoch] = quote;
                var epoches = Object.keys(spots).sort(function(a, b) {
                    return a - b;
                });
                if (epoches.length > keep_number) {
                    delete spots[epoches[0]];
                }
            }
        }
    };

    var display = function() {
        $('#spot').fadeIn(200);
        var spotElement = document.getElementById('spot');
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
        if (res.history && res.history.times && res.history.prices) {
            for (var i = 0; i < res.history.times.length; i++) {
                details({
                    tick: {
                        epoch: res.history.times[i],
                        quote: res.history.prices[i]
                    }
                });
            }
        }
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
        clean: function() {
            spots = {};
            quote = '';
            $('#spot').fadeOut(200, function(){
                // resets spot movement coloring, will continue on the next tick responses
                $(this).removeClass('price_moved_down price_moved_up').text('');
            });
        },
        spots: function() {
            return spots;
        },
        setQuote: function(q) {
            quote = q;
        },
        request: request,
        processHistory: processHistory
    };
})();
