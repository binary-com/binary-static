import PortfolioInit from './account/portfolio/portfolio.init';
import { updateContractBalance } from '../trade/update_values';
import Client from '../../base/client';
import { formatMoney } from '../../common_functions/currency_to_symbol';

const updateBalance = (response) => {
    if (response.hasOwnProperty('error')) {
        console.log(response.error.message);
        return;
    }
    const balance = response.balance.balance;
    Client.set('balance', balance);
    PortfolioInit.updateBalance();
    const currency = response.balance.currency;
    if (!currency) {
        return;
    }
    const view = formatMoney(currency, balance);
    updateContractBalance(balance);
    $('.topMenuBalance').text(view).css('visibility', 'visible');
};

module.exports = updateBalance;
