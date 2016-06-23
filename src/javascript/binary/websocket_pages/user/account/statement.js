var Statement = (function(){
    'use strict';
    var Compatibility = typeof window !== 'undefined' ? window.Compatibility : require('../../../common_functions/compatibility');
    var moment = Compatibility.requireIfNotExist('moment', '../../lib/moment/moment'),
        StringUtil = Compatibility.requireIfNotExist('StringUtil', '../common_functions/string_util'),
        addComma = Compatibility.requireIfNotExist('addComma', '../websocket_pages/trade/common', 'addComma');
    var getStatementData = function(statement) {
        var dateObj = new Date(statement["transaction_time"] * 1000),
            momentObj = moment.utc(dateObj),
            dateStr = momentObj.format("YYYY-MM-DD"),
            timeStr = momentObj.format("HH:mm:ss") + ' GMT';

        var statement_data = {
            'date'    : dateStr + "\n" + timeStr,
            'ref'     : statement["transaction_id"],
            'payout'  : parseFloat(statement["payout"]).toFixed(2),
            'action'  : StringUtil.toTitleCase(statement["action_type"]),
            'amount'  : addComma(parseFloat(statement["amount"])),
            'balance' : addComma(parseFloat(statement["balance_after"])),
            'desc'    : statement["longcode"].replace(/\n/g, '<br />'),
            'id'      : statement["contract_id"]
        };

        return statement_data;
    };

    var external = {
        getStatementData: getStatementData
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }
    
    return external;
}());
