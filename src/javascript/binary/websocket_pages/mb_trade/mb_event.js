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

                    MBTick.clean();

                    updateWarmChart();

                    MBContract.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTicks();
                    // get ticks for current underlying
                    MBTick.request(underlying);
                    MBProcess.processPriceRequest();
                }
            });
        }

        var categoryElement = document.getElementById('category');
        if (categoryElement) {
            categoryElement.addEventListener('change', function(e) {
                MBDefaults.set('category', e.target.value);
                MBContract.populatePeriods();
                MBProcess.processPriceRequest();
                TradingAnalysis.request();
            });
        }

        var periodElement = document.getElementById('period');
        if (periodElement) {
            periodElement.addEventListener('change', function(e) {
                MBDefaults.set('period', e.target.value);
                MBProcess.processPriceRequest();
                $('.countdown-timer').removeClass('alert');
                MBProcess.processRemainingTime('recalculate');
            });
        }

        var payoutElement = document.getElementById('payout');
        if (payoutElement) {
            if (!payoutElement.value) {
                var payout = MBDefaults.get('payout') || 1;
                payoutElement.value = payout;
                MBDefaults.set('payout', payout);
            }
            payoutElement.addEventListener('keypress', onlyNumericOnKeypress);
            payoutElement.addEventListener('input', debounce(function(e) {
                // if (!e.target.value) e.target.value = MBDefaults.get('payout');
                var payout = e.target.value,
                    payoutElement = document.getElementById('payout'),
                    $payoutElement = $('#payout'),
                    $tableElement = $('.japan-table');
                if (payout < 1 || payout > 100) {
                    $payoutElement.addClass('error-field');
                    $tableElement.addClass('invisible');
                    return false;
                } else {
                    $payoutElement.removeClass('error-field');
                    $tableElement.removeClass('invisible');
                }
                MBDefaults.set('payout', payout);
                MBProcess.processPriceRequest();
                MBContract.displayDescriptions();
            }));
            payoutElement.addEventListener('click', function() {
                this.select();
            });
        }
    };

    return {
        init: initiate,
    };
})();

module.exports = {
    MBTradingEvents: MBTradingEvents,
};
