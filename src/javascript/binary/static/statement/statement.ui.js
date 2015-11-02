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
        var footer = ["", "", "", "", "", ""];
        header[5] = header[5] + "(" + TUser.get().currency + ")";

        var metadata = {
            id: tableID,
            cols: columns
        };
        var data = [];
        var $tableContainer = Table.createFlexTable(data, metadata, header, footer);
        return $tableContainer;
    }

    function updateStatementTable(transactions){
        Table.appendTableBody(tableID, transactions, createStatementRow);
        updateStatementFooter(transactions);
        $("#" + tableID +">tfoot").show();
    }

    function clearTableContent(){
        Table.clearTableBody(tableID);
        $("#" + tableID +">tfoot").hide();
    }


    function updateStatementFooterBalance(balances){
        var accDropDown = document.getElementById("client_loginid");
        var acc = accDropDown.options[accDropDown.selectedIndex].value;
        var bal = balances.filter(function(element){
            return element.loginid === acc;
        });

        $("#statement-table > tfoot > tr").
            first().
            children(".bal").
            text(Number(parseFloat(bal[0].balance)).toFixed(2));
    }

    function updateStatementFooter(transactions){
        TradeSocket.send({balance: 1, passthrough: {purpose: "statement_footer"}});
        var accCredit = document.querySelector("#statement-table > tfoot > tr > .credit").textContent;
        accCredit = parseFloat(accCredit);
        if (isNaN(accCredit)) {
            accCredit = 0;
        }

        var newCredits = transactions.reduce(function(p, c){ return p + parseFloat(c.amount); }, 0);

        var totalCredit = accCredit + newCredits;
        totalCredit = Number(totalCredit).toFixed(2);

        var $footerRow = $("#" + tableID + " > tfoot > tr").first();
        var creditCell = $footerRow.children(".credit");
        var creditType = (totalCredit >= 0) ? "profit" : "loss";

        creditCell.text(totalCredit);
        creditCell.removeClass("profit").removeClass("loss");
        creditCell.addClass(creditType);
    }

    function createStatementRow(transaction){
        var dateObj = new Date(transaction["transaction_time"] * 1000);
        var momentObj = moment.utc(dateObj);
        var dateStr = momentObj.format("YYYY-MM-DD");
        var timeStr = momentObj.format("HH:mm:ss");

        var date = dateStr + "\n" + timeStr;
        var ref = transaction["transaction_id"];
        var action = StringUtil.toTitleCase(transaction["action_type"]);
        var desc = transaction["longcode"];
        var amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        var balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        var creditDebitType = (parseInt(amount) >= 0) ? "profit" : "loss";

        var $statementRow = Table.createFlexTableRow([date, ref, action, desc, amount, balance], columns, "data");
        $statementRow.children(".credit").addClass(creditDebitType);
        $statementRow.children(".date").addClass("break-line");

        return $statementRow[0];        //return DOM instead of jquery object
    }
    
    return {
        clearTableContent: clearTableContent,
        createEmptyStatementTable: createEmptyStatementTable,
        updateStatementTable: updateStatementTable,
        updateStatementFooterBalance: updateStatementFooterBalance
    };
}());
