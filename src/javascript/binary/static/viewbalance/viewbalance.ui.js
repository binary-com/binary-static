
var ViewBalanceUI = (function(){

    function updateBalances(balance){
        var bal = Number(parseFloat(balance.balance)).toFixed(2);
        var currency = balance.currency;
        var view = currency.toString() + " " + bal.toString();

        if(!currency){
            return;
        }

        $("#balance").text(view);
    }

    return {
        updateBalances: updateBalances
    };
}());
