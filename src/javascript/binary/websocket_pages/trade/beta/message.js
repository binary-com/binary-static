var TradingAnalysis_Beta = require('./analysis').TradingAnalysis_Beta;
var Purchase_Beta        = require('./purchase').Purchase_Beta;
var processActiveSymbols_Beta = require('./process').processActiveSymbols_Beta;
var processContract_Beta      = require('./process').processContract_Beta;
var forgetTradingStreams_Beta = require('./process').forgetTradingStreams_Beta;
var processTick_Beta          = require('./process').processTick_Beta;
var processProposal_Beta      = require('./process').processProposal_Beta;
var processTradingTimes_Beta  = require('./process').processTradingTimes_Beta;
var displayCurrencies = require('../currency').displayCurrencies;
var Notifications     = require('../notifications').Notifications;
var Symbols           = require('../symbols').Symbols;
var Tick              = require('../tick').Tick;
var AssetIndexUI  = require('../../resources/asset_index/asset_indexws.ui').AssetIndexUI;
var MarketTimesUI = require('../../resources/market_times/market_timesws.ui').MarketTimesUI;
var PortfolioWS   = require('../../user/account/portfolio/portfolio.init').PortfolioWS;
var ProfitTableWS = require('../../user/account/profit_table/profit_table.init').ProfitTableWS;
var StatementWS   = require('../../user/account/statement/statement.init').StatementWS;
var State  = require('../../../base/storage').State;
var GTM    = require('../../../base/gtm').GTM;
var Client = require('../../../base/client').Client;

/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message_Beta = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        if (!State.get('is_beta_trading')) {
            forgetTradingStreams_Beta();
            return;
        }
        if (response) {
            var type = response.msg_type;
            if (type === 'active_symbols') {
                processActiveSymbols_Beta(response);
                AssetIndexUI.setActiveSymbols(response);
                MarketTimesUI.setActiveSymbols(response);
            } else if (type === 'contracts_for') {
                Notifications.hide('CONNECTION_ERROR');
                processContract_Beta(response);
                window.contracts_for = response;
            } else if (type === 'payout_currencies' && response.hasOwnProperty('echo_req') && (!response.echo_req.hasOwnProperty('passthrough') || !response.echo_req.passthrough.hasOwnProperty('handler'))) {
                Client.set_value('currencies', response.payout_currencies);
                displayCurrencies();
                Symbols.getSymbols(1);
            } else if (type === 'proposal') {
                processProposal_Beta(response);
            } else if (type === 'buy') {
                Purchase_Beta.display(response);
                GTM.push_purchase_data(response);
            } else if (type === 'tick') {
                processTick_Beta(response);
            } else if (type === 'history') {
                var digit_info = TradingAnalysis_Beta.digit_info();
                if (response.req_id === 1 || response.req_id === 2) {
                    digit_info.show_chart(response.echo_req.ticks_history, response.history.prices);
                } else {
                    Tick.processHistory(response);
                }
            } else if (type === 'asset_index') {
                AssetIndexUI.setAssetIndex(response);
            } else if (type === 'trading_times') {
                processTradingTimes_Beta(response);
                MarketTimesUI.setTradingTimes(response);
            } else if (type === 'statement') {
                StatementWS.statementHandler(response);
            } else if (type === 'profit_table') {
                ProfitTableWS.profitTableHandler(response);
            } else if (type === 'error') {
                $('.error-msg').text(response.error.message);
            } else if (type === 'portfolio') {
                PortfolioWS.updatePortfolio(response);
            } else if (type === 'proposal_open_contract') {
                PortfolioWS.updateIndicative(response);
            } else if (type === 'transaction') {
                PortfolioWS.transactionResponseHandler(response);
            } else if (type === 'oauth_apps') {
                PortfolioWS.updateOAuthApps(response);
            }
        } else {
            console.log('some error occured');
        }
    };

    return {
        process: process,
    };
})();

module.exports = {
    Message_Beta: Message_Beta,
};
