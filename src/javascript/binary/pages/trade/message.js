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
            } else if (type === 'payout_currencies') {
                sessionStorage.setItem('currencies', msg.data);
                displayCurrencies();
                Symbols.getSymbols(1);
            } else if (type === 'proposal') {
                processProposal(response);
            } else if (type === 'buy') {
                Purchase.display(response);
            } else if (type === 'tick') {
                processTick(response);
            } else if (type === 'trading_times'){
                processTradingTimes(response);
            } else if (type === 'statement'){
                StatementWS.statementHandler(response);
            } else if (type === 'profit_table'){
                ProfitTableWS.profitTableHandler(response);
            } else if (type === 'error') {
                $(".error-msg").text(response.error.message);
            }
        } else {

            console.log('some error occured');
        }
    };

    return {
        process: process
    };

})();