const StatementError = (function(){
    function genericErrorHandler(err){
        console.log(err);
    }
    
    function wsRequestErrorHandler(wsErrorPayload){
        StatementUI.clearStatementTableBody();
        console.log(wsErrorPayload);
        const $errorDiv = $("<div></div>", {class: "error-msg", text: wsErrorPayload.message});
        $errorDiv.insertBefore($("#statement-table-footer"));
    }
    
    return {
        genericErrHandler: genericErrorHandler,
        wsReqErrHandler: wsRequestErrorHandler
    };
}());