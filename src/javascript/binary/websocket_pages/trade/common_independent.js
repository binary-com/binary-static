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

var trading_times = {};

function processTradingTimesAnswer(response) {
    if (!trading_times.hasOwnProperty(response.echo_req.trading_times) && response.hasOwnProperty('trading_times') && response.trading_times.hasOwnProperty('markets')) {
        for (var i = 0; i < response.trading_times.markets.length; i++) {
            var submarkets = response.trading_times.markets[i].submarkets;
            if (submarkets) {
                for (var j = 0; j < submarkets.length; j++) {
                    var symbols = submarkets[j].symbols;
                    if (symbols) {
                        for (var k = 0; k < symbols.length; k++) {
                            var symbol = symbols[k];
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

var getElement = function() {
    return document.getElementById('date_start');
};

module.exports = {
    displayPriceMovement     : displayPriceMovement,
    countDecimalPlaces       : countDecimalPlaces,
    processTradingTimesAnswer: processTradingTimesAnswer,
    getTradingTimes          : function () { return trading_times; },
    getStartDatenode         : getElement,
};
