import Client from '../../base/client';
import { localize } from '../../base/localize';
import { formatMoney } from '../../common_functions/currency_to_symbol';
import { addComma } from '../../common_functions/string_util';

const updatePurchaseStatus = (final_price, pnl, contract_status) => {
    $('#contract_purchase_heading').text(localize(contract_status));
    const $payout = $('#contract_purchase_payout');
    const $cost = $('#contract_purchase_cost');
    const $profit = $('#contract_purchase_profit');

    $payout.html($('<div/>', { text: localize('Buy price') }).append($('<p/>', { text: addComma(Math.abs(pnl)) })));
    $cost.html($('<div/>', { text: localize('Final price') }).append($('<p/>', { text: addComma(final_price) })));
    if (!final_price) {
        $profit.html($('<div/>', { text: localize('Loss') }).append($('<p/>', { text: addComma(pnl) })));
    } else {
        $profit.html(
            $('<div/>', { text: localize('Profit') }).append(
                $('<p/>', {
                    text: addComma(Math.round((final_price - pnl) * 100) / 100),
                }),
            ),
        );
        updateContractBalance(Client.get('balance'));
    }
};

const updateContractBalance = (balance) => {
    $('#contract_purchase_balance').text(
        `${localize('Account balance:')} ${formatMoney(Client.get('currency'), balance)}`,
    );
};

module.exports = {
    updatePurchaseStatus : updatePurchaseStatus,
    updateContractBalance: updateContractBalance,
};
