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
var Tick = (function () {
    'use strict';

    var quote = '',
        id = '',
        epoch = '',
        errorMessage = '',
        spots = [],
        keep_number = 20;

    var details = function (data) {
        errorMessage = '';

        if (data) {
            if (data['error']) {
                errorMessage = data['error']['message'];
            } else {
                var tick = data['tick'];
                quote = tick['quote'];
                id = tick['id'];
                epoch = tick['epoch'];

                if(spots.length === keep_number){
                    spots.shift();
                }
                spots.push(quote);
            }
        }
    };

    var display = function () {
        var spotElement = document.getElementById('spot');
        var message = '';
        if (errorMessage) {
            message = errorMessage;
        } else {
            message = quote;
        }

        if(parseFloat(message) != message){
            spotElement.className = 'error';
        } else{
            spotElement.classList.remove('error');
            displayPriceMovement(spotElement, spotElement.textContent, message);
            displayIndicativeBarrier();
        }

        spotElement.textContent = message;
    };

    return {
        details: details,
        display: display,
        quote: function () { return quote; },
        id: function () { return id; },
        epoch: function () { return epoch; },
        errorMessage: function () { return errorMessage; },
        clean: function(){ spots = [];},
        spots: function(){ return spots;}
    };
})();
