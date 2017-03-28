const MBContract                = require('./mb_contract').MBContract;
const MBDefaults                = require('./mb_defaults').MBDefaults;
const MBNotifications           = require('./mb_notifications').MBNotifications;
const MBPrice                   = require('./mb_price').MBPrice;
const MBSymbols                 = require('./mb_symbols').MBSymbols;
const MBTick                    = require('./mb_tick').MBTick;
const TradingAnalysis           = require('../trade/analysis').TradingAnalysis;
const jpClient                  = require('../../common_functions/country_base').jpClient;
const displayUnderlyings        = require('../trade/common').displayUnderlyings;
const generateUnderlyingOptions = require('../trade/common').generateUnderlyingOptions;
const showFormOverlay           = require('../trade/common').showFormOverlay;
const localize                  = require('../../base/localize').localize;
const Client                    = require('../../base/client');

const MBProcess = (function() {
    let market_status = '',
        symbols_timeout;
    /*
     * This function processes the active symbols to get markets
     * and underlying list
     */
    const processActiveSymbols = function(data) {
        'use strict';

        if (data.hasOwnProperty('error')) {
            MBNotifications.show({ text: data.error.message, uid: 'ACTIVE_SYMBOLS' });
            return;
        }

        // populate the Symbols object
        MBSymbols.details(data);

        const is_show_all  = Client.isLoggedIn() && !jpClient();
        const symbols_list = is_show_all ? MBSymbols.getAllSymbols() : MBSymbols.underlyings().major_pairs;
        const update_page  = MBSymbols.need_page_update();
        let symbol = MBDefaults.get('underlying');

        if (update_page && (!symbol || !symbols_list[symbol])) {
            symbol = undefined;
            MBDefaults.remove('underlying');
        }
        // check if all symbols are inactive
        let is_market_closed = true;
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
            if (is_show_all) populateUnderlyingGroups(symbol);
            else displayUnderlyings('underlying', symbols_list, symbol);

            if (symbol && !symbols_list[symbol].is_active) {
                MBNotifications.show({ text: localize('This symbol is not active. Please try another symbol.'), uid: 'SYMBOL_INACTIVE' });
            } else if (update_page) {
                MBProcess.processMarketUnderlying();
            }
        }
    };

    const populateUnderlyingGroups = function(selected) {
        const $underlyings = $('#underlying');
        const allSymbols = MBSymbols.underlyings();
        const markets    = MBSymbols.markets();

        $underlyings.empty();

        Object.keys(markets)
            .sort((a, b) => markets[a].name.localeCompare(markets[b].name))
            .forEach((market) => {
                $underlyings.append(
                    $('<optgroup/>', { label: markets[market].name })
                        .append($(generateUnderlyingOptions(allSymbols[market], selected))));
            });
    };

    const handleMarketClosed = function() {
        $('.japan-form, .japan-table, #trading_bottom_content').addClass('invisible');
        MBNotifications.show({ text: localize('Market is closed. Please try again later.'), uid: 'MARKET_CLOSED' });
        symbols_timeout = setTimeout(function() { MBSymbols.getSymbols(1); }, 30000);
    };

    const handleMarketOpen = function() {
        $('.japan-form, .japan-table, #trading_bottom_content').removeClass('invisible');
        MBNotifications.hide('MARKET_CLOSED');
    };

    const clearSymbolTimeout = function() {
        clearTimeout(symbols_timeout);
    };

    /*
     * Function to call when underlying has changed
     */
    const processMarketUnderlying = function() {
        'use strict';

        const underlyingElement = document.getElementById('underlying');
        if (!underlyingElement) {
            return;
        }

        if (underlyingElement.selectedIndex < 0) {
            underlyingElement.selectedIndex = 0;
        }
        const underlying = underlyingElement.value;
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
    };

    /*
     * Function to process ticks stream
     */
    const processTick = function(tick) {
        'use strict';

        if (tick.hasOwnProperty('error')) {
            MBNotifications.show({ text: tick.error.message, uid: 'TICK_ERROR' });
            return;
        }
        const symbol = MBDefaults.get('underlying');
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
            MBTick.details(tick);
            MBTick.display();
            MBTick.updateWarmChart();
        }
    };

    /*
     * Function to display contract form for current underlying
     */
    const processContract = function(contracts) {
        'use strict';

        if (contracts.hasOwnProperty('error')) {
            MBNotifications.show({ text: contracts.error.message, uid: contracts.error.code });
            return;
        }

        window.chartAllowed = !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly');

        checkMarketStatus(contracts.contracts_for.close);

        const noRebuild = contracts.hasOwnProperty('passthrough') &&
                        contracts.passthrough.hasOwnProperty('action') &&
                        contracts.passthrough.action === 'no-proposal';
        MBContract.populateOptions((noRebuild ? null : 'rebuild'));
        if (noRebuild) {
            processExpiredBarriers();
            return;
        }
        processPriceRequest();
        TradingAnalysis.request();
    };

    const checkMarketStatus = function(close) {
        const now = window.time.unix();

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
    };

    const processPriceRequest = function() {
        'use strict';

        MBPrice.increaseReqId();
        processForgetProposals();
        MBPrice.showPriceOverlay();
        const available_contracts = MBContract.getCurrentContracts(),
            durations = MBDefaults.get('period').split('_');

        const req = {
            proposal_array: 1,
            subscribe     : 1,
            basis         : 'payout',
            amount        : jpClient() ? (parseInt(MBDefaults.get('payout')) || 1) * 1000 : MBDefaults.get('payout'),
            currency      : MBContract.getCurrency(),
            symbol        : MBDefaults.get('underlying'),
            req_id        : MBPrice.getReqId(),
            date_expiry   : durations[1],
            contract_type : [],
            barriers      : [],

            trading_period_start: durations[0],
        };

        // contract_type
        available_contracts.forEach(c => req.contract_type.push(c.contract_type));

        // barriers
        let all_expired = true;
        const contract = available_contracts[0];
        contract.available_barriers.forEach((barrier) => {
            const barrier_item = {};
            if (+contract.barriers === 2) {
                barrier_item.barrier  = barrier[1];
                barrier_item.barrier2 = barrier[0];
            } else {
                barrier_item.barrier = barrier;
            }
            if (!barrierHasExpired(contract.expired_barriers, barrier_item.barrier, barrier_item.barrier2)) {
                all_expired = false;
                req.barriers.push(barrier_item);
            }
        });

        // send request
        if (req.barriers.length) {
            MBPrice.addPriceObj(req);
            BinarySocket.send(req);
        }

        // all barriers expired
        if (all_expired) {
            MBNotifications.show({ text: localize('All barriers in this trading window are expired') + '.', uid: 'ALL_EXPIRED' });
            MBPrice.hidePriceOverlay();
        } else {
            MBNotifications.hide('ALL_EXPIRED');
        }
    };

    const processProposal = function(response) {
        'use strict';

        const req_id = MBPrice.getReqId();
        if (response.req_id === req_id) {
            MBPrice.display(response);
        }
    };

    const processExpiredBarriers = function() {
        const contracts = MBContract.getCurrentContracts();
        let expired_barrier,
            $expired_barrier_element;
        contracts.forEach(function(c) {
            const expired_barriers = c.expired_barriers;
            for (let i = 0; i < expired_barriers.length; i++) {
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

    const barrierHasExpired = function(expired_barriers, barrier, barrier2) {
        if (barrier2) {
            return containsArray(expired_barriers, [[barrier2, barrier]]);
        }
        return (expired_barriers.indexOf((barrier).toString()) > -1);
    };

    const processForgetProposal = function(expired_barrier) {
        const prices = MBPrice.getPrices();
        Object.keys(prices[expired_barrier]).forEach(function(c) {
            if (!prices[expired_barrier][c].hasOwnProperty('error')) {
                BinarySocket.send({ forget: prices[expired_barrier][c].proposal.id });
            }
        });
    };

    const processForgetProposals = function() {
        MBPrice.showPriceOverlay();
        BinarySocket.send({
            forget_all: 'proposal_array',
        });
        MBPrice.cleanup();
    };

    const processForgetTicks = function() {
        BinarySocket.send({
            forget_all: 'ticks',
        });
    };

    const forgetTradingStreams = function() {
        processForgetProposals();
        processForgetTicks();
    };

    const containsArray = function(array, val) {
        const hash = {};
        for (let i = 0; i < array.length; i++) {
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
        processForgetTicks     : processForgetTicks,
        forgetTradingStreams   : forgetTradingStreams,
        onUnload               : function() { clearSymbolTimeout(); MBSymbols.clearData(); forgetTradingStreams(); },
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
