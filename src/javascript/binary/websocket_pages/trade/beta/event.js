const moment                         = require('moment');
const TradingAnalysis_Beta           = require('./analysis').TradingAnalysis_Beta;
const Barriers_Beta                  = require('./barriers').Barriers_Beta;
const Contract_Beta                  = require('./contract').Contract_Beta;
const Durations_Beta                 = require('./duration').Durations_Beta;
const Price_Beta                     = require('./price').Price_Beta;
const onDurationUnitChange           = require('./process').onDurationUnitChange;
const onExpiryTypeChange             = require('./process').onExpiryTypeChange;
const processContractForm_Beta       = require('./process').processContractForm_Beta;
const processForgetTicks_Beta        = require('./process').processForgetTicks_Beta;
const processMarket_Beta             = require('./process').processMarket_Beta;
const Defaults                       = require('../defaults').Defaults;
const Tick                           = require('../tick').Tick;
const setFormPlaceholderContent_Beta = require('../set_values').setFormPlaceholderContent_Beta;
const chartFrameSource               = require('../common').chartFrameSource;
const debounce                       = require('../common').debounce;
const displayTooltip_Beta            = require('../common').displayTooltip_Beta;
const reloadPage                     = require('../common').reloadPage;
const showFormOverlay                = require('../common').showFormOverlay;
const showPriceOverlay               = require('../common').showPriceOverlay;
const submitForm                     = require('../common').submitForm;
const toggleActiveCatMenuElement     = require('../common').toggleActiveCatMenuElement;
const timeIsValid                    = require('../common').timeIsValid;
const updateWarmChart                = require('../common').updateWarmChart;
const getStartDateNode               = require('../common_independent').getStartDateNode;
const dateValueChanged               = require('../../../common_functions/common_functions').dateValueChanged;
const elementTextContent             = require('../../../common_functions/common_functions').elementTextContent;
const isVisible                      = require('../../../common_functions/common_functions').isVisible;
const onlyNumericOnKeypress          = require('../../../common_functions/event_handler').onlyNumericOnKeypress;
const TimePicker                     = require('../../../components/time_picker').TimePicker;
const BinaryPjax                     = require('../../../base/binary_pjax');

