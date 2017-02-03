const MarketTimes = (function() {
    'use strict';

    const getSubmarketInfo = function(activeSymbols, submarketDisplayName) {
        return activeSymbols.filter(function(sy) {
            return sy.submarket_display_name === submarketDisplayName;
        });
    };

    const getSymbolInfo = function(qSymbol, activeSymbols) {
        return activeSymbols.filter(function(sy) {
            return (sy.symbol === qSymbol);
        });
    };

    return {
        getSubmarketInfo: getSubmarketInfo,
        getSymbolInfo   : getSymbolInfo,
    };
})();

module.exports = {
    MarketTimes: MarketTimes,
};
