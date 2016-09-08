var PortfolioWS =  (function() {
    'use strict';

    var values,
        currency,
        oauth_apps,
        hidden_class,
        is_initialized,
        is_first_response;

    var init = function() {
        if(is_initialized) return;

        values = {};
        currency = '';
        oauth_apps = {};
        hidden_class = 'invisible';
        showLoadingImage($("#portfolio-loading"));
        if (TUser.get().balance) {
            updateBalance();
        }
        is_first_response = true;
        BinarySocket.send({"portfolio":1});
        // Subscribe to transactions to auto update new purchases
        BinarySocket.send({'transaction': 1, 'subscribe': 1});
        BinarySocket.send({'oauth_apps': 1});
        is_initialized = true;
    };

    var createPortfolioRow = function(data, is_first) {
        var longCode = typeof module !== 'undefined' ? 
            data.longcode : 
            (japanese_client() ? toJapanTimeIfNeeded(void 0, void 0, data.longcode) : data.longcode);

        var new_class = is_first ? '' : 'new';
        $('#portfolio-body').prepend(
            $('<tr class="tr-first ' + new_class + ' ' + data.contract_id + '" id="' + data.contract_id + '">' +
                '<td class="ref"><span' + showTooltip(data.app_id, oauth_apps[data.app_id]) + '>' + data.transaction_id + '</span></td>' +
                '<td class="payout"><strong>' + format_money(data.currency, data.payout) + '</strong></td>' +
                '<td class="details">' + longCode + '</td>' +
                '<td class="purchase"><strong>' + format_money(data.currency, data.buy_price) + '</strong></td>' +
                '<td class="indicative"><strong class="indicative_price">' + format_money(data.currency, '--.--') + '</strong></td>' +
                '<td class="button"><button class="button open_contract_detailsws" contract_id="' + data.contract_id + '">' + text.localize('View') + '</button></td>' +
            '</tr>' +
            '<tr class="tr-desc ' + new_class + ' ' + data.contract_id + '">' +
                '<td colspan="6">' + longCode + '</td>' +
            '</tr>')
        );
    };

    var updateBalance = function() {
        if ($("#portfolio-balance").length === 0) return;
        $("#portfolio-balance").text(Portfolio.getBalance(TUser.get().balance, TUser.get().currency));
        var $if_balance_zero = $('#if-balance-zero');
        if(Portfolio.getBalance(TUser.get().balance) > 0 || page.client.is_virtual()) {
            $if_balance_zero.addClass(hidden_class);
        } else {
            $if_balance_zero.removeClass(hidden_class);
            if (page.client_status_detected('unwelcome, cashier_locked', 'any')) {
                $if_balance_zero.removeAttr('href').addClass('button-disabled');
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
            $("#portfolio-table").addClass(hidden_class);
        } else {
            /**
             * User has at least one contract
            **/
            $("#portfolio-no-contract").hide();
            var portfolio_data,
                contracts = '';
            $.each(data.portfolio.contracts, function(ci, c) {
                if (!values.hasOwnProperty(c.contract_id)) {
                    values[c.contract_id] = {};
                    values[c.contract_id].buy_price = c.buy_price;
                    portfolio_data = Portfolio.getPortfolioData(c);
                    currency = portfolio_data.currency;
                    createPortfolioRow(portfolio_data, is_first_response);
                    setTimeout(function() {
                        $('tr.' + c.contract_id).removeClass('new');
                    }, 1000);
                }
            });
            $("#portfolio-table").removeClass(hidden_class);

            // update footer area data
            updateFooter();

            // request "proposal_open_contract"
            BinarySocket.send({"proposal_open_contract":1, "subscribe":1});
        }
        // ready to show portfolio table
        $("#portfolio-loading").hide();
        $("#portfolio-content").removeClass(hidden_class);
        is_first_response = false;
    };

    var transactionResponseHandler = function(response) {
        if(response.hasOwnProperty('error')) {
            errorMessage(response.error.message);
            return;
        } else if(response.transaction.action === 'buy') {
            BinarySocket.send({'portfolio': 1});
        } else if(response.transaction.action === 'sell') {
            removeContract(response.transaction.contract_id);
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

    var updateOAuthApps = function(response) {
        oauth_apps = buildOauthApps(response.oauth_apps);
        addTooltip(oauth_apps);
    };

    var removeContract = function(contract_id) {
        delete(values[contract_id]);
        $('tr.' + contract_id)
            .removeClass('new')
            .css('opacity', '0.5')
            .fadeOut(1000, function() {
                $(this).remove();
                if ($('#portfolio-body tr').length === 0) {
                    $('#portfolio-table').addClass(hidden_class);
                    $('#cost-of-open-positions, #value-of-open-positions').text('');
                    $("#portfolio-no-contract").show();
                }
            });
        updateFooter();
    };

    var updateFooter = function() {
        $("#cost-of-open-positions").text(format_money(currency, addComma(Portfolio.getSumPurchase(values))));
        $("#value-of-open-positions").text(format_money(currency, addComma(Portfolio.getIndicativeSum(values))));
    };

    var errorMessage = function(msg) {
        var $err = $('#portfolio #err-msg');
        if(msg) {
            $err.removeClass(hidden_class).text(msg);
        } else {
            $err.addClass(hidden_class).text('');
        }
    };

    var onLoad = function() {
        if (!TradePage.is_trading_page() && !TradePage_Beta.is_trading_page()) {
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
                            PortfolioWS.updateOAuthApps(response);
                            break;
                        default:
                            // msg_type is not what PortfolioWS handles, so ignore it.
                    }
                }
            });
        }
        PortfolioWS.init();
    };

    var onUnload = function() {
        BinarySocket.send({"forget_all": "proposal_open_contract"});
        BinarySocket.send({"forget_all": "transaction"});
        $('#portfolio-body').empty();
        is_initialized = false;
    };

    return {
        init: init,
        updateBalance: updateBalance,
        updatePortfolio: updatePortfolio,
        updateIndicative: updateIndicative,
        updateOAuthApps: updateOAuthApps,
        transactionResponseHandler: transactionResponseHandler,
        onLoad: onLoad,
        onUnload: onUnload
    };

})();
