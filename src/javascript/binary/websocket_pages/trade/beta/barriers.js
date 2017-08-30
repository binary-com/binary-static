const moment             = require('moment');
const Contract_Beta      = require('./contract');
const countDecimalPlaces = require('../common_independent').countDecimalPlaces;
const Defaults           = require('../defaults');
const Tick               = require('../tick');
const elementTextContent = require('../../../common_functions/common_functions').elementTextContent;
const isVisible          = require('../../../common_functions/common_functions').isVisible;

/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Contract.form()
 */

const Barriers_Beta = (() => {
    'use strict';

    let is_barrier_updated = false;

    const display = () => {
        const barriers  = Contract_Beta.barriers()[Defaults.get('underlying')];
        const form_name = Contract_Beta.form();

        if (barriers && form_name && Defaults.get('formname') !== 'risefall') {
            const barrier = barriers[form_name];
            if (barrier) {
                const unit     = document.getElementById('duration_units');
                const end_time = document.getElementById('expiry_date');
                const current_tick   = Tick.quote();
                const decimal_places = countDecimalPlaces(current_tick);
                const indicative_barrier_tooltip      = document.getElementById('indicative_barrier_tooltip');
                const indicative_high_barrier_tooltip = document.getElementById('indicative_high_barrier_tooltip');
                const indicative_low_barrier_tooltip  = document.getElementById('indicative_low_barrier_tooltip');

                if (barrier.count === 1) {
                    document.getElementById('high_barrier_row').style.display = 'none';
                    document.getElementById('low_barrier_row').style.display = 'none';
                    document.getElementById('barrier_row').setAttribute('style', '');

                    const defaults_barrier = Defaults.get('barrier');
                    const elm     = document.getElementById('barrier');
                    const tooltip = document.getElementById('barrier_tooltip');
                    const span    = document.getElementById('barrier_span');
                    let barrier_def = defaults_barrier && !isNaN(defaults_barrier) ? defaults_barrier : barrier.barrier;
                    let value;
                    if ((unit && isVisible(unit) && unit.value === 'd') ||
                        (end_time && isVisible(end_time) && moment(end_time.getAttribute('data-value')).isAfter(moment(), 'day')) ||
                        !String(barrier.barrier).match(/^[+-]/)) {
                        if (current_tick && !isNaN(current_tick) && String(barrier_def).match(/^[+-]/)) {
                            value = (parseFloat(current_tick) + parseFloat(barrier_def)).toFixed(decimal_places);
                        } else {
                            value = parseFloat(barrier_def);
                        }
                        tooltip.style.display = 'none';
                        span.style.display = 'inherit';
                        // no need to display indicative barrier in case of absolute barrier
                        elementTextContent(indicative_barrier_tooltip, '');
                    } else {
                        if (!String(barrier_def).match(/^[+-]/)) barrier_def = barrier.barrier; // override Defaults value, because it's changing from absolute to relative barrier
                        value = barrier_def;
                        span.style.display = 'none';
                        tooltip.style.display = 'inherit';
                        if (current_tick && !isNaN(current_tick)) {
                            elementTextContent(indicative_barrier_tooltip, (parseFloat(current_tick) +
                              parseFloat(barrier_def)).toFixed(decimal_places));
                        } else {
                            elementTextContent(indicative_barrier_tooltip, '');
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

                    const high_elm     = document.getElementById('barrier_high');
                    const low_elm      = document.getElementById('barrier_low');
                    const high_tooltip = document.getElementById('barrier_high_tooltip');
                    const high_span    = document.getElementById('barrier_high_span');
                    const low_tooltip  = document.getElementById('barrier_low_tooltip');
                    const low_span     = document.getElementById('barrier_low_span');

                    const defaults_barrier_high = Defaults.get('barrier_high');
                    const defaults_barrier_low  = Defaults.get('barrier_low');
                    let barrier_high = defaults_barrier_high && !isNaN(defaults_barrier_high) ?
                            defaults_barrier_high : barrier.barrier;
                    let barrier_low  = defaults_barrier_low  && !isNaN(defaults_barrier_low) ?
                            defaults_barrier_low  : barrier.barrier1;
                    let value_high,
                        value_low;
                    if ((unit && isVisible(unit) && unit.value === 'd') ||
                        (end_time && isVisible(end_time) && moment(end_time.getAttribute('data-value')).isAfter(moment(), 'day')) ||
                        !String(barrier.barrier).match(/^[+-]/)) {
                        if (current_tick && !isNaN(current_tick) && String(barrier_high).match(/^[+-]/)) {
                            value_high = (parseFloat(current_tick) + parseFloat(barrier_high)).toFixed(decimal_places);
                            value_low  = (parseFloat(current_tick) + parseFloat(barrier_low)).toFixed(decimal_places);
                        } else {
                            value_high = parseFloat(barrier_high);
                            value_low  = parseFloat(barrier_low);
                        }

                        high_tooltip.style.display = 'none';
                        high_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';

                        elementTextContent(indicative_high_barrier_tooltip, '');
                        elementTextContent(indicative_low_barrier_tooltip, '');
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

                        if (current_tick && !isNaN(current_tick)) {
                            elementTextContent(indicative_high_barrier_tooltip, (parseFloat(current_tick) +
                                parseFloat(barrier_high)).toFixed(decimal_places));
                            elementTextContent(indicative_low_barrier_tooltip, (parseFloat(current_tick) +
                                parseFloat(barrier_low)).toFixed(decimal_places));
                        } else {
                            elementTextContent(indicative_high_barrier_tooltip, '');
                            elementTextContent(indicative_low_barrier_tooltip, '');
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

    const validateBarrier = () => {
        const barrier_element = document.getElementById('barrier');
        if (isVisible(barrier_element) && (isNaN(parseFloat(barrier_element.value)) ||
                parseFloat(barrier_element.value) === 0)) {
            barrier_element.classList.add('error-field');
        } else {
            barrier_element.classList.remove('error-field');
        }
    };

    return {
        display         : display,
        validateBarrier : validateBarrier,
        isBarrierUpdated: () => is_barrier_updated,
        setBarrierUpdate: (flag) => { is_barrier_updated = flag; },
    };
})();

module.exports = Barriers_Beta;
