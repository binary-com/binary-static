/*
 * Handles barrier processing and display
 *
 * It process `Contract.barriers` and display them if its applicable
 * for current `Offerings.form()
 */

var Barriers = (function () {
    'use strict';

    var isBarrierUpdated = false;

    var display = function (barrierCategory) {
        var barriers = Contract.barriers(),
            formName = Offerings.form();

        if (barriers && formName) {
            var barrier = barriers[formName];
            if(barrier) {
                var unit = document.getElementById('duration_units');
                var currentTick = Tick.quote();
                if (barrier.count === 1) {
                    document.getElementById('high_barrier_row').style.display = 'none';
                    document.getElementById('low_barrier_row').style.display = 'none';
                    document.getElementById('barrier_row').setAttribute('style', '');

                    var elm = document.getElementById('barrier'),
                        tooltip = document.getElementById('barrier_tooltip'),
                        span = document.getElementById('barrier_span');
                    if (unit && unit.value === 'd' && currentTick) {
                        elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(3);
                        elm.textContent = parseFloat(currentTick) + parseFloat(barrier['barrier']).toFixed(3);
                        tooltip.style.display = 'none';
                        span.style.display = 'inherit';
                    } else {
                        elm.value = barrier['barrier'];
                        elm.textContent = barrier['barrier'];
                        span.style.display = 'none';
                        tooltip.style.display = 'inherit';
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

                    if (unit && unit.value === 'd' && currentTick) {
                        high_elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(3);
                        high_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier'])).toFixed(3);

                        low_elm.value = (parseFloat(currentTick) + parseFloat(barrier['barrier1'])).toFixed(3);
                        low_elm.textContent = (parseFloat(currentTick) + parseFloat(barrier['barrier1'])).toFixed(3);

                        high_tooltip.style.display = 'none';
                        high_span.style.display = 'inherit';
                        low_tooltip.style.display = 'none';
                        low_span.style.display = 'inherit';
                    } else {
                        high_elm.value = barrier['barrier'];
                        high_elm.textContent = barrier['barrier'];

                        low_elm.value = barrier['barrier1'];
                        low_elm.textContent = barrier['barrier1'];

                        high_span.style.display = 'none';
                        high_tooltip.style.display = 'inherit';
                        low_span.style.display = 'none';
                        low_tooltip.style.display = 'inherit';
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
