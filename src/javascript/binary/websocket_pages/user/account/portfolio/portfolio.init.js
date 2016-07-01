var PortfolioWS =  (function() {
    'use strict';

    var indicative;

    var init = function() {
        indicative = {};
        showLoadingImage($("#portfolio-loading"));
        BinarySocket.send({"balance":1});
        BinarySocket.send({"portfolio":1});
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({'transaction': 1, 'subscribe': 1});
    };

    var createPortfolioRow = function(data) {
        $('#portfolio-body').append(
            '<tr class="flex-tr" id="' + data.contract_id + '">' +
                '<td class="ref flex-tr-child">' + data.transaction_id + '</td>' +
                '<td class="payout flex-tr-child">' + data.currency + ' <strong>' + data.payout + '</strong></td>' +
                '<td class="details flex-tr-child">' + data.longcode + '</td>' +
                '<td class="purchase flex-tr-child">' + data.currency + ' <strong>' + data.buy_price + '</strong></td>' +
                '<td class="indicative flex-tr-child">' + data.currency + ' <strong class="indicative_price"></strong></td>' +
                '<td class="button flex-tr-child"><button class="button open_contract_detailsws" contract_id="' + data.contract_id + '">' + text.localize('View') + '</button></td>' +
            '</tr>'
        );
    };

    var updateBalance = function(data) {
        $("#portfolio-balance").text(Portfolio.getBalance(data, 'separator'));
        if(Portfolio.getBalance(data) > 0 || page.client.is_virtual()) {
            $('#if-balance-zero').addClass('invisible');
        } else {
            $('#if-balance-zero').removeClass('invisible');
        }
    };

    var updatePortfolio = function(data) {
        if(data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        // no open contracts
        if(data.portfolio.contracts.length === 0) {
            $("#portfolio-no-contract").show();
            $("#portfolio-table").addClass("invisible");
        } else {
            /**
             * User has at least one contract
            **/
            $("#portfolio-no-contract").hide();
            var portfolio_data,
                contracts = '';
            Portfolio.setSumPurchase();
            $.each(data.portfolio.contracts, function(ci, c) {
                portfolio_data = Portfolio.getPortfolioData(c);
                createPortfolioRow(portfolio_data);
            });
            $("#portfolio-table").removeClass("invisible");

            // update footer area data
            $("#cost-of-open-positions").text(portfolio_data.currency + ' ' + addComma(Portfolio.getSumPurchase()));

            // request "proposal_open_contract"
            BinarySocket.send({"proposal_open_contract":1, "subscribe":1});
        }
        // ready to show portfolio table
        $("#portfolio-loading").hide();
        $("#portfolio-content").removeClass("invisible");
    };

    var transactionResponseHandler = function(response) {
        if(response.hasOwnProperty('error')) {
            errorMessage(response.error.message);
            return;
        } else if(response.transaction.action === 'buy') {
            $('#portfolio-body').empty();
            BinarySocket.send({'portfolio': 1});
        } else if(response.transaction.action === 'sell') {
            $("#" + response.transaction.contract_id).remove();
        }
        if ($('#portfolio-body tr').length === 0) {
            $('#portfolio-table').addClass('invisible');
            $('#cost-of-open-positions').text('');
            $('#value-of-open-positions').text('');
            $("#portfolio-no-contract").show();
        }
    };

    var updateIndicative = function(data) {
        if(data.hasOwnProperty('error')) {
            errorMessage(data.error.message);
            return;
        }

        var proposal = Portfolio.getProposalOpenContract(data.proposal_open_contract);
        // force to sell the expired contract, in order to remove from portfolio
        if(proposal.is_expired == 1 && !proposal.is_sold) {
            BinarySocket.send({"sell_expired": 1});
        }
        var $td = $("#" + proposal.contract_id + " td.indicative");

        var old_indicative = indicative[proposal.contract_id] ? indicative[proposal.contract_id] : 0.00;
        indicative[proposal.contract_id] = proposal.bid_price;

        var indicative_sum = Portfolio.getIndicativeSum(indicative);

        var status_class = '',
            no_resale_html = '';
        if(proposal.is_sold == 1) {
             $("#" + proposal.contract_id).remove();
        } else {
            if(proposal.is_valid_to_sell != 1) {
                no_resale_html = '<span>' + text.localize('Resale not offered') + '</span>';
                $td.addClass("no_resale");
            }
            else {
                status_class = indicative[proposal.contract_id] < old_indicative ? ' price_moved_down' : (indicative[proposal.contract_id] > old_indicative ? ' price_moved_up' : '');
                $td.removeClass("no_resale");
            }
            $td.html(proposal.currency + ' <strong class="indicative_price' + status_class + '"">' + indicative[proposal.contract_id] + '</strong>' + no_resale_html);
        }

        $("#value-of-open-positions").text(proposal.currency + ' ' + indicative_sum);
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
                var response = JSON.parse(msg.data),
                    msg_type = response.msg_type;

                switch(msg_type) {
                    case "balance":
                        PortfolioWS.updateBalance(response);
                        break;
                    case "portfolio":
                        PortfolioWS.updatePortfolio(response);
                        break;
                    case "transaction":
                        PortfolioWS.transactionResponseHandler(response);
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
    };

    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative,
        transactionResponseHandler: transactionResponseHandler,
        onLoad: onLoad
    };

})();
