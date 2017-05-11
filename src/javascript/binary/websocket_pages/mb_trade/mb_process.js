const MBContract      = require('./mb_contract');
const MBDefaults      = require('./mb_defaults');
const MBNotifications = require('./mb_notifications');
const MBPrice         = require('./mb_price');
const MBSymbols       = require('./mb_symbols');
const MBTick          = require('./mb_tick');
const BinarySocket    = require('../socket');
const TradingAnalysis = require('../trade/analysis');
const commonTrading   = require('../trade/common');
const BinaryPjax      = require('../../base/binary_pjax');
const Client          = require('../../base/client');
const getLanguage     = require('../../base/language').get;
const localize        = require('../../base/localize').localize;
const State           = require('../../base/storage').State;
const jpClient        = require('../../common_functions/country_base').jpClient;

const MBProcess = (() => {
    'use strict';

    let market_status = '',
        symbols_timeout;

    const getSymbols = () => {
        BinarySocket.wait('website_status').then((website_status) => {
            const landing_company_obj = State.get(['response', 'landing_company', 'landing_company']);
            const allowed_markets     = Client.currentLandingCompany().legal_allowed_markets;
            if (Client.isLoggedIn() && allowed_markets && allowed_markets.indexOf('forex') === -1) {
                BinaryPjax.load('trading');
                return;
            }
            const req = {
                active_symbols: 'brief',
                product_type  : 'multi_barrier',
            };
            if (landing_company_obj) {
                req.landing_company = landing_company_obj.financial_company ? landing_company_obj.financial_company.shortcode : 'japan';
            } else if (website_status.website_status.clients_country === 'jp' || getLanguage() === 'JA') {
                req.landing_company = 'japan';
            }
            BinarySocket.send(req, { msg_type: 'active_symbols' }).then((response) => {
                processActiveSymbols(response);
            });
        });
    };

    /*
     * This function processes the active symbols to get markets
     * and underlying list
     */
    const processActiveSymbols = (data) => {
        if (data.hasOwnProperty('error')) {
            MBNotifications.show({ text: data.error.message, uid: 'ACTIVE_SYMBOLS' });
            return;
        }

        // populate the Symbols object
        MBSymbols.details(data);

        const is_show_all  = Client.isLoggedIn() && !jpClient();
        const symbols_list = is_show_all ? MBSymbols.getAllSymbols() : MBSymbols.underlyings().major_pairs;
        let symbol = MBDefaults.get('underlying');

        if (!symbol || !symbols_list[symbol]) {
            symbol = undefined;
            MBDefaults.remove('underlying');
        }
        // check if all symbols are inactive
        let is_market_closed = true;
        Object.keys(symbols_list).forEach((s) => {
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
            else commonTrading.displayUnderlyings('underlying', symbols_list, symbol);

            if (symbol && !symbols_list[symbol].is_active) {
                MBNotifications.show({ text: localize('This symbol is not active. Please try another symbol.'), uid: 'SYMBOL_INACTIVE' });
            } else {
                MBProcess.processMarketUnderlying();
            }
        }
    };

    const populateUnderlyingGroups = (selected) => {
        const $underlyings = $('#underlying');
        const all_symbols = MBSymbols.underlyings();
        const markets     = MBSymbols.markets();

        $underlyings.empty();

        Object.keys(markets)
            .sort((a, b) => markets[a].name.localeCompare(markets[b].name))
            .forEach((market) => {
                $underlyings.append(
                    $('<optgroup/>', { label: markets[market].name })
                        .append($(commonTrading.generateUnderlyingOptions(all_symbols[market], selected))));
            });
    };

    const handleMarketClosed = () => {
        $('.japan-form, .japan-table, #trading_bottom_content').setVisibility(0);
        MBNotifications.show({ text: localize('Market is closed. Please try again later.'), uid: 'MARKET_CLOSED' });
        symbols_timeout = setTimeout(() => { getSymbols(); }, 30000);
    };

    const handleMarketOpen = () => {
        $('.japan-form, .japan-table, #trading_bottom_content').setVisibility(1);
        MBNotifications.hide('MARKET_CLOSED');
    };

    const clearSymbolTimeout = () => {
        clearTimeout(symbols_timeout);
    };

    /*
     * Function to call when underlying has changed
     */
    const processMarketUnderlying = () => {
        const underlying_element = document.getElementById('underlying');
        if (!underlying_element) {
            return;
        }

        if (underlying_element.selectedIndex < 0) {
            underlying_element.selectedIndex = 0;
        }
        const underlying = underlying_element.value;
        MBDefaults.set('underlying', underlying);

        commonTrading.showFormOverlay();

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks();
        // get ticks for current underlying
        MBTick.request(underlying);

        MBTick.clean();

        MBTick.updateWarmChart();

        BinarySocket.clearTimeouts();

        getContracts(underlying);
    };

    let contract_timeout;
    const getContracts = (underlying) => {
        const req = {
            contracts_for: (underlying || MBDefaults.get('underlying')),
            currency     : MBContract.getCurrency(),
            product_type : 'multi_barrier',
        };
        if (!underlying) {
            req.passthrough = { action: 'no-proposal' };
        }
        BinarySocket.send(req).then((response) => {
            MBNotifications.hide('CONNECTION_ERROR');
            MBContract.setContractsResponse(response);
            processContract(response);
        });
        if (contract_timeout) clearContractTimeout();
        contract_timeout = setTimeout(getContracts, 15000);
    };

    const clearContractTimeout = () => { clearTimeout(contract_timeout); };

    /*
     * Function to display contract form for current underlying
     */
    const processContract = (contracts) => {
        if (contracts.hasOwnProperty('error')) {
            MBNotifications.show({ text: contracts.error.message, uid: contracts.error.code });
            return;
        }

        State.set('is_chart_allowed', !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly'));

        checkMarketStatus(contracts.contracts_for.close);

        const no_rebuild = contracts.hasOwnProperty('passthrough') &&
                        contracts.passthrough.hasOwnProperty('action') &&
                        contracts.passthrough.action === 'no-proposal';
        MBContract.populateOptions((no_rebuild ? null : 'rebuild'));
        if (no_rebuild) {
            processExpiredBarriers();
            return;
        }
        processPriceRequest();
        TradingAnalysis.request();
    };

    const checkMarketStatus = (close) => {
        const now = window.time.unix();

        // if market is closed, else if market is open
        if (now > close) {
            if (market_status === 'open') {
                handleMarketClosed();
            }
            market_status = 'closed';
        } else {
            if (market_status === 'closed') {
                getSymbols();
                handleMarketOpen();
            }
            market_status = 'open';
        }
    };

    const processPriceRequest = () => {
        MBPrice.increaseReqId();
        processForgetProposals();
        MBPrice.showPriceOverlay();
        const available_contracts = MBContract.getCurrentContracts();
        const durations = MBDefaults.get('period').split('_');
        const req = {
            proposal_array: 1,
            subscribe     : 1,
            basis         : 'payout',
            amount        : jpClient() ? (parseInt(MBDefaults.get('payout')) || 1) * 1000 : MBDefaults.get('payout'),
            currency      : MBContract.getCurrency(),
            symbol        : MBDefaults.get('underlying'),
            passthrough   : { req_id: MBPrice.getReqId() },
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
            BinarySocket.send(req, { callback: processProposal });
        }

        // all barriers expired
        if (all_expired) {
            MBNotifications.show({ text: `${localize('All barriers in this trading window are expired')}.`, uid: 'ALL_EXPIRED' });
            MBPrice.hidePriceOverlay();
        } else {
            MBNotifications.hide('ALL_EXPIRED');
        }
    };

    const processProposal = (response) => {
        const req_id = MBPrice.getReqId();
        if (response.passthrough.req_id === req_id) {
            if (response.error) {
                MBNotifications.show({ text: response.error.message, uid: 'PROPOSAL', dismissible: false });
                return;
            }
            MBNotifications.hide('PROPOSAL');
            MBPrice.display(response);
        }
    };

    const processExpiredBarriers = () => {
        const contracts = MBContract.getCurrentContracts();
        let expired_barrier,
            $expired_barrier_element;
        contracts.forEach((c) => {
            const expired_barriers = c.expired_barriers;
            for (let i = 0; i < expired_barriers.length; i++) {
                if (+c.barriers === 2) {
                    expired_barrier = [expired_barriers[i][0], expired_barriers[i][1]].join('_');
                } else {
                    expired_barrier = expired_barriers[i];
                }
                $expired_barrier_element = $(`div [data-barrier="${expired_barrier}"]`);
                if ($expired_barrier_element.length > 0) {
                    processForgetProposal(expired_barrier);
                    $expired_barrier_element.remove();
                }
            }
        });
    };

    const barrierHasExpired = (expired_barriers, barrier, barrier2) => {
        if (barrier2) {
            return containsArray(expired_barriers, [[barrier2, barrier]]);
        }
        return (expired_barriers.indexOf((barrier).toString()) > -1);
    };

    const processForgetProposal = (expired_barrier) => {
        const prices = MBPrice.getPrices();
        Object.keys(prices[expired_barrier]).forEach((c) => {
            if (!prices[expired_barrier][c].hasOwnProperty('error')) {
                BinarySocket.send({ forget: prices[expired_barrier][c].proposal.id });
            }
        });
    };

    const processForgetProposals = () => {
        MBPrice.showPriceOverlay();
        BinarySocket.send({
            forget_all: 'proposal_array',
        });
        MBPrice.cleanup();
    };

    const processForgetTicks = () => {
        BinarySocket.send({
            forget_all: 'ticks',
        });
    };

    const forgetTradingStreams = () => {
        processForgetProposals();
        processForgetTicks();
    };

    const containsArray = (array, val) => {
        const hash = {};
        for (let i = 0; i < array.length; i++) {
            hash[array[i]] = i;
        }
        return hash.hasOwnProperty(val);
    };

    const onUnload = () => {
        forgetTradingStreams();
        clearSymbolTimeout();
        clearContractTimeout();
        MBSymbols.clearData();
        MBTick.clean();
    };

    return {
        getSymbols             : getSymbols,
        processActiveSymbols   : processActiveSymbols,
        processMarketUnderlying: processMarketUnderlying,
        getContracts           : getContracts,
        processContract        : processContract,
        processPriceRequest    : processPriceRequest,
        processProposal        : processProposal,
        processForgetTicks     : processForgetTicks,
        forgetTradingStreams   : forgetTradingStreams,
        onUnload               : onUnload,
    };
})();

module.exports = MBProcess;
