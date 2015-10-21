/*
 * TradingEvents object contains all the event handler function required for
 * websocket trading page
 *
 * We need it as object so that we can call TradingEvent.init() only on trading
 * page for pjax to work else it will fire on all pages
 *
 */
var TradingEvents = (function () {
    'use strict';

    var initiate = function () {
        /*
         * attach event to market list, so when client change market we need to update undelryings
         * and request for new Contract details to populate the form and request price accordingly
         */
        var marketNavElement = document.getElementById('contract_markets');
        var onMarketChange = function(market){
            showPriceOverlay();
            sessionStorage.setItem('market', market);

            // as different markets have different forms so remove from sessionStorage
            // it will default to proper one
            sessionStorage.removeItem('formname');
            sessionStorage.removeItem('underlying');
            processMarket(1);
        };

        if (marketNavElement) {
            marketNavElement.addEventListener('change', function(e) {
                var clickedMarket = e.target;
                onMarketChange(clickedMarket.value);
            });
        }

        /*
         * attach event to form list, so when client click on different form we need to update form
         * and request for new Contract details to populate the form and request price accordingly
         */
        var contractFormEventChange = function () {
            processContractForm();
            requestTradeAnalysis();
        };

        var formNavElement = document.getElementById('contract_form_name_nav');
        if (formNavElement) {
            formNavElement.addEventListener('click', function(e) {
                if (e.target && e.target.getAttribute('menuitem')) {
                    var clickedForm = e.target;
                    var isFormActive = clickedForm.classList.contains('active');
                    sessionStorage.setItem('formname', clickedForm.getAttribute('menuitem'));

                    setFormPlaceholderContent();
                    // if form is already active then no need to send same request again
                    toggleActiveCatMenuElement(formNavElement, e.target.getAttribute('menuitem'));

                    if (!isFormActive) {
                        contractFormEventChange();
                    }
                    var contractFormCheckbox = document.getElementById('contract_form_show_menu');
                    if (contractFormCheckbox) {
                        contractFormCheckbox.checked = false;
                    }
                }
            });
        }

        /*
         * attach event to underlying change, event need to request new contract details and price
         */
        var underlyingElement = document.getElementById('underlying');
        if (underlyingElement) {
            underlyingElement.addEventListener('change', function(e) {
                if (e.target) {
                    showPriceOverlay();
                    var underlying = e.target.value;
                    sessionStorage.setItem('underlying', underlying);
                    requestTradeAnalysis();

                    Contract.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTickId();
                    // get ticks for current underlying
                    TradeSocket.send({ ticks : underlying });
                }
            });
        }

        /*
         * bind event to change in duration amount, request new price
         */
        var durationAmountElement = document.getElementById('duration_amount');
        if (durationAmountElement) {
            // jquery needed for datepicker
            $('#duration_amount').on('change', debounce(function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        var expiryTypeElement = document.getElementById('expiry_type');
        if (expiryTypeElement) {
            expiryTypeElement.addEventListener('change', function(e) {
                Durations.populate();
                if(e.target && e.target.value === 'endtime') {
                    var current_moment = moment().add(5, 'minutes').utc();
                    document.getElementById('expiry_date').value = current_moment.format('YYYY-MM-DD');
                    document.getElementById('expiry_time').value = current_moment.format('HH:mm');
                    Durations.setTime(current_moment.format('HH:mm'));
                }
                processPriceRequest();
            });
        }

        /*
         * bind event to change in duration units, populate duration and request price
         */
        var durationUnitElement = document.getElementById('duration_units');
        if (durationUnitElement) {
            durationUnitElement.addEventListener('change', function () {
                Durations.populate();
                processPriceRequest();
            });
        }

        /*
         * bind event to change in endtime date and time
         */
        var endDateElement = document.getElementById('expiry_date');
        if (endDateElement) {
            // need to use jquery as datepicker is used, if we switch to some other
            // datepicker we can move back to javascript
            $('#expiry_date').on('change', function () {
                var input = this.value;
                var match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
                if(match){
                    var date1 = new Date();
                    date1.setUTCFullYear(match[1]);
                    date1.setUTCMonth(match[2]-1);
                    date1.setUTCDate(match[3]);

                    var date2 = new Date();
                    var diff = date1.getTime() - date2.getTime();
                    var expiry_time = document.getElementById('expiry_time');
                    if(diff > 24*60*60*1000){
                        Durations.setTime('');
                        expiry_time.hide();
                    }
                    else{
                        Durations.setTime(expiry_time.value);
                        expiry_time.show();
                    }
                    processTradingTimesRequest(input);
                }
            });
        }

        var endTimeElement = document.getElementById('expiry_time');
        if (endTimeElement) {
            $('#expiry_time').on('change', function () {
                Durations.setTime(endTimeElement.value);
                processPriceRequest();
            });
        }

        /*
         * attach event to change in amount, request new price only
         */
        var amountElement = document.getElementById('amount');
        if (amountElement) {
            amountElement.addEventListener('input', debounce( function(e) {
                sessionStorage.setItem('amount', e.target.value);
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach event to start time, display duration based on
         * whether start time is forward starting or not and request
         * new price
         */
        var dateStartElement = document.getElementById('date_start');
        if (dateStartElement) {
            dateStartElement.addEventListener('change', function (e) {
                if (e.target && e.target.value === 'now') {
                    Durations.display('spot');
                } else {
                    Durations.display('forward');
                }
                processPriceRequest();
            });
        }

        /*
         * attach event to change in amount type that is whether its
         * payout or stake and request new price
         */
        var amountTypeElement = document.getElementById('amount_type');
        if (amountTypeElement) {
            amountTypeElement.addEventListener('change', function (e) {
                sessionStorage.setItem('amount_type', e.target.value);
                processPriceRequest();
            });
        }

        /*
         * attach event to change in submarkets. We need to disable
         * underlyings that are not in selected seubmarkets
         */
        var submarketElement = document.getElementById('submarket');
        if (submarketElement) {
            submarketElement.addEventListener('change', function (e) {
                if (e.target) {
                    var elem = document.getElementById('underlying');
                    var underlyings = elem.children;

                    for (var i = 0, len = underlyings.length; i < len; i++ ) {
                        if (e.target.value !== 'all' && e.target.value !== underlyings[i].className) {
                            underlyings[i].disabled = true;
                        } else {
                            underlyings[i].disabled = false;
                        }
                    }

                    // as submarket change has modified the underlying list so we need to manually
                    // fire change event for underlying
                    document.querySelectorAll('#underlying option:enabled')[0].selected = 'selected';
                    var event = new Event('change');
                    elem.dispatchEvent(event);
                }
            });
        }

        /*
         * attach an event to change in currency
         */
        var currencyElement = document.getElementById('currency');
        if (currencyElement) {
            currencyElement.addEventListener('change', function (e) {
                sessionStorage.setItem('currency', e.target.value);
                var stopTypeDollarLabel = document.getElementById('stop_type_dollar_label');
                if (stopTypeDollarLabel && isVisible(stopTypeDollarLabel)) {
                    stopTypeDollarLabel.textContent = e.target.value;
                }
                processPriceRequest();
            });
        }

        /*
         * attach event to purchase buttons to buy the current contract
         */
        // using function expression form here as it used inside for loop
        var purchaseContractEvent = function () {
            var id = this.getAttribute('data-purchase-id'),
                askPrice = this.getAttribute('data-ask-price');

            var params = {buy: id, price: askPrice, passthrough:{}};
            var ids = Price.bufferedIds();
            if(ids[id]){
                for(var attr in this.attributes){
                    if(attr && this.attributes[attr] && this.attributes[attr].name){
                        var m = this.attributes[attr].name.match(/data\-(.+)/);

                        if(m && m[1] && m[1]!=="purchase-id" && m[1]!=="passthrough"){
                            params.passthrough[m[1]] = this.attributes[attr].value;
                        }
                    }
                }
                if (id && askPrice) {
                    TradeSocket.send(params);
                    Price.incrFormId();
                    processForgetPriceIds();
                }
            }
        };

        var purchaseButtonElements = document.getElementsByClassName('purchase_button');
        if (purchaseButtonElements) {
            for (var j = 0, l = purchaseButtonElements.length; j < l; j++) {
                purchaseButtonElements[j].addEventListener('click', purchaseContractEvent);
            }
        }

        /*
         * attach event to close icon for purchase container
         */
        var closeContainerElement = document.getElementById('close_confirmation_container');
        if (closeContainerElement) {
            closeContainerElement.addEventListener('click', function (e) {
                if (e.target) {
                    e.preventDefault();
                    document.getElementById('contract_confirmation_container').style.display = 'none';
                    document.getElementById('contracts_list').style.display = 'flex';
                    processPriceRequest();
                }
            });
        }

        /*
         * attach an event to change in barrier
         */
        var barrierElement = document.getElementById('barrier');
        if (barrierElement) {
            barrierElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in low barrier
         */
        var lowBarrierElement = document.getElementById('barrier_low');
        if (lowBarrierElement) {
            lowBarrierElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in high barrier
         */
        var highBarrierElement = document.getElementById('barrier_high');
        if (highBarrierElement) {
            highBarrierElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in digit prediction input
         */
        var predictionElement = document.getElementById('prediction');
        if (predictionElement) {
            predictionElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in amount per point for spreads
         */
        var amountPerPointElement = document.getElementById('amount_per_point');
        if (amountPerPointElement) {
            amountPerPointElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in stop type for spreads
         */
        var stopTypeEvent = function () {
            processPriceRequest();
        };

        var stopTypeElement = document.querySelectorAll('input[name="stop_type"]');
        if (stopTypeElement) {
            for (var i = 0, len = stopTypeElement.length; i < len; i++) {
                stopTypeElement[i].addEventListener('click', stopTypeEvent);
            }
        }

        /*
         * attach an event to change in stop loss input value
         */
        var stopLossElement = document.getElementById('stop_loss');
        if (stopLossElement) {
            stopLossElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in stop profit input value
         */
        var stopProfitElement = document.getElementById('stop_profit');
        if (stopProfitElement) {
            stopProfitElement.addEventListener('input', debounce( function (e) {
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        var init_logo = document.getElementById('trading_init_progress');
        if(init_logo){
            init_logo.addEventListener('click', debounce( function (e) {
                sessionStorage.removeItem('market');
                sessionStorage.removeItem('formname');
                sessionStorage.removeItem('underlying');
                location.reload();
            }));
        }

        var tip = document.getElementById('symbol_tip');
        if(init_logo){
            tip.addEventListener('click', debounce( function (e) {
                var url = e.target.getAttribute('target');
                load_with_pjax(url);
            }));
        }

        var view_button = document.getElementById('contract_purchase_button');
        if(view_button){
            tip.addEventListener('click', debounce( function (e) {
                BetSell.sell_at_market($(e.traget)[0]);
            }));
        }


        /*
         * attach datepicker and timepicker to end time durations
         * have to use jquery
         */
        $(".pickadate").datepicker({
            dateFormat: "yy-mm-dd"
        });
        $(".pickatime" ).timepicker();
    };

    return {
        init: initiate
    };
})();

