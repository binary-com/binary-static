/*
 * This Message object process the response from server and fire
 * events based on type of response
 */
var Message = (function () {
    "use strict";

    var process = function (msg) {

        var response;

        try {
            response  = JSON.parse(msg.data);
            if("object" !== typeof response || !("msg_type" in response)) {
                throw new Error("Response from WS API is not well formatted.");
            }
        } catch(e) {
            throw new Error("Response from WS API is not well formatted.");
        }

        var msg_type = response.msg_type;
        
        switch(msg_type) {

            case "error":

                // change_password
                if("change_password" in response.echo_req) {
                    // e.g.: {"echo_req":{"old_password":"1111","new_password":"zzzzzzzz","change_password":"1"},"version":3,"error":{"code":"InputValidationFailed","message":"Input validation failed  - $.old_password: does not match the regex pattern ^.{5,25}$"},"msg_type":"error"}
                    PasswordWS.apiResponse(response);
                    break;
                }

                // code from old error case, please identify the called method
                if(true) {
                    $(".error-msg").text(response.error.message);
                    break;
                }

                // still unknown?
                console.log("An error occured.", response);
                break;

            case "authorize":

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
                        TUser.set(response.authorize);
                        TradeSocket.send({ payout_currencies: 1 });
                }
                break;

            case "active_symbols":
                processActiveSymbols(response);
                break;

            case "contracts_for":
                processContract(response);
                break;

            case "payout_currencies":
                sessionStorage.setItem("currencies", msg.data);
                displayCurrencies();
                break;

            case "proposal":
                processProposal(response);
                break;

            case "buy":
                Purchase.display(response);
                break;

            case "tick":
                processTick(response);
                break;

            case "trading_times":
                processTradingTimes(response);
                break;

            case "statement":
                StatementWS.statementHandler(response);
                break;

            case "balance":
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
                break;

            case "portfolio":
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