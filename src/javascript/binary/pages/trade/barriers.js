/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Contract.form()
 */

var Barriers = (function () {
    'use strict';

    var isBarrierUpdated = false;

    var display = function (barrierCategory) {
        var barriers = Contract.barriers()[Defaults.get('underlying')],
            formName = Contract.form();

        if (barriers && formName && Defaults.get('formname')!=='risefall') {
            var barrier = barriers[formName];
            if(barrier) {
                var unit = document.getElementById('duration_units'),
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

                    var defaults_barrier = Defaults.get('barrier');
                    var barrier_def = defaults_barrier && !isNaN(defaults_barrier) ? defaults_barrier : barrier['barrier'];
                    var elm = document.getElementById('barrier'),
                        tooltip = document.getElementById('barrier_tooltip'),
                        span = document.getElementById('barrier_span');
                    if ((unit && unit.value === 'd') || (end_time && moment(end_time.value).isAfter(moment(),'day'))) {
                        if (currentTick && !isNaN(currentTick) && barrier_def.match(/^[+-]/)) {
                            elm.value = (parseFloat(currentTick) + parseFloat(barrier_def)).toFixed(decimalPlaces);
                            elm.textContent = (parseFloat(currentTick) + parseFloat(barrier_def)).toFixed(decimalPlaces);
                        } else {
                            elm.value = parseFloat(barrier_def);
                            elm.textContent = parseFloat(barrier_def);
                        }
                        tooltip.style.display = 'none';
                        span.style.display = 'inherit';
                        // no need to display indicative barrier in case of absolute barrier
                        indicativeBarrierTooltip.textContent = '';
                    } else {
                        elm.value = barrier_def;
                        elm.textContent = barrier_def;
                        span.style.display = 'none';
                        tooltip.style.display = 'inherit';
                        if (currentTick && !isNaN(currentTick)) {
                            indicativeBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier_def)).toFixed(decimalPlaces);
                        } else {
                            indicativeBarrierTooltip.textContent = '';
                        }
                    }
                    Defaults.set('barrier', elm.value);
                    Defaults.remove('barrier_high', 'barrier_low');
                    return;
                } else if (barrier.count === 2) {
                    document.getElementById('barrier_row').style.display = 'none';
                    document.getElementById('high_barrier_row').setAttribute('style', '');
                    document.getElementById('low_barrier_row').setAttribute('style', '');

                    var high_elm = document.getElementById('barrier_high'),
                        low_elm = document.getElementById('barrier_low'),
                        high_tooltip = document.getElementById('barrier_high_tooltip'),
                        high_span = document.getElementById('barrier_high_span'),
                        low_tooltip = document.getElementById('barrier_low_tooltip'),
                        low_span = document.getElementById('barrier_low_span');

                    var defaults_barrier_high = Defaults.get('barrier_high'), defaults_barrier_low = Defaults.get('barrier_low');
                    var barrier_high = defaults_barrier_high && !isNaN(defaults_barrier_high) ? defaults_barrier_high : barrier['barrier'],
                        barrier_low  = defaults_barrier_low  && !isNaN(defaults_barrier_low)  ? defaults_barrier_low  : barrier['barrier1'];
                    if (unit && unit.value === 'd') {
                        if (currentTick && !isNaN(currentTick) && barrier_high.match(/^[+-]/)) {
                            high_elm.value = (parseFloat(currentTick) + parseFloat(barrier_high)).toFixed(decimalPlaces);
                            high_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier_high)).toFixed(decimalPlaces);

                            low_elm.value = (parseFloat(currentTick) + parseFloat(barrier_low)).toFixed(decimalPlaces);
                            low_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier_low)).toFixed(decimalPlaces);
                        } else {
                            high_elm.value = parseFloat(barrier_high);
                            high_elm.textContent = parseFloat(barrier_high);

                            low_elm.value = parseFloat(barrier_low);
                            low_elm.textContent = parseFloat(barrier_low);
                        }

                        high_tooltip.style.display = 'none';
                        high_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';

                        indicativeHighBarrierTooltip.textContent = '';
                        indicativeLowBarrierTooltip.textContent = '';
                    } else {
                        high_elm.value = barrier_high;
                        high_elm.textContent = barrier_high;

                        low_elm.value = barrier_low;
                        low_elm.textContent = barrier_low;

                        high_span.style.display = 'none';
                        high_tooltip.style.display = 'inherit';
                        low_span.style.display = 'none';
                        low_tooltip.style.display = 'inherit';

                        if (currentTick && !isNaN(currentTick)) {
                            indicativeHighBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier_high)).toFixed(decimalPlaces);
                            indicativeLowBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier_low)).toFixed(decimalPlaces);
                        } else {
                            indicativeHighBarrierTooltip.textContent = '';
                            indicativeLowBarrierTooltip.textContent = '';
                        }
                    }
                    Defaults.set('barrier_high', high_elm.value);
                    Defaults.set('barrier_low', low_elm.value);
                    Defaults.remove('barrier');
                    return;
                }
            }
        }

        var elements = document.getElementsByClassName('barrier_class');
        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = 'none';
        }
        Defaults.remove('barrier', 'barrier_high', 'barrier_low');
    };

    return {
        display: display,
        isBarrierUpdated: function () { return isBarrierUpdated; },
        setBarrierUpdate: function (flag) {
            isBarrierUpdated = flag;
        }
    };
})();
