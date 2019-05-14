const getUnderlyingPipSize = require('../pages/trade/symbols').getUnderlyingPipSize;
const addComma             = require('../../_common/base/currency_base').addComma;

const changePocNumbersToString = (response) => {
    const {
        current_spot,
        exit_tick,
        sell_price,
    } = response.proposal_open_contract;

    return new Promise((resolve) => {
        getUnderlyingPipSize(response.proposal_open_contract.underlying).then(pip_size => {
            const toString = (property) => (
                property || property === 0 ? addComma(property, pip_size) : undefined
            );

            resolve($.extend({}, {
                ...response,
                proposal_open_contract: {
                    ...response.proposal_open_contract,
                    sell_price  : toString(sell_price),
                    current_spot: toString(current_spot),
                    exit_tick   : toString(exit_tick),
                },
            }));
        });
    });
};

module.exports = {
    changePocNumbersToString,
};
