const isEmptyObject = require('../base/utility').isEmptyObject;

const ActiveSymbols = (() => {
    'use strict';

    const groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const extend = function(a, b) {
        if (!a || !b) return null;
        Object.keys(b).forEach(function(key) {
            a[key] = b[key];
        });
        return a;
    };

    const clone = function(obj) {
        return extend({}, obj);
    };

    return {
        markets   : {},
        submarkets: {},
        symbols   : {},
        getMarkets: function(symbols) {
            if (!isEmptyObject(this.markets)) {
                return clone(this.markets);
            }

            const that = this;
            const markets = groupBy(symbols, 'market');
            Object.keys(markets).forEach(function(key) {
                const marketName = key;
                const marketSymbols = markets[key];
                const symbol = marketSymbols[0];
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
            if (!isEmptyObject(market.submarkets)) {
                return clone(market.submarkets);
            }
            market.submarkets = {};
            const that = this;
            const submarkets = groupBy(symbols, 'submarket');
            Object.keys(submarkets).forEach(function(key) {
                const submarketName = key;
                const submarketSymbols = submarkets[key];
                const symbol = submarketSymbols[0];
                market.submarkets[submarketName] = {
                    name     : symbol.submarket_display_name,
                    is_active: !symbol.is_trading_suspended && symbol.exchange_is_open,
                };
                that.getSymbolsForSubmarket(submarketSymbols, market.submarkets[submarketName]);
            });
            return clone(market.submarkets);
        },
        getSymbolsForSubmarket: function(symbols, submarket) {
            if (isEmptyObject(submarket.symbols)) {
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
            if (isEmptyObject(this.submarkets)) {
                const markets = this.getMarkets(active_symbols);
                const that = this;
                Object.keys(markets).forEach(function(key) {
                    const market = markets[key];
                    const submarkets = that.getSubmarketsForMarket(active_symbols, market);
                    extend(that.submarkets, submarkets);
                });
            }
            return clone(this.submarkets);
        },
        getSymbols: function(active_symbols) {
            if (isEmptyObject(this.symbols)) {
                const submarkets = this.getSubmarkets(active_symbols);
                const that = this;
                Object.keys(submarkets).forEach(function(key) {
                    const submarket = submarkets[key];
                    const symbols = that.getSymbolsForSubmarket(active_symbols, submarket);
                    extend(that.symbols, symbols);
                });
            }
            return clone(this.symbols);
        },
        getMarketsList: function(active_symbols) {
            const tradeMarketsList = {};
            extend(tradeMarketsList, this.getMarkets(active_symbols));
            extend(tradeMarketsList, this.getSubmarkets(active_symbols));
            return tradeMarketsList;
        },
        getTradeUnderlyings: function(active_symbols) {
            const tradeUnderlyings = {};
            const symbols = this.getSymbols(active_symbols);
            Object.keys(symbols).forEach(function(key) {
                const symbol = symbols[key];
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
            const symbols = clone(this.getSymbols(active_symbols));
            Object.keys(symbols).forEach(function(key) {
                symbols[key] = symbols[key].display;
            });
            return symbols;
        },
    };
})();

module.exports = ActiveSymbols;
