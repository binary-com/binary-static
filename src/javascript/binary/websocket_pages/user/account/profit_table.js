const moment      = require('moment');
const Client      = require('../../../base/client');
const formatMoney = require('../../../common_functions/currency_to_symbol').formatMoney;

const ProfitTable = (() => {
    'use strict';

    const getProfitTabletData = (transaction) => {
        const currency = Client.get('currency');
        const buy_moment   = moment.utc(transaction.purchase_time * 1000);
        const sell_moment  = moment.utc(transaction.sell_time * 1000);
        const buy_price    = formatMoney(currency, parseFloat(transaction.buy_price), 1);
        const sell_price   = formatMoney(currency, parseFloat(transaction.sell_price), 1);

        return {
            buyDate  : `${buy_moment.format('YYYY-MM-DD')}\n${buy_moment.format('HH:mm:ss')} GMT`,
            ref      : transaction.transaction_id,
            payout   : formatMoney(currency, parseFloat(transaction.payout), 1),
            buyPrice : buy_price,
            sellDate : `${sell_moment.format('YYYY-MM-DD')}\n${sell_moment.format('HH:mm:ss')} GMT`,
            sellPrice: sell_price,
            pl       : formatMoney(currency, Number(sell_price - buy_price), 1),
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
