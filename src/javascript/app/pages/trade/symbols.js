const countDecimalPlaces = require('./common_independent').countDecimalPlaces;
const ActiveSymbols      = require('../../common/active_symbols');
const BinarySocket       = require('../../base/socket');
const getPropertyValue   = require('../../../_common/utility').getPropertyValue;

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

const Symbols = (() => {
    let trade_markets             = {};
    let trade_markets_list        = {};
    let trade_underlyings         = {};
    let names                     = {};
    let is_active_symbols_cached  = false;

    const details = (data) => {
        const all_symbols  = data.active_symbols;
        trade_markets      = ActiveSymbols.getMarkets(all_symbols);
        trade_markets_list = ActiveSymbols.getMarketsList(all_symbols);
        trade_underlyings  = ActiveSymbols.getTradeUnderlyings(all_symbols);
        names              = ActiveSymbols.getSymbolNames(all_symbols);
    };

    const getUnderlyingPipSize = (underlying) => (
        new Promise((resolve) => {
            const req = { active_symbols: 'brief' };
            const options = { skip_cache_update: is_active_symbols_cached };
            BinarySocket.send(req, options).then(active_symbols => {
                details(active_symbols);
                const market             = ActiveSymbols.getSymbols(active_symbols);
                is_active_symbols_cached = true;

                // if we disable a symbol in API, pipsize won't be available
                // but we can still draw historical trades' charts
                // so we should handle getting undefined from this function
                resolve(countDecimalPlaces(getPropertyValue(market[underlying], ['pip'])));
            });
        })
    );

    return {
        details,
        markets      : list => (list ? trade_markets_list : trade_markets),
        getName      : symbol => names[symbol],
        underlyings  : () => trade_underlyings,
        getAllSymbols: () => names,
        getUnderlyingPipSize,
    };
})();

module.exports = Symbols;
