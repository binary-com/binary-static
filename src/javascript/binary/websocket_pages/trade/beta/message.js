/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message_Beta = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        if(!TradePage_Beta.is_trading_page()){
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
                processContract_Beta(response);
                window.contracts_for = response;
            } else if (type === 'payout_currencies' && response.hasOwnProperty('echo_req') && (!response.echo_req.hasOwnProperty('passthrough') || !response.echo_req.passthrough.hasOwnProperty('handler'))) {
                page.client.set_storage_value('currencies', response.payout_currencies);
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
                if(response.req_id === 1 || response.req_id === 2){
                    digit_info.show_chart(response.echo_req.ticks_history, response.history.prices);
                } else
                    Tick.processHistory(response);
            } else if (type === 'asset_index'){
                AssetIndexUI.setAssetIndex(response);
            } else if (type === 'trading_times'){
                processTradingTimes_Beta(response);
                MarketTimesUI.setTradingTimes(response);
            } else if (type === 'statement'){
                StatementWS.statementHandler(response);
            } else if (type === 'profit_table'){
                ProfitTableWS.profitTableHandler(response);
            } else if (type === 'pricing_table'){
                PricingTable.handleResponse(response);
            } else if (type === 'error') {
                $(".error-msg").text(response.error.message);
            } else if(type === 'portfolio'){
                PortfolioWS.updatePortfolio(response);
            } else if(type === 'proposal_open_contract'){
                PortfolioWS.updateIndicative(response);
            } else if(type === 'transaction'){
                PortfolioWS.transactionResponseHandler(response);
            } else if(type === 'oauth_apps'){
                PortfolioWS.updateOAuthApps(response);
            }
        } else {

            console.log('some error occured');
        }
    };

    return {
        process: process
    };

})();
