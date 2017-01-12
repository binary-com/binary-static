const format_money          = require('../../../common_functions/currency_to_symbol').format_money;
const PortfolioWS           = require('../account/portfolio/portfolio.init').PortfolioWS;
const updateContractBalance = require('../../trade/common').updateContractBalance;
const Client                = require('../../../base/client').Client;
const Cashier               = require('../../cashier/cashier').Cashier;

const ViewBalanceUI = (function() {
    const updateBalances = function(response) {
        if (response.hasOwnProperty('error')) {
            console.log(response.error.message);
            return;
        }
        const balance = response.balance.balance;
        Client.set_value('balance', balance);
        PortfolioWS.updateBalance();
        const currency = response.balance.currency;
        if (!currency) {
            return;
        }
        const view = format_money(currency, balance);
        updateContractBalance(balance);
        $('.topMenuBalance').text(view)
            .css('visibility', 'visible');
        Cashier.check_top_up_withdraw();
    };

    return {
        updateBalances: updateBalances,
    };
})();

module.exports = {
    ViewBalanceUI: ViewBalanceUI,
};
