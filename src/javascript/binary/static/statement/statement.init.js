const StatementWS = (function(){
    "use strict";
    function genericEventHandler(event){
        const payload = JSON.parse(event.data);
        const type = payload.msg_type;

        switch(type) {
            case "statement" :
                StatementUI.setStatementTable(payload.statement);
                break;
            case "balance" :
                StatementUI.setStatementTableFooterBalance(payload.balance);
                break;
            case "error" :
                StatementError.wsReqErrHandler(payload.error);
                break;
            default:
                throw "Unhandled case " + type;
        }
    }

    function reloadPageOnDateSubmit(){
        const submitButton = $("#submit-date");
        submitButton.click(function(){
            var date = $("#statement-date").datepicker("getDate");
            date.setDate(date.getDate() + 1);
            var epoch = Math.floor(date.getTime()/1000);

            StatementUI.clearStatementTableBody();
            $(".error-msg").text("");

            StatementData.getStatement({dt_to: epoch});
            StatementData.getBalance();
            submitButton.addClass("invisible");
        });    
    }
    
    function loadPage(){
        StatementData.getStatement();
        StatementData.getBalance();
    }

    function initPage(){
        StatementData.registerHandler(genericEventHandler, StatementError.genericErrHandler);
        
        StatementUI.setDatePickerDefault(new Date());
        StatementUI.showButtonOnDateChange();
        reloadPageOnDateSubmit();
        
        loadPage();
    }
    
    return {init: initPage};
}());
