/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    'use strict';

    var process = function (msg) {

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
                        TradeSocket.send({"portfolio": 1});
                        break;

                    default:
                        User.set(response.authorize);
                        TradeSocket.send({ payout_currencies: 1 });
                }
                break;

            case 'active_symbols':
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
                break;

            case 'portfolio':
                PortfolioWS.updatePortfolio(response);
                break;

            case "change_password":
                PasswordWS.apiResponse(response);
                break;

            default:
                throw new Error("No method exits to handle api message of type '" + msg_type + "'.");

        }

    };

    return {
        process: process
    };

})();