const moment = require('moment');

const ProfitTable = (function() {
    'use strict';

    const getProfitTabletData = function(transaction) {
        const buyMoment  = moment.utc(transaction.purchase_time * 1000),
            sellMoment = moment.utc(transaction.sell_time * 1000),
            buyPrice  = parseFloat(transaction.buy_price).toFixed(2),
            sellPrice = parseFloat(transaction.sell_price).toFixed(2);

        return {
            buyDate  : buyMoment.format('YYYY-MM-DD') + '\n' + buyMoment.format('HH:mm:ss') + ' GMT',
            ref      : transaction.transaction_id,
            payout   : parseFloat(transaction.payout).toFixed(2),
            buyPrice : buyPrice,
            sellDate : sellMoment.format('YYYY-MM-DD') + '\n' + sellMoment.format('HH:mm:ss') + ' GMT',
            sellPrice: sellPrice,
            pl       : Number(sellPrice - buyPrice).toFixed(2),
            desc     : transaction.longcode,
            id       : transaction.contract_id,
            app_id   : transaction.app_id,
        };
    };

    return {
        getProfitTabletData: getProfitTabletData,
    };
})();

module.exports = {
    ProfitTable: ProfitTable,
};
