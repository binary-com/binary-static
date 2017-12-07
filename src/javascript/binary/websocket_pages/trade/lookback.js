const Contract         = require('./contract');
const Defaults         = require('./defaults');

/*
 * Handles lookback option form
**/

const Lookback = (() => {
    const displayLookback = () => {
        const lot_element    = document.getElementById('lots_row');
        const lot_input      = document.getElementById('lots');
        const payout_element = document.getElementById('payout_row');

        if(Contract.form() === 'lookback') {
            lot_element.show();
            payout_element.hide(); // Hide payout
            if (Defaults.get('lot')) {
                lot_input.value = Defaults.get('lot');
            } else {
                Defaults.set('lot', lot_input.value);
            }
        } else {
            lot_element.hide();
            payout_element.show(); // Show payout
        }
    }

    return {
        display: displayLookback
    }
})();

module.exports = {
    Lookback
};
