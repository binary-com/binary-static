const MBContract            = require('./mb_contract');
const MBDefaults            = require('./mb_defaults');
const MBNotifications       = require('./mb_notifications');
const MBPrice               = require('./mb_price');
const MBProcess             = require('./mb_process');
const MBTick                = require('./mb_tick');
const MBSymbols             = require('./mb_symbols');
const TradingAnalysis       = require('../trade/analysis');
const debounce              = require('../trade/common').debounce;
const Client                = require('../../base/client');
const Currency              = require('../../common/currency');
const onlyNumericOnKeypress = require('../../common/event_handler');
const localize              = require('../../../_common/localize').localize;
const State                 = require('../../../_common/storage').State;
const getPropertyValue      = require('../../../_common/utility').getPropertyValue;

/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const MBTradingEvents = (() => {
    let $form,
        hidden_class,
        border_class;

    const initiate = () => {
        $form        = $('.trade_form');
        hidden_class = 'invisible';
        border_class = 'primary-border-color';

        const is_jp_client = Client.isJPClient();

        $(document).on('click', (e) => {
            if ($(e.target).parents('#payout_list').length) return;
            makeListsInvisible();
        });

        $form.find('.current, .header-current').on('click', function (e) {
            e.stopPropagation();
            const $this = $(this);
            let $list = $this.siblings('.list');
            if (!$list.length) {
                $list = $this.siblings().find('.list'); // in case of .header-current
            }
            if ($list.hasClass(hidden_class)) {
                makeListsInvisible();
            }
            $list.toggleClass(hidden_class);
            $this.toggleClass(border_class)
                .siblings().find('.current').toggleClass(border_class).end().end()
                .parent().siblings('.header-current').toggleClass(border_class);
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
                MBContract.displayRemainingTime(true, is_jp_client);
            });
            if (!is_jp_client) {
                const $header_cur = $form.find('.header-current');
                $period.on('mouseover', (e) => {
                    e.stopPropagation();
                    $header_cur.addClass(border_class);
                }).on('mouseleave', (e) => {
                    e.stopPropagation();
                    if ($period.find('.list').hasClass(hidden_class)) {
                        $header_cur.removeClass(border_class);
                    }
                });
            }
        }

        const validatePayout = (payout_amount, $error_wrapper) => {
            const market = getPropertyValue(MBSymbols.getAllSymbols(), [MBDefaults.get('underlying'), 'market']);
            if (!market) return false;

            const selected_currency = MBDefaults.get('currency');
            const max_client_amount = State.getResponse(`landing_company.financial_company.currency_config.${market}.${selected_currency}.max_payout`) || 5000;

            let is_valid  = true;
            let error_msg = '';

            if (!payout_amount || isNaN(payout_amount)) {
                is_valid  = false;
                error_msg = localize('Should be a valid number.');
            } else if (+payout_amount > max_client_amount) {
                is_valid  = false;
                error_msg = localize('Should be less than [_1]', [max_client_amount]);
            }

            // if value has decimal places
            if (is_valid && +payout_amount % 1 !== 0) {
                const allowed_decimals = Currency.getDecimalPlaces(MBDefaults.get('currency'));

                // verify number of decimal places doesn't exceed the allowed decimal places according to the currency
                is_valid = payout_amount.toString().replace(/^-?\d*\.?|0+$/, '').length <= allowed_decimals;
                if (!is_valid) {
                    error_msg = localize('Up to [_1] decimal places are allowed.', [allowed_decimals]);
                }
            }

            if (!is_valid && $error_wrapper && error_msg) {
                const $err_payout = $('#err_payout');
                if ($err_payout.length) {
                    $err_payout.text(error_msg);
                } else {
                    $error_wrapper.append($('<p/>', { class: 'error-msg gr-row', id: 'err_payout', text: error_msg }));
                }
            }

            return is_valid;
        };


        const $payout = $form.find('#payout');
        if ($payout.length) {
            const $payout_list = $form.find('#payout_list');

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
                if (is_jp_client) {
                    $payout.find('.current').html(payout_def);
                    appendActualPayout(payout_def);
                }
            }
            if (is_jp_client) {
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
                const $panel = $('#panel');
                $payout
                    .on('click', function() { $(this).select(); })
                    .on('keypress', onlyNumericOnKeypress)
                    .on('input', debounce((e) => {
                        const payout   = e.target.value;
                        const currency = MBDefaults.get('currency');
                        if (validatePayout(payout, $panel)) {
                            $panel.find('#err_payout').remove();
                            $payout.removeClass('error');
                            e.target.setAttribute('value', payout);
                            MBDefaults.set(`payout${Currency.isCryptocurrency(currency) ? '_crypto' : ''}`, payout);
                            MBProcess.processPriceRequest();
                        } else {
                            $payout.addClass('error');
                            MBPrice.showPriceOverlay();
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
                        if (new_payout < 1 && is_jp_client) {
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
                        if (is_jp_client) {
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
                if (is_jp_client) {
                    MBProcess.processPriceRequest();
                } else {
                    const is_crypto = Currency.isCryptocurrency(currency);
                    let amount      = MBDefaults.get(`payout${is_crypto ? '_crypto' : ''}`);
                    if (!amount) {
                        amount = Currency.getMinPayout(currency);
                        MBDefaults.set(`payout${is_crypto ? '_crypto' : ''}`, amount);
                    }
                    $payout
                        .val(amount).attr('value', amount)
                        .trigger('input'); // payout will call processPriceRequest
                }
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
            setTradingStatus(0);
            $trading_status.on('click', (e) => {
                const status = e.target.getAttribute('id');
                MBDefaults.set('disable_trading', status === 'disallow');
                setTradingStatus(status === 'allow');
            });
        }
    };

    const makeListsInvisible = () => {
        $form.find('.list, #payout_list').setVisibility(0).end()
            .find('#period, #category')
            .setVisibility(1);
        $form.find('.current, .header-current').removeClass(border_class);
    };

    return {
        init: initiate,
    };
})();

module.exports = MBTradingEvents;
