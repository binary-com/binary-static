const Contract           = require('./contract').Contract;
const Defaults           = require('./defaults').Defaults;
const Tick               = require('./tick').Tick;
const moment             = require('moment');
const isVisible          = require('../../common_functions/common_functions').isVisible;
const countDecimalPlaces = require('./common_independent').countDecimalPlaces;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;

/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Contract.form()
 */

const Barriers = (function () {
    'use strict';

    let isBarrierUpdated = false;

    const display = function () {
        const barriers = Contract.barriers()[Defaults.get('underlying')],
            formName = Contract.form();

        if (barriers && formName && Defaults.get('formname') !== 'risefall') {
            const barrier = barriers[formName];
            if (barrier) {
                const unit                         = document.getElementById('duration_units'),
                    end_time                     = document.getElementById('expiry_date'),
                    indicativeBarrierTooltip     = document.getElementById('indicative_barrier_tooltip'),
                    indicativeHighBarrierTooltip = document.getElementById('indicative_high_barrier_tooltip'),
                    indicativeLowBarrierTooltip  = document.getElementById('indicative_low_barrier_tooltip'),
                    currentTick   = Tick.quote(),
                    decimalPlaces = countDecimalPlaces(currentTick);

                if (barrier.count === 1) {
                    document.getElementById('high_barrier_row').style.display = 'none';
                    document.getElementById('low_barrier_row').style.display = 'none';
                    document.getElementById('barrier_row').setAttribute('style', '');

                    const defaults_barrier = Defaults.get('barrier'),
                        elm     = document.getElementById('barrier'),
                        tooltip = document.getElementById('barrier_tooltip'),
                        span    = document.getElementById('barrier_span');
                    let barrier_def = defaults_barrier && !isNaN(defaults_barrier) ? defaults_barrier : barrier.barrier,
                        value;
                    if ((unit && isVisible(unit) && unit.value === 'd') ||
                        (end_time && isVisible(end_time) && moment(end_time.getAttribute('data-value')).isAfter(moment(), 'day')) ||
                        !String(barrier.barrier).match(/^[+-]/)) {
                        if (currentTick && !isNaN(currentTick) && String(barrier_def).match(/^[+-]/)) {
                            value = (parseFloat(currentTick) + parseFloat(barrier_def)).toFixed(decimalPlaces);
                        } else {
                            value = parseFloat(barrier_def);
                        }
                        tooltip.style.display = 'none';
                        span.style.display = 'inherit';
                        // no need to display indicative barrier in case of absolute barrier
                        elementTextContent(indicativeBarrierTooltip, '');
                    } else {
                        if (!String(barrier_def).match(/^[+-]/)) barrier_def = barrier.barrier; // override Defaults value, because it's changing from absolute to relative barrier
                        value = barrier_def;
                        span.style.display = 'none';
                        tooltip.style.display = 'inherit';
                        if (currentTick && !isNaN(currentTick)) {
                            elementTextContent(indicativeBarrierTooltip, (parseFloat(currentTick) +
                              parseFloat(barrier_def)).toFixed(decimalPlaces));
                        } else {
                            elementTextContent(indicativeBarrierTooltip, '');
                        }
                    }
                    elm.value = elm.textContent = value;
                    Defaults.set('barrier', elm.value);
                    Defaults.remove('barrier_high', 'barrier_low');
                    Barriers.validateBarrier();
                    return;
                } else if (barrier.count === 2) {
                    document.getElementById('barrier_row').style.display = 'none';
                    document.getElementById('high_barrier_row').setAttribute('style', '');
                    document.getElementById('low_barrier_row').setAttribute('style', '');

                    const high_elm     = document.getElementById('barrier_high'),
                        low_elm      = document.getElementById('barrier_low'),
                        high_tooltip = document.getElementById('barrier_high_tooltip'),
                        high_span    = document.getElementById('barrier_high_span'),
                        low_tooltip  = document.getElementById('barrier_low_tooltip'),
                        low_span     = document.getElementById('barrier_low_span');

                    const defaults_high = Defaults.get('barrier_high'),
                        defaults_low  = Defaults.get('barrier_low');
                    let barrier_high  = defaults_high && !isNaN(defaults_high) ? defaults_high : barrier.barrier,
                        barrier_low   = defaults_low  && !isNaN(defaults_low)  ? defaults_low  : barrier.barrier1,
                        value_high,
                        value_low;
                    if ((unit && isVisible(unit) && unit.value === 'd') ||
                        (end_time && isVisible(end_time) && moment(end_time.getAttribute('data-value')).isAfter(moment(), 'day')) ||
                        !String(barrier.barrier).match(/^[+-]/)) {
                        if (currentTick && !isNaN(currentTick) && String(barrier_high).match(/^[+-]/)) {
                            value_high = (parseFloat(currentTick) + parseFloat(barrier_high)).toFixed(decimalPlaces);
                            value_low  = (parseFloat(currentTick) + parseFloat(barrier_low)).toFixed(decimalPlaces);
                        } else {
                            value_high = parseFloat(barrier_high);
                            value_low  = parseFloat(barrier_low);
                        }

                        high_span.style.display = 'inherit';
                        high_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';

                        elementTextContent(indicativeHighBarrierTooltip, '');
                        elementTextContent(indicativeLowBarrierTooltip, '');
                    } else {
                        // override Defaults value, if it's changing from absolute to relative barrier
                        if (!String(barrier_high).match(/^[+-]/) || !String(barrier_low).match(/^[+-]/)) {
                            barrier_high = barrier.barrier;
                            barrier_low  = barrier.barrier1;
                        }
                        value_high = barrier_high;
                        value_low  = barrier_low;

                        high_span.style.display = 'none';
                        high_tooltip.style.display = 'inherit';
                        low_span.style.display = 'none';
                        low_tooltip.style.display = 'inherit';

                        const barrierVal = function(current_tick, barrier_value) {
                            return (current_tick + parseFloat(barrier_value)).toFixed(decimalPlaces);
                        };

                        if (currentTick && !isNaN(currentTick)) {
                            const current_tick = parseFloat(currentTick);
                            elementTextContent(indicativeHighBarrierTooltip, barrierVal(current_tick, barrier_high));
                            elementTextContent(indicativeLowBarrierTooltip, barrierVal(current_tick, barrier_low));
                        } else {
                            elementTextContent(indicativeHighBarrierTooltip, '');
                            elementTextContent(indicativeLowBarrierTooltip, '');
                        }
                    }
                    high_elm.value = high_elm.textContent = value_high;
                    low_elm.value  = low_elm.textContent  = value_low;

                    Defaults.set('barrier_high', high_elm.value);
                    Defaults.set('barrier_low', low_elm.value);
                    Defaults.remove('barrier');
                    return;
                }
            }
        }

        const elements = document.getElementsByClassName('barrier_class');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
        Defaults.remove('barrier', 'barrier_high', 'barrier_low');
    };

    const validateBarrier = function() {
        const barrierElement = document.getElementById('barrier'),
            empty = isNaN(parseFloat(barrierElement.value)) || parseFloat(barrierElement.value) === 0;
        if (isVisible(barrierElement) && empty) {
            barrierElement.value = '0';
            barrierElement.classList.add('error-field');
        } else {
            barrierElement.classList.remove('error-field');
        }
    };

    return {
        display         : display,
        isBarrierUpdated: function () { return isBarrierUpdated; },
        setBarrierUpdate: function (flag) {
            isBarrierUpdated = flag;
        },
        validateBarrier: validateBarrier,
    };
})();

module.exports = {
    Barriers: Barriers,
};
