const MBDefaults     = require('./mb_defaults');
const Client         = require('../../base/client');
const jpClient       = require('../../common_functions/country_base').jpClient;
const formatCurrency = require('../../common_functions/currency_to_symbol').formatCurrency;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const MBDisplayCurrencies = () => {
    'use strict';

    const $currency  = $('.trade_form #currency');
    const $list      = $currency.find('.list');
    const currencies = Client.get('currencies').split(',');
    const def_curr   = MBDefaults.get('currency');
    const def_value  = def_curr && currencies.indexOf(def_curr) >= 0 ? def_curr : currencies[0];

    if (!$currency.length) return;

    $list.empty();
    if (currencies.length > 1 && !jpClient()) {
        currencies.forEach((currency) => {
            $list.append($('<div/>', { value: currency, text: formatCurrency(currency) }));
        });
        $currency.css('z-index', '0');
    }

    $currency.attr('value', def_value).find('> .current').html(jpClient() ? '✕' : formatCurrency(def_value));

    MBDefaults.set('currency', def_value);
};

module.exports = MBDisplayCurrencies;
