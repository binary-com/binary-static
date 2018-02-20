const Contract = require('./contract');
const Defaults = require('./defaults');

/*
 * Handles lookback option form
**/

const Lookback = (() => {
    const displayLookback = () => {
        const multiplier_element    = document.getElementById('multiplier_row');
        const multiplier_input      = document.getElementById('multiplier');
        const payout_element        = document.getElementById('payout_row');

        if (Contract.form() === 'lookback') {
            multiplier_element.show();
            payout_element.hide(); // Hide payout
            if (Defaults.get('multiplier')) {
                multiplier_input.value = Defaults.get('multiplier');
            } else {
                Defaults.set('multiplier', multiplier_input.value);
            }
        } else {
            multiplier_element.hide();
            payout_element.show(); // Show payout
        }
    };

    const getFormula = (type = '', mul) => {
        const value_map = {
            Multiplier: mul,
        };
        const regex = /Multiplier/g;
        const replacer = (str) => value_map[str] || str;
        const formulaMapping = {
            LBFLOATPUT : 'Multiplier x (High - Close)'.replace(regex, replacer),
            LBFLOATCALL: 'Multiplier x (Close - Low)'.replace(regex, replacer),
            LBHIGHLOW  : 'Multiplier x (High - Low)'.replace(regex, replacer),
        };

        return formulaMapping[type.toUpperCase()];
    };

    const isLookback = (type) => /^(LBFLOATCALL|LBFLOATPUT|LBHIGHLOW)$/.test(type);

    const getBarrierLabel = (type) => {
        const barrier_map = {
            LBFLOATCALL: ['Low'],
            LBFLOATPUT : ['High'],
            LBHIGHLOW  : ['High', 'Low'],
        };
        return barrier_map[type] || ['Barrier'];
    };

    return {
        display: displayLookback,
        getFormula,
        isLookback,
        getBarrierLabel,
    };
})();

module.exports = Lookback;
