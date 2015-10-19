const StatementUI = (function(){
    "use strict";
    const $statementTable = $("#statement-table");
    const $statementTableFooter = $("#statement-table-footer");
    const $statementTableBody = $("#statement-table-body");
    const $datePickerWidget = $("#statement-date");

    function setDescColSpan(spanNo){
        $(".desc-col-item").attr("colspan", spanNo);
    }

    function setStatementTable(statementResponse){

        const dateReq = new Date(statementResponse.echo_req.dt_to * 1000);
        //TODO : need to check if there' newer or older and show the button accordingly

        const statementData = statementResponse.statement;

        console.info("rendering table");
        clearStatementTableBody();

        const transactions = statementData.transactions;
        appendTransactionsToTable(transactions, $statementTable);

        const creditTotal = transactions.reduce(function(previousValue, currentValue){
            return previousValue + parseFloat(currentValue.amount);
        }, 0);

        $statementTableFooter
            .children(".date-col-item")
            .text(moment.utc().format("YYYY-MM-DD"));
        
        $statementTableFooter
            .children(".credit-col-item")
            .text(Number(creditTotal).toFixed(2));

        $("#statement-table-container").floatingScroll();
        //setDescColSpan(2);
    }    
    function setStatementTableFooterBalance(balanceObj){
        const balance = Number(balanceObj[0].balance).toFixed(2);
        $statementTableFooter
            .children(".bal-col-item")
            .text(balance);
    }
    function clearStatementTableBody(){
        $statementTableFooter
            .children(".credit-col-item")
            .text("");
        $statementTableBody
            .children()
            .remove();
    };
    function appendTransactionsToTable(transactions, $tableDOM){

        for (var i = 0 ; i < transactions.length ; i ++) {
            const rowDOM = generateTransactionDOM(transactions[i]);
            rowDOM.appendTo($statementTableBody);
        }
    }
    function generateTransactionDOM(transaction){
        const $rowDom = $("<tr></tr>", {class: "flex-table-row"});

        const dateObj = new Date(transaction["transaction_time"] * 1000);
        const momentObj = moment(dateObj);
        const dateStr = momentObj.format("YYYY-MM-DD");
        const timeStr = momentObj.format("HH:mm:ss");

        const ref = transaction["transaction_id"];

        const action = transaction["action_type"];

        const desc = transaction["description"];

        const amount = Number(parseFloat(transaction["amount"])).toFixed(2);
        const creditDebitType = (parseInt(amount) >= 0) ? "profit" : "loss";

        const balance = Number(parseFloat(transaction["balance_after"])).toFixed(2);

        const dateDom = $("<td></td>", {
            class: "flex-table-row-item breakline date-col-item",
            text: dateStr + "\n" + timeStr
        }).appendTo($rowDom);

        const refDom = $("<td></td>", {
            class: "flex-table-row-item ref-col-item",
            text: ref
        }).appendTo($rowDom);

        const actionDom = $("<td></td>", {
            class: "flex-table-row-item action-col-item",
            text: action
        }).appendTo($rowDom);

        const descDom = $("<td></td>", {
            class: "flex-table-row-item desc-col-item",
            text: desc
        }).appendTo($rowDom);

        const creditDebitDom = $("<td></td>", {
            class: "flex-table-row-item credit-col-item " + creditDebitType,
            text: amount
        }).appendTo($rowDom);

        const balanceDom = $("<td></td>", {
            class: "flex-table-row-item bal-col-item",
            text: balance
        }).appendTo($rowDom);

        return $rowDom;
    }
    function datepickerDefault(date){
        const utcMoment = moment.utc(date).format("MM/DD/YYYY").toString();
        const utcDate = Date.parse(utcMoment);
        
        $(".has-date-picker").
            datepicker({defaultDate: utcDate}).
            datepicker("setDate", utcDate);
    }
    function showButtonOnDateChange(){
        $datePickerWidget.on("change", function() {
            $("#submit-date").removeClass("invisible");
        });
    }
    
    const publicMethods = {
        setStatementTable: setStatementTable,
        setDatePickerDefault: datepickerDefault,
        showButtonOnDateChange: showButtonOnDateChange,
        setStatementTableFooterBalance: setStatementTableFooterBalance,
        clearStatementTableBody: clearStatementTableBody
    }
    
    return publicMethods;
}());
