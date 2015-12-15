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
        BinarySocket.send({"balance":1});
    };


    /**
     * Show balance
    **/
    var updateBalance = function(data) {
        $("span[data-id='balance']").text(data.balance.currency + ' ' + addComma(parseFloat(data.balance.balance)));
        if(parseFloat(data.balance.balance, 10) > 0) {
            $("#if-balance-zero").remove();
        }
        BinarySocket.send({"portfolio":1});
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
         * no open contracts
        **/
        if(0 === data.portfolio.contracts.length) {
            $("#portfolio-table").addClass("dynamic");
            $("#portfolio-content").removeClass("dynamic");
            $("#trading_init_progress").hide();
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
            .split("!buy_price!").join(addComma(parseFloat(c.buy_price)));
        });

        // contracts is ready to be added to the dom
        $("#portfolio-dynamic").replaceWith(trans(contracts));

        // update footer area data
        sumPurchase = sumPurchase.toFixed(2);
        $("#cost-of-open-positions").text(currency + ' ' + addComma(parseFloat(sumPurchase)));

        // request "proposal_open_contract"
        BinarySocket.send({"proposal_open_contract":1});

        // ready to show portfolio table
        $("#trading_init_progress").remove();
        $("#portfolio-content").removeClass("dynamic");

    };

    var updateIndicative = function(data) {

        var $td = $("tr[data-contract_id='"+data.proposal_open_contract.contract_id+"'] td.indicative");
        var old_indicative = $td.find('strong').text();
        old_indicative = parseFloat(old_indicative, 2);
        if(isNaN(old_indicative)) old_indicative = 0.0;

        var new_indicative = parseFloat(data.proposal_open_contract.bid_price, 2);
        if(isNaN(new_indicative)) new_indicative = 0.0;

        if(data.proposal_open_contract.is_valid_to_sell != 1) {
            $td.html(data.proposal_open_contract.currency+' <strong class="indicative_price">'+data.proposal_open_contract.bid_price+'</strong><span>'+text.localize('Resale not offered')+'</span>').addClass("no_resale");
        } else {
            $td.removeClass("no_resale");

            if(old_indicative > new_indicative) {
                $td.html(data.proposal_open_contract.currency+' <strong class="indicative_price price_moved_down">'+data.proposal_open_contract.bid_price+'</strong>');
            } else if(old_indicative < new_indicative) {
                $td.html(data.proposal_open_contract.currency+' <strong class="indicative_price price_moved_up">'+data.proposal_open_contract.bid_price+'</strong>');
            }            
        }

        var indicative_sum = 0, indicative_price = 0, up_down;
        $("strong.indicative_price").each(function() {
            indicative_price = $(this).text();
            indicative_price = parseFloat(indicative_price, 2);
            if(!isNaN(indicative_price)) {
                indicative_sum += indicative_price;
            }
        });

        indicative_sum = indicative_sum.toFixed(2);

        $("#value-of-open-positions").text('USD ' + addComma(parseFloat(indicative_sum)));

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
 
    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative
    };

})();

pjax_config_page("user/portfoliows", function() {
    return {
        onLoad: function() {
            if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }
            BinarySocket.init({

                onmessage: function(msg){

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

                        case "balance":
                            PortfolioWS.updateBalance(response);
                            break;

                        case "portfolio":
                            PortfolioWS.updatePortfolio(response);
                            break;

                        case "proposal_open_contract":
                            PortfolioWS.updateIndicative(response);
                            break;

                        default:
                            // msg_type is not what PortfolioWS handles, so ignore it.

                    }

                }
            });      
            PortfolioWS.init();
        }
    };
});
