const moment              = require('moment');
const Client              = require('../../../base/client').Client;
const localize            = require('../../../base/localize').localize;
const toJapanTimeIfNeeded = require('../../../base/clock').Clock.toJapanTimeIfNeeded;
const addComma            = require('../../../common_functions/string_util').addComma;
const format_money        = require('../../../common_functions/currency_to_symbol').format_money;
const toTitleCase         = require('../../../common_functions/string_util').toTitleCase;

const Statement = (() => {
    'use strict';

    const getStatementData = (statement, currency, jp_client) => {
        const date_obj = new Date(statement.transaction_time * 1000),
            moment_obj = moment.utc(date_obj),
            date_str   = moment_obj.format('YYYY-MM-DD'),
            time_str   = moment_obj.format('HH:mm:ss') + ' GMT',
            payout  = parseFloat(statement.payout),
            amount  = parseFloat(statement.amount),
            balance = parseFloat(statement.balance_after);

        return {
            date   : jp_client ? toJapanTimeIfNeeded(statement.transaction_time) : date_str + '\n' + time_str,
            ref    : statement.transaction_id,
            payout : isNaN(payout) ? '-' : (jp_client ? format_money(currency, payout) : payout.toFixed(2)),
            action : toTitleCase(statement.action_type),
            amount : isNaN(amount) ? '-' : (jp_client ? format_money(currency, amount) : addComma(amount)),
            balance: isNaN(balance) ? '-' : (jp_client ? format_money(currency, balance) : addComma(balance)),
            desc   : statement.longcode.replace(/\n/g, '<br />'),
            id     : statement.contract_id,
            app_id : statement.app_id,
        };
    };

    const generateCSV = (all_data, jp_client) => {
        const columns  = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'],
            header     = ['Date', 'Reference ID', 'Potential Payout', 'Action', 'Description', 'Credit/Debit'].map(str => (localize(str))),
            currency = Client.get('currency');
        header.push(localize('Balance') + (jp_client || !currency ? '' : ' (' + currency + ')'));
        const sep = ',';
        let csv = [header.join(sep)];
        if (all_data && all_data.length > 0) {
            csv = csv.concat(
                all_data.map(function(data) {
                    return columns.map(function(key) {
                        // eslint-disable-next-line no-control-regex
                        return (data[key] ? data[key].replace(new RegExp(sep, 'g'), '').replace(new RegExp('\n|<br />', 'g'), ' ') : '');
                    }).join(sep);
                }));
        }
        return csv.join('\r\n');
    };

    return {
        getStatementData: getStatementData,
        generateCSV     : generateCSV,
    };
})();

module.exports = Statement;
