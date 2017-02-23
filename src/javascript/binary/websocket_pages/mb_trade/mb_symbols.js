const ActiveSymbols = require('../../common_functions/active_symbols').ActiveSymbols;
const BinaryPjax    = require('../../base/binary_pjax');
const Client        = require('../../base/client').Client;

/*
 * MBSymbols object parses the active_symbols json that we get from socket.send({active_symbols: 'brief'}
 * and outputs in usable form, it gives markets, underlyings
 *
 *
 * Usage:
 *
 * use `MBSymbols.details` to populate this object first
 *
 * then use
 *
 * `MBSymbols.markets` to get markets like Forex
 * `MBSymbols.underlyings` to get underlyings
 *
 */

const MBSymbols = (function () {
    'use strict';

    let tradeMarkets     = {},
        tradeMarketsList = {},
        tradeUnderlyings = {},
        need_page_update = 1,
        allSymbols       = {},
        names            = {};

    const details = function (data) {
        ActiveSymbols.clearData();
        const active_symbols = data.active_symbols;
        tradeMarkets     = ActiveSymbols.getMarkets(active_symbols);
        tradeMarketsList = ActiveSymbols.getMarketsList(active_symbols);
        tradeUnderlyings = ActiveSymbols.getTradeUnderlyings(active_symbols);
        allSymbols       = ActiveSymbols.getSymbols(allSymbols);
        names            = ActiveSymbols.getSymbolNames(active_symbols);
    };

    const getSymbols = function (update) {
        const landing_company_obj = Client.landing_company();
        const allowed_markets     = Client.get_client_landing_company().legal_allowed_markets;
        if (Client.is_logged_in() && allowed_markets && allowed_markets.indexOf('forex') === -1) {
            BinaryPjax.load('trading');
            return;
        }
        const landing_company = landing_company_obj.financial_company ? landing_company_obj.financial_company.shortcode : 'japan';
        BinarySocket.send({
            active_symbols : 'brief',
            landing_company: landing_company,
            product_type   : 'multi_barrier',
        });
        need_page_update = update;
    };

    return {
        details         : details,
        getSymbols      : getSymbols,
        markets         : function (list)  { return list ? tradeMarketsList : tradeMarkets; },
        underlyings     : function ()      { return tradeUnderlyings; },
        getName         : function(symbol) { return names[symbol]; },
        need_page_update: function ()      { return need_page_update; },
        getAllSymbols   : function ()      { return allSymbols; },
        clearData       : function ()      { ActiveSymbols.clearData(); },
    };
})();

module.exports = {
    MBSymbols: MBSymbols,
};
