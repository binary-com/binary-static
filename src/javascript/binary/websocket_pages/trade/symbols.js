/*
 * Symbols object parses the active_symbols json that we get from socket.send({active_symbols: 'brief'}
 * and outputs in usable form, it gives markets, underlyings
 *
 *
 * Usage:
 *
 * use `Symbols.details` to populate this object first
 *
 * then use
 *
 * `Symbols.markets` to get markets like Forex, Random etc
 * `Symbols.underlyings` to get underlyings
 *
 */

var Symbols = (function () {
    'use strict';

    var tradeMarkets = {}, tradeMarketsList = {}, tradeUnderlyings = {}, need_page_update = 1, names = {};

    var details = function (data) {
        var allSymbols = data['active_symbols'];
        tradeMarkets = ActiveSymbols.getMarkets(allSymbols);
        tradeMarketsList = ActiveSymbols.getMarketsList(allSymbols);
        tradeUnderlyings = ActiveSymbols.getTradeUnderlyings(allSymbols);
        names = ActiveSymbols.getSymbolNames(allSymbols);
    };

    var getSymbols = function (update) {
        var $args = {
            active_symbols: "brief"
        };
        if (isJapanTrading()) {
            $args['landing_company'] = "japan";
        }
        BinarySocket.send($args);
        need_page_update = update;
    };

    return {
        details: details,
        getSymbols: getSymbols,
        markets: function (list) { return list ? tradeMarketsList : tradeMarkets; },
        underlyings: function () { return tradeUnderlyings; },
        getName: function(symbol){ return names[symbol]; },
        need_page_update: function () { return need_page_update; },
        getAllSymbols: function(){return names;}
    };

})();
