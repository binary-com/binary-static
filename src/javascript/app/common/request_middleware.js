const getUnderlyingPipSize = require('../pages/trade/symbols').getUnderlyingPipSize;
const addComma             = require('../../_common/base/currency_base').addComma;

const changePocNumbersToString = (response) => {
    const {
        barrier,
        current_spot,
        entry_spot,
        entry_tick,
        exit_tick,
        sell_price,
        sell_spot,
        profit_percentage,
    } = response.proposal_open_contract;

    return new Promise((resolve) => {
        getUnderlyingPipSize(response.proposal_open_contract.underlying).then(pip_size => {
            const toString = (property, decimal_places = pip_size) => (
                property || property === 0 ? addComma(property, decimal_places) : undefined
            );

            resolve($.extend({}, {
                ...response,
                proposal_open_contract: {
                    ...response.proposal_open_contract,
                    barrier          : barrier ? addComma(barrier, pip_size) : undefined, // Because `barrier` must not be displayed when zero
                    sell_price       : toString(sell_price),
                    sell_spot        : toString(sell_spot),
                    current_spot     : toString(current_spot),
                    entry_spot       : toString(entry_spot),
                    entry_tick       : toString(entry_tick),
                    exit_tick        : toString(exit_tick),
                    profit_percentage: toString(profit_percentage, 2),
                },
            }));
        });
    });
};

module.exports = {
    changePocNumbersToString,
};
