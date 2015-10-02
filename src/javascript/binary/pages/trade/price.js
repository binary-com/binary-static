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
 * `socket.send(Price.createProposal())` to send price proposal to sever
 * `Price.display()` to display the price details returned from server
 */
var Price = (function () {
    'use strict';

    var typeDisplayIdMapping = {},
        bufferedIds = {},
        bufferRequests = {};

    var createProposal = function (typeOfContract) {
        var proposal = {proposal: 1}, underlying = document.getElementById('underlying'),
            submarket = document.getElementById('submarket'),
            contractType = typeOfContract,
            amountType = document.getElementById('amount_type'),
            currency = document.getElementById('currency'),
            payout = document.getElementById('amount'),
            startTime = document.getElementById('date_start'),
            expiryType = document.getElementById('expiry_type'),
            duration = document.getElementById('duration_amount'),
            durationUnit = document.getElementById('duration_units'),
            endDate = document.getElementById('expiry_date'),
            endTime = document.getElementById('expiry_time'),
            barrier = document.getElementById('barrier'),
            highBarrier = document.getElementById('barrier_high'),
            lowBarrier = document.getElementById('barrier_low'),
            prediction = document.getElementById('prediction');

        if (payout && payout.value) {
            proposal['amount_val'] = payout.value;
        }
        if (amountType && amountType.value) {
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

        if (expiryType && expiryType.value === 'duration') {
            proposal['duration'] = duration.value;
            proposal['duration_unit'] = durationUnit.value;
        } else if (expiryType && expiryType.value === 'endtime') {
            proposal['date_expiry'] = moment.utc(endDate.value + " " + endTime.value).unix();
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

        if(prediction && isVisible(prediction)){
            proposal['barrier'] = prediction.value;
        }
        return proposal;
    };

    var display = function (details, contractType) {
        var proposal = details['proposal'];
        var params = details['echo_req'],
            id = proposal['id'],
            type = params['contract_type'] || typeDisplayIdMapping[id];

        if (params && Object.getOwnPropertyNames(params).length > 0) {
            typeDisplayIdMapping[id] = type;

            if (!bufferedIds.hasOwnProperty(id)) {
                bufferedIds[id] = moment().utc().unix();
            }

            if (!bufferRequests.hasOwnProperty(id)) {
                bufferRequests[id] = params;
            }
        }

        var position = contractTypeDisplayMapping(type);
        var container = document.getElementById('price_container_'+position);

        var h4 = container.getElementsByClassName('contract_heading')[0],
            amount = container.getElementsByClassName('contract_amount')[0],
            purchase = container.getElementsByClassName('purchase_button')[0],
            description = container.getElementsByClassName('contract_description')[0],
            comment = container.getElementsByClassName('price_comment')[0],
            error = container.getElementsByClassName('contract_error')[0];

        var display = type ? (contractType ? contractType[type] : '') : '';
        if (display) {
            h4.setAttribute('class', 'contract_heading ' + display.toLowerCase().replace(/ /g, '_'));
            h4.textContent = display;
        }

        if (proposal['ask_price']) {
            amount.textContent = currency.value + ' ' + proposal['ask_price'];
        }

        if (proposal['longcode']) {
            proposal['longcode'] = proposal['longcode'].replace(/\d+\.\d\d/,function(x){return '<b>'+x+'</b>';});
            description.innerHTML = proposal['longcode'];
        }

        if (details['error']){
            purchase.hide();
            comment.hide();
            error.show();
            error.textContent = details['error'].message;
        }
        else{
            purchase.show();
            comment.show();
            error.hide();
            displayCommentPrice(comment, currency.value, proposal['ask_price'], proposal['payout']);
            var oldprice = purchase.getAttribute('data-ask-price');
            if (oldprice) {
                displayPriceMovement(amount, oldprice, proposal['ask_price']);
            }
            purchase.setAttribute('data-purchase-id', id);
            purchase.setAttribute('data-ask-price', proposal['ask_price']);
            purchase.setAttribute('data-symbol', id);
            for(var key in bufferRequests[id]){
                if(key && key !== 'proposal'){
                    purchase.setAttribute('data-'+key, bufferRequests[id][key]);
                }
            }
        }
    };

    var clearMapping = function () {
        typeDisplayIdMapping = {};
    };

    return {
        proposal: createProposal,
        display: display,
        clearMapping: clearMapping,
        idDisplayMapping: function () { return typeDisplayIdMapping; },
        bufferedIds: function () { return bufferedIds; }
    };

})();
