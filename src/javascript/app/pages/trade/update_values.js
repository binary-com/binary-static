const Client      = require('../../base/client');
const formatMoney = require('../../common/currency').formatMoney;
const localize    = require('../../../_common/localize').localize;

const updatePurchaseStatus = (final_price, pnl, profit, contract_status, contract_category) => {
    $('#contract_purchase_heading').text(localize(contract_status));
    const $payout  = $('#contract_purchase_payout');
    const $cost    = $('#contract_purchase_cost');
    const $profit  = $('#contract_purchase_profit');
    const currency = Client.get('currency');

    $payout.html($('<div/>', { text: localize('Buy price') }).append($('<p/>', { html: formatMoney(currency, Math.abs(pnl)) })));
    $cost.html($('<div/>', { text: localize('Final price') }).append($('<p/>', { html: formatMoney(currency, final_price) })));
    if (!final_price) {
        $profit.html($('<div/>', { text: localize('Loss') }).append($('<p/>', { html: formatMoney(currency, pnl) })));
    } else {
        $profit.html($('<div/>', { text: localize('Profit') }).append($('<p/>', { html: formatMoney(currency, profit) })));
        if (contract_category === 'lookback') {
            $profit
                .removeClass('invisible')
                .html($('<div/>', { text: profit < 0 ? localize('Loss') : localize('Profit') })
                .append($('<p/>', { html: formatMoney(currency, profit), class: profit < 0 ? 'loss' : 'profit' })));
        }
        updateContractBalance(Client.get('balance'));
    }
};

const updateContractBalance = (balance) => {
    $('#contract_purchase_balance').html(`${localize('Account balance:')} ${formatMoney(Client.get('currency'), balance)}`);
};

const updateContractProfit = (profit) => {
    $('#contract_purchase_profit')
        .removeClass('invisible')
        .html(`${localize('Profit/Loss')}<p>${formatMoney(Client.get('currency'), profit)}</p>`);
};

module.exports = {
    updatePurchaseStatus,
    updateContractBalance,
    updateContractProfit,
};
