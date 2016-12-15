/*
 * Display price/spot movement variation to depict price moved up or down
 */
var displayPriceMovement = function(element, oldValue, currentValue) {
    'use strict';

    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(currentValue) > parseFloat(oldValue)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(currentValue) < parseFloat(oldValue)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
};

/*
 * count number of decimal places in spot so that we can make barrier to same decimal places
 */
var countDecimalPlaces = function(num) {
    'use strict';

    if (!isNaN(num)) {
        var str = num.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
    }
    return 0;
};

module.exports = {
    displayPriceMovement: displayPriceMovement,
    countDecimalPlaces  : countDecimalPlaces,
};
