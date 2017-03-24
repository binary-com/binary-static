const toJapanTimeIfNeeded = require('../../../base/clock').toJapanTimeIfNeeded;
const format_money        = require('../../../common_functions/currency_to_symbol').format_money;
const japanese_client     = require('../../../common_functions/country_base').japanese_client;

const Portfolio = (function() {
    'use strict';

    const getBalance = function(balance, currency) {
        balance = parseFloat(balance);
        return currency ? format_money(currency, balance) : balance;
    };

    const getPortfolioData = function(c) {
        return {
            transaction_id: c.transaction_id,
            contract_id   : c.contract_id,
            payout        : parseFloat(c.payout).toFixed(2),
            longcode      : typeof module !== 'undefined' ?
                c.longcode : (japanese_client() ?
                    toJapanTimeIfNeeded(undefined, undefined, c.longcode) : c.longcode),
            currency : c.currency,
            buy_price: c.buy_price,
            app_id   : c.app_id,
        };
    };

    const getProposalOpenContract = function(proposal) {
        return {
            contract_id     : proposal.contract_id,
            bid_price       : parseFloat(proposal.bid_price || 0).toFixed(2),
            is_sold         : proposal.is_sold,
            is_valid_to_sell: proposal.is_valid_to_sell,
            currency        : proposal.currency,
        };
    };

    const getSum = function(values, value_type) { // value_type is: indicative or buy_price
        let sum = 0;
        const keys = Object.keys(values);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (values[key] && !isNaN(values[key][value_type])) {
                sum += parseFloat(values[key][value_type]);
            }
        }

        return sum.toFixed(2);
    };

    return {
        getBalance             : getBalance,
        getPortfolioData       : getPortfolioData,
        getProposalOpenContract: getProposalOpenContract,
        getIndicativeSum       : function(values) { return getSum(values, 'indicative'); },
        getSumPurchase         : function(values) { return getSum(values, 'buy_price'); },
    };
})();

module.exports = {
    Portfolio: Portfolio,
};
