const Contract           = require('./contract');
const getLookBackFormula = require('./lookback').getFormula;
const isLookback         = require('./lookback').isLookback;
const Symbols            = require('./symbols');
const Tick               = require('./tick');
const TickDisplay        = require('./tick_trade');
const updateValues       = require('./update_values');
const Client             = require('../../base/client');
const formatMoney        = require('../../common/currency').formatMoney;
const CommonFunctions    = require('../../../_common/common_functions');
const localize           = require('../../../_common/localize').localize;
const padLeft            = require('../../../_common/string_util').padLeft;
const urlFor             = require('../../../_common/url').urlFor;
const createElement      = require('../../../_common/utility').createElement;

/*
 * Purchase object that handles all the functions related to
 * contract purchase response
 */

const Purchase = (() => {
    let purchase_data = {};

    let payout_value,
        cost_value;

    const display = (details) => {
        purchase_data = details;

        const receipt            = details.buy;
        const passthrough        = details.echo_req.passthrough;
        const container          = CommonFunctions.getElementById('contract_confirmation_container');
        const message_container  = CommonFunctions.getElementById('confirmation_message');
        const heading            = CommonFunctions.getElementById('contract_purchase_heading');
        const descr              = CommonFunctions.getElementById('contract_purchase_descr');
        const barrier_element    = CommonFunctions.getElementById('contract_purchase_barrier');
        const reference          = CommonFunctions.getElementById('contract_purchase_reference');
        const chart              = CommonFunctions.getElementById('tick_chart');
        const payout             = CommonFunctions.getElementById('contract_purchase_payout');
        const cost               = CommonFunctions.getElementById('contract_purchase_cost');
        const profit             = CommonFunctions.getElementById('contract_purchase_profit');
        const spots              = CommonFunctions.getElementById('contract_purchase_spots');
        const confirmation_error = CommonFunctions.getElementById('confirmation_error');
        const contracts_list     = CommonFunctions.getElementById('contracts_list');
        const button             = CommonFunctions.getElementById('contract_purchase_button');

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
            CommonFunctions.elementInnerHtml(confirmation_error, message);
        } else {
            CommonFunctions.getElementById('guideBtn').style.display = 'none';
            container.style.display = 'table-row';
            message_container.show();
            confirmation_error.hide();

            CommonFunctions.elementTextContent(heading, localize('Contract Confirmation'));
            CommonFunctions.elementTextContent(descr, receipt.longcode);
            CommonFunctions.elementTextContent(barrier_element, '');
            CommonFunctions.elementTextContent(reference, `${localize('Your transaction reference is')} ${receipt.transaction_id}`);

            const currency = Client.get('currency');
            let formula, multiplier;
            const {contract_type} = passthrough;
            if (isLookback(contract_type)) {
                multiplier = formatMoney(currency, passthrough.amount, false, 3, 2);
                formula    = getLookBackFormula(contract_type, multiplier);
            }

            payout_value = +receipt.payout;
            cost_value   = receipt.buy_price;

            const profit_value = payout_value ? formatMoney(currency, payout_value - cost_value) : undefined;

            CommonFunctions.elementInnerHtml(cost,   `${localize('Total Cost')} <p>${formatMoney(currency, cost_value)}</p>`);
            if (isLookback(contract_type)) {
                CommonFunctions.elementInnerHtml(payout, `${localize('Potential Payout')} <p>${formula}</p>`);
                profit.setVisibility(0);
            } else {
                profit.setVisibility(1);
                CommonFunctions.elementInnerHtml(payout, `${localize('Potential Payout')} <p>${formatMoney(currency, payout_value)}</p>`);
                CommonFunctions.elementInnerHtml(profit, `${localize('Potential Profit')} <p>${profit_value}</p>`);
            }

            updateValues.updateContractBalance(receipt.balance_after);

            if (show_chart) {
                chart.show();
            } else {
                chart.hide();
            }

            if (Contract.form() === 'digits') {
                CommonFunctions.elementTextContent(spots, '');
                spots.className = '';
                spots.show();
            } else {
                spots.hide();
            }

            if (Contract.form() !== 'digits' && !show_chart) {
                CommonFunctions.elementTextContent(button, localize('View'));
                button.setAttribute('contract_id', receipt.contract_id);
                button.show();
                $('.open_contract_details').attr('contract_id', receipt.contract_id).setVisibility(1);
            } else {
                button.hide();
                $('.open_contract_details').setVisibility(0);
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
                contract_sentiment,
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
        }
    };

    const updateSpotList = () => {
        if ($('#contract_purchase_spots:hidden').length) {
            return;
        }

        let duration = purchase_data.echo_req && purchase_data.echo_req.passthrough ?
            purchase_data.echo_req.passthrough.duration : null;

        if (!duration) {
            return;
        }

        const spots   = CommonFunctions.getElementById('contract_purchase_spots');
        const spots2  = Tick.spots();
        const epoches = Object.keys(spots2).sort((a, b) => a - b);
        CommonFunctions.elementTextContent(spots, '');

        let last_digit;
        const replace = (d) => { last_digit = d; return `<strong>${d}</strong>`; };
        for (let s = 0; s < epoches.length; s++) {
            const tick_d = {
                epoch: epoches[s],
                quote: spots2[epoches[s]],
            };

            if (CommonFunctions.isVisible(spots) && tick_d.epoch && tick_d.epoch > purchase_data.buy.start_time) {
                const fragment = createElement('div', { class: 'row' });
                const el1      = createElement('div', { class: 'col', text: `${localize('Tick')} ${(spots.getElementsByClassName('row').length + 1)}` });
                fragment.appendChild(el1);

                const el2     = createElement('div', { class: 'col' });
                const date    = new Date(tick_d.epoch * 1000);
                const hours   = padLeft(date.getUTCHours(), 2, '0');
                const minutes = padLeft(date.getUTCMinutes(), 2, '0');
                const seconds = padLeft(date.getUTCSeconds(), 2, '0');
                CommonFunctions.elementTextContent(el2, [hours, minutes, seconds].join(':'));
                fragment.appendChild(el2);

                const tick = tick_d.quote.replace(/\d$/, replace);
                const el3  = createElement('div', { class: 'col' });
                CommonFunctions.elementInnerHtml(el3, tick);
                fragment.appendChild(el3);

                spots.appendChild(fragment);
                spots.scrollTop = spots.scrollHeight;

                if (last_digit && duration === 1) {
                    let contract_status,
                        final_price,
                        pnl;
                    const pass_contract_type = purchase_data.echo_req.passthrough.contract_type;
                    const pass_barrier       = purchase_data.echo_req.passthrough.barrier;

                    if (
                        (pass_contract_type === 'DIGITMATCH' && +last_digit === +pass_barrier) ||
                        (pass_contract_type === 'DIGITDIFF'  && +last_digit !== +pass_barrier) ||
                        (pass_contract_type === 'DIGITEVEN'  && +last_digit % 2 === 0) ||
                        (pass_contract_type === 'DIGITODD'   && +last_digit % 2) ||
                        (pass_contract_type === 'DIGITOVER'  && +last_digit > pass_barrier) ||
                        (pass_contract_type === 'DIGITUNDER' && +last_digit < pass_barrier)
                    ) {
                        spots.className = 'won';
                        final_price     = payout_value;
                        pnl             = cost_value;
                        contract_status = localize('This contract won');
                    } else {
                        spots.className = 'lost';
                        final_price     = 0;
                        pnl             = -cost_value;
                        contract_status = localize('This contract lost');
                    }

                    updateValues.updatePurchaseStatus(final_price, pnl, contract_status);
                }

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
