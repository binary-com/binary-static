const toJapanTimeIfNeeded = require('../../../base/clock').toJapanTimeIfNeeded;
const formatMoney         = require('../../../common_functions/currency_to_symbol').formatMoney;
const jpClient            = require('../../../common_functions/country_base').jpClient;

const Portfolio = (() => {
    'use strict';

    const getBalance = (balance, currency) => {
        balance = parseFloat(balance);
        return currency ? formatMoney(currency, balance) : balance;
    };

    const getPortfolioData = c => (
        {
            transaction_id: c.transaction_id,
            contract_id   : c.contract_id,
            payout        : parseFloat(c.payout),
            longcode      : typeof module !== 'undefined' ?
                c.longcode : (jpClient() ?
                    toJapanTimeIfNeeded(undefined, undefined, c.longcode) : c.longcode),
            currency : c.currency,
            buy_price: c.buy_price,
            app_id   : c.app_id,
        }
    );

    const getProposalOpenContract = proposal => (
        {
            contract_id     : proposal.contract_id,
            bid_price       : parseFloat(proposal.bid_price || 0),
            is_sold         : proposal.is_sold,
            is_valid_to_sell: proposal.is_valid_to_sell,
            currency        : proposal.currency,
        }
    );

    const getSum = (values, value_type) => { // value_type is: indicative or buy_price
        let sum = 0;
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (values[key] && !isNaN(values[key][value_type])) {
                sum += parseFloat(values[key][value_type]);
            }
        }

        return sum;
    };

    return {
        getBalance             : getBalance,
        getPortfolioData       : getPortfolioData,
        getProposalOpenContract: getProposalOpenContract,
        getIndicativeSum       : values => getSum(values, 'indicative'),
        getSumPurchase         : values => getSum(values, 'buy_price'),
    };
})();

module.exports = {
    Portfolio: Portfolio,
};
