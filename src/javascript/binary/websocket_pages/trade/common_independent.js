const moment = require('moment');

/*
 * Display price/spot movement variation to depict price moved up or down
 */
const displayPriceMovement = (element, old_value, current_value) => {
    'use strict';

    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(current_value) > parseFloat(old_value)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(current_value) < parseFloat(old_value)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
};

/*
 * count number of decimal places in spot so that we can make barrier to same decimal places
 */
const countDecimalPlaces = (num) => {
    'use strict';

    if (!isNaN(num)) {
        const str = num.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
    }
    return 0;
};

const trading_times = {};

const processTradingTimesAnswer = (response) => {
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
};

const getElement = () => document.getElementById('date_start');

const checkValidTime = (time_start_element, $date_start, time) => {
    time_start_element = time_start_element || document.getElementById('time_start');
    $date_start = $date_start || $('#date_start');
    time = (time_start_element.value || time).split(':');
    if (time.length) {
        const hour = +time[0];
        const minute = +time[1];
        const date_time = moment.utc(getElement().value * 1000).hour(hour).minute(minute);
        const min_time = Math.max(getMinMaxTime($date_start).minTime, moment.utc());
        const max_time = getMinMaxTime($date_start).maxTime;
        time_start_element.value = date_time.isBefore(min_time) || date_time.isAfter(max_time) ? min_time.add(5, 'minutes').utc().format('HH:mm') : time.join(':');
        time_start_element.setAttribute('data-value', time_start_element.value);
    }
};

const getMinMaxTime = ($setMinMaxSelector, minTime = window.time ? window.time : moment.utc()) => {
    const $selected_option = $setMinMaxSelector.find('option:selected');
    minTime = +$selected_option.val() > minTime.unix() ? moment.utc($selected_option.val() * 1000) : minTime;
    const maxTime = moment.utc($selected_option.attr('data-end') * 1000);
    return {
        minTime: minTime,
        maxTime: maxTime,
    };
};

module.exports = {
    displayPriceMovement     : displayPriceMovement,
    countDecimalPlaces       : countDecimalPlaces,
    processTradingTimesAnswer: processTradingTimesAnswer,
    getTradingTimes          : () => trading_times,
    getStartDateNode         : getElement,
    checkValidTime           : checkValidTime,
    getMinMaxTime            : getMinMaxTime,
};
