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
                $(".error-msg").text(response.error.message);
                break;

            case "authorize":

                var then_do = "unknown";
                if("passthrough" in response.echo_req && "then_do" in response.echo_req.passthrough) {
                    then_do = response.echo_req.passthrough.then_do;
                }

                switch(then_do) {
                    case "updateBalance":
                        PortfolioWS.updateBalance(response);
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
                            StatementUI.updateStatementFooterBalance(response.balance);
                            break;
                        default :
                            //do nothing
                    }
                }
                break;

            case 'profit_table':
                ProfitTableWS.profitTableHandler(response);
                break;

            case "portfolio":
                PortfolioWS.updatePortfolio(response);
                break;

            case "proposal_open_contract":
                PortfolioWS.updateIndicative(response);
                break;

            case "change_password":
                PasswordWS.apiResponse(response);
                break;

            case "forget":
            case "forget_all":
                // no action needed
                break;

            default:
                throw new Error("No method exits to handle api message of type '" + msg_type + "'.");

        }

    };

    return {
        process: process
    };

})();