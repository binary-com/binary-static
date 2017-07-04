const MBContract     = require('./mb_contract');
const MBDefaults     = require('./mb_defaults');
const Client         = require('../../base/client');
const localize       = require('../../base/localize').localize;
const jpClient       = require('../../common_functions/country_base').jpClient;
const formatCurrency = require('../../common_functions/currency').formatCurrency;

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
    const jp_client  = jpClient();
    let def_value;

    if (!$currency.length) return;
    $list.empty();
    if (!jp_client) {
        const def_curr  = MBDefaults.get('currency');
        def_value = def_curr && currencies.indexOf(def_curr) >= 0 ? def_curr : currencies[0];
        if (currencies.length > 1) {
            currencies.forEach((currency) => {
                $list.append($('<div/>', { value: currency, text: formatCurrency(currency) }));
                if (def_value === currency) {
                    MBContract.setCurrentItem($currency, currency);
                }
            });
            $currency.css('z-index', '0');
        }
    } else {
        def_value = 'JPY';
    }

    $currency.attr('value', def_value).find('> .current').html(jp_client ? localize('Lots') : formatCurrency(def_value));
    MBDefaults.set('currency', def_value);
};

module.exports = MBDisplayCurrencies;
