const Client           = require('../../../../../base/client');
const Table            = require('../../../../../common/attach_dom/table');
const jpClient         = require('../../../../../common/country_base').jpClient;
const formatMoney      = require('../../../../../common/currency').formatMoney;
const elementInnerHtml = require('../../../../../../_common/common_functions').elementInnerHtml;
const getElementById   = require('../../../../../../_common/common_functions').getElementById;
const localize         = require('../../../../../../_common/localize').localize;
const urlForStatic     = require('../../../../../../_common/url').urlForStatic;
const findParent       = require('../../../../../../_common/utility').findParent;

const LimitsUI = (() => {
    const map = {
        atm                 : 'ATM',
        non_atm             : 'Non-ATM',
        less_than_seven_days: 'Duration up to 7 days',
        more_than_seven_days: 'Duration above 7 days',
    };

    let $client_limits,
        $gap_parent;

    const appendRowTable = (name, turnover_limit, padding, font_weight, insert_before) => {
        const $new_row = $('<tr/>', { class: 'flex-tr' })
            .append($('<td/>', { class: 'flex-tr-child', style: `padding-left: ${padding}; font-weight: ${font_weight};`, text: localize(map[name] || name) }))
            .append($('<td/>', { html: turnover_limit }));
        if (insert_before) {
            $new_row.insertBefore($gap_parent);
        } else {
            $client_limits.append($new_row);
        }
        if (name === 'atm') {
            addTooltip($new_row.find('td:first-child'), localize('Contracts where the barrier is the same as entry spot.'));
        } else if (name === 'non_atm') {
            addTooltip($new_row.find('td:first-child'), localize('Contracts where the barrier is different from the entry spot.'));
        }
    };

    const addTooltip = ($el, text) => {
        $el.append($('<a/>', { class: 'no-underline', href: `${'javascript:;'}`, 'data-balloon-length': 'xlarge', 'data-balloon': text })
            .append($('<img/>', { src: urlForStatic('images/common/question_1.png') })));
    };

    const fillLimitsTable = (limits) => {
        const currency = Client.get('currency');

        if (currency) {
            $('.limit').append(` (${currency})`);
        }

        const open_position       = getElementById('open-positions');
        const account_balance     = getElementById('account-balance');
        const payout              = getElementById('payout');
        const payout_per_contract = getElementById('payout-per-symbol-and-contract-type');

        $client_limits = $('#client-limits');
        $gap_parent    = $('#gap').parent();

        elementInnerHtml(open_position, limits.open_positions);
        elementInnerHtml(account_balance, formatMoney(currency, limits.account_balance, 1));
        elementInnerHtml(payout, formatMoney(currency, limits.payout, 1));
        elementInnerHtml(payout_per_contract, formatMoney(currency, limits.payout_per_symbol_and_contract_type, 1));

        if (limits.payout_per_symbol) {
            Object.keys(limits.payout_per_symbol).sort().forEach((key) => {
                if (typeof limits.payout_per_symbol[key] === 'object') {
                    appendRowTable(key, '', '25px', 'bold', true);
                    Object.keys(limits.payout_per_symbol[key]).sort().forEach((sub_key) => {
                        appendRowTable(sub_key, formatMoney(currency, limits.payout_per_symbol[key][sub_key], 1), '50px', 'normal', true);
                    });
                } else {
                    appendRowTable(key, formatMoney(currency, limits.payout_per_symbol[key], 1), '25px', 'bold', true);
                }
            });
        } else {
            const tr = findParent(getElementById('payout-per-symbol'), 'tr');
            if (tr) {
                tr.setVisibility(0);
            }
        }

        Object.keys(limits.market_specific).forEach((key) => {
            const object = limits.market_specific[key];
            if (object.length && object.length > 0) {
                appendRowTable(localize(key.charAt(0).toUpperCase() + key.slice(1)), '', 'auto', 'bold');
                Object.keys(object).forEach((c) => {
                    if (Client.get('residence') !== 'jp' || /Major Pairs/.test(object[c].name)) {
                        appendRowTable(object[c].name, object[c].turnover_limit !== 'null' ? formatMoney(currency, object[c].turnover_limit, 1) : 0, '25px', 'normal');
                    }
                });
            } else {
                appendRowTable(object.name, object.turnover_limit !== 'null' ? formatMoney(currency, object.turnover_limit, 1) : 0, 'auto', 'bold');
            }
        });

        const login_id = Client.get('loginid');
        if (login_id) {
            $('#trading-limits').prepend(`${login_id} - `);
            $('#withdrawal-title').prepend(`${login_id} - `);
        }
        $('#limits-title').setVisibility(1);
        if (!jpClient()) {
            $('#withdrawal-limits').setVisibility(1);
        }
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
