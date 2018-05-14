const Client           = require('../../../../../base/client');
const Table            = require('../../../../../common/attach_dom/table');
const formatMoney      = require('../../../../../common/currency').formatMoney;
const elementInnerHtml = require('../../../../../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../../../../../_common/common_functions').getElementById;
const localize         = require('../../../../../../_common/localize').localize;
const findParent       = require('../../../../../../_common/utility').findParent;

const LimitsUI = (() => {
    let $client_limits;

    // if we have value for td, set the value
    // if we don't, make the tr invisible
    const setText = (el, text) => {
        if (text) {
            elementInnerHtml(el, text);
        } else {
            const tr = findParent(el, 'tr');
            if (tr) {
                tr.setVisibility(0);
            }
        }
    };

    const appendRowTable = (name, turnover_limit, padding, font_weight) => {
        const $new_row = $('<tr/>', { class: 'flex-tr' })
            .append($('<td/>', { class: 'flex-tr-child', style: `padding-left: ${padding}; font-weight: ${font_weight};`, text: localize(name) }))
            .append($('<td/>', { html: turnover_limit }));
        $client_limits.append($new_row);
    };

    const fillLimitsTable = (limits) => {
        const currency = Client.get('currency');

        if (currency) {
            $('.limit').append(` (${currency})`);
        }

        const open_position   = getElementById('open-positions');
        const account_balance = getElementById('account-balance');
        const payout          = getElementById('payout');

        $client_limits = $('#client-limits');

        setText(open_position, 'open_positions' in limits ? limits.open_positions : '');
        setText(account_balance, 'account_balance' in limits ? formatMoney(currency, limits.account_balance, 1) : '');
        setText(payout, 'payout' in limits ? formatMoney(currency, limits.payout, 1) : '');

        if (limits.market_specific) {
            Object.keys(limits.market_specific).forEach((key) => {
                const object = limits.market_specific[key];
                if (object.length && object.length > 0) {
                    appendRowTable(localize(key.charAt(0).toUpperCase() + key.slice(1)), '', 'auto', 'bold');
                    Object.keys(object).forEach((c) => {
                        appendRowTable(object[c].name, object[c].turnover_limit !== 'null' ? formatMoney(currency, object[c].turnover_limit, 1) : 0, '25px', 'normal');
                    });
                } else {
                    appendRowTable(object.name, object.turnover_limit !== 'null' ? formatMoney(currency, object.turnover_limit, 1) : 0, 'auto', 'bold');
                }
            });
        } else {
            const tr = findParent(getElementById('market_specific'), 'tr');
            if (tr) {
                tr.setVisibility(0);
            }
        }

        const login_id = Client.get('loginid');
        if (login_id) {
            $('#trading-limits').prepend(`${login_id} - `);
            $('#withdrawal-title').prepend(`${login_id} - `);
        }
        $('#limits-title').setVisibility(1);
        $('#withdrawal-limits').setVisibility(1);
    };

    const clearTableContent = () => {
        Table.clearTableBody('client-limits');
    };

    return {
        clearTableContent,
        fillLimitsTable,
    };
})();

module.exports = LimitsUI;
