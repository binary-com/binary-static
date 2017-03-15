const getStartDateNode           = require('./common_independent').getStartDateNode;
const Content                    = require('../../common_functions/content').Content;
const format_money               = require('../../common_functions/currency_to_symbol').format_money;
const moment                     = require('moment');
const contractTypeDisplayMapping = require('./common').contractTypeDisplayMapping;
const resetPriceMovement         = require('./common').resetPriceMovement;
const displayCommentPrice        = require('./common').displayCommentPrice;
const displayCommentSpreads      = require('./common').displayCommentSpreads;
const showPriceOverlay           = require('./common').showPriceOverlay;
const displayPriceMovement       = require('./common_independent').displayPriceMovement;
const getTradingTimes            = require('./common_independent').getTradingTimes;
const Contract                   = require('./contract').Contract;
const Defaults                   = require('./defaults').Defaults;
const isVisible                  = require('../../common_functions/common_functions').isVisible;
const localize                   = require('../../base/localize').localize;
const elementTextContent         = require('../../common_functions/common_functions').elementTextContent;

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
const Price = (function() {
    'use strict';

    let typeDisplayIdMapping = {},
        form_id = 0;

    const createProposal = function(typeOfContract) {
        const proposal = {
            proposal : 1,
            subscribe: 1,
        };
        const underlying = document.getElementById('underlying'),
            contractType = typeOfContract,
            amountType = document.getElementById('amount_type'),
            currency = document.getElementById('currency'),
            payout = document.getElementById('amount'),
            startTime = getStartDateNode(),
            expiryType = document.getElementById('expiry_type'),
            duration = document.getElementById('duration_amount'),
            durationUnit = document.getElementById('duration_units'),
            endDate = document.getElementById('expiry_date'),
            barrier = document.getElementById('barrier'),
            highBarrier = document.getElementById('barrier_high'),
            lowBarrier = document.getElementById('barrier_low'),
            prediction = document.getElementById('prediction'),
            amountPerPoint = document.getElementById('amount_per_point'),
            stopType = document.querySelector('input[name="stop_type"]:checked'),
            stopLoss = document.getElementById('stop_loss'),
            stopProfit = document.getElementById('stop_profit');

        if (payout && isVisible(payout) && payout.value) {
            proposal.amount = parseFloat(payout.value);
        }

        if (amountType && isVisible(amountType) && amountType.value) {
            proposal.basis = amountType.value;
        }

        if (contractType) {
            proposal.contract_type = typeOfContract;
        }

        if (currency && (currency.value || currency.getAttribute('value'))) {
            proposal.currency = currency.value || currency.getAttribute('value');
        }

        if (underlying && underlying.value) {
            proposal.symbol = underlying.value;
        }

        if (startTime && isVisible(startTime) && startTime.value !== 'now') {
            proposal.date_start = startTime.value;
        }

        if (expiryType && isVisible(expiryType) && expiryType.value === 'duration') {
            proposal.duration = parseInt(duration.value);
            proposal.duration_unit = durationUnit.value;
        } else if (expiryType && isVisible(expiryType) && expiryType.value === 'endtime') {
            const endDate2 = endDate.getAttribute('data-value');
            let endTime2 = Defaults.get('expiry_time');
            if (!endTime2) {
                const trading_times = getTradingTimes();
                if (trading_times.hasOwnProperty(endDate2) && typeof trading_times[endDate2][underlying.value] === 'object' && trading_times[endDate2][underlying.value].length && trading_times[endDate2][underlying.value][0] !== '--') {
                    if (trading_times[endDate2][underlying.value].length > 1) {
                        endTime2 = trading_times[endDate2][underlying.value][1];
                    } else {
                        endTime2 = trading_times[endDate2][underlying.value];
                    }
                }
            }

            proposal.date_expiry = moment.utc(endDate2 + ' ' + endTime2).unix();
            // For stopping tick trade behaviour
            proposal.duration_unit = 'm';
        }

        if (barrier && isVisible(barrier) && barrier.value) {
            proposal.barrier = barrier.value;
        }

        if (highBarrier && isVisible(highBarrier) && highBarrier.value) {
            proposal.barrier = highBarrier.value;
        }

        if (lowBarrier && isVisible(lowBarrier) && lowBarrier.value) {
            proposal.barrier2 = lowBarrier.value;
        }

        if (prediction && isVisible(prediction)) {
            proposal.barrier = parseInt(prediction.value);
        }

        if (amountPerPoint && isVisible(amountPerPoint)) {
            proposal.amount_per_point = parseFloat(amountPerPoint.value);
        }

        if (stopType && isVisible(stopType)) {
            proposal.stop_type = stopType.value;
        }

        if (stopLoss && isVisible(stopLoss)) {
            proposal.stop_loss = parseFloat(stopLoss.value);
        }

        if (stopProfit && isVisible(stopProfit)) {
            proposal.stop_profit = parseFloat(stopProfit.value);
        }

        if (contractType) {
            proposal.contract_type = typeOfContract;
        }

        proposal.passthrough = {
            form_id: form_id,
        };

        resetPriceMovement();

        return proposal;
    };

    const display = function(details, contractType) {
        const proposal = details.proposal;
        const id = proposal ? proposal.id : '';
        const params = details.echo_req;

        let type = params.contract_type;
        if (id && !type) {
            type = typeDisplayIdMapping[id];
        }

        let is_spread = false;
        if (params.contract_type && (params.contract_type === 'SPREADU' || params.contract_type === 'SPREADD')) {
            is_spread = true;
        }

        if (params && id && Object.getOwnPropertyNames(params).length > 0) {
            typeDisplayIdMapping[id] = type;
        }

        const position = contractTypeDisplayMapping(type);

        if (!position) {
            return;
        }

        const container = document.getElementById('price_container_' + position);
        if (!container) return;
        if (!$(container).is(':visible')) {
            $(container).fadeIn(200);
        }

        const h4 = container.getElementsByClassName('contract_heading')[0],
            amount = container.getElementsByClassName('contract_amount')[0],
            payoutAmount = container.getElementsByClassName('contract_payout')[0],
            stake = container.getElementsByClassName('stake')[0],
            payout = container.getElementsByClassName('payout')[0],
            purchase = container.getElementsByClassName('purchase_button')[0],
            description = container.getElementsByClassName('contract_description')[0],
            comment = container.getElementsByClassName('price_comment')[0],
            error = container.getElementsByClassName('contract_error')[0],
            currency = document.getElementById('currency');

        const display_text = type && contractType ? contractType[type] : '';
        if (display_text) {
            h4.setAttribute('class', 'contract_heading ' + type);
            if (is_spread) {
                if (position === 'top') {
                    elementTextContent(h4, Content.localize().textSpreadTypeLong);
                } else {
                    elementTextContent(h4, Content.localize().textSpreadTypeShort);
                }
            } else {
                elementTextContent(h4, display_text);
            }
        }

        const setData = function(data) {
            if (!data) return;
            if (data.display_value) {
                if (is_spread) {
                    $('.stake:visible').hide();
                    elementTextContent(amount, data.display_value);
                } else {
                    $('.stake:hidden').show();
                    elementTextContent(stake, localize('Stake') + ': ');
                    elementTextContent(amount, format_money((currency.value || currency.getAttribute('value')), data.display_value));
                }
                $('.stake_wrapper:hidden').show();
            } else {
                $('.stake_wrapper:visible').hide();
            }

            if (data.payout) {
                elementTextContent(payout, (is_spread ? localize('Payout/point') : localize('Payout')) + ': ');
                elementTextContent(payoutAmount, format_money((currency.value || currency.getAttribute('value')), data.payout));
                $('.payout_wrapper:hidden').show();
            } else {
                $('.payout_wrapper:visible').hide();
            }

            if (data.longcode && window.innerWidth > 500) {
                description.setAttribute('data-balloon', data.longcode);
            } else {
                description.removeAttribute('data-balloon');
            }
        };

        if (details.error) {
            purchase.hide();
            comment.hide();
            setData(details.error.details);
            error.show();
            elementTextContent(error, details.error.message);
        } else {
            setData(proposal);
            if ($('#websocket_form').find('.error-field:visible').length > 0) {
                purchase.hide();
            } else {
                purchase.show();
            }
            comment.show();
            error.hide();
            if (is_spread) {
                displayCommentSpreads(comment, (currency.value || currency.getAttribute('value')), proposal.spread);
            } else {
                displayCommentPrice(comment, (currency.value || currency.getAttribute('value')), proposal.ask_price, proposal.payout);
            }
            const oldprice = purchase.getAttribute('data-display_value'),
                oldpayout = purchase.getAttribute('data-payout');
            displayPriceMovement(amount, oldprice, proposal.display_value);
            displayPriceMovement(payoutAmount, oldpayout, proposal.payout);
            purchase.setAttribute('data-purchase-id', id);
            purchase.setAttribute('data-ask-price', proposal.ask_price);
            purchase.setAttribute('data-display_value', proposal.display_value);
            purchase.setAttribute('data-payout', proposal.payout);
            purchase.setAttribute('data-symbol', id);
            Object.keys(params).forEach(function(key) {
                if (key && key !== 'proposal') {
                    purchase.setAttribute('data-' + key, params[key]);
                }
            });
        }
    };

    const clearMapping = function() {
        typeDisplayIdMapping = {};
    };

    const clearFormId = function() {
        form_id = 0;
    };

    /*
     * Function to request for cancelling the current price proposal
     */
    const processForgetProposals = function() {
        showPriceOverlay();
        BinarySocket.send({
            forget_all: 'proposal',
        });
        Price.clearMapping();
    };

    /*
     * Function to process and calculate price based on current form
     * parameters or change in form parameters
     */
    const processPriceRequest = function() {
        Price.incrFormId();
        processForgetProposals();
        showPriceOverlay();
        let types = Contract.contractType()[Contract.form()];
        if (Contract.form() === 'digits') {
            switch (sessionStorage.getItem('formname')) {
                case 'matchdiff':
                    types = {
                        DIGITMATCH: 1,
                        DIGITDIFF : 1,
                    };
                    break;
                case 'evenodd':
                    types = {
                        DIGITEVEN: 1,
                        DIGITODD : 1,
                    };
                    break;
                case 'overunder':
                    types = {
                        DIGITOVER : 1,
                        DIGITUNDER: 1,
                    };
                    break;
                default:
                    break;
            }
        }
        Object.keys(types).forEach(function(typeOfContract) {
            if (types.hasOwnProperty(typeOfContract)) {
                BinarySocket.send(Price.proposal(typeOfContract));
            }
        });
    };

    return {
        proposal        : createProposal,
        display         : display,
        clearMapping    : clearMapping,
        clearFormId     : clearFormId,
        idDisplayMapping: function() {
            return typeDisplayIdMapping;
        },
        getFormId: function() {
            return form_id;
        },
        incrFormId: function() {
            form_id++;
        },
        processForgetProposals: processForgetProposals,
        processPriceRequest   : processPriceRequest,
    };
})();

module.exports = {
    Price: Price,
};
