var PortfolioWS =  (function() {

    'use strict';

    var pageLanguage = page.language();
    if(!pageLanguage) pageLanguage = "EN";

    var rowTemplate;

    var init = function() {
        // get the row template and then discard the node as it has served its purpose
        rowTemplate = $("#portfolio-dynamic tr:first").html(); 
        $("#portfolio-dynamic tr:first").remove();
        
        TradeSocket.init({"thendo":"updateBalance"});
    };

    
    var updateBalance = function(data) {
        $("span[data-id='balance']").text(fixCurrency(data.authorize.balance, data.authorize.currency)).removeClass("loading");
        if(0 === parseFloat(data.authorize.balance, 10)) {
            $("#if-balance-zero").removeClass("dynamic");
        } else {
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
            .split("!ref-number!").join(c.fmb_id)
            .split("!longcode!").join(c.longcode)
            .split("!currency!").join(c.currency)
            .split("!lang-code!").join(pageLanguage)
            .split("!payout!").join(c.payout)
            .split("!contract_type!").join(c.contract_type)
            .split("!symbol!").join(c.symbol.toUpperCase())
            .split("!buy_price!").join(fixCurrency(c.buy_price));
        });

        // contracts is ready to be added to the dom
        $("#portfolio-dynamic").replaceWith(trans(contracts));

        // update footer area data
        $("#cost-of-open-positions").replaceWith( fixCurrency(sumPurchase, currency));
        $("#value-of-open-positions").replaceWith(currency + '0.00'); // Fix this once API returns a value for indicative amount

        // ready to show portfolio table
        $("#portfolio-table").removeClass("dynamic");

    };

    var updateIndicative = function() {

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
        updatePortfolio: updatePortfolio
    };

})();

pjax_config_page('portfoliows', function() {
    return {
        onLoad: function() {
            PortfolioWS.init();
        }
    };
});
