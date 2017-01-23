const Table    = require('../../../../../common_functions/attach_dom/table').Table;
const addComma = require('../../../../../common_functions/string_util').addComma;
const localize = require('../../../../../base/localize').localize;
const Client   = require('../../../../../base/client').Client;
const elementTextContent  = require('../../../../../common_functions/common_functions').elementTextContent;

const LimitsUI = (function() {
    'use strict';

    let clientLimits = '';

    const appendRowTable = function(name, turnover_limit, padding, font_weight) {
        clientLimits.append('<tr class="flex-tr">' +
            '<td class="flex-tr-child" style="padding-left: ' + padding + '; font-weight: ' + font_weight + ';">' +
            localize(name) +
            '</td>' +
            '<td>' +
            turnover_limit +
            '</td>' +
            '</tr>');
    };

    const fillLimitsTable = function(limits) {
        const currency = Client.get('currency');

        if (currency) {
            $('.limit').append(' (' + currency + ')');
        }

        const openPosition   = document.getElementById('open-positions'),
            accountBalance = document.getElementById('account-balance'),
            payout         = document.getElementById('payout'),
            payoutPer      = document.getElementById('payout-per-symbol-and-contract-type');

        elementTextContent(openPosition, addComma(limits.open_positions).split('.')[0]);
        elementTextContent(accountBalance, addComma(limits.account_balance).split('.')[0]);
        elementTextContent(payout, addComma(limits.payout).split('.')[0]);
        elementTextContent(payoutPer, addComma(limits.payout_per_symbol_and_contract_type).split('.')[0]);

        const marketSpecific = limits.market_specific;
        clientLimits = $('#client-limits');
        Object.keys(marketSpecific).forEach(function (key) {
            const object = marketSpecific[key];
            if (object.length && object.length > 0) {
                appendRowTable(localize(key.charAt(0).toUpperCase() + key.slice(1)), '', 'auto', 'bold');
                Object.keys(object).forEach(function (c) {
                    if (Client.get('residence') !== 'jp' || /Major Pairs/.test(object[c].name)) {
                        appendRowTable(object[c].name, object[c].turnover_limit !== 'null' ? addComma(object[c].turnover_limit).split('.')[0] : 0, '25px', 'normal');
                    }
                });
            } else {
                appendRowTable(object.name, object.turnover_limit !== 'null' ? addComma(object.turnover_limit).split('.')[0] : 0, 'auto', 'bold');
            }
        });
        const loginId =  Client.get('loginid');
        if (loginId) {
            $('#trading-limits').prepend(loginId + ' - ');
            $('#withdrawal-title').prepend(loginId + ' - ');
        }
        $('#withdrawal-limits, #limits-title').removeClass('invisible');
    };

    const clearTableContent = function() {
        Table.clearTableBody('client-limits');
    };

    return {
        clearTableContent: clearTableContent,
        fillLimitsTable  : fillLimitsTable,
    };
})();

module.exports = {
    LimitsUI: LimitsUI,
};
