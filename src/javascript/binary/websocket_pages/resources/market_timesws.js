var MarketTimes = (function() {
    "use strict";

    var getSymbolInfo = function(activeSymbols, submarketDisplayName) {
        return activeSymbols.filter(function(sy) {
            return sy.submarket_display_name === submarketDisplayName;
        });
    };

    return {
        getSymbolInfo: getSymbolInfo,
    };
}());
