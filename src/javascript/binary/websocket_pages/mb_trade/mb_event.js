/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
var MBTradingEvents = (function () {
    'use strict';

    var initiate = function () {
        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        var underlyingElement = document.getElementById('underlying');
        if (underlyingElement) {
            underlyingElement.addEventListener('change', function(e) {
                if (e.target) {
                    // chartFrameSource();
                    // showFormOverlay();
                    // showPriceOverlay();
                    if(e.target.selectedIndex < 0) {
                        e.target.selectedIndex = 0;
                    }
                    var underlying = e.target.value;
                    MBDefaults.set('underlying', underlying);
                    TradingAnalysis.request();

                    MBTick.clean();

                    updateWarmChart();

                    MBContract.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTicks();
                    // get ticks for current underlying
                    MBTick.request(underlying);
                    MBProcess.processPriceRequest(window.contracts_for);
                }
            });
        }

        var categoryElement = document.getElementById('category-select');
        if (categoryElement) {
            categoryElement.addEventListener('change', function(e) {
                MBDefaults.set('category', e.target.value);
                MBContract.populateDurations(window.contracts_for);
                MBProcess.processPriceRequest(window.contracts_for);
            });
        }

        var durationsElement = document.getElementById('durations');
        if (durationsElement) {
            durationsElement.addEventListener('change', function() {
                MBProcess.processPriceRequest(window.contracts_for);
            });
        }

        var payoutElement = document.getElementById('payout');
        if (payoutElement) {
            payoutElement.addEventListener('keypress', onlyNumericOnKeypress);
            payoutElement.addEventListener('input', function() {
                MBProcess.processPriceRequest(window.contracts_for);
            });
        }
    };

    function onlyNumericOnKeypress(ev) {
        var key = ev.keyCode;
        var char = String.fromCharCode(ev.which);
        if(
            (char === '.' && ev.target.value.indexOf(char) >= 0) ||
            (!/[0-9\.]/.test(char) && [8, 37, 39, 46].indexOf(key) < 0) || // delete, backspace, arrow keys
            /['%]/.test(char)) { // similarity to arrows key code in some browsers

            ev.returnValue = false;
            ev.preventDefault();
        }
    }

    return {
        init: initiate,
    };
})();

module.exports = {
    MBTradingEvents: MBTradingEvents,
};
