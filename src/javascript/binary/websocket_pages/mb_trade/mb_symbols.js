const ActiveSymbols = require('../../common_functions/active_symbols').ActiveSymbols;

/*
 * MBSymbols object parses the active_symbols json that we get from socket.send({active_symbols: 'brief'}
 * and outputs in usable form, it gives markets, underlyings
 *
 *
 * Usage:
 *
 * use `MBSymbols.details` to populate this object first
 *
 * then use
 *
 * `MBSymbols.markets` to get markets like Forex
 * `MBSymbols.underlyings` to get underlyings
 *
 */

const MBSymbols = (function () {
    'use strict';

    let tradeMarkets     = {},
        tradeMarketsList = {},
        tradeUnderlyings = {},
        need_page_update = 1,
        names            = {};

    const details = function (data) {
        ActiveSymbols.clearData();
        const allSymbols = data.active_symbols;
        tradeMarkets     = ActiveSymbols.getMarkets(allSymbols);
        tradeMarketsList = ActiveSymbols.getMarketsList(allSymbols);
        tradeUnderlyings = ActiveSymbols.getTradeUnderlyings(allSymbols);
        names            = ActiveSymbols.getSymbolNames(allSymbols);
    };

    const getSymbols = function (update) {
        BinarySocket.send({
            active_symbols : 'brief',
            landing_company: 'japan',
        });
        need_page_update = update;
    };

    return {
        details         : details,
        getSymbols      : getSymbols,
        markets         : function (list)  { return list ? tradeMarketsList : tradeMarkets; },
        underlyings     : function ()      { return tradeUnderlyings; },
        getName         : function(symbol) { return names[symbol]; },
        need_page_update: function ()      { return need_page_update; },
        getAllSymbols   : function()       { return names; },
    };
})();

module.exports = {
    MBSymbols: MBSymbols,
};
