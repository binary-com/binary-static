const MarketTimes = (() => {
    'use strict';

    const getSubmarketInfo = (activeSymbols, submarketDisplayName) =>
        activeSymbols.filter(sy => (sy.submarket_display_name === submarketDisplayName));

    const getSymbolInfo = (qSymbol, activeSymbols) =>
        activeSymbols.filter(sy => (sy.symbol === qSymbol));

    return {
        getSubmarketInfo: getSubmarketInfo,
        getSymbolInfo   : getSymbolInfo,
    };
})();

module.exports = MarketTimes;