/*
 * TradingEvents object contains all the event handler const required = function for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
const TradingEvents_Beta = (function () {
    'use strict';

    const initiate = function () {
        /*
         * attach event to market list, so when client change market we need to update undelryings
         * and request for new Contract details to populate the form and request price accordingly
         */
        const marketNavElement = document.getElementById('contract_markets');
        const onMarketChange = function(market) {
            showPriceOverlay();
            Defaults.set('market', market);

            // as different markets have different forms so remove from sessionStorage
            // it will default to proper one
            Defaults.remove('formname');
            Defaults.remove('underlying');
            processMarket_Beta(1);
            chartFrameSource();
        };

        if (marketNavElement) {
            marketNavElement.addEventListener('change', function(e) {
                const clickedMarket = e.target;
                onMarketChange(clickedMarket.value);
            });
        }

        /*
         * attach event to form list, so when client click on different form we need to update form
         * and request for new Contract details to populate the form and request price accordingly
         */
        const contractFormEventChange = function () {
            processContractForm_Beta();
            TradingAnalysis_Beta.request();
        };

        const formNavElement = document.getElementById('contract_form_name_nav');
        if (formNavElement) {
            formNavElement.addEventListener('click', function(e) {
                if (e.target && e.target.getAttribute('menuitem')) {
                    const clickedForm = e.target;
                    const isFormActive = clickedForm.classList.contains('active') || clickedForm.parentElement.classList.contains('active');
                    Defaults.set('formname', clickedForm.getAttribute('menuitem'));

                    setFormPlaceholderContent_Beta();
                    // if form is already active then no need to send same request again
                    toggleActiveCatMenuElement(formNavElement, e.target.getAttribute('menuitem'));

                    if (!isFormActive) {
                        contractFormEventChange();
                    }
                    const contractFormCheckbox = document.getElementById('contract_form_show_menu');
                    if (contractFormCheckbox) {
                        contractFormCheckbox.checked = false;
                    }
                }
            });
        }

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        const underlyingElement = document.getElementById('underlying');
        if (underlyingElement) {
            underlyingElement.addEventListener('change', function(e) {
                if (e.target) {
                    chartFrameSource();
                    showFormOverlay();
                    showPriceOverlay();
                    if (e.target.selectedIndex < 0) {
                        e.target.selectedIndex = 0;
                    }
                    const underlying = e.target.value;
                    Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                    Defaults.set('underlying', underlying);
                    TradingAnalysis_Beta.request();

                    Tick.clean();

                    updateWarmChart();

                    Contract_Beta.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTicks_Beta();
                    // get ticks for current underlying
                    Tick.request(underlying);
                    displayTooltip_Beta(Defaults.get('market'), underlying);
                }
            });
        }

        /*
         * bind event to change in duration amount, request new price
         */
        const triggerOnDurationChange = function(e) {
            if (e.target.value % 1 !== 0) {
                e.target.value = Math.floor(e.target.value);
            }
            Defaults.set('duration_amount', e.target.value);
            Durations_Beta.select_amount(e.target.value);
            Price_Beta.processPriceRequest_Beta();
            submitForm(document.getElementById('websocket_form'));
        };
        const durationAmountElement = document.getElementById('duration_amount');
        let inputEventTriggered = false;          // For triggering one of the two events.
        if (durationAmountElement) {
            durationAmountElement.addEventListener('keypress', onlyNumericOnKeypress);
            // jquery needed for datepicker
            $('#duration_amount')
                .on('input', debounce(function (e) {
                    triggerOnDurationChange(e);
                    Durations_Beta.validateMinDurationAmount();
                    inputEventTriggered = true;
                }))
                .on('change', debounce(function (e) {
                    // using Defaults, to update the value by datepicker if it was emptied by keyboard (delete)
                    Durations_Beta.validateMinDurationAmount();
                    if (inputEventTriggered === false || !Defaults.get('duration_amount')) {
                        triggerOnDurationChange(e);
                    } else {
                        inputEventTriggered = false;
                    }
                }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        const expiryTypeElement = document.getElementById('expiry_type');
        if (expiryTypeElement) {
            expiryTypeElement.addEventListener('change', function(e) {
                Defaults.set('expiry_type', e.target.value);
                onExpiryTypeChange(e.target.value);
                if (expiryTypeElement.value !== 'endtime') Price_Beta.processPriceRequest_Beta();
            });
        }

        /*
         * bind event to change in duration units, populate duration and request price
         */
        const durationUnitElement = document.getElementById('duration_units');
        if (durationUnitElement) {
            durationUnitElement.addEventListener('change', function (e) {
                Defaults.remove('barrier', 'barrier_high', 'barrier_low');
                onDurationUnitChange(e.target.value);
                Price_Beta.processPriceRequest_Beta();
            });
        }

        /*
         * bind event to change in endtime date and time
         */
        const endDateElement = document.getElementById('expiry_date');
        if (endDateElement) {
            // need to use jquery as datepicker is used, if we switch to some other
            // datepicker we can move back to javascript
            $('#expiry_date').on('change input', function() {
                if (!dateValueChanged(this, 'date')) {
                    return false;
                }
                // if start time is less than end time
                if (timeIsValid($('#expiry_date'))) {
                    Durations_Beta.selectEndDate(moment(this.getAttribute('data-value')));
                }
                return true;
            });
        }

        const endTimeElement = document.getElementById('expiry_time');
        if (endTimeElement) {
            /*
             * attach datepicker and timepicker to end time durations
             * have to use jquery
             */
            attachTimePicker();
            $('#expiry_time')
                .on('focus, click', attachTimePicker)
                .on('keypress', function(ev) { onlyNumericOnKeypress(ev, [58]); })
                .on('change input blur', function() {
                    if (!dateValueChanged(this, 'time')) {
                        return false;
                    }
                    // if start time is less than end time
                    if (timeIsValid($('#expiry_time'))) {
                        Durations_Beta.setTime(endTimeElement.value);
                        Price_Beta.processPriceRequest_Beta();
                    }
                    return true;
                });
        }

        /*
         * attach event to change in amount, request new price only
         */
        const amountElement = document.getElementById('amount');
        if (amountElement) {
            amountElement.addEventListener('keypress', onlyNumericOnKeypress);

            amountElement.addEventListener('input', debounce(function(e) {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                Defaults.set('amount', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        const dateStartElement = getStartDateNode();
        if (dateStartElement) {
            dateStartElement.addEventListener('change', function (e) {
                Defaults.set('date_start', e.target.value);
                const r = Durations_Beta.onStartDateChange(e.target.value);
                if (r >= 0) {
                    Price_Beta.processPriceRequest_Beta();
                }
            });
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        const amountTypeElement = document.getElementById('amount_type');
        if (amountTypeElement) {
            amountTypeElement.addEventListener('change', function (e) {
                Defaults.set('amount_type', e.target.value);
                Price_Beta.processPriceRequest_Beta();
            });
        }

        /*
         * attach event to change in submarkets. We need to disable
         * underlyings that are not in selected seubmarkets
         */
        const submarketElement = document.getElementById('submarket');
        if (submarketElement) {
            submarketElement.addEventListener('change', function (e) {
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
        const currencyElement = document.getElementById('currency');
        if (currencyElement) {
            currencyElement.addEventListener('change', function (e) {
                Defaults.set('currency', e.target.value);
                const stopTypeDollarLabel = document.getElementById('stop_type_dollar_label');
                if (stopTypeDollarLabel && isVisible(stopTypeDollarLabel)) {
                    elementTextContent(stopTypeDollarLabel, e.target.value);
                }
                Price_Beta.processPriceRequest_Beta();
            });
        }

        /*
         * attach event to purchase buttons to buy the current contract
         */
        $('.purchase_button').on('click dblclick', function () {
            BinarySocket.wait('get_account_status').then((response) => {
                if (!/unwelcome/.test(response.get_account_status.status) && !isVisible(document.getElementById('confirmation_message_container'))) {
                    const id = this.getAttribute('data-purchase-id'),
                        askPrice = this.getAttribute('data-ask-price');

                    const params = { buy: id, price: askPrice, passthrough: {} };
                    Object.keys(this.attributes).forEach(function(attr) {
                        if (attr && this.attributes[attr] && this.attributes[attr].name &&
                                !/data\-balloon/.test(this.attributes[attr].name)) { // do not send tooltip data
                            const m = this.attributes[attr].name.match(/data\-(.+)/);

                            if (m && m[1] && m[1] !== 'purchase-id' && m[1] !== 'passthrough') {
                                params.passthrough[m[1]] = this.attributes[attr].value;
                            }
                        }
                    }, this);
                    if (id && askPrice) {
                        BinarySocket.send(params);
                        Price_Beta.incrFormId();
                        Price_Beta.processForgetProposals_Beta();
                    }
                }
            });
        });

        /*
         * attach event to close icon for purchase container
         */
        $('#close_confirmation_container, #contract_purchase_new_trade').on('click', function (e) {
            if (e.target) {
                e.preventDefault();
                document.getElementById('contract_confirmation_container').style.display = 'none';
                document.getElementById('contracts_list').style.display = 'flex';
                Price_Beta.processPriceRequest_Beta();
            }
        });

        /*
         * attach an event to change in barrier
         */
        const barrierElement = document.getElementById('barrier');
        if (barrierElement) {
            $('#barrier')
                .on('keypress', function(ev) { onlyNumericOnKeypress(ev, [43, 45, 46]); })
                .on('input', debounce(function (e) {
                    Barriers_Beta.validateBarrier();
                    Defaults.set('barrier', e.target.value);
                    Price_Beta.processPriceRequest_Beta();
                    submitForm(document.getElementById('websocket_form'));
                }, 1000));
        }

        /*
         * attach an event to change in low barrier
         */
        const lowBarrierElement = document.getElementById('barrier_low');
        if (lowBarrierElement) {
            lowBarrierElement.addEventListener('input', debounce(function (e) {
                Defaults.set('barrier_low', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in high barrier
         */
        const highBarrierElement = document.getElementById('barrier_high');
        if (highBarrierElement) {
            highBarrierElement.addEventListener('input', debounce(function (e) {
                Defaults.set('barrier_high', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in digit prediction input
         */
        const predictionElement = document.getElementById('prediction');
        if (predictionElement) {
            predictionElement.addEventListener('change', debounce(function (e) {
                Defaults.set('prediction', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in amount per point for spreads
         */
        const amountPerPointElement = document.getElementById('amount_per_point');
        if (amountPerPointElement) {
            amountPerPointElement.addEventListener('input', debounce(function (e) {
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                Defaults.set('amount_per_point', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in stop type for spreads
         */
        const stopTypeEvent = function (e) {
            Defaults.set('stop_type', e.target.value);
            Price_Beta.processPriceRequest_Beta();
        };

        const stopTypeElement = document.querySelectorAll('input[name="stop_type"]');
        if (stopTypeElement) {
            for (let i = 0, len = stopTypeElement.length; i < len; i++) {
                stopTypeElement[i].addEventListener('click', stopTypeEvent);
            }
        }

        /*
         * attach an event to change in stop loss input value
         */
        const stopLossElement = document.getElementById('stop_loss');
        if (stopLossElement) {
            stopLossElement.addEventListener('input', debounce(function (e) {
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                Defaults.set('stop_loss', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in stop profit input value
         */
        const stopProfitElement = document.getElementById('stop_profit');
        if (stopProfitElement) {
            stopProfitElement.addEventListener('input', debounce(function (e) {
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                Defaults.set('stop_profit', e.target.value);
                Price_Beta.processPriceRequest_Beta();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        // For verifying there are 2 digits after decimal
        const isStandardFloat = (function(value) {
            return (!isNaN(value) && value % 1 !== 0 && ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length > 2);
        });

        const init_logo = document.getElementById('trading_init_progress');
        if (init_logo) {
            init_logo.addEventListener('click', debounce(function () {
                reloadPage();
            }));
        }

        const tip = document.getElementById('symbol_tip');
        if (init_logo) {
            tip.addEventListener('click', debounce(function (e) {
                BinaryPjax.load(e.target.getAttribute('target'));
            }));
        }
    };

    const attachTimePicker = function() {
        const timePickerInst = new TimePicker('#expiry_time');
        const date_start = document.getElementById('date_start').value;
        const now = !date_start || date_start === 'now';
        const current_moment = now ? (window.time ? window.time : moment.utc()) : parseInt(date_start) * 1000;
        timePickerInst.hide();
        timePickerInst.show(current_moment);
    };

    return {
        init: initiate,
    };
})();

module.exports = {
    TradingEvents_Beta: TradingEvents_Beta,
};
