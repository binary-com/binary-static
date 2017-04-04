const Defaults       = require('./defaults');
const Client         = require('../../base/client');
const formatCurrency = require('../../common_functions/currency_to_symbol').formatCurrency;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const displayCurrencies = () => {
    'use strict';

    const target = document.getElementById('currency'),
        fragment =  document.createDocumentFragment(),
        currencies = Client.get('currencies').split(',');

    if (!target) {
        return;
    }

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (currencies.length > 1) {
        currencies.forEach((currency) => {
            const option = document.createElement('option'),
                content = document.createTextNode(currency);

            option.setAttribute('value', currency);

            option.appendChild(content);
            fragment.appendChild(option);
        });

        target.appendChild(fragment);
        Defaults.set('currency', target.value);
    } else {
        $('#currency').replaceWith('<span id="' + target.getAttribute('id') +
                                    '" class="' + target.getAttribute('class') +
                                    '" value="' + currencies[0] + '">' +
                                    formatCurrency(currencies[0]) + '</span>');
        Defaults.set('currency', currencies[0]);
    }
};

module.exports = displayCurrencies;
