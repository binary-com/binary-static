const format_currency = require('../../common_functions/currency_to_symbol').format_currency;
const MBDefaults = require('./mb_defaults').MBDefaults;
const japanese_client = require('../../common_functions/country_base').japanese_client;
const State  = require('../../base/storage').State;
const Client = require('../../base/client').Client;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
function MBDisplayCurrencies(selected, showClass) {
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

    if (currencies.length > 1 && !japanese_client()) {
        currencies.forEach(function (currency) {
            const option = document.createElement('option'),
                content = document.createTextNode(currency);

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
        $('#currency').replaceWith('<span id="' + target.getAttribute('id') +
                                    '" class="' + (showClass ? target.getAttribute('class') : '') +
                                    '" value="' + currencies[0] + '">' +
                                    (State.get('is_mb_trading') && japanese_client() ? '✕' : format_currency(currencies[0])) + '</span>');
        if ($('.payout-mult:visible').length === 0) $('#payout').width(40); // wider when there is free space
        MBDefaults.set('currency', currencies[0]);
    }
}

module.exports = {
    MBDisplayCurrencies: MBDisplayCurrencies,
};
