var Portfolio = (function(){
    'use strict';

    var Compatibility = typeof window !== 'undefined' ? window.Compatibility : require('../../../common_functions/compatibility');
    var addComma = Compatibility.requireIfNotExist('addComma', '../websocket_pages/trade/common', 'addComma'),
        toJapanTimeIfNeeded = Compatibility.requireIfNotExist('toJapanTimeIfNeeded', '../base/utility', 'toJapanTimeIfNeeded');

    function getBalance(data, withCurrency) {
        return withCurrency ? data.balance.currency + ' ' + addComma(parseFloat(data.balance.balance)) : parseFloat(data.balance.balance);
    }

    function getPortfolioData(c) {
        var portfolio_data = {
            'transaction_id' : c.transaction_id,
            'contract_id'    : c.contract_id,
            'payout'         : parseFloat(c.payout).toFixed(2),
            'longcode'       : typeof module !== 'undefined' ? c.longcode : japanese_client() ? toJapanTimeIfNeeded(c.expiry_time, '', c.longcode) : c.longcode,
            'currency'       : c.currency,
            'buy_price'      : addComma(parseFloat(c.buy_price))
        };

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

    function getSum(values, value_type) { // value_type is: indicative or buy_price
        var sum = 0;
        if (Object.keys(values).length !== 0) {
            for (var key in values) {
                if (values[key] && !isNaN(values[key][value_type])) {
                    sum += parseFloat(values[key][value_type]);
                }
            }
        }

        return sum.toFixed(2);
    }

    var external = {
        getBalance: getBalance,
        getPortfolioData: getPortfolioData,
        getProposalOpenContract: getProposalOpenContract,
        getIndicativeSum: function(values) { return getSum(values, 'indicative'); },
        getSumPurchase: function(values) { return getSum(values, 'buy_price'); },
    };

    if (typeof module !== 'undefined') {
        module.exports = external;
    }

    return external;
}());
