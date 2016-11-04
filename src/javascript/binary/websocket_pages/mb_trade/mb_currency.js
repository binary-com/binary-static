var format_currency = require('../../common_functions/currency_to_symbol').format_currency;
var MBDefaults = require('./mb_defaults').MBDefaults;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
function MBDisplayCurrencies(selected, showClass) {
    'use strict';

    var target = document.getElementById('currency'),
        fragment =  document.createDocumentFragment(),
        currencies = page.client.get_storage_value('currencies').split(',');

    if (!target) {
        return;
    }

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (currencies.length > 1 && !japanese_client()) {
        currencies.forEach(function (currency) {
            var option = document.createElement('option'),
                content = document.createTextNode(currency);

            option.setAttribute('value', currency);
            if (selected && selected == key) {
                option.setAttribute('selected', 'selected');
            }

            option.appendChild(content);
            fragment.appendChild(option);
        });

        target.appendChild(fragment);
        MBDefaults.set('currency', target.value);
    } else {
        $('#currency').replaceWith('<span id="' + target.getAttribute('id') +
                                    '" class="' + (showClass ? target.getAttribute('class') : '') +
                                    '"value="' + currencies[0] + '">' +
                                    (/multi_barriers_trading/.test(window.location.pathname) && japanese_client() ? '✕' : format_currency(currencies[0])) + '</span>');
        MBDefaults.set('currency', currencies[0]);
    }
}

module.exports = {
    MBDisplayCurrencies: MBDisplayCurrencies,
};
