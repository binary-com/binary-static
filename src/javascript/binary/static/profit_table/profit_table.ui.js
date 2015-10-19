const ProfitTableUI = (function(){
    function createProfitTable(data){
        const metadata = {
            id: "profit-table",
            class: "flex-table scrollable",
            cols: [
                "purchase date",
                "ref.",
                "contract",
                "purchase price",
                "sale date",
                "sale price",
                "profit/loss"
            ]
        }

        return CommonUI.generateTable(data, metadata, false);
    }


}());