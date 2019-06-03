const getUnderlyingPipSize = require('../pages/trade/symbols').getUnderlyingPipSize;
const addComma             = require('../../_common/base/currency_base').addComma;
const isEmptyObject        = require('../../_common/utility').isEmptyObject;

const changePocNumbersToString = (response) => {
    const {
        audit_details,
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

            let new_response = $.extend({}, {
                ...response,
                proposal_open_contract: {
                    ...response.proposal_open_contract,
                    barrier          : barrier ? addComma(barrier) : undefined, // Because `barrier` must not be displayed when zero
                    sell_price       : toString(sell_price),
                    sell_spot        : toString(sell_spot),
                    current_spot     : toString(current_spot),
                    entry_spot       : toString(entry_spot),
                    entry_tick       : toString(entry_tick),
                    exit_tick        : toString(exit_tick),
                    profit_percentage: toString(profit_percentage, 2),
                },
            });

            if (!isEmptyObject(audit_details)) {
                if (!isEmptyObject(audit_details.all_ticks)) {
                    const formatAuditDetails = (obj) => ({ ...obj, all_ticks: obj.all_ticks.map(tick_obj => (
                        { ...tick_obj, tick: toString(tick_obj.tick) }
                    )) });

                    new_response =  $.extend({}, {
                        ...new_response,
                        proposal_open_contract: {
                            ...new_response.proposal_open_contract,
                            audit_details: formatAuditDetails(audit_details),
                        },
                    });
                }
            }

            resolve(new_response);
        });
    });
};

module.exports = {
    changePocNumbersToString,
};
