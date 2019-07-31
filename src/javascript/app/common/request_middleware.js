const getDecimalPlaces     = require('./currency').getDecimalPlaces;
const Client               = require('../base/client');
const addComma             = require('../../_common/base/currency_base').addComma;
const isEmptyObject        = require('../../_common/utility').isEmptyObject;

const changePocNumbersToString = (response) => {
    const {
        audit_details,
        barrier,
        bid_price,
        current_spot_display_value,
        display_value,
        entry_spot_display_value,
        entry_tick_display_value,
        exit_tick_display_value,
        sell_price,
        sell_spot_display_value,
        tick_stream,
        profit_percentage,
    } = response.proposal_open_contract;

    const currency_decimal_places = getDecimalPlaces(Client.get('currency'));
    const toString = (property, decimal_places) => (
        property || property === 0 ?
            addComma(property, decimal_places)
            : undefined
    );

    let modded_response =  $.extend({}, {
        ...response,
        proposal_open_contract: {
            ...response.proposal_open_contract,
            barrier                   : barrier ? addComma(barrier).replace(/,/g, '') : undefined, // Because `barrier` must not be displayed when zero
            bid_price                 : toString(bid_price, currency_decimal_places),
            sell_price                : toString(sell_price, currency_decimal_places),
            profit_percentage         : toString(profit_percentage, 2),
            current_spot_display_value: current_spot_display_value ? addComma(current_spot_display_value) : undefined,
            display_value             : display_value ? addComma(display_value) : undefined,
            entry_spot_display_value  : entry_spot_display_value ? addComma(entry_spot_display_value) : undefined,
            entry_tick_display_value  : entry_tick_display_value ? addComma(entry_tick_display_value) : undefined,
            exit_tick_display_value   : exit_tick_display_value ? addComma(exit_tick_display_value) : undefined,
            sell_spot_display_value   : sell_spot_display_value ? addComma(sell_spot_display_value) : undefined,
        },
    });

    if (!isEmptyObject(audit_details)) {
        const formatAuditDetails = (obj) => {
            const modded_obj = { ...obj };

            Object.keys(obj).forEach(key => {
                modded_obj[key] = modded_obj[key].map(tick_obj => (
                    tick_obj.tick ?
                        { ...tick_obj, tick_display_value: addComma(tick_obj.tick_display_value) }
                        : tick_obj
                ));
            });

            return modded_obj;
        };

        modded_response =  $.extend({}, {
            ...modded_response,
            proposal_open_contract: {
                ...modded_response.proposal_open_contract,
                audit_details: formatAuditDetails(audit_details),
            },
        });
    }

    if (!isEmptyObject(tick_stream)) {
        const formatTickStream = (arr) => arr.map(tick_obj => (
            tick_obj.tick ? { ...tick_obj, tick_display_value: addComma(tick_obj.tick_display_value) } : tick_obj
        ));

        modded_response =  $.extend({}, {
            ...modded_response,
            proposal_open_contract: {
                ...modded_response.proposal_open_contract,
                tick_stream: formatTickStream(tick_stream),
            },
        });
    }

    return modded_response;
};

module.exports = {
    changePocNumbersToString,
};
