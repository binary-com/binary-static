const ViewBalance = (function () {
    function attachViewBalancePopupToBody(){
       const $viewBalanceDiv$ = $("<div></div>", {class: "inpage_popup_content invisible", id: "balance"});
       $("<h1></h1>", {text: "Balances"}).appendTo($viewBalanceDiv$);

       $viewBalanceDiv$.appendTo("body");
   }

    function generateBalanceTable(balanceResponse){
        const balanceRecords = [];
        const header = ["Login ID", "Currency", "Balance"];
        const balanceArray = balanceResponse.balance;
        for (var i = 0 ; i < balanceArray.length ; i++){
            const balanceRecord = [];
            balanceRecord.push(balanceArray.loginid);
            balanceRecord.push(balanceArray.currency);
            balanceRecord.push(balanceArray.balance);

            balanceRecords.push(balanceRecord);
        }

        const metadata = {
            id: "view-bal-table",
            cols: ["loginid", "currency", "balance"]
        };

        return CommonUI.generateTable(balanceRecords, metadata, header);
    }

    function generateClosePopUpButton(){
        const button = $("<button></button>", {class: "button", text: "Continue Trading", id: "close-popup"});

        button.click(function(){
           $("div #balance").addClass("invisible");
        });
        return button;
    }

    function showPopUp(balanceResponse){
        const $balTable = generateBalanceTable(balanceResponse);
        const $closeButton = generateClosePopUpButton();
        const $balanceDiv = $("div #balance");
        $balTable.appendTo($balanceDiv);
        $closeButton.appendTo($balanceDiv);

        $balanceDiv.removeClass("invisible");
    }

    var attached = false;
    function attachViewBalance($element){
        if (attached) {
            return;
        }
        attachViewBalancePopupToBody();
        $element.click(function(){
            TradeSocket.init();
            TradeSocket.send({balance: 1});
        });
    }

    return {
        showPopUp: showPopUp,
        attachViewBalance: attachViewBalance
    };
}());

ViewBalance.attachViewBalance($("div #balance"));
