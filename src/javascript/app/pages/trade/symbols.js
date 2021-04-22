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

    const isSymbolOpen = symbol => symbol.exchange_is_open === 1;

    const findSymbol = async (active_symbols, symbol) => {
        const first_symbol = active_symbols.find(item => item.symbol === symbol && isSymbolOpen(item));
        const is_symbol_offered = await isSymbolOffered(first_symbol);

        if (is_symbol_offered) return first_symbol;

        return undefined;
    };

    const isSymbolOffered = async symbol_info => {
        const response = await BinarySocket.send({ contracts_for: symbol_info.symbol });
        
        return !(getPropertyValue(response, ['error', 'code']) === 'InvalidSymbol');
    };

    const findFirstSymbol = async (active_symbols, pattern) => {
        const first_symbol = active_symbols.find(
            symbol_info => pattern.test(symbol_info.submarket) && isSymbolOpen(symbol_info)
        );

        if (first_symbol) {
            const is_symbol_offered = await isSymbolOffered(first_symbol);

            if (is_symbol_offered) return first_symbol;
        }
        
        return undefined;
    };

    const getDefaultOpenSymbol = async active_symbols => {
        const default_open_symbol =
            (await findSymbol(active_symbols, '1HZ100V')) ||
            (await findFirstSymbol(active_symbols, /random_index/)) ||
            (await findFirstSymbol(active_symbols, /major_pairs/));

        if (default_open_symbol) return default_open_symbol.symbol;

        return active_symbols.find(symbol_info => symbol_info.submarket === 'major_pairs');
    };

    return {
        details,
        markets      : list => (list ? trade_markets_list : trade_markets),
        getName      : symbol => names[symbol],
        underlyings  : () => trade_underlyings,
        getAllSymbols: () => names,
        getUnderlyingPipSize,
        getDefaultOpenSymbol,
    };
})();

module.exports = Symbols;
