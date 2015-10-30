/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    'use strict';

    var process = function (msg) {
<<<<<<< HEAD

        var response;

        try {
            response  = JSON.parse(msg.data);
            if('object' !== typeof response || !("msg_type" in response)) {
                throw new Error("Response from WS API is not well formatted.");
            }
        } catch(e) {
            throw new Error("Response from WS API is not well formatted.");
        }

        var msg_type = response.msg_type;
        
        switch(msg_type) {

            case 'authorize':

                var thendo = "unknown";
                if("passthrough" in response.echo_req && "thendo" in response.echo_req.passthrough) {
                    thendo = response.echo_req.passthrough.thendo;
                }

                switch(thendo) {
                    case "updateBalance":
                        PortfolioWS.updateBallance(response);
                        TradeSocket.send({"portfolio": 1}); // It seems the spawn property has been removed from the API (it is still in the Playground but even there it results in an error)
                        break;

                    default:
                        User.set(response.authorize);
                        TradeSocket.send({ payout_currencies: 1 });
                }
                break;

            case 'active_symbols':
=======
        var response = JSON.parse(msg.data);
        if (response) {
            var type = response.msg_type;
            if (type === 'authorize') {
                TUser.set(response.authorize);
                TradeSocket.send({ payout_currencies: 1 });
            } else if (type === 'active_symbols') {
>>>>>>> upstream/master
                processActiveSymbols(response);
                break;

            case 'contracts_for':
                processContract(response);
                break;

            case 'payout_currencies':
                sessionStorage.setItem('currencies', msg.data);
                displayCurrencies();
                break;

            case 'proposal':
                processProposal(response);
                break;

            case 'buy':
                Purchase.display(response);
                break;

            case 'tick':
                processTick(response);
                break;

            case 'trading_times':
                processTradingTimes(response);
<<<<<<< HEAD
                break;

            case 'portfolio':
                PortfolioWS.updatePortfolio(response);
                break;

            default:
                throw new Error("No method exits to handle api message of type '" + msg_type + "'.");

=======
            } else if (type === 'statement'){
                StatementWS.statementHandler(response);
            } else if (type === 'balance'){
                var passthroughObj = response.echo_req.passthrough;
                if (passthroughObj){
                    switch (passthroughObj.purpose) {
                        case "statement_footer":
                            var bal = response.balance[0].balance;
                            $("#statement-table > tfoot > tr").
                                first().
                                children(".bal").
                                text(Number(parseFloat(bal)).toFixed(2));
                            break;
                        default :
                            //do nothing
                    }
                }
            } else if (type === 'error') {
                $(".error-msg").text(response.error.message);
            }
        } else {

            console.log('some error occured');
>>>>>>> upstream/master
        }

    };

    return {
        process: process
    };

})();
