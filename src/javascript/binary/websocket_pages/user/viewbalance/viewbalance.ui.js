var ViewBalanceUI = (function(){

    function updateBalances(response){
        if (response.hasOwnProperty('error')) {
            console.log(response.error.message);
            return;
        }
        var balance = response.balance;
        var currency = balance.currency;
        if (!currency) {
            return;
        }

        var amount = addComma(parseFloat(balance.balance));
        var view = format_money(currency, amount);

        TUser.get().balance = balance.balance;
        PortfolioWS.updateBalance();
        $(".topMenuBalance").text(view)
                     .css('visibility', 'visible');
    }

    return {
        updateBalances: updateBalances
    };
}());
