
var ViewBalanceUI = (function(){

    function updateBalances(response){
        if(response.hasOwnProperty('error')) {
            console.log(response.error.message);
            return;
        }
        var balance = response.balance;
        var bal = addComma(Number(parseFloat(balance.balance)));
        var currency = balance.currency;
        var view = currency.toString() + " " + bal.toString();

        if(!currency){
            return;
        }

        TUser.get().balance = balance.balance;
        $("#balance").text(view);
    }

    return {
        updateBalances: updateBalances
    };
}());
