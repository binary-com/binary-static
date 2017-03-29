const MBContract                = require('./mb_contract').MBContract;
const MBDefaults                = require('./mb_defaults').MBDefaults;
const MBNotifications           = require('./mb_notifications').MBNotifications;
const MBPrice                   = require('./mb_price').MBPrice;
const MBSymbols                 = require('./mb_symbols').MBSymbols;
const TradingAnalysis           = require('../trade/analysis').TradingAnalysis;
const jpClient                  = require('../../common_functions/country_base').jpClient;
const showFormOverlay           = require('../trade/common').showFormOverlay;
const showHighchart             = require('../trade/common').showHighchart;
const processForgetTicks        = require('../trade/process').processForgetTicks;
const localize                  = require('../../base/localize').localize;
const Client                    = require('../../base/client');
const urlForStatic              = require('../../base/url').urlForStatic;

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
            populateUnderlyings(symbol);

            if (symbol && !symbols_list[symbol].is_active) {
                MBNotifications.show({ text: localize('This symbol is not active. Please try another symbol.'), uid: 'SYMBOL_INACTIVE' });
            } else if (update_page) {
                MBProcess.processMarketUnderlying();
            }
        }

        showHighchart();
    };

    const populateUnderlyings = function(selected) {
        const $underlyings = $('#underlying');
        const all_symbols = MBSymbols.getAllSymbols();

        const $list = $underlyings.find('.list');
        $list.empty();

        Object.keys(all_symbols).forEach((symbol, idx) => {
            if (all_symbols[symbol].is_active) {
                const is_current = (!selected && idx === 0) || symbol === selected;
                const $current = $('<div/>', { value: symbol })
                    .append($('<img/>', {
                        src: urlForStatic(`/images/pages/mb_trading/${symbol.toLowerCase()}.svg`),
                        alt: all_symbols[symbol].display,
                    }));
                $list.append($current);
                if (is_current) {
                    $underlyings.attr('value', symbol).find('> .current').html($current.clone());
                }
            }
        });
    };

    const handleMarketClosed = function() {
        $('.trade-form, .price-table, #trading_bottom_content').addClass('invisible');
        MBNotifications.show({ text: localize('Market is closed. Please try again later.'), uid: 'MARKET_CLOSED' });
        symbols_timeout = setTimeout(function() { MBSymbols.getSymbols(1); }, 30000);
    };

    const handleMarketOpen = function() {
        $('.trade-form, .price-table, #trading_bottom_content').removeClass('invisible');
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

        const underlying = $('#underlying').attr('value');
        MBDefaults.set('underlying', underlying);

        showFormOverlay();

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks();

        BinarySocket.clearTimeouts();

        MBContract.getContracts(underlying);
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

    const processForgetProposals = function() {
        'use strict';

        MBPrice.showPriceOverlay();
        BinarySocket.send({
            forget_all: 'proposal',
        });
        MBPrice.cleanup();
    };

    const processPriceRequest = function() {
        'use strict';

        MBPrice.increaseReqId();
        processForgetProposals();
        MBPrice.showPriceOverlay();
        const available_contracts = MBContract.getCurrentContracts(),
            durations = MBDefaults.get('period').split('_');
        const req = {
            proposal   : 1,
            subscribe  : 1,
            basis      : 'payout',
            amount     : jpClient() ? (parseInt(MBDefaults.get('payout')) || 1) * 1000 : MBDefaults.get('payout'),
            currency   : MBContract.getCurrency(),
            symbol     : MBDefaults.get('underlying'),
            req_id     : MBPrice.getReqId(),
            date_expiry: durations[1],

            trading_period_start: durations[0],
        };
        let barriers_array,
            all_expired = true;
        for (let i = 0; i < available_contracts.length; i++) {
            req.contract_type = available_contracts[i].contract_type;
            barriers_array = available_contracts[i].available_barriers;
            for (let j = 0; j < barriers_array.length; j++) {
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
            // MBPrice.hidePriceOverlay();
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
        processContract        : processContract,
        processPriceRequest    : processPriceRequest,
        processProposal        : processProposal,
        onUnload               : function() { clearSymbolTimeout(); MBSymbols.clearData(); },
    };
})();

module.exports = {
    MBProcess: MBProcess,
};
