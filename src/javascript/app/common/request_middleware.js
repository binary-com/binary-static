const getDecimalPlaces     = require('./currency').getDecimalPlaces;
const getUnderlyingPipSize = require('../pages/trade/symbols').getUnderlyingPipSize;
const addComma             = require('../../_common/base/currency_base').addComma;
const isEmptyObject        = require('../../_common/utility').isEmptyObject;
const Client               = require('../base/client');

const changePocNumbersToString = (response) => {
    const {
        audit_details,
        barrier,
        bid_price,
        current_spot,
        entry_spot,
        entry_tick,
        exit_tick,
        sell_price,
        sell_spot,
        tick_stream,
        profit_percentage,
    } = response.proposal_open_contract;

    return new Promise((resolve) => {
        getUnderlyingPipSize(response.proposal_open_contract.underlying).then(pip_size => {
            const currency_decimal_places = getDecimalPlaces(Client.get('currency'));
            const toString = (property, has_comma = true, decimal_places = pip_size) => (
                property || property === 0 ?
                    has_comma ? addComma(property, decimal_places) : addComma(property, decimal_places).replace(',', '')
                    : undefined
            );

            let new_response = $.extend({}, {
                ...response,
                proposal_open_contract: {
                    ...response.proposal_open_contract,
                    barrier          : barrier ? addComma(barrier).replace(',', '') : undefined, // Because `barrier` must not be displayed when zero
                    bid_price        : toString(bid_price, true, currency_decimal_places),
                    sell_price       : toString(sell_price, true, currency_decimal_places),
                    sell_spot        : toString(sell_spot),
                    current_spot     : toString(current_spot),
                    entry_spot       : toString(entry_spot, false),
                    entry_tick       : toString(entry_tick),
                    exit_tick        : toString(exit_tick),
                    profit_percentage: toString(profit_percentage, true, 2),
                },
            });

            if (!isEmptyObject(audit_details)) {
                const formatAuditDetails = (obj) => {
                    const modded_obj = { ...obj };

                    Object.keys(obj).forEach(key => {
                        modded_obj[key] = modded_obj[key].map(tick_obj => (
                            tick_obj.tick ? { ...tick_obj, tick: toString(tick_obj.tick) } : tick_obj
                        ));
                    });

                    return modded_obj;
                };

                new_response =  $.extend({}, {
                    ...new_response,
                    proposal_open_contract: {
                        ...new_response.proposal_open_contract,
                        audit_details: formatAuditDetails(audit_details),
                    },
                });
            }

            if (!isEmptyObject(tick_stream)) {
                const formatTickStream = (arr) => arr.map(tick_obj => (
                    tick_obj.tick ? { ...tick_obj, tick: toString(tick_obj.tick) } : tick_obj
                ));

                new_response =  $.extend({}, {
                    ...new_response,
                    proposal_open_contract: {
                        ...new_response.proposal_open_contract,
                        tick_stream: formatTickStream(tick_stream),
                    },
                });
            }

            resolve(new_response);
        });
    });
};

module.exports = {
    changePocNumbersToString,
};
