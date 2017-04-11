const BinaryPjax    = require('../../base/binary_pjax');
const Client        = require('../../base/client');
const getLanguage   = require('../../base/language').get;
const State         = require('../../base/storage').State;
const ActiveSymbols = require('../../common_functions/active_symbols');

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

const MBSymbols = (() => {
    'use strict';

    let trade_markets      = {},
        trade_markets_list = {},
        trade_underlyings  = {},
        need_page_update   = 1,
        all_symbols        = {},
        names              = {};

    const details = (data) => {
        ActiveSymbols.clearData();
        const active_symbols = data.active_symbols;
        trade_markets        = ActiveSymbols.getMarkets(active_symbols);
        trade_markets_list   = ActiveSymbols.getMarketsList(active_symbols);
        trade_underlyings    = ActiveSymbols.getTradeUnderlyings(active_symbols);
        all_symbols          = ActiveSymbols.getSymbols(all_symbols);
        names                = ActiveSymbols.getSymbolNames(active_symbols);
    };

    const getSymbols = (update) => {
        BinarySocket.wait('website_status').then((website_status) => {
            const landing_company_obj = State.get(['response', 'landing_company', 'landing_company']);
            const allowed_markets     = Client.currentLandingCompany().legal_allowed_markets;
            if (Client.isLoggedIn() && allowed_markets && allowed_markets.indexOf('forex') === -1) {
                BinaryPjax.load('trading');
                return;
            }
            const req = {
                active_symbols: 'brief',
                product_type  : 'multi_barrier',
            };
            if (landing_company_obj) {
                req.landing_company = landing_company_obj.financial_company ? landing_company_obj.financial_company.shortcode : 'japan';
            } else if (website_status.website_status.clients_country === 'jp' || getLanguage() === 'JA') {
                req.landing_company = 'japan';
            }
            BinarySocket.send(req, { forced: false, msg_type: 'active_symbols' });
            need_page_update = update;
        });
    };

    return {
        details       : details,
        getSymbols    : getSymbols,
        markets       : list    => (list ? trade_markets_list : trade_markets),
        underlyings   : ()      => trade_underlyings,
        getName       : symbol  => names[symbol],
        needPageUpdate: ()      => need_page_update,
        getAllSymbols : ()      => all_symbols,
        clearData     : ()      => { ActiveSymbols.clearData(); },
    };
})();

module.exports = MBSymbols;
