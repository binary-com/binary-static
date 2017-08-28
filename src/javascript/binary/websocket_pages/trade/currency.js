const Defaults = require('./defaults');
const localize = require('../../base/localize').localize;
const State    = require('../../base/storage').State;
const Currency = require('../../common_functions/currency');

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const displayCurrencies = () => {
    'use strict';

    const $currency = $('#currency');

    if (!$currency.length) {
        return;
    }

    const currencies = State.getResponse('payout_currencies');

    if (currencies.length > 1) {
        const $fiat_currencies = $('<optgroup/>', { label: localize('Fiat Currency') });
        const $cryptocurrencies = $('<optgroup/>', { label: localize('Cryptocurrency') });

        currencies.forEach((currency) => {
            (Currency.isCryptocurrency(currency) ? $cryptocurrencies : $fiat_currencies)
                .append($('<option/>', { value: currency, text: currency }));
        });

        $currency.html($fiat_currencies).append($cryptocurrencies);
        Defaults.set('currency', $currency.val());
    } else {
        $currency.replaceWith($('<span/>', { id: $currency.attr('id'), class: $currency.attr('class'), value: currencies[0], html: Currency.formatCurrency(currencies[0]) }));
        Defaults.set('currency', currencies[0]);
    }
};

module.exports = displayCurrencies;
