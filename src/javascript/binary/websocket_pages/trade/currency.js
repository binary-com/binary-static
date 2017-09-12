const Defaults = require('./defaults');
const State    = require('../../base/storage').State;
const Currency = require('../../common_functions/currency');

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const displayCurrencies = () => {
    const $currency = $('#currency');

    if (!$currency.length) {
        return;
    }

    const currencies = State.getResponse('payout_currencies');

    if (currencies.length > 1) {
        $currency.html(Currency.getCurrencyList(currencies).html());
        Defaults.set('currency', $currency.val());
    } else {
        $currency.replaceWith($('<span/>', { id: $currency.attr('id'), class: $currency.attr('class'), value: currencies[0], html: Currency.formatCurrency(currencies[0]) }));
        Defaults.set('currency', currencies[0]);
    }
};

module.exports = displayCurrencies;
