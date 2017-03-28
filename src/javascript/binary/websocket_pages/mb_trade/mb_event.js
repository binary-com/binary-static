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
        const $form = $('#trade_form');
        const hidden_class = 'invisible';

        $(document).on('click', function(e) {
            if ($(e.target).parents('#payout').length) return;
            $form.find('.list').addClass(hidden_class);
        });

        $form.find('.current').on('click', function(e) {
            e.stopPropagation();
            const $list = $(this).siblings('.list');
            if ($list.hasClass(hidden_class)) {
                $form.find('.list').addClass(hidden_class);
            }
            $list.toggleClass(hidden_class);
        });

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const $underlying = $form.find('#underlying');
        if ($underlying.length) {
            $underlying.on('click', '.list > div', function() {
                const underlying = $(this).attr('value');
                $underlying.attr('value', underlying).find('> .current').html($(this).clone());
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
            });
        }

        const $category = $form.find('#category');
        if ($category.length) {
            $category.on('click', '.list > div', function() {
                const category = $(this).attr('value');
                $category.attr('value', category).find('> .current').html($(this).clone());
                MBDefaults.set('category', category);
                MBContract.populatePeriods('rebuild');
                MBProcess.processPriceRequest();
                TradingAnalysis.request();
            });
        }

        const $period = $('#period');
        if ($period.length) {
            $period.on('click', '.list > div', function() {
                const period = $(this).attr('value');
                $period.attr('value', period).find('> .current').html($(this).clone());
                MBDefaults.set('period', period);
                MBProcess.processPriceRequest();
                $('.countdown-timer').removeClass('alert');
                MBContract.displayRemainingTime('recalculate');
                MBContract.displayDescriptions();
            });
        }

        const validatePayout = function(payoutAmount) {
            let isOK = true;
            const contract = MBContract.getCurrentContracts();
            const maxAmount = (Array.isArray(contract) && contract[0].expiry_type !== 'intraday') ? 20000 : 5000;
            if (!payoutAmount || isNaN(payoutAmount) ||
                (japanese_client() && (payoutAmount < 1 || payoutAmount > 100)) ||
                (payoutAmount <= 0 || payoutAmount > maxAmount)) {
                isOK = false;
            }

            return isOK;
        };

        const $payout = $('#payout');
        if ($payout.length) {
            if (!$payout.attr('value')) {
                const payout_def = MBDefaults.get('payout') || (japanese_client() ? 1 : 10);
                $payout.value = payout_def;
                MBDefaults.set('payout', payout_def);
                $payout.attr('value', payout_def).find('.current').html(payout_def);
            }
            $payout.on('click', '.list > div', debounce(function() {
                const payout = +MBDefaults.get('payout');
                const new_payout = payout + parseInt($(this).attr('value'));

                if (validatePayout(new_payout)) {
                    $('.price-table').removeClass('invisible');
                    MBDefaults.set('payout', new_payout);
                    $payout.attr('value', new_payout).find('.current').html(new_payout);
                    MBProcess.processPriceRequest();
                    MBContract.displayDescriptions();
                }
            }));
        }

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
