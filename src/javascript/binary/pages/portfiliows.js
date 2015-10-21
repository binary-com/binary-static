/** 
 * mising data in api portfolio object:
 *  - recomputed_price
 *  - sell_channel
 *  - shortcode
 *  - ref number
 *  - indicative amount      
**/

var PortfolioWS =  (function() {

    'use strict';

    var pageLanguage = page.language();
    if(!pageLanguage) pageLanguage = "EN";

    var init = function() {
        TradeSocket.init({"thendo":"updateBalance"});
    };

    
    var updateBallance = function(data) {
        $("span[data-id='balance']").text(fixCurrency(data.authorize.balance, data.authorize.currency).removeClass("loading");
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

        var rowTemplate = '<div class="grd-parent grd-grid-12 grd-row-padding table-body table-body-lines"><div class="grd-grid-2 grd-hide-mobile grd-grid-phablet-2">!ref-number!</div><div class="grd-grid-5 grd-grid-mobile-7 grd-grid-phablet-6">!longcode!</div><div class="grd-grid-5 grd-grid-mobile-5 grd-grid-phablet-4"><div class="grd-grid-4 grd-grid-mobile-12 grd-grid-phablet-12 right-aligned">!currency! <strong>!buy_price!</strong></div><div class="grd-hide grd-show-mobile grd-grid-mobile-12 grd-show-phablet grd-grid-phablet-12"><br>Indicative :</div><div class="grd-grid-4 grd-grid-mobile-12 grd-grid-phablet-12 right-aligned">!currency! 0.00</div><div class="grd-hide grd-show-mobile grd-grid-mobile-12 grd-show-phablet grd-grid-phablet-12"><br></div><div class="grd-grid-4 grd-grid-mobile-12 grd-grid-phablet-12 center-aligned"><div><span class="button"><button class="button open_contract_details" onclick="return false;" contract_id="5266199068" controller_action="sell" currency="!currency!" l="!lang-code!" payout="!payout!" purchase_price="!buy_price!" purchase_time="2015-10-02 08:24:13" qty="1" recomputed_price="0" sell_channel="P_!contract_type!-1443774253_!symbol!_1444424400_14958600_14065600_c_!currency!_!lang-code!" shortcode="!contract_type!_!symbol!_100_1443774253_1444424400F_14958600_14065600" url="https://www.binary.com/trade/analyse_contract?l=!lang-code!">:view:</button></span></div></div></div></div>';
        var contracts = '';
        var sumPurchase = 0.0;
        var sumIndicative = 0.0; // As of writing this, the API still does not return a value for this field
        var currency;
        //var n, s;
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


    /*** utility functions ***/

    // Until we can publish language specific json objects to each gh-pages branch
    var uiTexts = {
        "EN": {"view":"View"},
        "ZH_TW": {"view":"檢視"},
        "DE": {"view":"Ansehen"},
        "ID": {"view":"Lihat"},
        "ZH_CN": {"view":"查看"},
        "VI": {"view":"Xem"},
        "AR": {"view":"شاهد"},
        "PL": {"view":"Widok"},
        "RU": {"view":"Просмотр"},
        "PT": {"view":"Ver"},
        "ES": {"view":"Ver"},
        "FR": {"view":"Voir"}
    };

    /**
     * In the dynamic parts we have strings to include
     * For instance, in portfolio table, we have a 'View' button
     * for each contract.
    **/
    var trans = function(str) {
        $.each(uiTexts[pageLanguage], function(k, t) {
            if(-1 === str.indexOf(":"+k+":")) return true;
            str = str.split(":"+k+":").join(t);
        });
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
    var fixCurrency = function(n, currency) {
        if("number" !== typeof n) n = parseFloat(n);
        var snum = n + "", dec;
        if(-1 === snum.indexOf(".")) {
            dec = 2;
        } else {
            dec = snum.split(".")[1].length;
        }
        if("string" === typeof currency) {
            currency += " ";
        } else {
            var currency = "";
        }
        return currency + " " + n.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };
 
    return {
        init: init,
        updateBallance: updateBallance,
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
