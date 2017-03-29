const formatMoney           = require('../../../common_functions/currency_to_symbol').formatMoney;
const PortfolioWS           = require('../account/portfolio/portfolio.init');
const updateContractBalance = require('../../trade/common').updateContractBalance;
const Client                = require('../../../base/client');

const ViewBalanceUI = (function() {
    const updateBalances = function(response) {
        if (response.hasOwnProperty('error')) {
            console.log(response.error.message);
            return;
        }
        const balance = response.balance.balance;
        Client.set('balance', balance);
        PortfolioWS.updateBalance();
        const currency = response.balance.currency;
        if (!currency) {
            return;
        }
        const view = formatMoney(currency, balance);
        updateContractBalance(balance);
        $('.topMenuBalance').text(view)
            .css('visibility', 'visible');
    };

    return {
        updateBalances: updateBalances,
    };
})();

module.exports = {
    ViewBalanceUI: ViewBalanceUI,
};
