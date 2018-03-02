const MBContract       = require('./mb_contract');
const MBDefaults       = require('./mb_defaults');
const MBNotifications  = require('./mb_notifications');
const MBPrice          = require('./mb_price');
const MBSymbols        = require('./mb_symbols');
const MBTick           = require('./mb_tick');
const commonTrading    = require('../trade/common');
const BinaryPjax       = require('../../base/binary_pjax');
const Client           = require('../../base/client');
const BinarySocket     = require('../../base/socket');
const jpClient         = require('../../common/country_base').jpClient;
const isCryptocurrency = require('../../common/currency').isCryptocurrency;
const getLanguage      = require('../../../_common/language').get;
const localize         = require('../../../_common/localize').localize;
const State            = require('../../../_common/storage').State;
const urlForStatic     = require('../../../_common/url').urlForStatic;
const getPropertyValue = require('../../../_common/utility').getPropertyValue;

const MBProcess = (() => {
    let market_status = '';

    let symbols_timeout,
        contract_timeout;

    const getSymbols = () => {
        BinarySocket.wait('website_status').then((website_status) => {
            const landing_company_obj = State.getResponse('landing_company');
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
        if (getPropertyValue(data, 'error')) {
            MBNotifications.show({ text: data.error.message, uid: 'ACTIVE_SYMBOLS' });
            return;
        }

        // populate the Symbols object
        MBSymbols.details(data);

        const is_show_all  = Client.isLoggedIn() && !jpClient();
        const symbols_list = is_show_all ? MBSymbols.getAllSymbols() : MBSymbols.underlyings().major_pairs;
        let symbol         = MBDefaults.get('underlying');

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
            populateUnderlyings(symbol);

            if (symbol && !symbols_list[symbol].is_active) {
                MBNotifications.show({ text: localize('This symbol is not active. Please try another symbol.'), uid: 'SYMBOL_INACTIVE' });
            } else {
                processMarketUnderlying();
            }
        }
    };

    const populateUnderlyings = (selected) => {
        const $underlyings = $('#underlying');
        const all_symbols  = MBSymbols.getAllSymbols();

        const $list = $underlyings.find('.list');
        $list.empty();
        $underlyings.find('.current').html($('<div/>', { class: 'gr-row' })
            .append($('<img/>', { class: 'gr-3 gr-no-gutter-m' }))
            .append($('<span/>', { class: 'name gr-6 gr-5-m align-self-center' }))
            .append($('<span/>', { class: 'gr-3 gr-4-m align-self-center still', id: 'spot' })));

        let selected_symbol = selected;
        if (Object.keys(all_symbols).indexOf(selected) === -1) selected_symbol = '';
        Object.keys(all_symbols).forEach((symbol, idx) => {
            if (all_symbols[symbol].is_active) {
                const is_current = (!selected_symbol && idx === 0) || symbol === selected_symbol;
                const $current   = $('<div/>', { value: symbol, class: 'gr-4 gr-4-t gr-4-m' })
                    .append($('<img/>', { src: urlForStatic(`/images/pages/mb_trading/${symbol.toLowerCase()}.svg`), alt: '' }))
                    .append($('<div/>', { text: all_symbols[symbol].display, class: 'name align-self-center' }));
                $list.append($current);
                if (is_current) {
                    MBContract.setCurrentItem($underlyings, symbol, 1);
                }
            }
        });
    };

    const selectors = '.trade_form, .price-table, #trading_bottom_content, .selection_wrapper, #trade_live_chart';

    const handleMarketClosed = () => {
        $(selectors).setVisibility(0);
        hideShowMbTrading('hide');
        MBNotifications.show({ text: localize('Market is closed. Please try again later.'), uid: 'MARKET_CLOSED' });
        symbols_timeout = setTimeout(() => { getSymbols(); }, 30000);
    };

    const handleMarketOpen = () => {
        $(selectors).setVisibility(1);
        hideShowMbTrading('show');
        MBNotifications.hide('MARKET_CLOSED');
    };

    const hideShowMbTrading = (action) => {
        const classes = ['gr-5 ', 'gr-12 ']; // the extra space is so gr-5-m is not replaced
        const show    = action === 'show';
        const $parent = $('#mb_trading').parent();
        $parent.attr('class', $parent.attr('class').replace(classes[+show], classes[+!show]));
    };

    const clearSymbolTimeout = () => {
        clearTimeout(symbols_timeout);
    };

    /*
     * Function to call when underlying has changed
     */
    const processMarketUnderlying = () => {
        const underlying = $('#underlying').attr('value');
        MBDefaults.set('underlying', underlying);

        commonTrading.showFormOverlay();

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks().then(() => {
            // get ticks for current underlying
            MBTick.request(underlying);
            MBTick.clean();
        });

        BinarySocket.clearTimeouts();

        getContracts(underlying);
    };

    const getContracts = (underlying) => {
        const req = {
            contracts_for: (underlying || MBDefaults.get('underlying')),
            currency     : MBContract.getCurrency(),
            product_type : 'multi_barrier',
        };
        BinarySocket.send(req).then((response) => {
            MBNotifications.hide('CONNECTION_ERROR');
            MBContract.setContractsResponse(response);
            // contracts_for is triggered every 15 seconds to check for expired barriers
            // but we don't want to send proposal in that case
            // so getContracts will be called without underlying param to distinguish these two cases
            processContract(response, underlying);
        });
        if (contract_timeout) clearContractTimeout();
        contract_timeout = setTimeout(getContracts, 15000);
    };

    const clearContractTimeout = () => { clearTimeout(contract_timeout); };

    /*
     * Function to display contract form for current underlying
     */
    const processContract = (contracts, should_send_proposal) => {
        if (getPropertyValue(contracts, 'error')) {
            MBNotifications.show({ text: contracts.error.message, uid: contracts.error.code });
            return;
        }

        State.set('is_chart_allowed', !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly'));

        checkMarketStatus(contracts.contracts_for.close);

        MBContract.populateOptions(should_send_proposal);
        if (should_send_proposal) {
            processPriceRequest();
        } else {
            processExpiredBarriers();
        }
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
        MBPrice.showPriceOverlay();
        const available_contracts = MBContract.getCurrentContracts();
        const durations           = MBDefaults.get('period').split('_');
        const jp_client           = jpClient();
        const is_crypto           = isCryptocurrency(MBDefaults.get('currency'));
        const payout              = parseFloat(MBDefaults.get(`payout${is_crypto ? '_crypto' : ''}`));

        const req = {
            proposal_array: 1,
            subscribe     : 1,
            basis         : 'payout',
            amount        : jp_client ? (parseInt(payout) || 1) * 1000 : payout,
            currency      : MBContract.getCurrency(),
            symbol        : MBDefaults.get('underlying'),
            passthrough   : { req_id: MBPrice.getReqId() },
            date_expiry   : durations[1],
            contract_type : [],
            barriers      : [],
            product_type  : 'multi_barrier',

            trading_period_start: durations[0],
        };

        // contract_type
        available_contracts.forEach(c => req.contract_type.push(c.contract_type));

        // barriers
        let all_expired = true;
        const contract  = available_contracts[0];
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

        processForgetProposals().then(() => {
            // send request
            if (req.barriers.length) {
                MBPrice.addPriceObj(req);
                BinarySocket.send(req, { callback: processProposal });
            }
        });

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
                const error_message = response.error.error ? response.error.error.message : response.error.message;
                MBNotifications.show({ text: error_message, uid: 'PROPOSAL', dismissible: false });
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
            if (!getPropertyValue(prices[expired_barrier][c], 'error')) {
                BinarySocket.send({ forget: prices[expired_barrier][c].proposal.id });
            }
        });
    };

    const processForgetProposals = () => {
        MBPrice.showPriceOverlay();
        const forget_proposal = BinarySocket.send({
            forget_all: 'proposal_array',
        });
        forget_proposal.then(() => {
            MBPrice.cleanup();
        });
        return forget_proposal;
    };

    const processForgetTicks = () => BinarySocket.send({ forget_all: 'ticks' });

    const forgetTradingStreams = () => {
        processForgetProposals();
        processForgetTicks();
    };

    const containsArray = (array, val) => {
        const hash = {};
        for (let i = 0; i < array.length; i++) {
            hash[array[i]] = i;
        }
        return getPropertyValue(hash, val);
    };

    const onUnload = () => {
        forgetTradingStreams();
        clearSymbolTimeout();
        clearContractTimeout();
        MBSymbols.clearData();
        MBTick.clean();
    };

    return {
        getSymbols,
        getContracts,
        processPriceRequest,
        processForgetTicks,
        onUnload,
    };
})();

module.exports = MBProcess;
