const Contract              = require('./contract').Contract;
const Symbols               = require('./symbols').Symbols;
const Tick                  = require('./tick').Tick;
const WSTickDisplay         = require('./tick_trade').WSTickDisplay;
const Content               = require('../../common_functions/content').Content;
const isVisible             = require('../../common_functions/common_functions').isVisible;
const updatePurchaseStatus  = require('./common').updatePurchaseStatus;
const updateContractBalance = require('./common').updateContractBalance;

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const Purchase = (function () {
    'use strict';

    let purchase_data = {};

    const display = function (details) {
        purchase_data = details;

        const receipt = details.buy,
            passthrough        = details.echo_req.passthrough,
            container          = document.getElementById('contract_confirmation_container'),
            message_container  = document.getElementById('confirmation_message'),
            heading            = document.getElementById('contract_purchase_heading'),
            descr              = document.getElementById('contract_purchase_descr'),
            barrier_element    = document.getElementById('contract_purchase_barrier'),
            reference          = document.getElementById('contract_purchase_reference'),
            chart              = document.getElementById('tick_chart'),
            payout             = document.getElementById('contract_purchase_payout'),
            cost               = document.getElementById('contract_purchase_cost'),
            profit             = document.getElementById('contract_purchase_profit'),
            spots              = document.getElementById('contract_purchase_spots'),
            confirmation_error = document.getElementById('confirmation_error'),
            contracts_list     = document.getElementById('contracts_list'),
            button             = document.getElementById('contract_purchase_button');

        const error = details.error;
        const show_chart = !error && passthrough.duration <= 10 && passthrough.duration_unit === 't' && (sessionStorage.formname === 'risefall' || sessionStorage.formname === 'higherlower' || sessionStorage.formname === 'asian');

        contracts_list.style.display = 'none';

        if (error) {
            container.style.display = 'block';
            message_container.hide();
            confirmation_error.show();
            confirmation_error.innerHTML = error.message;
        } else {
            const guideBtn = document.getElementById('guideBtn');
            if (guideBtn) {
                guideBtn.style.display = 'none';
            }
            container.style.display = 'table-row';
            message_container.show();
            confirmation_error.hide();

            heading.textContent = Content.localize().textContractConfirmationHeading;
            descr.textContent = receipt.longcode;
            if (barrier_element) barrier_element.textContent = '';
            reference.textContent = Content.localize().textContractConfirmationReference + ' ' + receipt.transaction_id;

            let payout_value,
                cost_value;

            if (passthrough.basis === 'payout') {
                payout_value = passthrough.amount;
                cost_value = passthrough['ask-price'];
            } else {
                cost_value = passthrough.amount;
                payout_value = receipt.payout;
            }
            const profit_value = Math.round((payout_value - cost_value) * 100) / 100;

            if (sessionStorage.getItem('formname') === 'spreads') {
                payout.innerHTML = Content.localize().textStopLoss + ' <p>' + receipt.stop_loss_level + '</p>';
                cost.innerHTML = Content.localize().textAmountPerPoint + ' <p>' + receipt.amount_per_point + '</p>';
                profit.innerHTML = Content.localize().textStopProfit + ' <p>' + receipt.stop_profit_level + '</p>';
            } else {
                payout.innerHTML = Content.localize().textContractConfirmationPayout + ' <p>' + payout_value + '</p>';
                cost.innerHTML = Content.localize().textContractConfirmationCost + ' <p>' + cost_value + '</p>';
                profit.innerHTML = Content.localize().textContractConfirmationProfit + ' <p>' + profit_value + '</p>';
            }

            updateContractBalance(receipt.balance_after);

            if (show_chart) {
                chart.show();
            } else {
                chart.hide();
            }

            if (Contract.form() === 'digits') {
                spots.textContent = '';
                spots.className = '';
                spots.show();
            } else {
                spots.hide();
            }

            if (Contract.form() !== 'digits' && !show_chart) {
                button.textContent = Content.localize().textContractConfirmationButton;
                button.setAttribute('contract_id', receipt.contract_id);
                button.show();
                $('.open_contract_detailsws').attr('contract_id', receipt.contract_id).removeClass('invisible');
            } else {
                button.hide();
                $('.open_contract_detailsws').addClass('invisible');
            }
        }

        if (show_chart) {
            let contract_sentiment;
            if (passthrough.contract_type === 'CALL' || passthrough.contract_type === 'ASIANU') {
                contract_sentiment = 'up';
            } else {
                contract_sentiment = 'down';
            }

            // calculate number of decimals needed to display tick-chart according to the spot
            // value of the underlying
            let decimal_points = 2;
            const tick_spots = Tick.spots();
            const tick_spot_epochs = Object.keys(tick_spots);
            if (tick_spot_epochs.length > 0) {
                const last_quote = tick_spots[tick_spot_epochs[0]].toString();

                if (last_quote.indexOf('.') !== -1) {
                    decimal_points = last_quote.split('.')[1].length;
                }
            }

            let barrier;
            if (sessionStorage.getItem('formname') === 'higherlower') {
                barrier = passthrough.barrier;
            }

            WSTickDisplay.initialize({
                symbol              : passthrough.symbol,
                barrier             : barrier,
                number_of_ticks     : passthrough.duration,
                previous_tick_epoch : receipt.start_time,
                contract_category   : sessionStorage.getItem('formname') === 'asian' ? 'asian' : 'callput',
                display_symbol      : Symbols.getName(passthrough.symbol),
                contract_start      : receipt.start_time,
                display_decimals    : decimal_points,
                contract_sentiment  : contract_sentiment,
                price               : passthrough['ask-price'],
                payout              : receipt.payout,
                show_contract_result: 1,
                width               : $('#confirmation_message').width(),
            });
            WSTickDisplay.spots_list = {};
        }
    };

    const update_spot_list = function() {
        if ($('#contract_purchase_spots:hidden').length) {
            return;
        }

        let duration = purchase_data.echo_req && purchase_data.echo_req.passthrough ?
                        purchase_data.echo_req.passthrough.duration : null;

        if (!duration) {
            return;
        }

        const spots = document.getElementById('contract_purchase_spots');
        const spots2 = Tick.spots();
        const epoches = Object.keys(spots2).sort(function(a, b) { return a - b; });
        if (spots) spots.textContent = '';

        let last_digit;
        const replace = function(d) { last_digit = d; return '<b>' + d + '</b>'; };
        for (let s = 0; s < epoches.length; s++) {
            const tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]],
            };

            if (isVisible(spots) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time) {
                const fragment = document.createElement('div');
                fragment.classList.add('row');

                const el1 = document.createElement('div');
                el1.classList.add('col');
                el1.textContent = Content.localize().textTickResultLabel + ' ' + (spots.getElementsByClassName('row').length + 1);
                fragment.appendChild(el1);

                const el2 = document.createElement('div');
                el2.classList.add('col');
                const date = new Date(tick_d.epoch * 1000);
                const hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
                const minutes = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
                const seconds = date.getUTCSeconds() < 10 ? '0' + date.getUTCSeconds() : date.getUTCSeconds();
                el2.textContent = hours + ':' + minutes + ':' + seconds;
                fragment.appendChild(el2);

                const tick = tick_d.quote.replace(/\d$/, replace);
                const el3 = document.createElement('div');
                el3.classList.add('col');
                el3.innerHTML = tick;
                fragment.appendChild(el3);

                spots.appendChild(fragment);
                spots.scrollTop = spots.scrollHeight;

                if (last_digit && duration === 1) {
                    let contract_status,
                        final_price,
                        pnl;
                    const pass_contract_type = purchase_data.echo_req.passthrough.contract_type,
                        pass_barrier       = purchase_data.echo_req.passthrough.barrier;

                    if (
                        (pass_contract_type === 'DIGITMATCH' && +last_digit === +pass_barrier) ||
                        (pass_contract_type === 'DIGITDIFF'  && +last_digit !== +pass_barrier) ||
                        (pass_contract_type === 'DIGITEVEN'  && +last_digit % 2 === 0) ||
                        (pass_contract_type === 'DIGITODD'   && +last_digit % 2) ||
                        (pass_contract_type === 'DIGITOVER'  && +last_digit > pass_barrier) ||
                        (pass_contract_type === 'DIGITUNDER' && +last_digit < pass_barrier)
                    ) {
                        spots.className = 'won';
                        final_price = $('#contract_purchase_payout').find('p').text();
                        pnl = $('#contract_purchase_cost').find('p').text();
                        contract_status = Content.localize().textContractStatusWon;
                    } else {
                        spots.className = 'lost';
                        final_price = 0;
                        pnl = -$('#contract_purchase_cost').find('p').text();
                        contract_status = Content.localize().textContractStatusLost;
                    }

                    updatePurchaseStatus(final_price, pnl, contract_status);
                }

                duration--;
                if (!duration) {
                    purchase_data.echo_req.passthrough.duration = 0;
                }
            }
        }
    };

    return {
        display         : display,
        update_spot_list: update_spot_list,
    };
})();

module.exports = {
    Purchase: Purchase,
};
