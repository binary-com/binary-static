const Contract           = require('./contract');
const Symbols            = require('./symbols');
const Tick               = require('./tick');
const TickDisplay        = require('./tick_trade');
const updateValues       = require('./update_values');
const Client             = require('../../base/client');
const localize           = require('../../base/localize').localize;
const urlFor             = require('../../base/url').urlFor;
const createElement      = require('../../base/utility').createElement;
const getPropertyValue   = require('../../base/utility').getPropertyValue;
const elementInnerHtml   = require('../../common_functions/common_functions').elementInnerHtml;
const elementTextContent = require('../../common_functions/common_functions').elementTextContent;
const isVisible          = require('../../common_functions/common_functions').isVisible;
const formatMoney        = require('../../common_functions/currency').formatMoney;
const padLeft            = require('../../common_functions/string_util').padLeft;
const BinarySocket       = require('../../websocket_pages/socket');

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const Purchase = (() => {
    let purchase_data = {};

    let payout_value,
        cost_value,
        status;

    const display = (details) => {
        purchase_data = details;
        status        = '';

        const receipt            = details.buy;
        const passthrough        = details.echo_req.passthrough;
        const container          = document.getElementById('contract_confirmation_container');
        const message_container  = document.getElementById('confirmation_message');
        const heading            = document.getElementById('contract_purchase_heading');
        const descr              = document.getElementById('contract_purchase_descr');
        const barrier_element    = document.getElementById('contract_purchase_barrier');
        const reference          = document.getElementById('contract_purchase_reference');
        const chart              = document.getElementById('tick_chart');
        const payout             = document.getElementById('contract_purchase_payout');
        const cost               = document.getElementById('contract_purchase_cost');
        const profit             = document.getElementById('contract_purchase_profit');
        const spots              = document.getElementById('contract_purchase_spots');
        const confirmation_error = document.getElementById('confirmation_error');
        const contracts_list     = document.getElementById('contracts_list');
        const button             = document.getElementById('contract_purchase_button');

        const error      = details.error;
        const show_chart = !error && passthrough.duration <= 10 && passthrough.duration_unit === 't' && (sessionStorage.formname === 'risefall' || sessionStorage.formname === 'higherlower' || sessionStorage.formname === 'asian');

        contracts_list.style.display = 'none';

        if (error) {
            container.style.display = 'block';
            message_container.hide();
            confirmation_error.show();
            let message = error.message;
            if (/RestrictedCountry/.test(error.code)) {
                let additional_message = '';
                if (/FinancialBinaries/.test(error.code)) {
                    additional_message = localize('Try our [_1]Volatility Indices[_2].', [`<a href="${urlFor('get-started/volidx-markets')}" >`, '</a>']);
                } else if (/Random/.test(error.code)) {
                    additional_message = localize('Try our other markets.');
                }
                message = `${error.message}. ${additional_message}`;
            }
            elementInnerHtml(confirmation_error, message);
        } else {
            const guide_btn = document.getElementById('guideBtn');
            if (guide_btn) {
                guide_btn.style.display = 'none';
            }
            container.style.display = 'table-row';
            message_container.show();
            confirmation_error.hide();

            elementTextContent(heading, localize('Contract Confirmation'));
            elementTextContent(descr, receipt.longcode);
            if (barrier_element) barrier_element.textContent = '';
            elementTextContent(reference, `${localize('Your transaction reference is')} ${receipt.transaction_id}`);

            const currency = Client.get('currency');

            if (passthrough.basis === 'payout') {
                payout_value = passthrough.amount;
                cost_value   = passthrough['ask-price'];
            } else {
                cost_value   = passthrough.amount;
                payout_value = receipt.payout;
            }
            const profit_value = formatMoney(currency, payout_value - cost_value);

            elementInnerHtml(payout, `${localize('Potential Payout')} <p>${formatMoney(currency, payout_value)}</p>`);
            elementInnerHtml(cost,   `${localize('Total Cost')} <p>${formatMoney(currency, cost_value)}</p>`);
            elementInnerHtml(profit, `${localize('Potential Profit')} <p>${profit_value}</p>`);

            updateValues.updateContractBalance(receipt.balance_after);

            if (show_chart) {
                chart.show();
            } else {
                chart.hide();
            }

            if (Contract.form() === 'digits') {
                elementTextContent(spots, '');
                spots.className = '';
                spots.show();
            } else {
                spots.hide();
            }

            if (Contract.form() !== 'digits' && !show_chart) {
                elementTextContent(button, localize('View'));
                button.setAttribute('contract_id', receipt.contract_id);
                button.show();
                $('.open_contract_details').attr('contract_id', receipt.contract_id).setVisibility(1);
            } else {
                button.hide();
                $('.open_contract_details').setVisibility(0);
            }
        }

        if (show_chart) {
            // calculate number of decimals needed to display tick-chart according to the spot
            // value of the underlying
            let decimal_points     = 2;
            const tick_spots       = Tick.spots();
            const tick_spot_epochs = Object.keys(tick_spots);
            if (tick_spot_epochs.length > 0) {
                const last_quote = tick_spots[tick_spot_epochs[0]].toString();

                if (last_quote.indexOf('.') !== -1) {
                    decimal_points = last_quote.split('.')[1].length;
                }
            }

            TickDisplay.init({
                symbol              : passthrough.symbol,
                barrier             : sessionStorage.getItem('formname') === 'higherlower' ? passthrough.barrier : undefined,
                number_of_ticks     : passthrough.duration,
                previous_tick_epoch : receipt.start_time,
                contract_category   : sessionStorage.getItem('formname') === 'asian' ? 'asian' : 'callput',
                display_symbol      : Symbols.getName(passthrough.symbol),
                contract_start      : receipt.start_time,
                display_decimals    : decimal_points,
                price               : passthrough['ask-price'],
                payout              : receipt.payout,
                show_contract_result: 1,
                width               : $('#confirmation_message').width(),
            });
            TickDisplay.resetSpots();

            const request = {
                proposal_open_contract: 1,
                contract_id           : receipt.contract_id,
                subscribe             : 1,
            };
            BinarySocket.send(request, { callback: (response) => {
                TickDisplay.setStatus(getPropertyValue(response, ['proposal_open_contract', 'status']));
            } });
        }
    };

    const updateSpotList = () => {
        let duration = +getPropertyValue(purchase_data, ['echo_req', 'passthrough', 'duration']);
        if ($('#contract_purchase_spots:hidden').length || !duration) {
            return;
        }

        const spots   = document.getElementById('contract_purchase_spots');
        const spots2  = Tick.spots();
        const epoches = Object.keys(spots2).sort((a, b) => a - b);
        if (spots) spots.textContent = '';

        if (!status) {
            const request = {
                proposal_open_contract: 1,
                contract_id           : purchase_data.buy.contract_id,
                subscribe             : 1,
            };
            BinarySocket.send(request, { callback: (response) => {
                status = getPropertyValue(response, ['proposal_open_contract', 'status']);
                if (status && status !== 'open') {
                    spots.className = status;
                    if (status === 'won') {
                        updateValues.updatePurchaseStatus(payout_value, cost_value, localize('This contract won'));
                    } else if (status === 'lost') {
                        updateValues.updatePurchaseStatus(0, -cost_value, localize('This contract lost'));
                    }
                }
            } });
        }

        const replace = d => `<strong>${d}</strong>`;
        for (let s = 0; s < epoches.length; s++) {
            const tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]],
            };

            if (isVisible(spots) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time) {
                const fragment = createElement('div', { class: 'row' });
                const el1      = createElement('div', { class: 'col', text: `${localize('Tick')} ${(spots.getElementsByClassName('row').length + 1)}` });
                fragment.appendChild(el1);

                const el2     = createElement('div', { class: 'col' });
                const date    = new Date(tick_d.epoch * 1000);
                const hours   = padLeft(date.getUTCHours(), 2, '0');
                const minutes = padLeft(date.getUTCMinutes(), 2, '0');
                const seconds = padLeft(date.getUTCSeconds(), 2, '0');
                elementTextContent(el2, [hours, minutes, seconds].join(':'));
                fragment.appendChild(el2);

                const tick = tick_d.quote.replace(/\d$/, replace);
                const el3  = createElement('div', { class: 'col' });
                elementInnerHtml(el3, tick);
                fragment.appendChild(el3);

                spots.appendChild(fragment);
                spots.scrollTop = spots.scrollHeight;

                duration--;
                if (!duration) {
                    purchase_data.echo_req.passthrough.duration = 0;
                }
            }
        }
    };

    return {
        display,
        updateSpotList,
    };
})();

module.exports = Purchase;
