var PortfolioWS =  (function() {
    'use strict';

    var rowTemplate;

    var init = function() {
        showLoadingImage($("#portfolio-loading"));
        // get the row template and then discard the node as it has served its purpose
        var $tempRow = $("#portfolio-dynamic tr[data-contract_id='!contract_id!']");
        if($tempRow.length) {
            rowTemplate = $tempRow[0].outerHTML;
            $tempRow.remove();
        }
        BinarySocket.send({"balance":1});
        BinarySocket.send({"portfolio":1});
        // Subscribe transactions to auto update new purchases
        BinarySocket.send({'transaction': 1, 'subscribe': 1});
    };


    /**
     * Show balance
    **/
    var updateBalance = function(data) {
        $("span[data-id='balance']").text(data.balance.currency + ' ' + addComma(parseFloat(data.balance.balance)));
        if(parseFloat(data.balance.balance, 10) > 0 || page.client.is_virtual()) {
            $('#if-balance-zero').addClass('dynamic');
        } else {
            $('#if-balance-zero').removeClass('dynamic');
        }
    };

    /**
     * Updates portfolio table
    **/
    var updatePortfolio = function(data) {
        /**
         * Check for error
        **/
        if(data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        /**
         * no open contracts
        **/
        if(0 === data.portfolio.contracts.length) {
            $("#portfolio-no-contract").show();
            $("#portfolio-table").addClass("dynamic");
            $("#portfolio-content").removeClass("dynamic");
            $("#portfolio-loading").hide();
            return true;
        }

        /**
         * User has at least one contract
        **/
        if(!rowTemplate) init();
        $("#portfolio-no-contract").hide();
        var contracts = '';
        var sumPurchase = 0.0;
        var currency;
        $.each(data.portfolio.contracts, function(ci, c) {
            sumPurchase += parseFloat(c.buy_price, 10);
            currency = c.currency;
            var longcode = toJapanTimeIfNeeded(c.expiry_time, '', c.longcode);

            contracts += rowTemplate
            .split("!transaction_id!").join(c.transaction_id)
            .split("!contract_id!").join(c.contract_id)
            .split("!payout!").join(parseFloat(c.payout).toFixed(2))
            .split("!longcode!").join(longcode)
            .split("!currency!").join(c.currency)
            .split("!buy_price!").join(addComma(parseFloat(c.buy_price)));
        });

        // contracts is ready to be added to the dom
        $("#portfolio-dynamic").append(trans(contracts));
        if(contracts.length > 0) {
            $("#portfolio-table").removeClass("dynamic");
        }

        // update footer area data
        sumPurchase = sumPurchase.toFixed(2);
        $("#cost-of-open-positions").text(currency + ' ' + addComma(parseFloat(sumPurchase)));

        // request "proposal_open_contract"
        BinarySocket.send({"proposal_open_contract":1, "subscribe":1});

        // ready to show portfolio table
        $("#portfolio-loading").remove();
        $("#portfolio-content").removeClass("dynamic");
    };

    var transactionResponseHandler = function(response) {
        if(response.hasOwnProperty('error')) {
            errorMessage(response.error.message);
            return;
        }

        if(response.transaction.action === 'buy') {
            $('#portfolio-dynamic').empty();
            BinarySocket.send({'portfolio': 1});
        }
        else if(response.transaction.action === 'sell') {
            $("tr[data-contract_id='" + response.transaction.contract_id + "']").remove();
            if($('#portfolio-dynamic tr').length === 0) {
                BinarySocket.send({"portfolio":1});
            }
        }
    };

    var updateIndicative = function(data) {
        if(data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        var proposal = data.proposal_open_contract;
        var $td = $("tr[data-contract_id='" + proposal.contract_id + "'] td.indicative");
        var old_indicative = $td.find('strong').text();
        old_indicative = parseFloat(old_indicative, 2);
        if(isNaN(old_indicative)) old_indicative = 0.0;

        var new_indicative = parseFloat(proposal.bid_price, 2);
        if(isNaN(new_indicative)) new_indicative = 0.0;

        var bid_price = parseFloat(proposal.bid_price || 0).toFixed(2);

        var status_class = '';
        var no_resale_html = '';
        if(proposal.is_sold == 1) {
            $td.parent('tr').remove();
            if($('#portfolio-dynamic tr').length === 0) {
                BinarySocket.send({"portfolio":1});
            }
        }
        else {
            if(proposal.is_valid_to_sell != 1) {
                no_resale_html = '<span>' + text.localize('Resale not offered') + '</span>';
                $td.addClass("no_resale");
            }
            else {
                status_class = new_indicative < old_indicative ? ' price_moved_down' : (new_indicative > old_indicative ? ' price_moved_up' : '');
                $td.removeClass("no_resale");
            }
            $td.html(proposal.currency + ' <strong class="indicative_price' + status_class + '"">' + bid_price + '</strong>' + no_resale_html);
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

        var curr = localStorage.getItem('client.currencies');
        $("#value-of-open-positions").text(curr + ' ' + parseFloat(indicative_sum).toFixed(2));
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

    var errorMessage = function(msg) {
        var $err = $('#portfolio #err-msg');
        if(msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    };

    var onLoad = function() {
        BinarySocket.init({
            onmessage: function(msg){
                var response;
                try {
                    response  = JSON.parse(msg.data);
                    if("object" !== typeof response || !("msg_type" in response)) {
                        throw new Error("Response from WS API is not well formatted.");
                    }
                } catch(e) {
                    throw new Error("Response from WS API is not well formatted."+ e);
                }

                var msg_type = response.msg_type;
                switch(msg_type) {
                    case "balance":
                        updateBalance(response);
                        break;
                    case "portfolio":
                        updatePortfolio(response);
                        break;
                    case "transaction":
                        transactionResponseHandler(response);
                        break;
                    case "proposal_open_contract":
                        updateIndicative(response);
                        break;
                    default:
                        // msg_type is not what PortfolioWS handles, so ignore it.
                }
            }
        });
        init();
    };

    var onUnload = function(){
        BinarySocket.send({"forget_all": "proposal_open_contract"});
        BinarySocket.send({"forget_all": "transaction"});
    };

    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative,
        transactionResponseHandler: transactionResponseHandler,
        onLoad: onLoad,
        onUnload: onUnload,
    };

})();

pjax_config_page_require_auth("user/portfoliows", function() {
    return {
        onLoad: PortfolioWS.onLoad,
        onUnload: PortfolioWS.onUnload,
    };
});
