const Client      = require('../../base/client');
const localize    = require('../../base/localize').localize;
const formatMoney = require('../../common_functions/currency_to_symbol').formatMoney;

const updatePurchaseStatus = (final_price, pnl, contract_status) => {
    $('#contract_purchase_heading').text(localize(contract_status));
    const $payout = $('#contract_purchase_payout');
    const $cost   = $('#contract_purchase_cost');
    const $profit = $('#contract_purchase_profit');
    const currency = Client.get('currency');

    $payout.html($('<div/>', { text: localize('Buy price') }).append($('<p/>', { text: formatMoney(currency, Math.abs(pnl), 1) })));
    $cost.html($('<div/>', { text: localize('Final price') }).append($('<p/>', { text: formatMoney(currency, final_price, 1) })));
    if (!final_price) {
        $profit.html($('<div/>', { text: localize('Loss') }).append($('<p/>', { text: formatMoney(currency, pnl, 1) })));
    } else {
        $profit.html($('<div/>', { text: localize('Profit') }).append($('<p/>', { text: formatMoney(currency, Math.round((final_price - pnl) * 100) / 100, 1) })));
        updateContractBalance(Client.get('balance'));
    }
};

const updateContractBalance = (balance) => {
    $('#contract_purchase_balance').text(`${localize('Account balance:')} ${formatMoney(Client.get('currency'), balance)}`);
};

module.exports = {
    updatePurchaseStatus : updatePurchaseStatus,
    updateContractBalance: updateContractBalance,
};
