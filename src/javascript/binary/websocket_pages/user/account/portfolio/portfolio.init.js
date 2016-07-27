var PortfolioWS =  (function() {
    'use strict';

    var values,
        currency;

    var init = function() {
        values = {};
        currency = '';
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
        $("#portfolio-balance").text(Portfolio.getBalance(data, true));
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
            values = {};
            $.each(data.portfolio.contracts, function(ci, c) {
                if(!values.hasOwnProperty(c.contract_id)) values[c.contract_id] = {};
                values[c.contract_id].buy_price = c.buy_price;
                portfolio_data = Portfolio.getPortfolioData(c);
                currency = portfolio_data.currency;
                createPortfolioRow(portfolio_data);
            });
            $("#portfolio-table").removeClass("invisible");

            // update footer area data
            updateFooter();

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
            removeContract(response.transaction.contract_id);
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
        if(!values) return;

        var proposal = Portfolio.getProposalOpenContract(data.proposal_open_contract);
        // force to sell the expired contract, in order to remove from portfolio
        if(proposal.is_expired == 1 && !proposal.is_sold) {
            BinarySocket.send({"sell_expired": 1});
        }
        var $td = $("#" + proposal.contract_id + " td.indicative");

        if(!values.hasOwnProperty(proposal.contract_id)) values[proposal.contract_id] = {};
        var old_indicative = values[proposal.contract_id].indicative || 0.00;
        values[proposal.contract_id].indicative = proposal.bid_price;

        var status_class = '',
            no_resale_html = '';
        if(proposal.is_sold == 1) {
            removeContract(proposal.contract_id);
        } else {
            if(proposal.is_valid_to_sell != 1) {
                no_resale_html = '<span>' + text.localize('Resale not offered') + '</span>';
                $td.addClass("no_resale");
            }
            else {
                status_class = values[proposal.contract_id].indicative < old_indicative ? ' price_moved_down' : (values[proposal.contract_id].indicative > old_indicative ? ' price_moved_up' : '');
                $td.removeClass("no_resale");
            }
            $td.html(proposal.currency + ' <strong class="indicative_price' + status_class + '"">' + values[proposal.contract_id].indicative + '</strong>' + no_resale_html);
        }

        updateFooter();
    };

    var removeContract = function(contract_id) {
        $("#" + contract_id).remove();
        delete(values[contract_id]);
        updateFooter();
    };

    var updateFooter = function() {
        $("#cost-of-open-positions").text(currency + ' ' + addComma(Portfolio.getSumPurchase(values)));
        $("#value-of-open-positions").text(currency + ' ' + addComma(Portfolio.getIndicativeSum(values)));
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

    var onUnload = function() {
        BinarySocket.send({"forget_all": "proposal_open_contract"});
        BinarySocket.send({"forget_all": "transaction"});
        $('#portfolio-body').empty();
    };

    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative,
        transactionResponseHandler: transactionResponseHandler,
        onLoad: onLoad,
        onUnload: onUnload
    };

})();
