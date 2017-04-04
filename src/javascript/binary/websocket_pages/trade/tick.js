const moment               = require('moment');
const countDecimalPlaces   = require('./common_independent').countDecimalPlaces;
const displayPriceMovement = require('./common_independent').displayPriceMovement;
const elementTextContent   = require('../../common_functions/common_functions').elementTextContent;
const isVisible            = require('../../common_functions/common_functions').isVisible;

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
const Tick = (() => {
    'use strict';

    let quote = '',
        id = '',
        epoch = '',
        spots = {},
        error_message = '';
    const keep_number = 20;

    const details = (data) => {
        error_message = '';

        if (data) {
            if (data.error) {
                error_message = data.error.message;
            } else {
                const tick = data.tick;
                quote = tick.quote;
                id = tick.id;
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
            displayPriceMovement(spot_element, elementTextContent(spot_element), message);
            displayIndicativeBarrier();
        }

        elementTextContent(spot_element, message);
    };

    /*
     * display indicative barrier
     */
    const displayIndicativeBarrier = () => {
        const unit = document.getElementById('duration_units'),
            current_tick = Tick.quote(),
            indicative_barrier_tooltip = document.getElementById('indicative_barrier_tooltip'),
            indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip'),
            indicative_low_barrier_tooltip = document.getElementById('indicative_low_barrier_tooltip'),
            barrier_element = document.getElementById('barrier'),
            high_barrier_element = document.getElementById('barrier_high'),
            low_barrier_element = document.getElementById('barrier_low');
        let value;

        const end_time = document.getElementById('expiry_date');
        if (unit && (!isVisible(unit) || unit.value !== 'd') && current_tick && !isNaN(current_tick) &&
            (end_time && (!isVisible(end_time) || moment(end_time.getAttribute('data-value')).isBefore(moment().add(1, 'day'), 'day')))) {
            const decimal_places = countDecimalPlaces(current_tick);
            if (indicative_barrier_tooltip && isVisible(indicative_barrier_tooltip)) {
                const barrierValue = isNaN(parseFloat(barrier_element.value)) ? 0 : parseFloat(barrier_element.value);
                indicative_barrier_tooltip.textContent =
                    (parseFloat(current_tick) + barrierValue).toFixed(decimal_places);
            }

            if (indicative_high_barrier_tooltip && isVisible(indicative_high_barrier_tooltip)) {
                value = parseFloat(high_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_high_barrier_tooltip.textContent =
                    (parseFloat(current_tick) + value).toFixed(decimal_places);
            }

            if (indicative_low_barrier_tooltip && isVisible(indicative_low_barrier_tooltip)) {
                value = parseFloat(low_barrier_element.value);
                value = isNaN(value) ? 0 : value;
                indicative_low_barrier_tooltip.textContent = (parseFloat(current_tick) + value).toFixed(decimal_places);
            }
        } else {
            elementTextContent(indicative_barrier_tooltip, '');
            elementTextContent(indicative_high_barrier_tooltip, '');
            elementTextContent(indicative_low_barrier_tooltip, '');
        }
    };

    const request = (symbol) => {
        BinarySocket.send({
            ticks_history: symbol,
            style        : 'ticks',
            end          : 'latest',
            count        : keep_number,
            subscribe    : 1,
        });
    };

    const processHistory = (res) => {
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

    const clean = () => {
        spots = {};
        quote = '';
        $('#spot').fadeOut(200, function() {
            // resets spot movement coloring, will continue on the next tick responses
            $(this).removeClass('price_moved_down price_moved_up').text('');
        });
    };

    return {
        details       : details,
        display       : display,
        request       : request,
        processHistory: processHistory,
        clean         : clean,
        quote         : () => quote,
        id            : () => id,
        epoch         : () => epoch,
        errorMessage  : () => error_message,
        spots         : () => spots,
        setQuote      : (q) => { quote = q; },
    };
})();

module.exports = Tick;
