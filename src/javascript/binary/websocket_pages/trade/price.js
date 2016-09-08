/*
 * Price object handles all the functions we need to display prices
 *
 * We create Price proposal that we need to send to server to get price,
 * longcode and all other information that we need to get the price for
 * current contract
 *
 *
 * Usage:
 *
 * `socket.send(Price.proposal())` to send price proposal to sever
 * `Price.display()` to display the price details returned from server
 */
var Price = (function() {
    'use strict';

    var typeDisplayIdMapping = {},
        form_id = 0;

    var createProposal = function(typeOfContract) {
        var proposal = {
            proposal: 1,
            subscribe: 1
        };
        var underlying = document.getElementById('underlying'),
            submarket = document.getElementById('submarket'),
            contractType = typeOfContract,
            amountType = document.getElementById('amount_type'),
            currency = document.getElementById('currency'),
            payout = document.getElementById('amount'),
            startTime = StartDates.node(),
            expiryType = document.getElementById('expiry_type'),
            duration = document.getElementById('duration_amount'),
            durationUnit = document.getElementById('duration_units'),
            endDate = document.getElementById('expiry_date'),
            endTime = document.getElementById('expiry_time'),
            barrier = document.getElementById('barrier'),
            highBarrier = document.getElementById('barrier_high'),
            lowBarrier = document.getElementById('barrier_low'),
            prediction = document.getElementById('prediction'),
            amountPerPoint = document.getElementById('amount_per_point'),
            stopType = document.querySelector('input[name="stop_type"]:checked'),
            stopLoss = document.getElementById('stop_loss'),
            stopProfit = document.getElementById('stop_profit');

        if (payout && isVisible(payout) && payout.value) {
            proposal['amount'] = parseFloat(payout.value);
        }

        if (amountType && isVisible(amountType) && amountType.value) {
            proposal['basis'] = amountType.value;
        }

        if (contractType) {
            proposal['contract_type'] = typeOfContract;
        }

        if (currency && currency.value) {
            proposal['currency'] = currency.value;
        }

        if (underlying && underlying.value) {
            proposal['symbol'] = underlying.value;
        }

        if (startTime && isVisible(startTime) && startTime.value !== 'now') {
            proposal['date_start'] = startTime.value;
        }

        if (expiryType && isVisible(expiryType) && expiryType.value === 'duration') {
            proposal['duration'] = parseInt(duration.value);
            proposal['duration_unit'] = durationUnit.value;
        } else if (expiryType && isVisible(expiryType) && expiryType.value === 'endtime') {
            var endDate2 = endDate.value;
            var endTime2 = Durations.getTime();
            if (!endTime2) {
                var trading_times = Durations.trading_times();
                if (trading_times.hasOwnProperty(endDate2) && typeof trading_times[endDate2][underlying.value] === 'object' && trading_times[endDate2][underlying.value].length && trading_times[endDate2][underlying.value][0] !== '--') {
                    if( trading_times[endDate2][underlying.value].length>1)
                        endTime2 = trading_times[endDate2][underlying.value][1];
                    else
                         endTime2=trading_times[endDate2][underlying.value];
                }
            }

            proposal['date_expiry'] = moment.utc(endDate2 + " " + endTime2).unix();
            // For stopping tick trade behaviour
            proposal['duration_unit'] = "m";
        }

        if (barrier && isVisible(barrier) && barrier.value) {
            proposal['barrier'] = barrier.value;
        }

        if (highBarrier && isVisible(highBarrier) && highBarrier.value) {
            proposal['barrier'] = highBarrier.value;
        }

        if (lowBarrier && isVisible(lowBarrier) && lowBarrier.value) {
            proposal['barrier2'] = lowBarrier.value;
        }

        if (prediction && isVisible(prediction)) {
            proposal['barrier'] = parseInt(prediction.value);
        }

        if (amountPerPoint && isVisible(amountPerPoint)) {
            proposal['amount_per_point'] = parseFloat(amountPerPoint.value);
        }

        if (stopType && isVisible(stopType)) {
            proposal['stop_type'] = stopType.value;
        }

        if (stopLoss && isVisible(stopLoss)) {
            proposal['stop_loss'] = parseFloat(stopLoss.value);
        }

        if (stopProfit && isVisible(stopProfit)) {
            proposal['stop_profit'] = parseFloat(stopProfit.value);
        }

        if (contractType) {
            proposal['contract_type'] = typeOfContract;
        }

        proposal['passthrough'] = {
            form_id: form_id
        };

        resetPriceMovement();

        return proposal;
    };

    var display = function(details, contractType) {
        var proposal = details['proposal'];
        var id = proposal ? proposal['id'] : '';
        var params = details['echo_req'];

        var type = params['contract_type'];
        if (id && !type) {
            type = typeDisplayIdMapping[id];
        }

        var is_spread = false;
        if (params.contract_type && (params.contract_type === 'SPREADU' || params.contract_type === 'SPREADD')) {
            is_spread = true;
        }

        if (params && id && Object.getOwnPropertyNames(params).length > 0) {
            typeDisplayIdMapping[id] = type;
        }

        var position = contractTypeDisplayMapping(type);

        if (!position) {
            return;
        }

        var container = document.getElementById('price_container_' + position);
        if (!container) return;
        if (!$(container).is(":visible")) {
            $(container).fadeIn(200);
        }

        var h4 = container.getElementsByClassName('contract_heading')[0],
            amount = container.getElementsByClassName('contract_amount')[0],
            payoutAmount = container.getElementsByClassName('contract_payout')[0],
            stake = container.getElementsByClassName('stake')[0],
            payout = container.getElementsByClassName('payout')[0],
            purchase = container.getElementsByClassName('purchase_button')[0],
            description = container.getElementsByClassName('contract_description')[0],
            comment = container.getElementsByClassName('price_comment')[0],
            error = container.getElementsByClassName('contract_error')[0],
            price_wrapper = container.getElementsByClassName('price_wrapper')[0],
            currency = document.getElementById('currency');

        var display = type ? (contractType ? contractType[type] : '') : '';
        if (display) {
            h4.setAttribute('class', 'contract_heading ' + type);
            if (is_spread) {
                if (position === "top") {
                    h4.textContent = Content.localize().textSpreadTypeLong;
                } else {
                    h4.textContent = Content.localize().textSpreadTypeShort;
                }
            } else {
                h4.textContent = display;
            }
        }

        var setData = function(data) {
            if (!data) return;
            if (data['display_value']) {
                if (is_spread) {
                    $('.stake:visible').hide();
                    amount.textContent = data['display_value'];
                } else {
                    $('.stake:hidden').show();
                    stake.textContent = text.localize('Stake') + ': ';
                    amount.textContent = format_money(currency.value, (data['display_value']*1).toFixed(2));
                }
                $('.stake_wrapper:hidden').show();
            } else {
                $('.stake_wrapper:visible').hide();
            }

            if (data['payout']) {
              payout.textContent = (is_spread ? text.localize('Payout/point') : text.localize('Payout')) + ': ';
              payoutAmount.textContent = format_money(currency.value, (data['payout']*1).toFixed(2));
              $('.payout_wrapper:hidden').show();
            } else {
              $('.payout_wrapper:visible').hide();
            }

            if (data['longcode'] && window.innerWidth > 500 && !page.client_status_detected('unwelcome')) {
                description.setAttribute('data-balloon', data['longcode']);
            } else {
                description.removeAttribute('data-balloon');
            }
        };

        if (details['error']) {
            purchase.hide();
            comment.hide();
            setData(details['error']['details']);
            error.show();
            error.textContent = details['error']['message'];
        } else {
            setData(proposal);
            purchase.show();
            comment.show();
            error.hide();
            if (is_spread) {
                displayCommentSpreads(comment, currency.value, proposal['spread']);
            } else {
                displayCommentPrice(comment, currency.value, proposal['ask_price'], proposal['payout']);
            }
            var oldprice = purchase.getAttribute('data-display_value'),
                oldpayout = purchase.getAttribute('data-payout');
            displayPriceMovement(amount, oldprice, proposal['display_value']);
            displayPriceMovement(payoutAmount, oldpayout, proposal['payout']);
            purchase.setAttribute('data-purchase-id', id);
            purchase.setAttribute('data-ask-price', proposal['ask_price']);
            purchase.setAttribute('data-display_value', proposal['display_value']);
            purchase.setAttribute('data-payout', proposal['payout']);
            purchase.setAttribute('data-symbol', id);
            for (var key in params) {
                if (key && key !== 'proposal') {
                    purchase.setAttribute('data-' + key, params[key]);
                }
            }
        }
    };

    var clearMapping = function() {
        typeDisplayIdMapping = {};
    };

    var clearFormId = function() {
        form_id = 0;
    };

    return {
        proposal: createProposal,
        display: display,
        clearMapping: clearMapping,
        idDisplayMapping: function() {
            return typeDisplayIdMapping;
        },
        getFormId: function() {
            return form_id;
        },
        incrFormId: function() {
            form_id++;
        },
        clearFormId: clearFormId
    };

})();
