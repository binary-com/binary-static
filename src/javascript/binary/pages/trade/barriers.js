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
        var barriers = Contract.barriers()[sessionStorage.getItem('underlying')],
            formName = Contract.form();

        if (barriers && formName) {
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

                    var elm = document.getElementById('barrier'),
                        tooltip = document.getElementById('barrier_tooltip'),
                        span = document.getElementById('barrier_span');
                    if ((unit && unit.value === 'd') || (end_time && moment(end_time.value).isAfter(moment(),'day'))) {
                        if (currentTick && !isNaN(currentTick)) {
                            elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);
                            elm.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);
                        } else {
                            elm.value = parseFloat(barrier['barrier']);
                            elm.textContent = parseFloat(barrier['barrier']);
                        }
                        tooltip.style.display = 'none';
                        span.style.display = 'inherit';
                        // no need to display indicative barrier in case of absolute barrier
                        indicativeBarrierTooltip.textContent = '';
                    } else {
                        elm.value = barrier['barrier'];
                        elm.textContent = barrier['barrier'];
                        span.style.display = 'none';
                        tooltip.style.display = 'inherit';
                        if (currentTick && !isNaN(currentTick)) {
                            indicativeBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);
                        } else {
                            indicativeBarrierTooltip.textContent = '';
                        }
                    }
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

                    if (unit && unit.value === 'd') {
                        if (currentTick && !isNaN(currentTick)) {
                            high_elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);
                            high_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);

                            low_elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier1'])).toFixed(decimalPlaces);
                            low_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier1'])).toFixed(decimalPlaces);
                        } else {
                            high_elm.value = parseFloat(barrier['barrier']);
                            high_elm.textContent = parseFloat(barrier['barrier']);

                            low_elm.value = parseFloat(barrier['barrier1']);
                            low_elm.textContent = parseFloat(barrier['barrier1']);
                        }

                        high_tooltip.style.display = 'none';
                        high_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';

                        indicativeHighBarrierTooltip.textContent = '';
                        indicativeLowBarrierTooltip.textContent = '';
                    } else {
                        high_elm.value = barrier['barrier'];
                        high_elm.textContent = barrier['barrier'];

                        low_elm.value = barrier['barrier1'];
                        low_elm.textContent = barrier['barrier1'];

                        high_span.style.display = 'none';
                        high_tooltip.style.display = 'inherit';
                        low_span.style.display = 'none';
                        low_tooltip.style.display = 'inherit';

                        if (currentTick && !isNaN(currentTick)) {
                            indicativeHighBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(decimalPlaces);
                            indicativeLowBarrierTooltip.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier1'])).toFixed(decimalPlaces);
                        } else {
                            indicativeHighBarrierTooltip.textContent = '';
                            indicativeLowBarrierTooltip.textContent = '';
                        }
                    }
                    return;
                }
            }
        }

        var elements = document.getElementsByClassName('barrier_class');
        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = 'none';
        }
    };

    return {
        display: display,
        isBarrierUpdated: function () { return isBarrierUpdated; },
        setBarrierUpdate: function (flag) {
            isBarrierUpdated = flag;
        }
    };
})();
