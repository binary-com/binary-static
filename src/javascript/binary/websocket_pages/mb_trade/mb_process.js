var MBProcess = (function() {
    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    function processActiveSymbols(data) {
        'use strict';
        if (data.hasOwnProperty('error')) {
            showErrorMessage($('#content .container .japan-ui'), data.error.message);
            return;
        }

        // populate the Symbols object
        MBSymbols.details(data);

        var market       = 'major_pairs',
            symbols_list = MBSymbols.underlyings()[market],
            symbol       = MBDefaults.get('underlying'),
            update_page  = MBSymbols.need_page_update();

        if (update_page && (!symbol || !symbols_list[symbol])) {
            symbol = undefined;
        }
        displayUnderlyings('underlying', symbols_list, symbol);
        if (update_page) {
            MBProcess.processMarketUnderlying();
        }
    }

    /*
     * Function to call when underlying has changed
     */
    function processMarketUnderlying() {
        'use strict';

        var underlyingElement = document.getElementById('underlying');
        if (!underlyingElement) {
            return;
        }

        if(underlyingElement.selectedIndex < 0) {
            underlyingElement.selectedIndex = 0;
        }
        var underlying = underlyingElement.value;
        MBDefaults.set('underlying', underlying);

        showFormOverlay();

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks();
        // get ticks for current underlying
        MBTick.request(underlying);

        MBTick.clean();

        MBTick.updateWarmChart();

        BinarySocket.clearTimeouts();

        MBContract.getContracts(underlying);
    }

    /*
     * Function to process ticks stream
     */
    function processTick(tick) {
        'use strict';
        if (tick.hasOwnProperty('error')) {
            showErrorMessage($('#content .container .japan-ui'), tick.error.message);
            return;
        }
        var symbol = MBDefaults.get('underlying');
        if(tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)){
            MBTick.details(tick);
            MBTick.display();
            MBTick.updateWarmChart();
        }
    }

    /*
     * Function to display contract form for current underlying
     */
    function processContract(contracts) {
        'use strict';

        if (contracts.hasOwnProperty('error')) {
            showErrorMessage($('#content .container .japan-ui'), contracts.error.message);
            return;
        }

        window.chartAllowed = true;
        if (contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly') {
            window.chartAllowed = false;
        }
        var noRebuild = contracts.hasOwnProperty('passthrough') &&
                        contracts.passthrough.hasOwnProperty('action') &&
                        contracts.passthrough.action === 'no-proposal';
        MBContract.populateOptions((noRebuild ? null : 'rebuild'));
        if (noRebuild) {
            processExpiredBarriers();
            return;
        }
        processPriceRequest();
        TradingAnalysis.request();
    }

    function processForgetProposals() {
        'use strict';
        MBPrice.showPriceOverlay();
        BinarySocket.send({
            forget_all: "proposal"
        });
        MBPrice.cleanup();
    }

    function processPriceRequest() {
        'use strict';
        MBPrice.increaseReqId();
        processForgetProposals();
        MBPrice.showPriceOverlay();
        var available_contracts = MBContract.getCurrentContracts(),
            durations = MBDefaults.get('period').split('_');
        var req = {
            proposal   : 1,
            subscribe  : 1,
            basis      : 'payout',
            amount     : (parseInt(MBDefaults.get('payout')) || 1) * (japanese_client() ? 1000 : 1),
            currency   : MBContract.getCurrency(),
            symbol     : MBDefaults.get('underlying'),
            req_id     : MBPrice.getReqId(),
            date_expiry: durations[1],
            trading_period_start: durations[0],
        };
        var barriers_array, i, j, barrier_count, all_expired = true;
        for (i = 0; i < available_contracts.length; i++) {
            req.contract_type = available_contracts[i].contract_type;
            barrier_count = available_contracts[i].barriers == 2 ? 2 : 1;
            barriers_array = available_contracts[i].available_barriers;
            for (j = 0; j < barriers_array.length; j++) {
                if (available_contracts[i].barriers == 2) {
                    req.barrier = barriers_array[j][1];
                    req.barrier2 = barriers_array[j][0];
                    if (barrierHasExpired(available_contracts[i].expired_barriers, req.barrier, req.barrier2)) {
                        continue;
                    }
                } else {
                    req.barrier = barriers_array[j];
                    if (barrierHasExpired(available_contracts[i].expired_barriers, req.barrier)) {
                        continue;
                    }
                }
                all_expired = false;
                MBPrice.addPriceObj(req);
                BinarySocket.send(req);
            }
        }
        if (all_expired) {
            if ($('.all-expired-error').length === 0){
                showErrorMessage($('.notifications-wrapper'), page.text.localize('All barriers in this trading window are expired') + '.', 'all-expired-error');
            }
        } else {
            $('.all-expired-error').remove();
        }
    }

    function processProposal(response) {
        'use strict';
        var req_id = MBPrice.getReqId();
        if(response.req_id === req_id){
            MBPrice.display(response);
            //MBPrice.hidePriceOverlay();
        }
    }

    var periodValue, $countDownTimer, remainingTimeElement;
    function processRemainingTime(recalculate) {
        if (typeof periodValue === 'undefined' || recalculate) {
            periodValue = document.getElementById('period').value;
            $countDownTimer = $('.countdown-timer');
            remainingTimeElement = document.getElementById('remaining-time');
        }
        if (!periodValue) return;
        var timeLeft = parseInt(periodValue.split('_')[1]) - window.time.unix();
        if (timeLeft <= 0) {
            location.reload();
        } else if (timeLeft < 120) {
            $countDownTimer.addClass('alert');
        }
        var remainingTimeString = [],
            duration = moment.duration(timeLeft * 1000),
            singlePeriod;
        var all_durations = {
            month  : duration.months(),
            day    : duration.days(),
            hour   : duration.hours(),
            minute : duration.minutes(),
            second : duration.seconds()
        };
        for (var key in all_durations) {
            if (all_durations[key]) {
                singlePeriod = all_durations[key] === 1;
                remainingTimeString.push(all_durations[key] + page.text.localize((key + (singlePeriod ? '' : 's' ))));
            }
        }
        remainingTimeElement.innerHTML = remainingTimeString.join(' ');
        setTimeout(processRemainingTime, 1000);
    }

    function showErrorMessage($element, text, addClass) {
        $element.prepend('<p class="notice-msg center-text ' + (addClass ? addClass : '') + '">' + text + '</p>');
    }

    function processBuy(barrier, contract_type) {
        if (!barrier || !contract_type) return;
        if (!page.client.is_logged_in) {
            if ($('.login-error').length === 0){
                showErrorMessage($('.notifications-wrapper'), page.text.localize('Please log in.'), 'login-error');
            }
            return;
        }
        MBPrice.showPriceOverlay();
        MBPrice.sendBuyRequest(barrier, contract_type);
    }

    var processExpiredBarriers = function() {
        var contracts = MBContract.getCurrentContracts(),
            i, expired_barrier, expired_barrier_element;
        contracts.forEach(function(c) {
            var expired_barriers = c.expired_barriers;
            for (i = 0; i < c.expired_barriers.length; i++) {
                if (c.barriers == 2) {
                    $expired_barrier = c.expired_barriers[i][0] + '_' + c.expired_barriers[i][1];
                } else {
                    $expired_barrier = c.expired_barriers[i];
                }
                $expired_barrier_element = $('div [data-barrier="' + $expired_barrier + '"]');
                if ($expired_barrier_element.length > 0) {
                    processForgetProposal($expired_barrier);
                    $expired_barrier_element.remove();
                }
            }
        });
    };

    var barrierHasExpired = function(expired_barriers, barrier, barrier2) {
        if (barrier2) {
            return containsArray(expired_barriers, [[barrier2, barrier]]);
        }
        return (expired_barriers.indexOf((barrier).toString()) > -1);
    };

    function processForgetProposal(expired_barrier) {
        var proposal = MBPrice.getProposalResponse();
        BinarySocket.send({forget: proposal[expired_barrier]});
    }

    var containsArray = function(array, val) {
        var hash = {};
        for(var i = 0; i < array.length; i++) {
            hash[array[i]] = i;
        }
        return hash.hasOwnProperty(val);
    };

    return {
        processActiveSymbols   : processActiveSymbols,
        processMarketUnderlying: processMarketUnderlying,
        processTick            : processTick,
        processContract        : processContract,
        processPriceRequest    : processPriceRequest,
        processProposal        : processProposal,
        processRemainingTime   : processRemainingTime,
        showErrorMessage       : showErrorMessage,
        processBuy             : processBuy,
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
