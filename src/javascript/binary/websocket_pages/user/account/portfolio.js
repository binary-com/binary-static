var Portfolio = (function(){
    'use strict';

    var Compatibility = typeof window !== 'undefined' ? window.Compatibility : require('../../../common_functions/compatibility');
    var addComma = Compatibility.requireIfNotExist('addComma', '../websocket_pages/trade/common', 'addComma'),
        toJapanTimeIfNeeded = Compatibility.requireIfNotExist('toJapanTimeIfNeeded', '../base/utility', 'toJapanTimeIfNeeded');
    var sum_purchase = 0.00;

    function getBalance(data, separator) {
        return (data.balance.currency + ' ' + (separator ? addComma(parseFloat(data.balance.balance)) : parseFloat(data.balance.balance)));
    }

    function getPortfolioData(c) {
        var portfolio_data = {
            'transaction_id' : c.transaction_id,
            'contract_id'    : c.contract_id,
            'payout'         : parseFloat(c.payout).toFixed(2),
            'longcode'       : toJapanTimeIfNeeded(c.expiry_time, '', c.longcode),
            'currency'       : c.currency,
            'buy_price'      : addComma(parseFloat(c.buy_price))
        };

        sum_purchase += parseFloat(c.buy_price);

        return portfolio_data;
    }

    function getProposalOpenContract(proposal) {
        var proposal_data = {
            'contract_id'      : proposal.contract_id,
            'bid_price'        : parseFloat(proposal.bid_price || 0).toFixed(2),
            'is_sold'          : proposal.is_sold,
            'is_valid_to_sell' : proposal.is_valid_to_sell,
            'currency'         : proposal.currency
        };

        return proposal_data;
    }

    function getIndicativeSum(indicative) {
        var indicative_sum = 0;
        if (Object.keys(indicative).length !== 0) {
            for (var key in indicative) {
                if (indicative[key] && !isNaN(indicative[key])) {
                    indicative_sum += parseFloat(indicative[key]);
                }
            }
        }

        return indicative_sum.toFixed(2);
    }

    var external = {
        getBalance: getBalance,
        getPortfolioData: getPortfolioData,
        getProposalOpenContract: getProposalOpenContract,
        getIndicativeSum: getIndicativeSum,
        getSumPurchase: function() { return sum_purchase; },
        setSumPurchase: function() { sum_purchase = 0.0; }
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }

    return external;
}());
