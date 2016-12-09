var MBContract         = require('./mb_contract').MBContract;
var MBDefaults         = require('./mb_defaults').MBDefaults;
var MBNotifications    = require('./mb_notifications').MBNotifications;
var MBPrice            = require('./mb_price').MBPrice;
var MBSymbols          = require('./mb_symbols').MBSymbols;
var MBTick             = require('./mb_tick').MBTick;
var TradingAnalysis    = require('../trade/analysis').TradingAnalysis;
var japanese_client    = require('../../common_functions/country_base').japanese_client;
var displayUnderlyings = require('../trade/common').displayUnderlyings;
var showFormOverlay    = require('../trade/common').showFormOverlay;

var MBProcess = (function() {
    var market_status = '',
        symbols_timeout;
    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    function processActiveSymbols(data) {
        'use strict';

        if (data.hasOwnProperty('error')) {
            MBNotifications.show({ text: data.error.message, uid: 'ACTIVE_SYMBOLS' });
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
        // check if all symbols are inactive
        var is_market_closed = true;
        Object.keys(symbols_list).forEach(function(s) {
            if (symbols_list[s].is_active) {
                is_market_closed = false;
            }
        });
        clearSymbolTimeout();
        if (is_market_closed) {
            handleMarketClosed();
        } else {
            handleMarketOpen();
            displayUnderlyings('underlying', symbols_list, symbol);

            if (symbol && !symbols_list[symbol].is_active) {
                MBNotifications.show({ text: page.text.localize('This symbol is not active. Please try another symbol.'), uid: 'SYMBOL_INACTIVE' });
            } else if (update_page) {
                MBProcess.processMarketUnderlying();
            }
        }
    }

    function handleMarketClosed() {
        $('.japan-form, .japan-table, #trading_bottom_content').addClass('invisible');
        MBNotifications.show({ text: page.text.localize('Market is closed. Please try again later.'), uid: 'MARKET_CLOSED' });
        symbols_timeout = setTimeout(function() { MBSymbols.getSymbols(1); }, 30000);
    }

    function handleMarketOpen() {
        $('.japan-form, .japan-table, #trading_bottom_content').removeClass('invisible');
        MBNotifications.hide('MARKET_CLOSED');
    }

    function clearSymbolTimeout() {
        clearTimeout(symbols_timeout);
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

        if (underlyingElement.selectedIndex < 0) {
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
            MBNotifications.show({ text: tick.error.message, uid: 'TICK_ERROR' });
            return;
        }
        var symbol = MBDefaults.get('underlying');
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
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
            MBNotifications.show({ text: contracts.error.message, uid: contracts.error.code });
            return;
        }

        window.chartAllowed = true;
        if (contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly') {
            window.chartAllowed = false;
        }

        checkMarketStatus(contracts.contracts_for.close);

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

    function checkMarketStatus(close) {
        var now = window.time.unix();

        // if market is closed, else if market is open
        if (now > close) {
            if (market_status === 'open') {
                handleMarketClosed();
            }
            market_status = 'closed';
        } else {
            if (market_status === 'closed') {
                MBSymbols.getSymbols(1);
                handleMarketOpen();
            }
            market_status = 'open';
        }
    }

    function processForgetProposals() {
        'use strict';

        MBPrice.showPriceOverlay();
        BinarySocket.send({
            forget_all: 'proposal',
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
            proposal : 1,
            subscribe: 1,
            basis    : 'payout',
            amount   : japanese_client() ? (parseInt(MBDefaults.get('payout')) || 1) * 1000 :
                                            MBDefaults.get('payout'),
            currency   : MBContract.getCurrency(),
            symbol     : MBDefaults.get('underlying'),
            req_id     : MBPrice.getReqId(),
            date_expiry: durations[1],

            trading_period_start: durations[0],
        };
        var barriers_array,
            all_expired = true;
        for (var i = 0; i < available_contracts.length; i++) {
            req.contract_type = available_contracts[i].contract_type;
            barriers_array = available_contracts[i].available_barriers;
            for (var j = 0; j < barriers_array.length; j++) {
                if (+available_contracts[i].barriers === 2) {
                    req.barrier  = barriers_array[j][1];
                    req.barrier2 = barriers_array[j][0];
                } else {
                    req.barrier = barriers_array[j];
                }
                if (!barrierHasExpired(available_contracts[i].expired_barriers, req.barrier, req.barrier2)) {
                    all_expired = false;
                    MBPrice.addPriceObj(req);
                    BinarySocket.send(req);
                }
            }
        }
        if (all_expired) {
            MBNotifications.show({ text: page.text.localize('All barriers in this trading window are expired') + '.', uid: 'ALL_EXPIRED' });
            MBPrice.hidePriceOverlay();
        } else {
            MBNotifications.hide('ALL_EXPIRED');
        }
    }

    function processProposal(response) {
        'use strict';

        var req_id = MBPrice.getReqId();
        if (response.req_id === req_id) {
            MBPrice.display(response);
            // MBPrice.hidePriceOverlay();
        }
    }

    var processExpiredBarriers = function() {
        var contracts = MBContract.getCurrentContracts(),
            i,
            expired_barrier,
            $expired_barrier_element;
        contracts.forEach(function(c) {
            var expired_barriers = c.expired_barriers;
            for (i = 0; i < expired_barriers.length; i++) {
                if (+c.barriers === 2) {
                    expired_barrier = expired_barriers[i][0] + '_' + expired_barriers[i][1];
                } else {
                    expired_barrier = expired_barriers[i];
                }
                $expired_barrier_element = $('div [data-barrier="' + expired_barrier + '"]');
                if ($expired_barrier_element.length > 0) {
                    processForgetProposal(expired_barrier);
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
        var prices = MBPrice.getPrices();
        Object.keys(prices[expired_barrier]).forEach(function(c) {
            if (!prices[expired_barrier][c].hasOwnProperty('error')) {
                BinarySocket.send({ forget: prices[expired_barrier][c].proposal.id });
            }
        });
    }

    var containsArray = function(array, val) {
        var hash = {};
        for (var i = 0; i < array.length; i++) {
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
        onUnload               : function() { clearSymbolTimeout(); },
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
