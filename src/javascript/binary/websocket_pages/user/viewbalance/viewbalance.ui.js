var format_money           = require('../../../common_functions/currency_to_symbol').format_money;
var PortfolioWS            = require('../account/portfolio/portfolio.init').PortfolioWS;
var updateContractBalance  = require('../../trade/common').updateContractBalance;

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
        var view = format_money(currency, balance.balance);

        TUser.get().balance = balance.balance;
        updateContractBalance(balance.balance);
        PortfolioWS.updateBalance();
        $(".topMenuBalance").text(view)
                     .css('visibility', 'visible');
    }

    return {
        updateBalances: updateBalances
    };
}());

module.exports = {
    ViewBalanceUI: ViewBalanceUI,
};
