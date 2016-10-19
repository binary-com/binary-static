var MarketTimes = (function() {
    "use strict";

    var getSubmarketInfo = function(activeSymbols, submarketDisplayName) {
        return activeSymbols.filter(function(sy) {
            return sy.submarket_display_name === submarketDisplayName;
        });
    };

    var getSymbolInfo = function(qSymbol, activeSymbols) {
        return activeSymbols.filter(function(sy, id) {
            if(sy.symbol === qSymbol) {
                return true;
            }
        });
    };

    var external = {
        getSubmarketInfo: getSubmarketInfo,
        getSymbolInfo: getSymbolInfo
    };
    return external;
}());

module.exports = {
    MarketTimes: MarketTimes,
};
