const PortfolioInit         = require('./account/portfolio/portfolio.init');
const updateContractBalance = require('../trade/update_values').updateContractBalance;
const Client                = require('../../base/client');
const getPropertyValue      = require('../../base/utility').getPropertyValue;
const formatMoney           = require('../../common_functions/currency').formatMoney;
const BinarySocket          = require('../../websocket_pages/socket');

const updateBalance = (response) => {
    if (getPropertyValue(response, 'error')) {
        return;
    }
    BinarySocket.wait('website_status').then(() => {
        const balance = response.balance.balance;
        Client.set('balance', balance);
        PortfolioInit.updateBalance();
        const currency = response.balance.currency;
        if (!currency) {
            return;
        }
        const view = formatMoney(currency, balance);
        updateContractBalance(balance);
        $('.topMenuBalance').html(view)
            .css('visibility', 'visible');
    });
};

module.exports = updateBalance;
