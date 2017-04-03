const TradingTimes = (() => {
    'use strict';

    const getSubmarketInfo = (active_symbols, submarket_display_name) =>
        active_symbols.filter(sy => (sy.submarket_display_name === submarket_display_name));

    const getSymbolInfo = (qSymbol, active_symbols) =>
        active_symbols.filter(sy => (sy.symbol === qSymbol));

    return {
        getSubmarketInfo: getSubmarketInfo,
        getSymbolInfo   : getSymbolInfo,
    };
})();

module.exports = TradingTimes;
