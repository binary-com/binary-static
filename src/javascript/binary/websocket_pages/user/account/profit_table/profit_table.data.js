const ProfitTableData = (function() {
    const getProfitTable = function(opts) {
        const req = { profit_table: 1, description: 1 };
        if (opts) {
            $.extend(true, req, opts);
        }

        BinarySocket.send(req);
    };

    return {
        getProfitTable: getProfitTable,
    };
})();

module.exports = {
    ProfitTableData: ProfitTableData,
};
