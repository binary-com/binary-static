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

    var tradeMarkets = {}, tradeMarketsList = {}, tradeUnderlyings = {}, current = '', need_page_update = 1, names = {};

    var details = function (data) {
        var allSymbols = data['active_symbols'];

        allSymbols.forEach(function (element) {
            var currentMarket = element['market'],
                currentSubMarket = element['submarket'],
                currentUnderlying = element['symbol'];

            var is_active = !element['is_trading_suspended'] && element['exchange_is_open'];

            if(!tradeMarkets[currentMarket]){
                tradeMarkets[currentMarket] = {name:element['market_display_name'],is_active:0,submarkets:{}};
            }
            if(!tradeMarkets[currentMarket]['submarkets'][currentSubMarket]){
                tradeMarkets[currentMarket]['submarkets'][currentSubMarket] = {name: element['submarket_display_name'],is_active:0};
            }

            if(is_active){
                tradeMarkets[currentMarket]['is_active'] = 1;
                tradeMarkets[currentMarket]['submarkets'][currentSubMarket]['is_active'] = 1;
            }

            tradeMarketsList[currentMarket] = tradeMarkets[currentMarket];
            tradeMarketsList[currentSubMarket] = tradeMarkets[currentMarket]['submarkets'][currentSubMarket];

            if (!tradeUnderlyings.hasOwnProperty(currentMarket)) {
                tradeUnderlyings[currentMarket] = {};
            }

            if (!tradeUnderlyings.hasOwnProperty(currentSubMarket)) {
                tradeUnderlyings[currentSubMarket] = {};
            }

            if (!tradeUnderlyings[currentMarket].hasOwnProperty(currentUnderlying)) {
                tradeUnderlyings[currentMarket][currentUnderlying] = {
                    is_active: is_active,
                    display: element['display_name'],
                    market: currentMarket,
                    submarket: currentSubMarket
                };
            }

            if (!tradeUnderlyings[currentSubMarket].hasOwnProperty(currentUnderlying)) {
                tradeUnderlyings[currentSubMarket][currentUnderlying] = {
                    is_active: is_active,
                    display: element['display_name'],
                    market: currentMarket,
                    submarket: currentSubMarket
                };
            }

            names[currentUnderlying]=element['display_name'];
        });
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
