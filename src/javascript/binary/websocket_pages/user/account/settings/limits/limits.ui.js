var Table          = require('../../../../../common_functions/attach_dom/table').Table;
var addComma       = require('../../../../../common_functions/string_util').addComma;

var LimitsUI = (function() {
    'use strict';

    var clientLimits = '';
    function fillLimitsTable(limits) {
        var currency = TUser.get().currency;

        if (currency) {
            $('.limit').append(' (' + currency + ')');
        }

        var openPosition   = document.getElementById('open-positions'),
            accountBalance = document.getElementById('account-balance'),
            payout         = document.getElementById('payout'),
            payoutPer      = document.getElementById('payout-per-symbol-and-contract-type');

        openPosition.textContent   = addComma(limits.open_positions).split('.')[0];
        accountBalance.textContent = addComma(limits.account_balance).split('.')[0];
        payout.textContent         = addComma(limits.payout).split('.')[0];
        payoutPer.textContent      = addComma(limits.payout_per_symbol_and_contract_type).split('.')[0];

        var marketSpecific = limits.market_specific;
        clientLimits = $('#client-limits');
        Object.keys(marketSpecific).forEach(function (key) {
            var object = marketSpecific[key];
            if (object.length && object.length > 0) {
                appendRowTable(page.text.localize(key.charAt(0).toUpperCase() + key.slice(1)), '', 'auto', 'bold');
                Object.keys(object).forEach(function (c) {
                    if (page.client.residence !== 'jp' || /Major Pairs/.test(object[c].name)) {
                        appendRowTable(object[c].name, object[c].turnover_limit !== 'null' ? addComma(object[c].turnover_limit).split('.')[0] : 0, '25px', 'normal');
                    }
                });
            } else {
                appendRowTable(object.name, object.turnover_limit !== 'null' ? addComma(object.turnover_limit).split('.')[0] : 0, 'auto', 'bold');
            }
        });
        var loginId = page.client.loginid;
        if (loginId) {
            $('#trading-limits').prepend(loginId + ' - ');
            $('#withdrawal-title').prepend(loginId + ' - ');
        }
        $('#withdrawal-limits, #limits-title').removeClass('invisible');
    }

    function appendRowTable(name, turnover_limit, padding, font_weight) {
        clientLimits.append('<tr class="flex-tr">' +
                                '<td class="flex-tr-child" style="padding-left: ' + padding + '; font-weight: ' + font_weight + ';">' +
                                    page.text.localize(name) +
                                '</td>' +
                                '<td>' +
                                    turnover_limit +
                                '</td>' +
                            '</tr>');
    }

    function clearTableContent() {
        Table.clearTableBody('client-limits');
    }

    return {
        clearTableContent: clearTableContent,
        fillLimitsTable  : fillLimitsTable,
    };
})();

module.exports = {
    LimitsUI: LimitsUI,
};
