const moment                = require('moment');
const TradingAnalysis       = require('./analysis');
const Barriers              = require('./barriers');
const commonTrading         = require('./common');
const Defaults              = require('./defaults');
const Durations             = require('./duration');
const GetTicks              = require('./get_ticks');
const Notifications         = require('./notifications');
const Price                 = require('./price');
const Process               = require('./process');
const Purchase              = require('./purchase');
const getMinMaxTime         = require('./common_independent').getMinMaxTime;
const getStartDateNode      = require('./common_independent').getStartDateNode;
const Tick                  = require('./tick');
const BinarySocket          = require('../socket');
const BinaryPjax            = require('../../base/binary_pjax');
const GTM                   = require('../../base/gtm');
const dateValueChanged      = require('../../common_functions/common_functions').dateValueChanged;
const isVisible             = require('../../common_functions/common_functions').isVisible;
const getDecimalPlaces      = require('../../common_functions/currency').getDecimalPlaces;
const isCryptocurrency      = require('../../common_functions/currency').isCryptocurrency;
const onlyNumericOnKeypress = require('../../common_functions/event_handler');
const TimePicker            = require('../../components/time_picker');

/*
 * TradingEvents object contains all the event handler function for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const TradingEvents = (() => {
    'use strict';

    const initiate = () => {
        const attachTimePicker = (selector, checkEndTime) => {
            let minTime = window.time || moment.utc();
            let maxTime;
            if ($date_start && $date_start.val()) {
                const minMaxTime = getMinMaxTime($date_start, minTime);
                minTime = minMaxTime.minTime;
                maxTime = minMaxTime.maxTime;
                const date_start_val = $date_start.val();
                // if date_start is not 'now'
                if (checkEndTime && !Durations.isNow(date_start_val)) {
                    const $expiry_date = $('#expiry_date');
                    const endTime = moment($expiry_date.attr('data-value'));
                    const start_time_val = $time_start.val().split(':');
                    const compare = isNaN(+date_start_val) ? window.time : moment(+date_start_val * 1000);
                    // if expiry time is one day after start time, minTime can be 0
                    // but maxTime should be 24 hours after start time, so exact value of start time
                    if (endTime.isAfter(compare.format('YYYY-MM-DD HH:mm'), 'day')) {
                        minTime = 0;
                        maxTime = endTime.utc().hour(start_time_val[0]).minute(start_time_val[1]);
                    } else {
                        // if expiry time is same as today, min time should be the selected start time
                        minTime = minTime.hour(start_time_val[0]).minute(start_time_val[1]);
                    }
                }
            }
            const initObj = {
                selector: selector,
                minTime : minTime,
                maxTime : maxTime || null,
            };
            TimePicker.init(initObj);
        };

        /*
         * attach event to market list, so when client change market we need to update undelryings
         * and request for new Contract details to populate the form and request price accordingly
         */
        const onMarketChange = (market) => {
            commonTrading.showPriceOverlay();
            Defaults.set('market', market);

            // as different markets have different forms so remove from sessionStorage
            // it will default to proper one
            Defaults.remove('formname');
            Defaults.remove('underlying');
            Process.processMarket();
        };

        const market_nav_element = document.getElementById('contract_markets');
        if (market_nav_element) {
            market_nav_element.addEventListener('change', (e) => {
                onMarketChange(e.target.value);
            });
        }

        /*
         * attach event to form list, so when client click on different form we need to update form
         * and request for new Contract details to populate the form and request price accordingly
         */
        const contractFormEventChange = () => {
            Process.processContractForm();
            TradingAnalysis.request();
        };

        const form_nav_element = document.getElementById('contract_form_name_nav');
        if (form_nav_element) {
            form_nav_element.addEventListener('click', (e) => {
                const clicked_form = e.target;
                if (clicked_form && clicked_form.getAttribute('menuitem')) {
                    const is_form_active = clicked_form.classList.contains('active') || clicked_form.parentElement.classList.contains('active');
                    Defaults.set('formname', clicked_form.getAttribute('menuitem'));

                    // if form is already active then no need to send same request again
                    commonTrading.toggleActiveCatMenuElement(form_nav_element, e.target.getAttribute('menuitem'));

                    if (!is_form_active) {
                        contractFormEventChange();
                    }
                }
            });
        }

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const underlying_element = document.getElementById('underlying');
        if (underlying_element) {
            underlying_element.addEventListener('change', (e) => {
                if (e.target) {
                    commonTrading.showFormOverlay();
                    commonTrading.showPriceOverlay();
                    if (e.target.selectedIndex < 0) {
                        e.target.selectedIndex = 0;
                    }
                    const underlying = e.target.value;
                    Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                    Defaults.set('underlying', underlying);

                    Tick.clean();

                    commonTrading.updateWarmChart();

                    getContracts(underlying);

                    // get ticks for current underlying
                    GetTicks.request(underlying);
                    commonTrading.displayTooltip(Defaults.get('market'), underlying);

                    GetTicks.populateDigits(underlying);
                }
            });
        }

        const getContracts = (underlying) => {
            BinarySocket.send({ contracts_for: underlying }).then((response) => {
                Notifications.hide('CONNECTION_ERROR');
                Process.processContract(response);
            });
        };

        /*
         * bind event to change in duration amount, request new price
         */
        const triggerOnDurationChange = (e) => {
            if (e.target.value % 1 !== 0) {
                e.target.value = Math.floor(e.target.value);
            }
            Defaults.set('duration_amount', e.target.value);
            Durations.selectAmount(e.target.value);
            Price.processPriceRequest();
            commonTrading.submitForm(document.getElementById('websocket_form'));
        };
        const duration_amount_element = document.getElementById('duration_amount');
        let input_event_triggered = false;          // For triggering one of the two events.
        if (duration_amount_element) {
            duration_amount_element.addEventListener('keypress', onlyNumericOnKeypress);
            // jquery needed for datepicker
            $('#duration_amount')
                .on('input', commonTrading.debounce((e) => {
                    triggerOnDurationChange(e);
                    Durations.validateMinDurationAmount();
                    input_event_triggered = true;
                }))
                .on('change', commonTrading.debounce((e) => {
                    // using Defaults, to update the value by datepicker if it was emptied by keyboard (delete)
                    Durations.validateMinDurationAmount();
                    if (input_event_triggered === false || !Defaults.get('duration_amount')) {
                        triggerOnDurationChange(e);
                    } else {
                        input_event_triggered = false;
                    }
                }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        const expiry_type_element = document.getElementById('expiry_type');
        if (expiry_type_element) {
            expiry_type_element.addEventListener('change', (e) => {
                Defaults.set('expiry_type', e.target.value);
                Process.onExpiryTypeChange(e.target.value);
                if (expiry_type_element.value !== 'endtime') Price.processPriceRequest();
            });
        }

        /*
         * bind event to change in duration units, populate duration and request price
         */
        const duration_unit_element = document.getElementById('duration_units');
        if (duration_unit_element) {
            duration_unit_element.addEventListener('change', (e) => {
                Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                Process.onDurationUnitChange(e.target.value);
                Price.processPriceRequest();
            });
        }

        /*
         * bind event to change in endtime date and time
         */
        const end_date_element = document.getElementById('expiry_date');
        if (end_date_element) {
            // need to use jquery as datepicker is used, if we switch to some other
            // datepicker we can move back to javascript
            Durations.expiryDateOnChange($('#expiry_date'));
        }

        const end_time_element = document.getElementById('expiry_time');
        const $expiry_time = $('#expiry_time');
        if (end_time_element) {
            /*
             * attach datepicker and timepicker to end time durations
             * have to use jquery
             */
            attachTimePicker('#expiry_time');
            $expiry_time
                .on('focus click', () => { attachTimePicker('#expiry_time', 1); })
                .on('change input blur', function() {
                    if (!dateValueChanged(this, 'time')) {
                        return false;
                    }
                    Durations.setTime(end_time_element.value, 1);
                    return true;
                });
        }

        /*
         * attach event to change in amount, request new price only
         */
        const amount_element = document.getElementById('amount');
        if (amount_element) {
            amount_element.addEventListener('keypress', onlyNumericOnKeypress);

            amount_element.addEventListener('input', commonTrading.debounce((e) => {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                const currency = Defaults.get('currency');
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(getDecimalPlaces(currency));
                }
                Defaults.set(`amount${isCryptocurrency(currency) ? '_crypto' : ''}`, e.target.value);
                Price.processPriceRequest();
                commonTrading.submitForm(document.getElementById('websocket_form'));
            }));
        }

        let timepicker_initialized = false;
        const initTimePicker = () => {
            if (timepicker_initialized) return;
            timepicker_initialized = true;
            attachTimePicker('#time_start');
            $time_start
                .on('focus click', () => { attachTimePicker('#time_start'); })
                .on('change input blur', function() {
                    if (!dateValueChanged(this, 'time')) {
                        return false;
                    }
                    Defaults.set('time_start', time_start_element.value);
                    Price.processPriceRequest();
                    return true;
                });
        };

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        const date_start_element = getStartDateNode();
        if (date_start_element) {
            date_start_element.addEventListener('change', (e) => {
                Defaults.set('date_start', e.target.value);
                initTimePicker();
                const r = Durations.onStartDateChange(e.target.value);
                if (r >= 0) {
                    Price.processPriceRequest();
                }
            });
        }

        const time_start_element = document.getElementById('time_start');
        const $date_start = $('#date_start');
        const $time_start = $('#time_start');
        if (time_start_element && date_start_element.value !== 'now') {
            initTimePicker();
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        const amount_type_element = document.getElementById('amount_type');
        if (amount_type_element) {
            amount_type_element.addEventListener('change', (e) => {
                Defaults.set('amount_type', e.target.value);
                Price.processPriceRequest();
            });
        }

        /*
         * attach event to change in submarkets. We need to disable
         * underlyings that are not in selected seubmarkets
         */
        const submarket_element = document.getElementById('submarket');
        if (submarket_element) {
            submarket_element.addEventListener('change', (e) => {
                if (e.target) {
                    const elem = document.getElementById('underlying');
                    const underlyings = elem.children;

                    for (let i = 0, len = underlyings.length; i < len; i++) {
                        underlyings[i].disabled = e.target.value !== 'all' && e.target.value !== underlyings[i].className;
                    }

                    // as submarket change has modified the underlying list so we need to manually
                    // fire change event for underlying
                    document.querySelectorAll('#underlying option:enabled')[0].selected = 'selected';
                    const event = new Event('change');
                    elem.dispatchEvent(event);
                }
            });
        }

        /*
         * attach an event to change in currency
         */
        const currency_element = document.getElementById('currency');
        if (currency_element) {
            currency_element.addEventListener('change', (e) => {
                const currency = e.target.value;
                Defaults.set('currency', currency);
                const amount = isCryptocurrency(currency) ? 'amount_crypto' : 'amount';
                if (Defaults.get(amount)) $('#amount').val(Defaults.get(amount));
                Price.processPriceRequest();
            });
        }

        /*
         * attach event to purchase buttons to buy the current contract
         */
        $('.purchase_button').on('click dblclick', function() {
            if (!isVisible(document.getElementById('confirmation_message_container'))) {
                const id        = this.getAttribute('data-purchase-id');
                const ask_price = this.getAttribute('data-ask-price');

                const params = { buy: id, price: ask_price, passthrough: {} };
                Object.keys(this.attributes).forEach(function(attr) {
                    if (attr && this.attributes[attr] && this.attributes[attr].name &&
                            !/data\-balloon/.test(this.attributes[attr].name)) { // do not send tooltip data
                        const m = this.attributes[attr].name.match(/data\-(.+)/);

                        if (m && m[1] && m[1] !== 'purchase-id' && m[1] !== 'passthrough') {
                            params.passthrough[m[1]] = this.attributes[attr].value;
                        }
                    }
                }, this);
                if (id && ask_price) {
                    $('.purchase_button').css('visibility', 'hidden');
                    BinarySocket.send(params).then((response) => {
                        Purchase.display(response);
                        GTM.pushPurchaseData(response);
                    });
                    Price.incrFormId();
                    Price.processForgetProposals();
                }
            }
        });

        /*
         * attach event to close icon for purchase container
         */
        $('#close_confirmation_container').on('click dblclick', (e) => {
            if (e.target && isVisible(document.getElementById('confirmation_message_container'))) {
                e.preventDefault();
                commonTrading.hideOverlayContainer();
                Price.processPriceRequest();
            }
        });

        /*
         * attach an event to change in barrier
         */
        const barrier_element = document.getElementById('barrier');
        if (barrier_element) {
            $('#barrier')
                .on('keypress', (ev) =>  { onlyNumericOnKeypress(ev, [43, 45, 46]); })
                .on('input', commonTrading.debounce((e) => {
                    Barriers.validateBarrier();
                    Defaults.set('barrier', e.target.value);
                    Price.processPriceRequest();
                    commonTrading.submitForm(document.getElementById('websocket_form'));
                }, 1000));
        }

        /*
         * attach an event to change in low barrier
         */
        const low_barrier_element = document.getElementById('barrier_low');
        if (low_barrier_element) {
            low_barrier_element.addEventListener('input', commonTrading.debounce((e) => {
                Defaults.set('barrier_low', e.target.value);
                Price.processPriceRequest();
                commonTrading.submitForm(document.getElementById('websocket_form'));
            }));
            low_barrier_element.addEventListener('keypress', (ev) => {
                onlyNumericOnKeypress(ev, [43, 45, 46]);
            });
        }

        /*
         * attach an event to change in high barrier
         */
        const high_barrier_element = document.getElementById('barrier_high');
        if (high_barrier_element) {
            high_barrier_element.addEventListener('input', commonTrading.debounce((e) => {
                Defaults.set('barrier_high', e.target.value);
                Price.processPriceRequest();
                commonTrading.submitForm(document.getElementById('websocket_form'));
            }));
            high_barrier_element.addEventListener('keypress', (ev) => {
                onlyNumericOnKeypress(ev, [43, 45, 46]);
            });
        }

        /*
         * attach an event to change in digit prediction input
         */
        const prediction_element = document.getElementById('prediction');
        if (prediction_element) {
            prediction_element.addEventListener('change', commonTrading.debounce((e) => {
                Defaults.set('prediction', e.target.value);
                Price.processPriceRequest();
                commonTrading.submitForm(document.getElementById('websocket_form'));
            }));
        }

        // Verify number of decimal places doesn't exceed the allowed decimal places according to the currency
        const isStandardFloat = value => (
            !isNaN(value) &&
            value % 1 !== 0 &&
            ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > getDecimalPlaces(Defaults.get('currency'))
        );

        const init_logo = document.getElementById('trading_init_progress');
        if (init_logo) {
            init_logo.addEventListener('click', commonTrading.debounce(() => {
                commonTrading.reloadPage();
            }));
        }

        const tip = document.getElementById('symbol_tip');
        if (tip) {
            tip.addEventListener('click', commonTrading.debounce((e) => {
                BinaryPjax.load(e.target.getAttribute('target'));
            }));
        }
    };

    return {
        init: initiate,
    };
})();

module.exports = TradingEvents;
