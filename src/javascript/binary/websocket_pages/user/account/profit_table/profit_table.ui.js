
var ProfitTableUI = (function(){
    "use strict";

    var profitTableID = "profit-table";
    var cols = ["buy-date", "ref", "contract", "buy-price", "sell-date", "sell-price", "pl", "details"];

    function createEmptyTable(){
        var header = [
            Content.localize().textDate,
            Content.localize().textRef,
            Content.localize().textContract,
            Content.localize().textPurchasePrice,
            Content.localize().textSaleDate,
            Content.localize().textSalePrice,
            Content.localize().textProfitLoss,
            Content.localize().textDetails
        ];

        header[6] = header[6] + (TUser.get().currency ? " (" + TUser.get().currency + ")" : "");

        var footer = [Content.localize().textTotalProfitLoss, "", "", "", "", "", "", ""];

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

        $("#pl-day-total > .pl").text(addComma(Number(total).toFixed(2)));

        var subTotalType = (total >= 0 ) ? "profit" : "loss";
        $("#pl-day-total > .pl").removeClass("profit").removeClass("loss");
        $("#pl-day-total > .pl").addClass(subTotalType);
    }

    function createProfitTableRow(transaction){
        var buyMoment = moment.utc(transaction["purchase_time"] * 1000);
        var sellMoment = moment.utc(transaction["sell_time"] * 1000);

        var buyDate = buyMoment.format("YYYY-MM-DD") + "\n" + buyMoment.format("HH:mm:ss") + ' GMT';
        var sellDate = sellMoment.format("YYYY-MM-DD") + "\n" + sellMoment.format("HH:mm:ss") + ' GMT';

        var ref = transaction["transaction_id"];
        var buyPrice = Number(parseFloat(transaction["buy_price"])).toFixed(2);
        var sellPrice = Number(parseFloat(transaction["sell_price"])).toFixed(2);

        var pl = Number(sellPrice - buyPrice).toFixed(2);

        var plType = (pl >= 0) ? "profit" : "loss";

        var data = [buyDate, ref, '', buyPrice, sellDate, sellPrice, pl, ''];
        var $row = Table.createFlexTableRow(data, cols, "data");

        $row.children(".buy-date").addClass("pre");
        $row.children(".pl").addClass(plType);
        $row.children(".sell-date").addClass("pre");
        $row.children(".contract").html(transaction["longcode"] + "<br>");

        //create view button and append
        var $viewButtonSpan = Button.createBinaryStyledButton();
        var $viewButton = $viewButtonSpan.children(".button").first();
        $viewButton.text(text.localize("View"));
        $viewButton.addClass("open_contract_detailsws");
        $viewButton.attr("contract_id", transaction["contract_id"]);

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

    return {
        createEmptyTable: createEmptyTable,
        updateProfitTable: updateProfitTable,
        initDatepicker: initDatepicker,
        cleanTableContent: clearTableContent
    };
}());
