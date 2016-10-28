/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 */

var MBPrice = (function() {
    'use strict';

    var prices            = {},
        contract_types    = {},
        barriers          = [],
        req_id            = 0,
        res_count         = 0,
        is_displayed      = false,
        price_selector    = '.prices-wrapper .price-rows',
        proposal_response = {},
        $tables;

    var addPriceObj = function(req) {
        var barrier = makeBarrier(req);
        if (!prices[barrier]) {
            prices[barrier] = {};
        }
        prices[barrier][req.contract_type] = {};
        if (!contract_types[req.contract_type]) {
            contract_types[req.contract_type] = MBContract.getTemplate(req.contract_type);
        }
    };

    var makeBarrier = function(req) {
        return (req.barrier2 ? req.barrier2 + '_' : '') + req.barrier;
    };

    var display = function(response) {
        var barrier = makeBarrier(response.echo_req),
            contract_type = response.echo_req.contract_type,
            prev_proposal = $.extend({}, prices[barrier][contract_type]);

        if (!objectNotEmpty(prev_proposal)) {
            res_count++;
        }

        prices[barrier][contract_type] = response;
        // update previous ask_price to use in price movement
        if (objectNotEmpty(prev_proposal) && !prev_proposal.error) {
            prices[barrier][contract_type].prev_price = prev_proposal.proposal.ask_price;
        }

        // populate table if all proposals received
        if (!is_displayed && res_count === Object.keys(prices).length * 2) {
            populateTable();
        } else {
            updatePrice(prices[barrier][contract_type]);
        }
    };

    var populateTable = function() {
        if (!$tables) {
            $tables = $(price_selector);
        }
        if (!barriers.length) {
            barriers = Object.keys(prices).sort(function(a, b) {
                return +b.split('_')[0] - (+a.split('_')[0]);
            });
        }

        var payout = MBDefaults.get('payout') * 1000;
        barriers.forEach(function(barrier) {
            Object.keys(contract_types).forEach(function(contract_type) {
                $($tables[+contract_types[contract_type].order])
                    .append(makePriceRow(getValues(prices[barrier][contract_type])));
            });
        });

        MBPrice.hidePriceOverlay();
        hideSpinnerShowTrading();
        is_displayed = true;
    };

    var updatePrice = function(proposal) {
        var barrier     = makeBarrier(proposal.echo_req),
            $price_rows = $(price_selector + ' div[data-barrier="' + barrier + '"]');

        if (!$price_rows.length) return;

        var contract_type     = proposal.echo_req.contract_type,
            contract_info     = contract_types[contract_type],
            contract_info_opp = contract_types[contract_info.opposite];
        var values     = getValues(proposal),
            values_opp = getValues(prices[barrier][contract_info.opposite]);

        $($price_rows[+contract_info.order]).replaceWith(makePriceRow(values));
        $($price_rows[+contract_info_opp.order]).replaceWith(makePriceRow(values_opp));
    };

    var getValues = function(proposal) {
        var barrier       = makeBarrier(proposal.echo_req),
            payout        = proposal.echo_req.amount,
            contract_type = proposal.echo_req.contract_type,
            proposal_opp  = prices[barrier][contract_types[contract_type].opposite];
        return {
            contract_type : contract_type,
            barrier       : barrier,
            id            : !proposal.error ? proposal.proposal.id : undefined,
            is_active     : !proposal.error && proposal.proposal.ask_price,
            message       :  proposal.error && proposal.error.code !== 'RateLimit' ? proposal.error.message : '',
            ask_price     : getAskPrice(proposal),
            sell_price    : payout - getAskPrice(proposal_opp),
            ask_price_movement  : !proposal.error ? getMovementDirection(proposal.prev_price, proposal.proposal.ask_price) : '',
            sell_price_movement : proposal_opp && !proposal_opp.error ? getMovementDirection(proposal_opp.proposal.ask_price, proposal_opp.prev_price) : '',
        };
    };

    var getAskPrice = function(proposal) {
        return proposal.error || +proposal.proposal.ask_price === 0 ? proposal.echo_req.amount : Math.round(proposal.proposal.ask_price);
    };

    var getMovementDirection = function(prev, current) {
        return current > prev ? '⬆' : current < prev ? '⬇' : '';
    };

    var makePriceRow = function(values) {
        return '<div data-barrier="' + values.barrier + '" class="gr-row price-row">' +
                '<div class="gr-4 barrier">' + values.barrier.split('_').join(' ... ') + '</div>' +
                '<div class="gr-4 buy-price">' +
                    '<button class="price-button' + (!values.is_active ? ' inactive' : '') + '"' +
                        (values.id ? ' onclick="MBProcess.processBuy(\'' + values.barrier + '\', \'' + values.contract_type + '\')"' : '') +
                        (values.message ? ' data-balloon="' + values.message + '"' : '') + '>' + values.ask_price +
                        '<span class="dynamics">' + (values.ask_price_movement || '') + '</span>' +
                    '</button>' +
                '</div>' +
                '<div class="gr-4 sell-price">' +
                    '<span class="price-wrapper' + (!values.sell_price ? ' inactive' : '') + '">' + values.sell_price +
                        '<span class="dynamics">' + (values.sell_price_movement || '') + '</span>' +
                    '</span>' +
                '</div>' +
            '</div>';
    };

    var cleanup = function() {
        prices         = {};
        contract_types = {};
        barriers       = [];
        res_count      = 0;
        is_displayed   = false;
        $(price_selector).html('');
    };

    var sendBuyRequest = function(barrier, contract_type) {
        var proposal = prices[barrier][contract_type];
        if (!proposal || proposal.error) return;

        var req = {
            buy   : 1,
            price : proposal.proposal.ask_price,
            parameters: {
                amount        : proposal.echo_req.amount,
                barrier       : proposal.echo_req.barrier,
                basis         : 'payout',
                contract_type : proposal.echo_req.contract_type,
                currency      : MBContract.getCurrency(),
                symbol        : proposal.echo_req.symbol,
                date_expiry   : proposal.echo_req.date_expiry,
                trading_period_start  : proposal.echo_req.trading_period_start,
                app_markup_percentage : '0',
            }
        };

        if (proposal.echo_req.barrier2) {
            req.parameters.barrier2 = proposal.echo_req.barrier2;
        }

        BinarySocket.send(req);
    };

    var showPriceOverlay = function() {
        $('#disable-overlay').removeClass('invisible');
    };

    var hidePriceOverlay = function() {
        $('#disable-overlay').addClass('invisible');
    };

    var hideSpinnerShowTrading = function() {
        $('.spinner').addClass('invisible');
        $('.mb-trading-wrapper').removeClass('invisible');
    };

    var setProposalResponse = function(response) {
        if (response.hasOwnProperty('error') || !response.proposal.id || !response.proposal.spot ||
            !response.hasOwnProperty('echo_req') || !response.echo_req.hasOwnProperty('barrier')) return;
        var barrier = makeBarrier(response.echo_req);
        if (req_id !== response.req_id) {
            proposal_response = {};
        }
        if (!proposal_response[barrier]) {
            proposal_response[barrier] = response.proposal.id;
        }
    };

    return {
        display             : display,
        addPriceObj         : addPriceObj,
        cleanup             : cleanup,
        sendBuyRequest      : sendBuyRequest,
        showPriceOverlay    : showPriceOverlay,
        hidePriceOverlay    : hidePriceOverlay,
        getReqId            : function() { return req_id; },
        increaseReqId       : function() { req_id++; cleanup(); },
        getProposalResponse : function() { return proposal_response; },
        setProposalResponse : setProposalResponse,
    };
})();

module.exports = {
    MBPrice: MBPrice,
};
