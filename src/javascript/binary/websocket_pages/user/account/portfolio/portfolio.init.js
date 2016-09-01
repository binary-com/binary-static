var PortfolioWS =  (function() {
    'use strict';

    var values,
        currency,
        oauth_apps;

    var init = function() {
        values = {};
        currency = '';
        oauth_apps = {};
        showLoadingImage($("#portfolio-loading"));
        if (TUser.get().balance) {
            updateBalance();
        }
        BinarySocket.send({"portfolio":1});
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({'transaction': 1, 'subscribe': 1});
        BinarySocket.send({'oauth_apps': 1});
    };

    var createPortfolioRow = function(data) {
        console.log(data);
        var longCode = typeof module !== 'undefined' ? 
            data.longcode : 
            (japanese_client() ? toJapanTimeIfNeeded(void 0, void 0, data.longcode) : data.longcode);

        $('#portfolio-body').append(
            $('<tr class="flex-tr" id="' + data.contract_id + '">' +
                '<td class="ref flex-tr-child">' + '<span' + showTooltip(data.app_id, oauth_apps[data.app_id]) + '>' + data.transaction_id + '</span>' +
                '</td>' +
                '<td class="payout flex-tr-child"><strong>' + format_money(data.currency, data.payout) + '</strong></td>' +
                '<td class="details flex-tr-child">' + longCode + '</td>' +
                '<td class="purchase flex-tr-child"><strong>' + format_money(data.currency, data.buy_price) + '</strong></td>' +
                '<td class="indicative flex-tr-child"><strong class="indicative_price">' + format_money(data.currency, '--.--') + '</strong></td>' +
                '<td class="button flex-tr-child"><button class="button open_contract_detailsws" contract_id="' + data.contract_id + '">' + text.localize('View') + '</button></td>' +
            '</tr>')
        );
    };

    var updateBalance = function() {
        if ($("#portfolio-balance").length === 0) return;
        $("#portfolio-balance").text(Portfolio.getBalance(TUser.get().balance, TUser.get().currency));
        var if_balance_zero = $('#if-balance-zero');
        if(Portfolio.getBalance(TUser.get().balance) > 0 || page.client.is_virtual()) {
            if_balance_zero.addClass('invisible');
        } else {
            if_balance_zero.removeClass('invisible');
            if (page.client_status_detected('unwelcome, cashier_locked', 'any')) {
                if_balance_zero.removeAttr('href').addClass('button-disabled');
            }
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
        if(data.hasOwnProperty('error') || !values) {
            return;
        }

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
            $td.html('<strong class="indicative_price' + status_class + '"">' + format_money(proposal.currency, values[proposal.contract_id].indicative) + '</strong>' + no_resale_html);
        }

        updateFooter();
    };

    var removeContract = function(contract_id) {
        $("#" + contract_id).remove();
        delete(values[contract_id]);
        updateFooter();
    };

    var updateFooter = function() {
        $("#cost-of-open-positions").text(format_money(currency, addComma(Portfolio.getSumPurchase(values))));
        $("#value-of-open-positions").text(format_money(currency, addComma(Portfolio.getIndicativeSum(values))));
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
                    case "portfolio":
                        PortfolioWS.updatePortfolio(response);
                        break;
                    case "transaction":
                        PortfolioWS.transactionResponseHandler(response);
                        break;
                    case "proposal_open_contract":
                        PortfolioWS.updateIndicative(response);
                        break;
                    case "oauth_apps":
                        oauth_apps = buildOauthApps(response.oauth_apps);
                        addTooltip(oauth_apps);
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
