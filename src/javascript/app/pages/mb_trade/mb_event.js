const MBContract            = require('./mb_contract');
const MBDefaults            = require('./mb_defaults');
const MBNotifications       = require('./mb_notifications');
const MBPrice               = require('./mb_price');
const MBProcess             = require('./mb_process');
const MBTick                = require('./mb_tick');
const TradingAnalysis       = require('../trade/analysis');
const debounce              = require('../trade/common').debounce;
const Client                = require('../../base/client');
const jpClient              = require('../../common/country_base').jpClient;
const Currency              = require('../../common/currency');
const onlyNumericOnKeypress = require('../../common/event_handler');
const localize              = require('../../../_common/localize').localize;

/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const MBTradingEvents = (() => {
    const initiate = () => {
        const $form        = $('.trade_form');
        const hidden_class = 'invisible';

        $(document).on('click', (e) => {
            if ($(e.target).parents('#payout_list').length) return;
            makeListsInvisible();
        });

        $form.find('.current').on('click', function (e) {
            e.stopPropagation();
            const $list = $(this).siblings('.list');
            if ($list.hasClass(hidden_class)) {
                makeListsInvisible();
            }
            $list.toggleClass(hidden_class);
        });

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const $underlying = $form.find('#underlying');
        if ($underlying.length) {
            $underlying.on('click', '.list > div', function () {
                const underlying = $(this).attr('value');
                MBContract.setCurrentItem($underlying, underlying, 1);
                MBDefaults.set('underlying', underlying);
                MBNotifications.hide('SYMBOL_INACTIVE');

                MBTick.clean();

                MBProcess.getContracts(underlying);
                // forget the old tick id i.e. close the old tick stream
                MBProcess.processForgetTicks().then(() => {
                    // get ticks for current underlying
                    MBTick.request(underlying);
                });
            });
        }

        const $category = $form.find('#category');
        if ($category.length) {
            $category.on('click', '.list > div', function () {
                const category = $(this).attr('value');
                MBContract.setCurrentItem($category, category);
                MBDefaults.set('category', category);
                MBContract.populatePeriods(1);
                MBProcess.processPriceRequest();
                TradingAnalysis.request();
            });
        }

        const $period = $form.find('#period');
        if ($period.length) {
            $period.on('click', '.list > div', function () {
                const period = $(this).attr('value');
                MBContract.setCurrentItem($period, period);
                MBDefaults.set('period', period);
                MBProcess.processPriceRequest();
                $('.remaining-time').removeClass('alert');
                MBContract.displayRemainingTime('recalculate');
            });
        }

        const validatePayout = (payout_amount) => {
            const contract            = MBContract.getCurrentContracts();
            const jp_client           = jpClient();
            const min_amount          = jp_client ? 1 : 0;
            const max_contract_amount = Array.isArray(contract) && contract.length && contract[0].expiry_type !== 'intraday' ? 20000 : 5000;
            const max_client_amount   = jp_client ? 100 : max_contract_amount;


            return (payout_amount && !isNaN(payout_amount) &&
                payout_amount >= min_amount && payout_amount <= max_client_amount);
        };


        const $payout = $form.find('#payout');
        if ($payout.length) {
            const $payout_list = $form.find('#payout_list');
            const jp_client    = jpClient();

            const appendActualPayout = (payout) => {
                $payout.find('.current').append($('<div/>', { class: 'hint', text: localize('Payout') }).append($('<span/>', { id: 'actual_payout', html: Currency.formatMoney('JPY', payout * 1000) })));
            };

            const client_currency = Client.get('currency') || MBDefaults.get('currency');
            const is_crypto       = Currency.isCryptocurrency(client_currency);
            let old_value         = Currency.getMinPayout(client_currency);
            if (!$payout.attr('value')) {
                const amount   = `payout${is_crypto ? '_crypto' : ''}`;
                let payout_def = MBDefaults.get(amount);
                if (!validatePayout(payout_def)) {
                    payout_def = old_value;
                }
                $payout.value = payout_def;
                MBDefaults.set(amount, payout_def);
                $payout.attr('value', payout_def);
                if (jp_client) {
                    $payout.find('.current').html(payout_def);
                    appendActualPayout(payout_def);
                }
            }
            if (jp_client) {
                $payout.find('.current').on('click', function () {
                    old_value      = +this.childNodes[0].nodeValue;
                    const $list    = $(`#${$(this).parent().attr('id')}_list`);
                    const $sublist = $list.find('.list');
                    if ($list.hasClass(hidden_class)) {
                        makeListsInvisible();
                    }
                    $list.toggleClass(hidden_class);
                    $sublist.toggleClass(hidden_class);
                    $category.toggleClass(hidden_class);
                    $period.toggleClass(hidden_class);
                });
            } else {
                // Verify number of decimal places doesn't exceed the allowed decimal places according to the currency
                const isStandardFloat = value => (
                    !isNaN(value) &&
                    value % 1 !== 0 &&
                    value.replace(/^-?\d*\.?|0+$/, '').length > Currency.getDecimalPlaces(MBDefaults.get('currency'))
                );

                $payout
                    .on('click', function() { $(this).select(); })
                    .on('keypress', onlyNumericOnKeypress)
                    .on('input', debounce((e) => {
                        old_value      = e.target.getAttribute('value');
                        let new_payout = e.target.value;
                        const currency = MBDefaults.get('currency');
                        if (isStandardFloat(new_payout)) {
                            new_payout     = parseFloat(new_payout).toFixed(Currency.getDecimalPlaces(currency));
                            e.target.value = new_payout;
                        }
                        if (!validatePayout(new_payout)) {
                            e.target.value = old_value;
                        } else if (+new_payout !== +old_value) {
                            e.target.setAttribute('value', new_payout);
                            MBDefaults.set(`payout${Currency.isCryptocurrency(currency) ? '_crypto' : ''}`, new_payout);
                            MBProcess.processPriceRequest();
                        }
                    }));
            }
            if ($payout_list.length) {
                $payout_list.on('click', '> .list > div', debounce(function () {
                    const payout = +MBDefaults.get(`payout${Currency.isCryptocurrency(MBDefaults.get('currency')) ? '_crypto' : ''}`);
                    const value  = $(this).attr('value');
                    let new_payout;
                    if (/\+|-/.test(value)) {
                        new_payout = payout + parseInt(value);
                        if (new_payout < 1 && jp_client) {
                            new_payout = 1;
                        }
                    } else if (/ok|cancel/.test(value)) {
                        if (value === 'cancel') new_payout = old_value || 10;
                        makeListsInvisible();
                    } else {
                        new_payout = value;
                    }

                    if (validatePayout(new_payout)) {
                        $('.price-table').setVisibility(1);
                        MBDefaults.set('payout', new_payout);
                        $payout.attr('value', new_payout).find('.current').html(new_payout);
                        if (jp_client) {
                            appendActualPayout(new_payout);
                        }
                        MBProcess.processPriceRequest();
                    }
                }));
                $payout_list.find('div[unselectable]').on('selectstart mousedown', () => false);
            }
        }

        const $currency = $form.find('#currency');
        if ($currency.length) {
            $currency.on('click', '.list > div', function () {
                const currency = $(this).attr('value');
                MBContract.setCurrentItem($currency, currency);
                MBDefaults.set('currency', currency);
                if (!jpClient()) {
                    const is_crypto = Currency.isCryptocurrency(currency);
                    const amount    = `payout${is_crypto ? '_crypto' : ''}`;
                    if (!MBDefaults.get(amount)) {
                        MBDefaults.set(`payout${is_crypto ? '_crypto' : ''}`, Currency.getMinPayout(currency));
                    }
                    $payout.val(MBDefaults.get(amount)).attr('value', MBDefaults.get(amount));
                }
                MBProcess.processPriceRequest();
            });
        }

        const $trading_status   = $('.trading-status');
        const $allow_trading    = $trading_status.find('#allow');
        const $disallow_trading = $trading_status.find('#disallow');
        const setTradingStatus  = (is_enabled) => {
            if (is_enabled) {
                MBPrice.hidePriceOverlay();
                MBNotifications.hide('TRADING_DISABLED');
                $disallow_trading.removeClass('selected');
                $allow_trading.addClass('selected');
            } else {
                MBPrice.showPriceOverlay();
                $allow_trading.removeClass('selected');
                $disallow_trading.addClass('selected');
            }
        };
        if ($trading_status.length) {
            setTradingStatus(!jpClient());
            $trading_status.on('click', (e) => {
                const status = e.target.getAttribute('id');
                MBDefaults.set('disable_trading', status === 'disallow');
                setTradingStatus(status === 'allow');
            });
        }

        const makeListsInvisible = () => {
            $form.find('.list, #payout_list').setVisibility(0).end()
                .find('#period, #category')
                .setVisibility(1);
        };
    };

    return {
        init: initiate,
    };
})();

module.exports = MBTradingEvents;
