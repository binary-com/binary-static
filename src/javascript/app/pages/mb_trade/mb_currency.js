const MBContract     = require('./mb_contract');
const MBDefaults     = require('./mb_defaults');
const jpClient       = require('../../common/country_base').jpClient;
const formatCurrency = require('../../common/currency').formatCurrency;
const localize       = require('../../../_common/localize').localize;
const State          = require('../../../_common/storage').State;

/*
 * Handles currency display
 *
 * It process 'socket.send({payout_currencies:1})` response
 * and display them
 */
const MBDisplayCurrencies = () => {
    const $currency  = $('.trade_form #currency');
    const $list      = $currency.find('.list');
    const $current   = $currency.find('.current');
    const currencies = State.getResponse('payout_currencies');
    const jp_client  = jpClient();
    let def_value;

    if (!$currency.length) return;
    $list.empty();
    if (!jp_client) {
        const def_curr = MBDefaults.get('currency');
        def_value      = def_curr && currencies.indexOf(def_curr) >= 0 ? def_curr : currencies[0];
        if (currencies.length > 1) {
            currencies.forEach((currency) => {
                $list.append($('<div/>', { value: currency, html: formatCurrency(currency) }));
                if (def_value === currency) {
                    MBContract.setCurrentItem($currency, currency);
                }
            });
        }
        $current.html(formatCurrency(def_value));
    } else {
        def_value = 'JPY';
        $current.html($('<span/>', { text: localize('Lots'), 'data-balloon': localize('Payout per lot = 1,000') }));
    }
    $currency.attr('value', def_value);
    MBDefaults.set('currency', def_value);
    // if there is no currency drop down, remove hover style from currency
    if (!$list.children().length) {
        $current
            .css({ 'background-color': 'white' })
            .hover(function () {
                $(this).css({ 'background-color': 'white', cursor: 'auto' });
            });
    }
};

module.exports = MBDisplayCurrencies;
