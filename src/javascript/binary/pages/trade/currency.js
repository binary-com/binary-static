/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
function displayCurrencies(selected) {
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
    Defaults.set('currency', target.value);
}
