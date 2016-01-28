var StatementUI = (function(){
    "use strict";
    var tableID = "statement-table";
    var columns = ["date", "ref", "act", "desc", "credit", "bal"];

    function createEmptyStatementTable(){
        var header = [
            Content.localize().textPurchaseDate,
            Content.localize().textRef,
            Content.localize().textAction,
            Content.localize().textDescription,
            Content.localize().textCreditDebit,
            Content.localize().textBalance
        ];

        header[5] = header[5] + (TUser.get().currency ? "(" + TUser.get().currency + ")" : "");

        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = Table.createFlexTable(data, metadata, header);
        return $tableContainer;
    }

    function updateStatementTable(transactions){
        Table.appendTableBody(tableID, transactions, createStatementRow);
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }

    function createStatementRow(transaction){
        var action = transaction["action_type"];
        var dateObj = new Date(transaction["transaction_time"] * 1000);
        if (action === 'sell') {
            dateObj = new Date(transaction["purchase_time"] * 1000);
        }
        action = StringUtil.toTitleCase(action);

        var momentObj = moment.utc(dateObj);
        var dateStr = momentObj.format("YYYY-MM-DD");
        var timeStr = momentObj.format("HH:mm:ss");

        var date = dateStr + "\n" + timeStr;
        var ref = transaction["transaction_id"];
        var desc = transaction["longcode"];
        var amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        var balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        var creditDebitType = (parseFloat(amount) >= 0) ? "profit" : "loss";

        var $statementRow = Table.createFlexTableRow([date, ref, action, desc, amount, balance], columns, "data");
        $statementRow.children(".credit").addClass(creditDebitType);
        $statementRow.children(".date").addClass("pre");

        //create view button and append
        if (action === "Sell" || action === "Buy") {
            var $viewButtonSpan = Button.createBinaryStyledButton();
            var $viewButton = $viewButtonSpan.children(".button").first();
            $viewButton.text(text.localize("View"));
            $viewButton.addClass("open_contract_details");
            $viewButton.attr("contract_id", transaction["contract_id"]);

            $statementRow.
                children(".desc").
                first().
                append("<br>").
                append($viewButtonSpan);    
        }

        return $statementRow[0];        //return DOM instead of jquery object
    }
    
    return {
        clearTableContent: clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable: updateStatementTable
    };
}());
