const MBDefaults     = require('./mb_defaults');
const Client         = require('../../base/client');
const State          = require('../../base/storage').State;
const jpClient       = require('../../common_functions/country_base').jpClient;
const formatCurrency = require('../../common_functions/currency').formatCurrency;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const MBDisplayCurrencies = (selected, show_class) => {
    'use strict';

    const target = document.getElementById('currency');
    const fragment =  document.createDocumentFragment();
    const currencies = Client.get('currencies').split(',');

    if (!target) {
        return;
    }

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (currencies.length > 1 && !jpClient()) {
        currencies.forEach((currency) => {
            const option = document.createElement('option');
            const content = document.createTextNode(currency);

            option.setAttribute('value', currency);
            /* if (selected && selected == key) {
                option.setAttribute('selected', 'selected');
            }*/

            option.appendChild(content);
            fragment.appendChild(option);
        });

        target.appendChild(fragment);
        MBDefaults.set('currency', target.value);
    } else {
        const class_value = show_class ? target.getAttribute('class') : '';
        const text_value = State.get('is_mb_trading') && jpClient() ? '✕' : formatCurrency(currencies[0]);
        $('#currency').replaceWith($('<span/>', { id: target.getAttribute('id'), class: class_value, value: currencies[0], text: text_value }));
        if ($('.payout-mult:visible').length === 0) $('#payout').width(40); // wider when there is free space
        MBDefaults.set('currency', currencies[0]);
    }
};

module.exports = MBDisplayCurrencies;
