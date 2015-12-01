
var ProfitTableData = (function(){
    function getProfitTable(opts){
        var req = {profit_table: 1, description: 1};
        if(opts){
            $.extend(true, req, opts);
        }

        BinarySocket.send(req);
    }

    return {
        getProfitTable: getProfitTable
    };
}());