/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    'use strict';

    var process = function (msg) {
        var response = JSON.parse(msg.data);
        if (response) {
            var type = response.msg_type;
            if (type === 'authorize') {
                TradeSocket.send({ payout_currencies: 1 });
            } else if (type === 'active_symbols') {
                processActiveSymbols(response);
            } else if (type === 'contracts_for') {
                processContract(response);
            } else if (type === 'payout_currencies') {
                sessionStorage.setItem('currencies', msg.data);
                displayCurrencies();
            } else if (type === 'proposal') {
                processProposal(response);
            } else if (type === 'buy') {
                Purchase.display(response);
            } else if (type === 'tick') {
                processTick(response);
            }

            // if(type !== 'tick' && type !== 'proposal'){
            if(type !== 'tick'){
                console.log(response);
            }
        } else {
            console.log('some error occured');
        }
    };

    return {
        process: process,
    };

})();
