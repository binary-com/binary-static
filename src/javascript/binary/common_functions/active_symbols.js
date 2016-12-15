var objectNotEmpty = require('../base/utility').objectNotEmpty;

var ActiveSymbols = (function () {
    'use strict';

    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    var extend = function(a, b) {
        if (!a || !b) return null;
        Object.keys(b).forEach(function(key) {
            a[key] = b[key];
        });
        return a;
    };

    var clone = function(obj) {
        return extend({}, obj);
    };

    var activeSymbols = {
        markets   : {},
        submarkets: {},
        symbols   : {},
        getMarkets: function(symbols) {
            if (objectNotEmpty(this.markets)) {
                return clone(this.markets);
            }

            var that = this;
            var markets = groupBy(symbols, 'market');
            Object.keys(markets).forEach(function(key) {
                var marketName = key;
                var marketSymbols = markets[key];
                var symbol = marketSymbols[0];
                that.markets[marketName] = {
                    name     : symbol.market_display_name,
                    is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
                };
                that.getSubmarketsForMarket(marketSymbols, that.markets[marketName]);
            });
            return clone(this.markets);
        },
        clearData: function() {
            this.markets = {};
            this.symbols = {};
            this.submarkets = {};
        },
        getSubmarketsForMarket: function(symbols, market) {
            if (objectNotEmpty(market.submarkets)) {
                return clone(market.submarkets);
            }
            market.submarkets = {};
            var that = this;
            var submarkets = groupBy(symbols, 'submarket');
            Object.keys(submarkets).forEach(function(key) {
                var submarketName = key;
                var submarketSymbols = submarkets[key];
                var symbol = submarketSymbols[0];
                market.submarkets[submarketName] = {
                    name     : symbol.submarket_display_name,
                    is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
                };
                that.getSymbolsForSubmarket(submarketSymbols, market.submarkets[submarketName]);
            });
            return clone(market.submarkets);
        },
        getSymbolsForSubmarket: function(symbols, submarket) {
            if (!objectNotEmpty(submarket.symbols)) {
                submarket.symbols = {};
                symbols.forEach(function(symbol) {
                    submarket.symbols[symbol.symbol] = {
                        display    : symbol.display_name,
                        symbol_type: symbol.symbol_type,
                        is_active  : !symbol.is_trading_suspended && symbol.exchange_is_open,
                        pip        : symbol.pip,
                        market     : symbol.market,
                        submarket  : symbol.submarket,
                    };
                });
            }
            return clone(submarket.symbols);
        },
        getSubmarkets: function(active_symbols) {
            if (!objectNotEmpty(this.submarkets)) {
                var markets = this.getMarkets(active_symbols);
                var that = this;
                Object.keys(markets).forEach(function(key) {
                    var market = markets[key];
                    var submarkets = that.getSubmarketsForMarket(active_symbols, market);
                    extend(that.submarkets, submarkets);
                });
            }
            return clone(this.submarkets);
        },
        getSymbols: function(active_symbols) {
            if (!objectNotEmpty(this.symbols)) {
                var submarkets = this.getSubmarkets(active_symbols);
                var that = this;
                Object.keys(submarkets).forEach(function(key) {
                    var submarket = submarkets[key];
                    var symbols = that.getSymbolsForSubmarket(active_symbols, submarket);
                    extend(that.symbols, symbols);
                });
            }
            return clone(this.symbols);
        },
        getMarketsList: function(active_symbols) {
            var tradeMarketsList = {};
            extend(tradeMarketsList, this.getMarkets(active_symbols));
            extend(tradeMarketsList, this.getSubmarkets(active_symbols));
            return tradeMarketsList;
        },
        getTradeUnderlyings: function(active_symbols) {
            var tradeUnderlyings = {};
            var symbols = this.getSymbols(active_symbols);
            Object.keys(symbols).forEach(function(key) {
                var symbol = symbols[key];
                if (!tradeUnderlyings[symbol.market]) {
                    tradeUnderlyings[symbol.market] = {};
                }
                if (!tradeUnderlyings[symbol.submarket]) {
                    tradeUnderlyings[symbol.submarket] = {};
                }
                tradeUnderlyings[symbol.market][key] = symbol;
                tradeUnderlyings[symbol.submarket][key] = symbol;
            });
            return tradeUnderlyings;
        },
        getSymbolNames: function(active_symbols) {
            var symbols = clone(this.getSymbols(active_symbols));
            Object.keys(symbols).forEach(function(key) {
                symbols[key] = symbols[key].display;
            });
            return symbols;
        },
    };
    return activeSymbols;
})();

module.exports = {
    ActiveSymbols: ActiveSymbols,
};
