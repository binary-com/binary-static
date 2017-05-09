const MBContract      = require('./mb_contract');
const MBDefaults      = require('./mb_defaults');
const MBNotifications = require('./mb_notifications');
const MBProcess       = require('./mb_process');
const MBTick          = require('./mb_tick');
const TradingAnalysis = require('../trade/analysis');
const debounce        = require('../trade/common').debounce;
const jpClient        = require('../../common_functions/country_base').jpClient;
const formatMoney     = require('../../common_functions/currency_to_symbol').formatMoney;

/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const MBTradingEvents = (() => {
    'use strict';

    const initiate = () => {
        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const underlying_element = document.getElementById('underlying');
        if (underlying_element) {
            underlying_element.addEventListener('change', (e) => {
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

                    MBProcess.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    MBProcess.processForgetTicks();
                    // get ticks for current underlying
                    MBTick.request(underlying);
                    MBContract.displayDescriptions();
                }
            });
        }

        const category_element = document.getElementById('category');
        if (category_element) {
            category_element.addEventListener('change', (e) => {
                MBDefaults.set('category', e.target.value);
                MBContract.populatePeriods('rebuild');
                MBProcess.processPriceRequest();
                TradingAnalysis.request();
            });
        }

        const period_element = document.getElementById('period');
        if (period_element) {
            period_element.addEventListener('change', (e) => {
                MBDefaults.set('period', e.target.value);
                MBProcess.processPriceRequest();
                $('.countdown-timer').removeClass('alert');
                MBContract.displayRemainingTime('recalculate');
                MBContract.displayDescriptions();
            });
        }

        const payout_element = document.getElementById('payout');
        const payoutOnKeypress = (ev) => {
            const key  = ev.keyCode;
            const char = String.fromCharCode(ev.which);
            let is_ok = true;
            if ((char === '.' && ev.target.value.indexOf(char) >= 0) ||
                    (!/[0-9\.]/.test(char) && [8, 37, 39, 46].indexOf(key) < 0) || // delete, backspace, arrow keys
                    /['%]/.test(char)) { // similarity to arrows key code in some browsers
                is_ok = false;
            }
            const result = payout_element.value.substring(0, ev.target.selectionStart) + char +
                payout_element.value.substring(ev.target.selectionEnd);

            if ((jpClient() && char === '.') || result[0] === '0' || !validatePayout(+result)) {
                is_ok = false;
            }

            if (!is_ok) {
                ev.returnValue = false;
                ev.preventDefault();
            }
        };

        const validatePayout = (payout_amount) => {
            let is_ok = true;
            const contract = MBContract.getCurrentContracts();
            const max_amount = (Array.isArray(contract) && contract[0].expiry_type !== 'intraday') ? 20000 : 5000;
            if (!payout_amount || isNaN(payout_amount) ||
                (jpClient() && (payout_amount < 1 || payout_amount > 100)) ||
                (payout_amount <= 0 || payout_amount > max_amount)) {
                is_ok = false;
            }

            return is_ok;
        };

        if (payout_element) {
            if (!payout_element.value) {
                const payout_def = MBDefaults.get('payout') || (jpClient() ? 1 : 10);
                payout_element.value = payout_def;
                MBDefaults.set('payout', payout_def);
            }
            payout_element.addEventListener('keypress', payoutOnKeypress);
            payout_element.addEventListener('input', debounce((e) => {
                let payout = e.target.value;

                if (!jpClient()) {
                    payout = payout.replace(/[^0-9.]/g, '');
                    if (isStandardFloat(payout)) {
                        payout = formatMoney(MBDefaults.get('currency'), parseFloat(payout), 1);
                    }
                    e.target.value = payout;
                }

                const $payout_element = $('#payout');
                const $table_element = $('.japan-table');
                if (!validatePayout(payout)) {
                    $payout_element.addClass('error-field');
                    $table_element.setVisibility(0);
                    return false;
                }
                // else
                $payout_element.removeClass('error-field');
                $table_element.setVisibility(1);

                MBDefaults.set('payout', payout);
                MBProcess.processPriceRequest();
                MBContract.displayDescriptions();
                return true;
            }));
            payout_element.addEventListener('click', function() {
                this.select();
            });
        }

        // For verifying there are 2 digits after decimal
        const isStandardFloat = value => (
            !isNaN(value) && value % 1 !== 0 && ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > 2
        );

        const currency_element = document.getElementById('currency');
        if (currency_element) {
            currency_element.addEventListener('change', () => {
                MBProcess.processPriceRequest();
                MBContract.displayDescriptions();
            });
        }
    };

    return {
        init: initiate,
    };
})();

module.exports = MBTradingEvents;
