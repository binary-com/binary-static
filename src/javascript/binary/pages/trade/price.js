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
        bufferedIds = {};

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
            lowBarrier = document.getElementById('barrier_low');

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

        return proposal;
    };

    var display = function (details, contractType) {
        var proposal = details['proposal'];
        var params = details['echo_req'],
            id = proposal['id'],
            type = params['contract_type'] || typeDisplayIdMapping[id],
            h4 = document.createElement('h4'),
            row = document.createElement('div'),
            para = document.createElement('p'),
            description = row.cloneNode(),
            fragment = document.createDocumentFragment();

        if (params && Object.getOwnPropertyNames(params).length > 0) {
            typeDisplayIdMapping[id] = type;

            if (!bufferedIds.hasOwnProperty(id)) {
                bufferedIds[id] = moment().utc().unix();
            }
        }

        var position = contractTypeDisplayMapping(type),
            container = document.getElementById('price_description_' + position),
            description_container = document.getElementById('description_container_' + position),
            purchase = document.getElementById('contract_purchase_' + position),
            amount = document.createElement('div'),
            currency = document.getElementById('currency');

        var display = type ? (contractType ? contractType[type] : '') : '';

        while (description_container && description_container.firstChild) {
            description_container.removeChild(description_container.firstChild);
        }

        if (display) {
            h4.setAttribute('class', 'contract_heading ' + display.toLowerCase().replace(/ /g, '_'));
        }

        h4.setAttribute('id', 'contract_heading_' + position);

        description.setAttribute('class', 'contract_description big-col');
        description.setAttribute('id', 'contract_description_' + position);
        row.setAttribute('class', 'row');

        var content = document.createTextNode(display);
        h4.appendChild(content);
        fragment.appendChild(h4);

        var span = document.createElement('span');
        if (proposal['ask_price']) {
            amount.setAttribute('class', 'contract_amount col');
            span.setAttribute('id', 'contract_amount_' + position);
            content = document.createTextNode(currency.value + ' ' + proposal['ask_price']);
            span.appendChild(content);
            amount.appendChild(span);
        }

        if (proposal['longcode']) {
            content = document.createTextNode(proposal['longcode']);
            description.appendChild(content);
            row.appendChild(amount);
        }

        if (details['error'] || !document.getElementById('websocket_form').checkValidity()) {
            if (purchase) {
                purchase.style.display = 'none';
            }
            row.appendChild(description);
            fragment.appendChild(row);
            content = document.createTextNode(details['error']['message']);
            para.appendChild(content);
            para.setAttribute('class', 'notice-msg');
            fragment.appendChild(para);
        } else {
            displayCommentPrice('price_comment_' + position, currency.value, proposal['ask_price'], document.getElementById('amount').value);

            var priceId = document.getElementById('purchase_button_' + position);

            if (purchase) {
                purchase.style.display = 'block';
            }
            var oldprice = priceId.getAttribute('data-ask-price');
            if (oldprice) {
                displayPriceMovement(span, oldprice, proposal['ask_price']);
            }

            // create unique id object that is send in response
            priceId.setAttribute('data-purchase-id', id);
            priceId.setAttribute('data-ask-price', proposal['ask_price']);

            row.appendChild(amount);
            row.appendChild(description);
            fragment.appendChild(row);
        }

        if (description_container) {
            description_container.appendChild(fragment);
        }
        if (container) {
            container.insertBefore(description_container, purchase);
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
