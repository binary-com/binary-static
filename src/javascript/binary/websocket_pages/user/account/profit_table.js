const moment      = require('moment');
const Client      = require('../../../base/client');
const jpClient    = require('../../../common_functions/country_base').jpClient;
const formatMoney = require('../../../common_functions/currency_to_symbol').formatMoney;

const ProfitTable = (() => {
    'use strict';

    const getProfitTabletData = (transaction) => {
        const currency = Client.get('currency');
        const is_jp_client = jpClient();
        const buy_moment   = moment.utc(transaction.purchase_time * 1000);
        const sell_moment  = moment.utc(transaction.sell_time * 1000);
        const buy_price    = parseFloat(transaction.buy_price);
        const sell_price   = parseFloat(transaction.sell_price);

        return {
            buyDate  : `${buy_moment.format('YYYY-MM-DD')}\n${buy_moment.format('HH:mm:ss')} GMT`,
            ref      : transaction.transaction_id,
            payout   : formatMoney(currency, parseFloat(transaction.payout), !is_jp_client),
            buyPrice : formatMoney(currency, buy_price, !is_jp_client),
            sellDate : `${sell_moment.format('YYYY-MM-DD')}\n${sell_moment.format('HH:mm:ss')} GMT`,
            sellPrice: formatMoney(currency, sell_price, !is_jp_client),
            pl       : formatMoney(currency, Number(sell_price - buy_price), !is_jp_client),
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
