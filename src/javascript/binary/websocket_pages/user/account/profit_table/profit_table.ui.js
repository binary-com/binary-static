var ProfitTableUI = (function(){
    "use strict";

    var profitTableID = "profit-table";
    var cols = ["buy-date", "ref", "payout", "contract", "buy-price", "sell-date", "sell-price", "pl", "details"];
    var oauth_apps = {};

    function createEmptyTable(){
        var header = [
            Content.localize().textDate,
            Content.localize().textRef,
            text.localize('Potential Payout'),
            Content.localize().textContract,
            Content.localize().textPurchasePrice,
            Content.localize().textSaleDate,
            Content.localize().textSalePrice,
            Content.localize().textProfitLoss,
            Content.localize().textDetails
        ];

        var jpClient = japanese_client();

        header[7] = header[7] + (jpClient ? "" : (TUser.get().currency ? " (" + TUser.get().currency + ")" : ""));

        var footer = [Content.localize().textTotalProfitLoss, "", "", "", "", "", "", "", ""];

        var data = [];
        var metadata = {
            cols: cols,
            id: profitTableID
        };
        var $tableContainer = Table.createFlexTable(data, metadata, header, footer);

        var $pltotal = $tableContainer.
            children("table").
            children("tfoot").
            children("tr").
            attr("id", "pl-day-total");

        return $tableContainer;
    }

    function updateProfitTable(transactions){
        Table.appendTableBody(profitTableID, transactions, createProfitTableRow);
        updateFooter(transactions);
    }

    function updateFooter(transactions){
        var accTotal = document.querySelector("#pl-day-total > .pl").textContent;
        accTotal = parseFloat(accTotal.replace(/,/g, ''));
        if (isNaN(accTotal)) {
            accTotal = 0;
        }

        var currentTotal = transactions.reduce(function(previous, current){
            var buyPrice = Number(parseFloat(current["buy_price"]));
            var sellPrice = Number(parseFloat(current["sell_price"]));
            var pl = sellPrice - buyPrice;
            return previous + pl;
        }, 0);

        var total = accTotal + currentTotal;

        var jpClient = japanese_client();

        $("#pl-day-total > .pl").text(jpClient ? format_money_jp(TUser.get().currency, total.toString()) : addComma(Number(total).toFixed(2)));

        var subTotalType = (total >= 0 ) ? "profit" : "loss";
        $("#pl-day-total > .pl").removeClass("profit").removeClass("loss");
        $("#pl-day-total > .pl").addClass(subTotalType);
    }

    function createProfitTableRow(transaction){
        var profit_table_data = ProfitTable.getProfitTabletData(transaction);
        var plType = (profit_table_data.pl >= 0) ? "profit" : "loss";

        var jpClient = japanese_client();

        var data = [profit_table_data.buyDate, '<span' + showTooltip(profit_table_data.app_id, oauth_apps[profit_table_data.app_id]) + '>' + profit_table_data.ref + '</span>', jpClient ? format_money_jp(TUser.get().currency, profit_table_data.payout) : profit_table_data.payout , '', jpClient ? format_money_jp(TUser.get().currency, profit_table_data.buyPrice) : profit_table_data.buyPrice , profit_table_data.sellDate, jpClient ? format_money_jp(TUser.get().currency, profit_table_data.sellPrice) : profit_table_data.sellPrice , jpClient ? format_money_jp(TUser.get().currency, profit_table_data.pl) : profit_table_data.pl , ''];
        var $row = Table.createFlexTableRow(data, cols, "data");

        $row.children(".buy-date").addClass("pre");
        $row.children(".pl").addClass(plType);
        $row.children(".sell-date").addClass("pre");
        $row.children(".contract").html(profit_table_data.desc + "<br>");

        //create view button and append
        var $viewButtonSpan = Button.createBinaryStyledButton();
        var $viewButton = $viewButtonSpan.children(".button").first();
        $viewButton.text(text.localize("View"));
        $viewButton.addClass("open_contract_detailsws");
        $viewButton.attr("contract_id", profit_table_data.id);

        $row.children(".contract,.details").append($viewButtonSpan);

        return $row[0];
    }

    function initDatepicker(){
        DatepickerUtil.initDatepicker("profit-table-date", moment.utc(), null, 0);
    }

    function clearTableContent(){
        Table.clearTableBody(profitTableID);
        $("#" + profitTableID + ">tfoot").hide();
    }

    function errorMessage(msg) {
        var $err = $('#profit-table-ws-container #err-msg');
        if(msg) {
            $err.removeClass('invisible').text(msg);
        } else {
            $err.addClass('invisible').text('');
        }
    }

    return {
        createEmptyTable: createEmptyTable,
        updateProfitTable: updateProfitTable,
        initDatepicker: initDatepicker,
        cleanTableContent: clearTableContent,
        errorMessage: errorMessage,
        setOauthApps: function(values) {
            return (oauth_apps = values);
        }
    };
}());
