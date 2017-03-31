const MBContract         = require('./mb_contract').MBContract;
const MBNotifications    = require('./mb_notifications').MBNotifications;
const isEmptyObject      = require('../../base/utility').isEmptyObject;
const getPropertyValue   = require('../../base/utility').getPropertyValue;
const localize           = require('../../base/localize').localize;
const Client             = require('../../base/client');
const jpClient           = require('../../common_functions/country_base').jpClient;
const addComma           = require('../../common_functions/string_util').addComma;

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
    const is_japan       = jpClient();

    let prices         = {},
        contract_types = {},
        barriers       = [],
        req_id         = 0,
        res_count      = 0,
        is_displayed   = false,
        is_unwelcome   = false,
        $rows          = {},
        $table;

    const addPriceObj = function(req) {
        const barrier = makeBarrier(req);
        if (!prices[barrier]) {
            prices[barrier] = {};
        }
        prices[barrier][req.contract_type] = {};
        if (!contract_types[req.contract_type]) {
            contract_types[req.contract_type] = MBContract.getTemplate(req.contract_type);
        }
    };

    const makeBarrier = function(req) {
        return (req.barrier2 ? req.barrier2 + '_' : '') + req.barrier;
    };

    const display = function(response) {
        const barrier = makeBarrier(response.echo_req);
        const contract_type = response.echo_req.contract_type;
        const prev_proposal = $.extend({}, prices[barrier][contract_type]);

        if (isEmptyObject(prev_proposal)) {
            res_count++;
        }

        prices[barrier][contract_type] = response;
        // update previous ask_price to use in price movement
        if (!isEmptyObject(prev_proposal) && !prev_proposal.error) {
            prices[barrier][contract_type].prev_price = prev_proposal.proposal.ask_price;
        }

        // populate table if all proposals received
        if (!is_displayed && res_count === Object.keys(prices).length * 2) {
            populateTable();
        } else if ($rows[barrier]) {
            updatePrice(prices[barrier][contract_type]);
        }
    };

    const populateTable = function() {
        if (!$table) {
            $table = $(price_selector);
        }
        if (!barriers.length) {
            barriers = Object.keys(prices).sort(function(a, b) {
                return +b.split('_')[0] - (+a.split('_')[0]);
            });
        }

        const $price_row = $('#templates .price-row');
        barriers.forEach((barrier) => {
            $rows[barrier] = $price_row.clone().attr('data-barrier', barrier);
            $rows[barrier].find('.barrier').html(barrier.split('_').join('<br />'));
            $table.append($rows[barrier]);
        });

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
                $($table[+contract_types[contract_type].order])
                    .append(updatePriceRow(getValues(prices[barrier][contract_type])));
            });
        });

        MBPrice.hidePriceOverlay();
        MBNotifications.hideSpinnerShowTrading();
        is_displayed = true;
    };

    const updatePrice = function(proposal) {
        const barrier = makeBarrier(proposal.echo_req);
        const contract_type_opp = contract_types[proposal.echo_req.contract_type].opposite;

        updatePriceRow(getValues(proposal));
        updatePriceRow(getValues(prices[barrier][contract_type_opp]));
    };

    const getValues = function(proposal) {
        const barrier       = makeBarrier(proposal.echo_req),
            payout        = proposal.echo_req.amount,
            contract_type = proposal.echo_req.contract_type,
            proposal_opp  = prices[barrier][contract_types[contract_type].opposite];
        return {
            payout             : payout / 1000,
            contract_type      : contract_type,
            barrier            : barrier,
            is_active          : !proposal.error && proposal.proposal.ask_price && !is_unwelcome,
            message            : proposal.error && proposal.error.code !== 'RateLimit' ? proposal.error.message : '',
            ask_price          : getAskPrice(proposal),
            sell_price         : payout - getAskPrice(proposal_opp),
            ask_price_movement : !proposal.error ? getMovementDirection(proposal.prev_price, proposal.proposal.ask_price) : '',
            sell_price_movement: proposal_opp && !proposal_opp.error ? getMovementDirection(proposal_opp.proposal.ask_price, proposal_opp.prev_price) : '',
        };
    };

    const getAskPrice = function(proposal) {
        return (proposal.error || +proposal.proposal.ask_price === 0) ?
            (getPropertyValue(proposal, ['error', 'details', 'display_value']) || proposal.echo_req.amount) : // In case of RateLimit error, there is no display_value, so we display the request amount
            proposal.proposal.ask_price;
    };

    const getMovementDirection = function(prev, current) {
        return current > prev ? 'up' : current < prev ? 'down' : '';
    };

    const updatePriceRow = function(values) {
        const $buy = $('<button class="price-button' + (values.is_active ? '' : ' inactive') + '"' +
            (values.is_active ? ' onclick="return HandleClick(\'MBPrice\', \'' + values.barrier + '\', \'' + values.contract_type + '\')"' : '') +
            (values.message ? ' data-balloon="' + values.message + '"' : '') + '>' +
                '<span class="value-wrapper">' +
                    '<span class="dynamics ' + (values.ask_price_movement || '') + '"></span>' +
                    formatPrice(values.ask_price) +
                '</span>' +
                (is_japan ? '<span class="base-value">(' + formatPrice(values.ask_price / values.payout) + ')</span>' : '') +
            '</button>');
        const $sell = '<span class="price-wrapper' + (!values.sell_price ? ' inactive' : '') + '">' +
                '<span class="dynamics ' + (values.sell_price_movement || '') + '"></span>' +
                formatPrice(values.sell_price) +
                (is_japan ? '<span class="base-value">(' + formatPrice(values.sell_price / values.payout) + ')</span>' : '') +
            '</span>';

        const $row = $rows[values.barrier];
        const order = contract_types[values.contract_type].order;
        $row.find(`.buy-price:eq(${order})`).html($buy);
        $row.find(`.sell-price:eq(${order})`).html($sell);
    };

    const processBuy = function(barrier, contract_type) {
        if (!barrier || !contract_type) return;
        if (!Client.isLoggedIn()) {
            MBNotifications.show({ text: localize('Please log in.'), uid: 'LOGIN_ERROR', dismissible: true });
            return;
        }
        MBPrice.showPriceOverlay();
        MBPrice.sendBuyRequest(barrier, contract_type);
    };

    const formatPrice = function(price) {
        return addComma(price, jpClient() ? '0' : 2);
    };

    const cleanup = function() {
        prices         = {};
        contract_types = {};
        barriers       = [];
        res_count      = 0;
        is_displayed   = false;
        $rows          = {};
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
            price     : proposal.proposal.ask_price,
            parameters: {
                amount               : proposal.echo_req.amount,
                barrier              : proposal.echo_req.barrier,
                basis                : 'payout',
                contract_type        : proposal.echo_req.contract_type,
                currency             : MBContract.getCurrency(),
                symbol               : proposal.echo_req.symbol,
                date_expiry          : proposal.echo_req.date_expiry,
                trading_period_start : proposal.echo_req.trading_period_start,
                app_markup_percentage: '0',
            },
        };

        if (proposal.echo_req.barrier2) {
            req.parameters.barrier2 = proposal.echo_req.barrier2;
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
        onUnload        : function() { cleanup(); req_id = 0; $table = undefined; },
    };
})();

module.exports = {
    MBPrice: MBPrice,
};
