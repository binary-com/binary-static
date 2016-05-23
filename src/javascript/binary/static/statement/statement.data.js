var StatementData = (function(){
    "use strict";
    var hasOlder = true;

    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){ 
            $.extend(true, req, opts);    
        }

        BinarySocket.send(req);
    }

    return {
        getStatement: getStatement,
        hasOlder: hasOlder
    };
}());
