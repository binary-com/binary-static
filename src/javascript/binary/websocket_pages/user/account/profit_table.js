const moment = require('moment');

const ProfitTable = (() => {
    'use strict';

    const getProfitTabletData = (transaction) => {
        const buy_moment = moment.utc(transaction.purchase_time * 1000),
            sell_moment  = moment.utc(transaction.sell_time * 1000),
            buy_price    = parseFloat(transaction.buy_price).toFixed(2),
            sell_price   = parseFloat(transaction.sell_price).toFixed(2);

        return {
            buyDate  : buy_moment.format('YYYY-MM-DD') + '\n' + buy_moment.format('HH:mm:ss') + ' GMT',
            ref      : transaction.transaction_id,
            payout   : parseFloat(transaction.payout).toFixed(2),
            buyPrice : buy_price,
            sellDate : sell_moment.format('YYYY-MM-DD') + '\n' + sell_moment.format('HH:mm:ss') + ' GMT',
            sellPrice: sell_price,
            pl       : Number(sell_price - buy_price).toFixed(2),
            desc     : transaction.longcode,
            id       : transaction.contract_id,
            app_id   : transaction.app_id,
        };
    };

    return {
        getProfitTabletData: getProfitTabletData,
    };
})();

module.exports = ProfitTable;
