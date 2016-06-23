var ProfitTable = (function(){
    'use strict';
    var Compatibility = typeof window !== 'undefined' ? window.Compatibility : require('../../../common_functions/compatibility');
    var moment = Compatibility.requireIfNotExist('moment', '../../lib/moment/moment');
    var getProfitTabletData = function(transaction) {
        var buyMoment = moment.utc(transaction["purchase_time"] * 1000),
            sellMoment = moment.utc(transaction["sell_time"] * 1000),
            buyPrice = parseFloat(transaction["buy_price"]).toFixed(2),
            sellPrice = parseFloat(transaction["sell_price"]).toFixed(2);

        var profit_table_data = {
            'buyDate'   : buyMoment.format("YYYY-MM-DD") + "\n" + buyMoment.format("HH:mm:ss") + ' GMT',
            'ref'       : transaction["transaction_id"],
            'payout'    : parseFloat(transaction["payout"]).toFixed(2),
            'buyPrice'  : buyPrice,
            'sellDate'  : sellMoment.format("YYYY-MM-DD") + "\n" + sellMoment.format("HH:mm:ss") + ' GMT',
            'sellPrice' : sellPrice,
            'pl'        : Number(sellPrice - buyPrice).toFixed(2),
            'desc'      : transaction["longcode"],
            'id'        : transaction["contract_id"]
        };

        return profit_table_data;
    };

    var external = {
        getProfitTabletData: getProfitTabletData
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }

    return external;
}());
