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

    return {
        display: displayLookback,
    };
})();

module.exports = Lookback;
