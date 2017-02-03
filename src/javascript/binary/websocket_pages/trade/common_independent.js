/*
 * Display price/spot movement variation to depict price moved up or down
 */
function displayPriceMovement(element, oldValue, currentValue) {
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
}

/*
 * count number of decimal places in spot so that we can make barrier to same decimal places
 */
function countDecimalPlaces(num) {
    'use strict';

    if (!isNaN(num)) {
        const str = num.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
    }
    return 0;
}

const trading_times = {};

function processTradingTimesAnswer(response) {
    if (!trading_times.hasOwnProperty(response.echo_req.trading_times) && response.hasOwnProperty('trading_times') && response.trading_times.hasOwnProperty('markets')) {
        for (let i = 0; i < response.trading_times.markets.length; i++) {
            const submarkets = response.trading_times.markets[i].submarkets;
            if (submarkets) {
                for (let j = 0; j < submarkets.length; j++) {
                    const symbols = submarkets[j].symbols;
                    if (symbols) {
                        for (let k = 0; k < symbols.length; k++) {
                            const symbol = symbols[k];
                            if (!trading_times[response.echo_req.trading_times]) {
                                trading_times[response.echo_req.trading_times] = {};
                            }
                            trading_times[response.echo_req.trading_times][symbol.symbol] = symbol.times.close;
                        }
                    }
                }
            }
        }
    }
}

function getElement() {
    return document.getElementById('date_start');
}

module.exports = {
    displayPriceMovement     : displayPriceMovement,
    countDecimalPlaces       : countDecimalPlaces,
    processTradingTimesAnswer: processTradingTimesAnswer,
    getTradingTimes          : function () { return trading_times; },
    getStartDateNode         : getElement,
};
