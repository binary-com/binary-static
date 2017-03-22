const Table    = require('../../../../../common_functions/attach_dom/table').Table;
const addComma = require('../../../../../common_functions/string_util').addComma;
const localize = require('../../../../../base/localize').localize;
const Client   = require('../../../../../base/client');
const elementTextContent  = require('../../../../../common_functions/common_functions').elementTextContent;

const LimitsUI = (() => {
    'use strict';

    let client_limits = '';

    const appendRowTable = (name, turnover_limit, padding, font_weight) => {
        client_limits.append('<tr class="flex-tr">' +
            '<td class="flex-tr-child" style="padding-left: ' + padding + '; font-weight: ' + font_weight + ';">' +
            localize(name) +
            '</td>' +
            '<td>' +
            turnover_limit +
            '</td>' +
            '</tr>');
    };

    const fillLimitsTable = (limits) => {
        const currency = Client.get('currency');

        if (currency) {
            $('.limit').append(' (' + currency + ')');
        }

        const open_position = document.getElementById('open-positions'),
            account_balance = document.getElementById('account-balance'),
            payout          = document.getElementById('payout'),
            payout_per      = document.getElementById('payout-per-symbol-and-contract-type');

        elementTextContent(open_position, addComma(limits.open_positions).split('.')[0]);
        elementTextContent(account_balance, addComma(limits.account_balance).split('.')[0]);
        elementTextContent(payout, addComma(limits.payout).split('.')[0]);
        elementTextContent(payout_per, addComma(limits.payout_per_symbol_and_contract_type).split('.')[0]);

        const market_specific = limits.market_specific;
        client_limits = $('#client-limits');
        Object.keys(market_specific).forEach(function (key) {
            const object = market_specific[key];
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
        const login_id =  Client.get('login_id');
        if (login_id) {
            $('#trading-limits').prepend(login_id + ' - ');
            $('#withdrawal-title').prepend(login_id + ' - ');
        }
        $('#withdrawal-limits, #limits-title').removeClass('invisible');
    };

    const clearTableContent = () =>  {
        Table.clearTableBody('client-limits');
    };

    return {
        clearTableContent: clearTableContent,
        fillLimitsTable  : fillLimitsTable,
    };
})();

module.exports = LimitsUI;
