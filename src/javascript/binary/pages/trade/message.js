/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        if(!TradePage.is_trading_page()){
            forgetTradingStreams();
            return;
        }
        if (response) {
            var type = response.msg_type;
            if (type === 'active_symbols') {
                processActiveSymbols(response);
            } else if (type === 'contracts_for') {
                processContract(response);
                window.contracts_for = response;
            } else if (type === 'payout_currencies') {
                page.client.set_storage_value('currencies', response.payout_currencies);
                displayCurrencies();
                Symbols.getSymbols(1);
            } else if (type === 'proposal') {
                processProposal(response);
            } else if (type === 'buy') {
                if(isJapanTrading()){
                    PricingTable.processBuy(response);
                }
                Purchase.display(response);
            } else if (type === 'tick') {
                processTick(response);
            } else if (type === 'history') {
                var digit_info = TradingAnalysis.digit_info();
                if(response.req_id === 1 || response.req_id === 2){
                    digit_info.show_chart(response.echo_req.ticks_history, response.history.prices);
                } else
                    Tick.processHistory(response);
            } else if (type === 'trading_times'){
                processTradingTimes(response);
            } else if (type === 'statement'){
                StatementWS.statementHandler(response);
            } else if (type === 'profit_table'){
                ProfitTableWS.profitTableHandler(response);
            } else if (type === 'pricing_table'){
                PricingTable.handleResponse(response);
            } else if (type === 'error') {
                $(".error-msg").text(response.error.message);
            } else if(type === 'balance'){
                PortfolioWS.updateBalance(response);
            } else if(type === 'portfolio'){
                PortfolioWS.updatePortfolio(response);
            } else if(type === 'proposal_open_contract'){
                PortfolioWS.updateIndicative(response);
            } else if(type === 'transaction'){
                PortfolioWS.transactionResponseHandler(response);
            }
        } else {

            console.log('some error occured');
        }
    };

    return {
        process: process
    };

})();
