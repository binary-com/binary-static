var moment              = require('moment');
var toTitleCase         = require('../../../common_functions/string_util').toTitleCase,
    addComma            = require('../../../common_functions/string_util').addComma,
    format_money        = require('../../../common_functions/currency_to_symbol').format_money,
    toJapanTimeIfNeeded = require('../../../base/utility').toJapanTimeIfNeeded;

var Statement = (function() {
    'use strict';

    var getStatementData = function(statement, currency, jpClient) {
        var dateObj = new Date(statement.transaction_time * 1000),
            momentObj = moment.utc(dateObj),
            dateStr = momentObj.format('YYYY-MM-DD'),
            timeStr = momentObj.format('HH:mm:ss') + ' GMT',
            payout  = parseFloat(statement.payout),
            amount  = parseFloat(statement.amount),
            balance = parseFloat(statement.balance_after);

        var statement_data = {
            date   : jpClient ? toJapanTimeIfNeeded(statement.transaction_time) : dateStr + '\n' + timeStr,
            ref    : statement.transaction_id,
            payout : isNaN(payout) ? '-' : (jpClient ? format_money(currency, payout) : payout.toFixed(2)),
            action : toTitleCase(statement.action_type),
            amount : isNaN(amount) ? '-' : (jpClient ? format_money(currency, amount) : addComma(amount)),
            balance: isNaN(balance) ? '-' : (jpClient ? format_money(currency, balance) : addComma(balance)),
            desc   : statement.longcode.replace(/\n/g, '<br />'),
            id     : statement.contract_id,
            app_id : statement.app_id,
        };

        return statement_data;
    };

    var generateCSV = function(allData, jpClient) {
        var columns = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'],
            header  = ['Date', 'Reference ID', 'Potential Payout', 'Action', 'Description', 'Credit/Debit'].map(function(str) { return page.text.localize(str); });
        header.push(page.text.localize('Balance') + (jpClient || !TUser.get().currency ? '' : ' (' + TUser.get().currency + ')'));
        var sep = ',',
            csv = [header.join(sep)];
        if (allData && allData.length > 0) {
            csv = csv.concat(
                allData.map(function(data) {
                    return columns.map(function(key) {
                        // eslint-disable-next-line no-control-regex
                        return (data[key] ? data[key].replace(new RegExp(sep, 'g'), '').replace(new RegExp('\n|<br />', 'g'), ' ') : '');
                    }).join(sep);
                }));
        }
        return csv.join('\r\n');
    };

    var external = {
        getStatementData: getStatementData,
        generateCSV     : generateCSV,
    };

    return external;
})();

module.exports = {
    Statement: Statement,
};
