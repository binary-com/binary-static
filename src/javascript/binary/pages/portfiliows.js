var PortfolioWS =  (function() {

    'use strict';

    var pageLanguage = page.language();
    if(!pageLanguage) pageLanguage = "EN";

    var rowTemplate;
    var retry;

    var init = function() {
        // get the row template and then discard the node as it has served its purpose
        rowTemplate = $("#portfolio-dynamic tr:first")[0].outerHTML;
        $("#portfolio-dynamic tr:first").remove();
        TradeSocket.init({"thendo":"updateBalance"});
    };

    
    var updateBalance = function(data) {
        $("span[data-id='balance']").text(fixCurrency(data.authorize.balance, data.authorize.currency));
        if(parseFloat(data.authorize.balance, 10) > 0) {
            $("#if-balance-zero").remove();
        }
    };

    /**
     * Updates portfolio table
    **/
    var updatePortfolio = function(data) {

        /**
         * Check for error
        **/
        if("error" in data) {
            throw new Error("Trying to get portfolio data, we got this error", data.error);
        }

        /**
         * no contracts
        **/
        if(0 === data.portfolio.contracts.length) {
            $("#portfolio-table").remove();
            $("#portfolio-no-contract").removeClass("dynamic");
            return true;
        }

        /**
         * User has at least one contract
        **/

        $("#portfolio-no-contract").remove();
        var contracts = '';
        var sumPurchase = 0.0;
        var currency;
        $.each(data.portfolio.contracts, function(ci, c) {
            sumPurchase += parseFloat(c.buy_price, 10);
            currency = c.currency;
            contracts += rowTemplate
            .split("!transaction_id!").join(c.transaction_id)
            .split("!contract_id!").join(c.contract_id)
            .split("!longcode!").join(c.longcode)
            .split("!currency!").join(c.currency)
            .split("!buy_price!").join(fixCurrency(c.buy_price));
        });

        // contracts is ready to be added to the dom
        $("#portfolio-dynamic").replaceWith(trans(contracts));

        // update footer area data
        sumPurchase = sumPurchase.toFixed(2);
        $("#cost-of-open-positions").text( fixCurrency(sumPurchase, currency));

        // request "proposal_open_contract"
        TradeSocket.send({"proposal_open_contract":1});

        // ready to show portfolio table
        $("#trading_init_progress").remove();
        $("#portfolio-content").removeClass("dynamic");

    };

    var updateIndicative = function(data) {

        if("error" in data) {
            // if api returns a response like the one below. 
            // we assume the indicative to be 0 if this happens
            /*
            {
              "echo_req": {
                "proposal_open_contract": 1
              },
              "error": {
                "code": "ContractSellValidationError",
                "message": "Resale of this contract is not offered."
              },
              "proposal_open_contract": {
                "id": "c4f8b5176928a7823ff09f8f44a51528"
              },
              "msg_type": "proposal_open_contract"
            }
            */
            return false;
        }

        $("tr[data-contract_id='"+data.proposal_open_contract.contract_id+"'] strong.indicative_price").text(data.proposal_open_contract.ask_price);

        var indicative_sum = 0, indicative_price = 0;
        $("strong.indicative_price").each(function() {
            indicative_price = $(this).text();
            indicative_price = parseFloat(indicative_price, 2);
            if(!isNaN(indicative_price)) {
                indicative_sum += indicative_price;
            }
        });

        indicative_sum = indicative_sum.toFixed(2);

        $("#value-of-open-positions").text(fixCurrency(indicative_sum, "USD"));

    };


    /*** utility functions ***/

    // Dynamic text
    var dTexts = ["view", "indicative"];

    /**
     * In the dynamic parts we have strings to include
     * For instance, in portfolio table, we have a 'View' button
     * for each contract.
    **/
    var trans = function(str) {
        var placeholder;
        for(var i = 0, l = dTexts.length; i < l; i++) {
            placeholder = ":"+dTexts[i]+":";
            if(-1 === str.indexOf(placeholder)) continue;
            str = str.split(placeholder).join(text.localize(dTexts[i]));
        }
        return str;
    };

    /**
     * Amounts received from the API could be integer or decimal numbers.
     * In case we have an integer, like 73, we want to display a decimal
     * with two fractions, i.e. 73:00
     * This function does that.
     * Adapted from http://stackoverflow.com/a/14428340
     * Kudos to: [VisioN](http://stackoverflow.com/users/1249581)
    **/
    var fixCurrency = function(n, c) {
        var currency = ""; 
        if("number" !== typeof n) n = parseFloat(n);
        var snum = n + "", dec;
        if(-1 === snum.indexOf(".")) {
            dec = 2;
        } else {
            dec = snum.split(".")[1].length;
        }
        if("string" === typeof c) {
            currency = c + " ";
        }
        return currency + " " + n.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };
 
    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative
    };

})();

pjax_config_page('portfoliows', function() {
    return {
        onLoad: function() {
            PortfolioWS.init();
        }
    };
});
