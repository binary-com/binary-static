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

    var tradeMarkets = {}, tradeUnderlyings = {}, current = '', need_page_update = 1, names = {};

    var details = function (data) {
        var allSymbols = data['active_symbols'];

        allSymbols.forEach(function (element) {
            var currentMarket = element['market'],
                currentSubMarket = element['submarket'],
                currentUnderlying = element['symbol'];

            var is_active = !element['is_trading_suspended'] && element['exchange_is_open'];

            if(is_active){
                if(!tradeMarkets[currentMarket]){
                    tradeMarkets[currentMarket] = {name:'',submarkets:{}};
                }
                tradeMarkets[currentMarket]['name'] = element['market_display_name'];
                tradeMarkets[currentMarket]['submarkets'][currentSubMarket] = element['submarket_display_name'];
            }

            if (!tradeUnderlyings.hasOwnProperty(currentMarket)) {
                tradeUnderlyings[currentMarket] = {};
            }

            if (!tradeUnderlyings.hasOwnProperty(currentSubMarket)) {
                tradeUnderlyings[currentSubMarket] = {};
            }

            if (!tradeUnderlyings[currentMarket].hasOwnProperty(currentUnderlying)) {
                tradeUnderlyings[currentMarket][currentUnderlying] = {
                    is_active: is_active,
                    display: element['display_name']
                };
            }

            if (!tradeUnderlyings[currentSubMarket].hasOwnProperty(currentUnderlying)) {
                tradeUnderlyings[currentSubMarket][currentUnderlying] = {
                    is_active: is_active,
                    display: element['display_name']
                };
            }

            names[currentUnderlying]=element['display_name'];
        });
    };

    var getSymbols = function (update) {
        TradeSocket.send({
            active_symbols: "brief"
        });
        need_page_update = update;
    };

    return {
        details: details,
        getSymbols: getSymbols,
        markets: function () { return tradeMarkets; },
        underlyings: function () { return tradeUnderlyings; },
        getName: function(symbol){ return names[symbol]; },
        need_page_update: function () { return need_page_update; }
    };

})();
