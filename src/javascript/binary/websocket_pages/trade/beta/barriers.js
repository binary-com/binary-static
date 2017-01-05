const Contract_Beta      = require('./contract').Contract_Beta;
const Defaults           = require('../defaults').Defaults;
const Tick               = require('../tick').Tick;
const moment             = require('moment');
const isVisible          = require('../../../common_functions/common_functions').isVisible;
const countDecimalPlaces = require('../common_independent').countDecimalPlaces;
const elementTextContent = require('../../../common_functions/common_functions').elementTextContent;

/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Contract.form()
 */

const Barriers_Beta = (function () {
    'use strict';

    let isBarrierUpdated = false;

    const display = function () {
        const barriers = Contract_Beta.barriers()[Defaults.get('underlying')],
            formName = Contract_Beta.form();

        if (barriers && formName && Defaults.get('formname') !== 'risefall') {
            const barrier = barriers[formName];
            if (barrier) {
                const unit = document.getElementById('duration_units'),
                    end_time = document.getElementById('expiry_date'),
                    currentTick = Tick.quote(),
                    indicativeBarrierTooltip = document.getElementById('indicative_barrier_tooltip'),
                    indicativeHighBarrierTooltip = document.getElementById('indicative_high_barrier_tooltip'),
                    indicativeLowBarrierTooltip = document.getElementById('indicative_low_barrier_tooltip'),
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
                    Barriers_Beta.validateBarrier();
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

                    const defaults_barrier_high = Defaults.get('barrier_high'),
                        defaults_barrier_low  = Defaults.get('barrier_low');
                    let barrier_high = defaults_barrier_high && !isNaN(defaults_barrier_high) ?
                            defaults_barrier_high : barrier.barrier,
                        barrier_low  = defaults_barrier_low  && !isNaN(defaults_barrier_low) ?
                            defaults_barrier_low  : barrier.barrier1,
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

                        high_tooltip.style.display = 'none';
                        high_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';

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

                        if (currentTick && !isNaN(currentTick)) {
                            elementTextContent(indicativeHighBarrierTooltip, (parseFloat(currentTick) +
                                parseFloat(barrier_high)).toFixed(decimalPlaces));
                            elementTextContent(indicativeLowBarrierTooltip, (parseFloat(currentTick) +
                                parseFloat(barrier_low)).toFixed(decimalPlaces));
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
        const barrierElement = document.getElementById('barrier');
        if (isVisible(barrierElement) && (isNaN(parseFloat(barrierElement.value)) ||
                parseFloat(barrierElement.value) === 0)) {
            barrierElement.value = '0';
            barrierElement.classList.add('error-field');
        } else {
            barrierElement.classList.remove('error-field');
        }
    };

    return {
        display         : display,
        validateBarrier : validateBarrier,
        isBarrierUpdated: function () { return isBarrierUpdated; },
        setBarrierUpdate: function (flag) { isBarrierUpdated = flag; },
    };
})();

module.exports = {
    Barriers_Beta: Barriers_Beta,
};
