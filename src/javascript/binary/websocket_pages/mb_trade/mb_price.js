const MBContract         = require('./mb_contract').MBContract;
const MBDefaults         = require('./mb_defaults').MBDefaults;
const MBNotifications    = require('./mb_notifications').MBNotifications;
const objectNotEmpty     = require('../../base/utility').objectNotEmpty;
const getPropertyValue   = require('../../base/utility').getPropertyValue;
const localize           = require('../../base/localize').localize;
const Client             = require('../../base/client').Client;
const japanese_client    = require('../../common_functions/country_base').japanese_client;
const addComma           = require('../../common_functions/string_util').addComma;
const elementInnerHtml   = require('../../common_functions/common_functions').elementInnerHtml;

/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 */

const MBPrice = (function() {
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

    const addPriceObj = function(req) {
        req.barriers.forEach(function(barrier_obj) {
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

    const makeBarrier = function(barrier_obj) {
        if (!barrier_obj.barrier && barrier_obj.error) barrier_obj = barrier_obj.error.details;
        return (barrier_obj.barrier2 ? barrier_obj.barrier2 + '_' : '') + barrier_obj.barrier;
    };

    const display = function(response) {
        Object.keys(response.proposal_array.proposals).forEach(function(contract_type) {
            response.proposal_array.proposals[contract_type].forEach(function(proposal) {
                const barrier                  = makeBarrier(proposal);
                const prev_proposal            = $.extend({}, prices[barrier][contract_type]);
                prices[barrier][contract_type] = $.extend({ echo_req: response.echo_req }, proposal);

                if (!objectNotEmpty(prev_proposal)) {
                    res_count++;
                }

                // update previous ask_price to use in price movement
                if (objectNotEmpty(prev_proposal) && !prev_proposal.error) {
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

    const populateTable = function() {
        if (!$tables) {
            $tables = $(price_selector);
        }
        if (!barriers.length) {
            barriers = Object.keys(prices).sort(function(a, b) {
                return +b.split('_')[0] - (+a.split('_')[0]);
            });
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

        barriers.forEach(function(barrier) {
            Object.keys(contract_types).forEach(function(contract_type) {
                $($tables[+contract_types[contract_type].order])
                    .append(makePriceRow(getValues(prices[barrier][contract_type])));
            });
        });

        MBPrice.hidePriceOverlay();
        MBNotifications.hideSpinnerShowTrading();
        is_displayed = true;
    };

    const updatePrice = function(contract_type) {
        barriers.forEach(function(barrier) {
            const proposal = prices[barrier][contract_type],
                price_rows = document.querySelectorAll(price_selector + ' div[data-barrier="' + makeBarrier(proposal) + '"]');

            if (!price_rows.length) return;

            const contract_info     = contract_types[contract_type];
            const contract_info_opp = contract_types[contract_info.opposite];
            const values     = getValues(proposal);
            const values_opp = getValues(prices[barrier][contract_info.opposite]);

            elementInnerHtml(price_rows[+contract_info.order],     makePriceRow(values,     true));
            elementInnerHtml(price_rows[+contract_info_opp.order], makePriceRow(values_opp, true));
        });
    };

    const getValues = function(proposal) {
        const barrier     = makeBarrier(proposal),
            payout        = proposal.echo_req.amount,
            contract_type = proposal.echo_req.contract_type,
            proposal_opp  = prices[barrier][contract_types[contract_type].opposite];
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

    const getAskPrice = function(proposal) {
        return (proposal.error || +proposal.ask_price === 0) ?
            (getPropertyValue(proposal, ['error', 'details', 'display_value']) || proposal.echo_req.amount) : // In case of RateLimit error, there is no display_value, so we display the request amount
            proposal.ask_price;
    };

    const getMovementDirection = function(prev, current) {
        return current > prev ? 'up' : current < prev ? 'down' : '';
    };

    const makePriceRow = function(values, is_update) {
        const payout   = MBDefaults.get('payout'),
            is_japan = japanese_client();
        return (is_update ? '' : '<div data-barrier="' + values.barrier + '" class="gr-row price-row">') +
                '<div class="gr-4 barrier">' + values.barrier.split('_').join(' ... ') + '</div>' +
                '<div class="gr-4 buy-price">' +
                    '<button class="price-button' + (values.is_active ? '' : ' inactive') + '"' +
                        (values.is_active ? ' onclick="return HandleClick(\'MBPrice\', \'' + values.barrier + '\', \'' + values.contract_type + '\')"' : '') +
                        (values.message ? ' data-balloon="' + values.message + '"' : '') + '>' +
                            '<span class="value-wrapper">' +
                                '<span class="dynamics ' + (values.ask_price_movement || '') + '"></span>' +
                                formatPrice(values.ask_price) +
                            '</span>' +
                            (is_japan ? '<span class="base-value">(' + formatPrice(values.ask_price / payout) + ')</span>' : '') +
                    '</button>' +
                '</div>' +
                '<div class="gr-4 sell-price">' +
                    '<span class="price-wrapper' + (!values.sell_price ? ' inactive' : '') + '">' +
                        '<span class="dynamics ' + (values.sell_price_movement || '') + '"></span>' +
                        formatPrice(values.sell_price) +
                        (is_japan ? '<span class="base-value">(' + formatPrice(values.sell_price / payout) + ')</span>' : '') +
                    '</span>' +
                '</div>' +
            (is_update ? '' : '</div>');
    };

    const processBuy = function(barrier, contract_type) {
        if (!barrier || !contract_type) return;
        if (!Client.is_logged_in()) {
            MBNotifications.show({ text: localize('Please log in.'), uid: 'LOGIN_ERROR', dismissible: true });
            return;
        }
        MBPrice.showPriceOverlay();
        MBPrice.sendBuyRequest(barrier, contract_type);
    };

    const formatPrice = function(price) {
        return addComma(price, japanese_client() ? '0' : 2);
    };

    const cleanup = function() {
        prices         = {};
        contract_types = {};
        barriers       = [];
        res_count      = 0;
        is_displayed   = false;
        // display loading
        if ($(price_selector).html()) {
            $('#loading-overlay').height($(price_selector).height()).removeClass('invisible');
        }
        $(price_selector).html('');
    };

    const sendBuyRequest = function(barrier, contract_type) {
        const proposal = prices[barrier][contract_type];
        if (!proposal || proposal.error) return;

        const req = {
            buy       : 1,
            price     : proposal.ask_price,
            parameters: {
                amount               : proposal.echo_req.amount,
                barrier              : proposal.barrier,
                basis                : 'payout',
                contract_type        : proposal.echo_req.contract_type,
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

        BinarySocket.send(req);
    };

    const showPriceOverlay = function() {
        $('#disable-overlay').removeClass('invisible');
    };

    const hidePriceOverlay = function() {
        $('#disable-overlay, #loading-overlay').addClass('invisible');
    };

    return {
        display         : display,
        addPriceObj     : addPriceObj,
        processBuy      : processBuy,
        cleanup         : cleanup,
        sendBuyRequest  : sendBuyRequest,
        showPriceOverlay: showPriceOverlay,
        hidePriceOverlay: hidePriceOverlay,
        getReqId        : function() { return req_id; },
        increaseReqId   : function() { req_id++; cleanup(); },
        getPrices       : function() { return prices; },
        onUnload        : function() { cleanup(); req_id = 0; $tables = undefined; },
    };
})();

module.exports = {
    MBPrice: MBPrice,
};
