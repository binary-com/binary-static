const getDecimalPlaces     = require('./currency').getDecimalPlaces;
const addComma             = require('../../_common/base/currency_base').addComma;
const Client               = require('../base/client');

const changePocNumbersToString = (response) => {
    const {
        barrier,
        bid_price,
        sell_price,
        profit_percentage,
    } = response.proposal_open_contract;

    const currency_decimal_places = getDecimalPlaces(Client.get('currency'));
    const toString = (property, decimal_places) => (
        property || property === 0 ?
            addComma(property, decimal_places)
            : undefined
    );

    return $.extend({}, {
        ...response,
        proposal_open_contract: {
            ...response.proposal_open_contract,
            barrier          : barrier ? addComma(barrier).replace(/,/g, '') : undefined, // Because `barrier` must not be displayed when zero
            bid_price        : toString(bid_price, currency_decimal_places),
            sell_price       : toString(sell_price, currency_decimal_places),
            profit_percentage: toString(profit_percentage, 2),
        },
    });
};

module.exports = {
    changePocNumbersToString,
};
