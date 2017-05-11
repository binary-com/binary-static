const MBContract       = require('./mb_contract');
const MBDefaults       = require('./mb_defaults');
const MBNotifications  = require('./mb_notifications');
const BinarySocket     = require('../socket');
const ViewPopup        = require('../user/view_popup/view_popup');
const Client           = require('../../base/client');
const GTM              = require('../../base/gtm');
const localize         = require('../../base/localize').localize;
const getPropertyValue = require('../../base/utility').getPropertyValue;
const isEmptyObject    = require('../../base/utility').isEmptyObject;
const elementInnerHtml = require('../../common_functions/common_functions').elementInnerHtml;
const jpClient         = require('../../common_functions/country_base').jpClient;
const formatMoney      = require('../../common_functions/currency_to_symbol').formatMoney;

/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 */

const MBPrice = (() => {
    'use strict';

    const price_selector = '.prices-wrapper .price-rows';
    let prices         = {},
        contract_types = {},
        barriers       = [],
        req_id         = 0,
        res_count      = 0,
        is_displayed   = false,
        is_unwelcome   = false,
        $tables;

    const addPriceObj = (req) => {
        req.barriers.forEach((barrier_obj) => {
            const barrier = makeBarrier(barrier_obj);
            if (!prices[barrier]) {
                prices[barrier] = {};
            }
            req.contract_type.forEach((c_type) => {
                prices[barrier][c_type] = {};
                if (!contract_types[c_type]) {
                    contract_types[c_type] = MBContract.getTemplate(c_type);
                }
            });
        });
    };

    const makeBarrier = (barrier_obj) => {
        if (!barrier_obj.barrier && barrier_obj.error) barrier_obj = barrier_obj.error.details;
        return (barrier_obj.barrier2 ? `${barrier_obj.barrier2}_` : '') + barrier_obj.barrier;
    };

    const display = (response) => {
        Object.keys(response.proposal_array.proposals).forEach((contract_type) => {
            response.proposal_array.proposals[contract_type].forEach((proposal) => {
                const barrier                  = makeBarrier(proposal);
                const prev_proposal            = $.extend({}, prices[barrier][contract_type]);
                prices[barrier][contract_type] = $.extend({ echo_req: response.echo_req }, proposal);

                if (isEmptyObject(prev_proposal)) {
                    res_count++;
                }

                // update previous ask_price to use in price movement
                if (!isEmptyObject(prev_proposal) && !prev_proposal.error) {
                    prices[barrier][contract_type].prev_price = prev_proposal.ask_price;
                }
            });

            // populate table if all proposals received
            if (!is_displayed && res_count === Object.keys(prices).length * 2) {
                populateTable();
            } else {
                updatePrice(contract_type);
            }
        });
    };

    const populateTable = () => {
        if (!$tables) {
            $tables = $(price_selector);
        }
        if (!barriers.length) {
            barriers = Object.keys(prices).sort((a, b) => +b.split('_')[0] - (+a.split('_')[0]));
        }

        BinarySocket.wait('get_account_status').then((response) => {
            is_unwelcome = /unwelcome/.test(response.get_account_status.status);
            if (is_unwelcome) {
                MBNotifications.show({
                    text       : localize('Sorry, your account is not authorised for any further contract purchases.'),
                    uid        : 'UNWELCOME',
                    dismissible: false,
                });
            }
        });

        barriers.forEach((barrier) => {
            Object.keys(contract_types).forEach((contract_type) => {
                $($tables[+contract_types[contract_type].order])
                    .append(makePriceRow(getValues(prices[barrier][contract_type], contract_type)));
            });
        });

        MBPrice.hidePriceOverlay();
        MBNotifications.hideSpinnerShowTrading();
        is_displayed = true;
    };

    const updatePrice = (contract_type) => {
        barriers.forEach((barrier) => {
            const proposal = prices[barrier][contract_type],
                price_rows = document.querySelectorAll(`${price_selector} div[data-barrier="${makeBarrier(proposal)}"]`);

            if (!price_rows.length) return;

            const contract_info     = contract_types[contract_type];
            const contract_info_opp = contract_types[contract_info.opposite];
            const values     = getValues(proposal, contract_type);
            const values_opp = getValues(prices[barrier][contract_info.opposite], contract_info.opposite);

            elementInnerHtml(price_rows[+contract_info.order],     makePriceRow(values,     true));
            elementInnerHtml(price_rows[+contract_info_opp.order], makePriceRow(values_opp, true));
        });
    };

    const getValues = (proposal, contract_type) => {
        const barrier      = makeBarrier(proposal);
        const payout       = proposal.echo_req.amount;
        const proposal_opp = prices[barrier][contract_types[contract_type].opposite];
        return {
            contract_type      : contract_type,
            barrier            : barrier,
            is_active          : !proposal.error && proposal.ask_price && !is_unwelcome,
            message            : proposal.error && proposal.error.code !== 'RateLimit' ? proposal.error.message : '',
            ask_price          : getAskPrice(proposal),
            sell_price         : payout - getAskPrice(proposal_opp),
            ask_price_movement : !proposal.error ? getMovementDirection(proposal.prev_price, proposal.ask_price) : '',
            sell_price_movement: proposal_opp && !proposal_opp.error ? getMovementDirection(proposal_opp.ask_price, proposal_opp.prev_price) : '',
        };
    };

    const getAskPrice = proposal => (
        (proposal.error || +proposal.ask_price === 0) ?
            (getPropertyValue(proposal, ['error', 'details', 'display_value']) || proposal.echo_req.amount) : // In case of RateLimit error, there is no display_value, so we display the request amount
            proposal.ask_price
    );

    const getMovementDirection = (prev, current) => (current > prev ? 'up' : current < prev ? 'down' : '');

    const makePriceRow = (values, is_update) => {
        const payout   = MBDefaults.get('payout');
        const is_japan = jpClient();
        return `${(is_update ? '' : `<div data-barrier="${values.barrier}" class="gr-row price-row">`)}
                <div class="gr-4 barrier">${values.barrier.split('_').join(' ... ')}</div>
                <div class="gr-4 buy-price">
                    <button class="price-button${(values.is_active ? '' : ' inactive')}"
                        ${(values.is_active ? ` onclick="return HandleClick('MBPrice', '${values.barrier}', '${values.contract_type}')"` : '')}
                        ${(values.message ? ` data-balloon="${values.message}"` : '')}>
                            <span class="value-wrapper">
                                <span class="dynamics ${(values.ask_price_movement || '')}"></span>
                                ${formatPrice(values.ask_price)}
                            </span>
                            ${(is_japan ? `<span class="base-value">(${formatPrice(values.ask_price / payout)})</span>` : '')}
                    </button>
                </div>
                <div class="gr-4 sell-price">
                    <span class="price-wrapper${(!values.sell_price ? ' inactive' : '')}">
                        <span class="dynamics ${(values.sell_price_movement || '')}"></span>
                        ${formatPrice(values.sell_price)}
                        ${(is_japan ? `<span class="base-value">(${formatPrice(values.sell_price / payout)})</span>` : '')}
                    </span>
                </div>
            ${(is_update ? '' : '</div>')}`;
    };

    const processBuy = (barrier, contract_type) => {
        if (!barrier || !contract_type) return;
        if (!Client.isLoggedIn()) {
            MBNotifications.show({ text: localize('Please log in.'), uid: 'LOGIN_ERROR', dismissible: true });
            return;
        }
        MBPrice.showPriceOverlay();
        MBPrice.sendBuyRequest(barrier, contract_type);
    };

    const formatPrice = price => formatMoney(MBContract.getCurrency(), price, 1);

    const cleanup = () => {
        prices         = {};
        contract_types = {};
        barriers       = [];
        res_count      = 0;
        is_displayed   = false;
        // display loading
        if ($(price_selector).html()) {
            $('#loading-overlay').height($(price_selector).height()).setVisibility(1);
        }
        $(price_selector).html('');
    };

    const sendBuyRequest = (barrier, contract_type) => {
        const proposal = prices[barrier][contract_type];
        if (!proposal || proposal.error) return;

        const req = {
            buy       : 1,
            price     : proposal.ask_price,
            parameters: {
                amount               : proposal.echo_req.amount,
                barrier              : proposal.barrier,
                basis                : 'payout',
                contract_type        : contract_type,
                currency             : MBContract.getCurrency(),
                symbol               : proposal.echo_req.symbol,
                date_expiry          : proposal.echo_req.date_expiry,
                trading_period_start : proposal.echo_req.trading_period_start,
                app_markup_percentage: '0',
            },
        };

        if (proposal.barrier2) {
            req.parameters.barrier2 = proposal.barrier2;
        }

        BinarySocket.send(req).then((response) => {
            if (response.error) {
                hidePriceOverlay();
                MBNotifications.show({ text: response.error.message, uid: 'BUY_ERROR', dismissible: true });
            } else {
                MBNotifications.hide('BUY_ERROR');
                ViewPopup.init($('<div />', { contract_id: response.buy.contract_id }).get(0));
                GTM.pushPurchaseData(response);
            }
        });
    };

    const showPriceOverlay = () => {
        $('#disable-overlay').setVisibility(1);
    };

    const hidePriceOverlay = () => {
        $('#disable-overlay, #loading-overlay').setVisibility(0);
    };

    return {
        display         : display,
        addPriceObj     : addPriceObj,
        processBuy      : processBuy,
        cleanup         : cleanup,
        sendBuyRequest  : sendBuyRequest,
        showPriceOverlay: showPriceOverlay,
        hidePriceOverlay: hidePriceOverlay,
        getReqId        : () => req_id,
        increaseReqId   : () => { req_id++; cleanup(); },
        getPrices       : () => prices,
        onUnload        : () => { cleanup(); req_id = 0; $tables = undefined; },
    };
})();

module.exports = MBPrice;
