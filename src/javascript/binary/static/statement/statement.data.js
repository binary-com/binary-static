const StatementData = (function(){
    "use strict";

    TradeSocket.init();

    function getBalance(){
        TradeSocket.send({balance: 1});
    }
    
    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        TradeSocket.send(req);
    }
    
    return {
        getStatement: getStatement,
        getBalance: getBalance
    };
}());
