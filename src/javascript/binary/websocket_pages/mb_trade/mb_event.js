const MBContract      = require('./mb_contract').MBContract;
const MBDefaults      = require('./mb_defaults').MBDefaults;
const MBNotifications = require('./mb_notifications').MBNotifications;
const MBProcess       = require('./mb_process').MBProcess;
const MBTick          = require('./mb_tick').MBTick;
const TradingAnalysis = require('../trade/analysis').TradingAnalysis;
const japanese_client = require('../../common_functions/country_base').japanese_client;
const debounce        = require('../trade/common').debounce;
const processForgetTicks = require('../trade/process').processForgetTicks;

/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const MBTradingEvents = (function () {
    'use strict';

    const initiate = function () {
        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const underlyingElement = document.getElementById('underlying');
        if (underlyingElement) {
            underlyingElement.addEventListener('change', function(e) {
                if (e.target) {
                    // chartFrameSource();
                    // showFormOverlay();
                    // showPriceOverlay();
                    if (e.target.selectedIndex < 0) {
                        e.target.selectedIndex = 0;
                    }
                    const underlying = e.target.value;
                    MBDefaults.set('underlying', underlying);
                    MBNotifications.hide('SYMBOL_INACTIVE');

                    MBTick.clean();

                    MBTick.updateWarmChart();

                    MBContract.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTicks();
                    // get ticks for current underlying
                    MBTick.request(underlying);
                    MBContract.displayDescriptions();
                }
            });
        }

        const categoryElement = document.getElementById('category');
        if (categoryElement) {
            categoryElement.addEventListener('change', function(e) {
                MBDefaults.set('category', e.target.value);
                MBContract.populatePeriods('rebuild');
                MBProcess.processPriceRequest();
                TradingAnalysis.request();
            });
        }

        const periodElement = document.getElementById('period');
        if (periodElement) {
            periodElement.addEventListener('change', function(e) {
                MBDefaults.set('period', e.target.value);
                MBProcess.processPriceRequest();
                $('.countdown-timer').removeClass('alert');
                MBContract.displayRemainingTime('recalculate');
                MBContract.displayDescriptions();
            });
        }

        const payoutOnKeypress = function(ev) {
            const key  = ev.keyCode,
                char = String.fromCharCode(ev.which);
            let isOK = true;
            if ((char === '.' && ev.target.value.indexOf(char) >= 0) ||
                    (!/[0-9\.]/.test(char) && [8, 37, 39, 46].indexOf(key) < 0) || // delete, backspace, arrow keys
                    /['%]/.test(char)) { // similarity to arrows key code in some browsers
                isOK = false;
            }
            const result = payoutElement.value.substring(0, ev.target.selectionStart) + char +
                payoutElement.value.substring(ev.target.selectionEnd);
            if (japanese_client()) {
                if (char === '.' || result[0] === '0' || +result < 1 || +result > 100) {
                    isOK = false;
                }
            } else if (result[0] === '0' || +result > 5000) {
                isOK = false;
            }

            if (!isOK) {
                ev.returnValue = false;
                ev.preventDefault();
            }
        };

        const payoutElement = document.getElementById('payout');
        if (payoutElement) {
            if (!payoutElement.value) {
                const payout_def = MBDefaults.get('payout') || (japanese_client() ? 1 : 10);
                payoutElement.value = payout_def;
                MBDefaults.set('payout', payout_def);
            }
            payoutElement.addEventListener('keypress', payoutOnKeypress);
            payoutElement.addEventListener('input', debounce(function(e) {
                let payout = e.target.value;
                if (japanese_client()) {
                    const $payoutElement = $('#payout'),
                        $tableElement = $('.japan-table');
                    if (payout < 1 || payout > 100 || isNaN(payout)) {
                        $payoutElement.addClass('error-field');
                        $tableElement.addClass('invisible');
                        return false;
                    }
                    $payoutElement.removeClass('error-field');
                    $tableElement.removeClass('invisible');
                } else {
                    payout = payout.replace(/[^0-9.]/g, '');
                    if (isStandardFloat(payout)) {
                        payout = parseFloat(payout).toFixed(2);
                    }
                    e.target.value = payout;
                }
                MBDefaults.set('payout', payout);
                MBProcess.processPriceRequest();
                MBContract.displayDescriptions();
                return true;
            }));
            payoutElement.addEventListener('click', function() {
                this.select();
            });
        }

        // For verifying there are 2 digits after decimal
        const isStandardFloat = (function(value) {
            return (!isNaN(value) && value % 1 !== 0 && ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > 2);
        });

        const currencyElement = document.getElementById('currency');
        if (currencyElement) {
            currencyElement.addEventListener('change', function() {
                MBProcess.processPriceRequest();
                MBContract.displayDescriptions();
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
