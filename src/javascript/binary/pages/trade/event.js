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


    var onStartDateChange = function(value){

        if(!value || !$('#date_start').find('option[value='+value+']').length){
            return 0;
        }
        $('#date_start').val(value);

        var make_price_request = 1;
        if (value === 'now') {
            sessionStorage.removeItem('date_start');
        } else {
            if ($('expiry_type').val() === 'endtime'){
                make_price_request = -1;
                var end_time = moment(value*1000).utc().add(15,'minutes');
                Durations.setTime(end_time.format("hh:mm"));
                Durations.selectEndDate(end_time.format("YYYY-MM-DD"));
            }
            sessionStorage.setItem('date_start', value);
        }

        Durations.display();

        return make_price_request;
    };

    var onExpiryTypeChange = function(value){

        if(!value || !$('#expiry_type').find('option[value='+value+']').length){
            value = 'duration';
        }

        $('#expiry_type').val(value);

        sessionStorage.setItem('expiry_type',value);
        var make_price_request = 0;
        if(value === 'endtime'){
            Durations.displayEndTime();
            if(sessionStorage.getItem('end_date')){
                Durations.selectEndDate(sessionStorage.getItem('end_date'));
                make_price_request = -1;
            }
        }
        else{
            Durations.display();
            if(sessionStorage.getItem('duration_units')){
                TradingEvents.onDurationUnitChange(sessionStorage.getItem('duration_units'));
            }
            if(sessionStorage.getItem('duration_amount') && sessionStorage.getItem('duration_amount') > $('#duration_minimum').text()){
                $('#duration_amount').val(sessionStorage.getItem('duration_amount'));
            }
            make_price_request = 1;
        }

        return make_price_request;
    };

    var onDurationUnitChange = function(value){

        if(!value || !$('#duration_units').find('option[value='+value+']').length){
            return 0;
        }
        $('#duration_units').val(value);
        
        sessionStorage.setItem('duration_units',value);
        Durations.select_unit(value);
        Durations.populate();

        return 1;
    };

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
            TradingAnalysis.request();
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
                    showFormOverlay();
                    showPriceOverlay();
                    if(e.target.selectedIndex < 0) {
                        e.target.selectedIndex = 0;
                    }
                    var underlying = e.target.value;
                    sessionStorage.setItem('underlying', underlying);
                    TradingAnalysis.request();

                    Tick.clean();

                    updateWarmChart();

                    Contract.getContracts(underlying);

                    // forget the old tick id i.e. close the old tick stream
                    processForgetTicks();
                    // get ticks for current underlying
                    Tick.request(underlying);
                }
            });
            underlyingElement.addEventListener('mousedown', function(e) {
                Symbols.getSymbols(0);
            });
        }

        /*
         * bind event to change in duration amount, request new price
         */
        function triggerOnDurationChange(e){
            if (e.target.value % 1 !== 0 ) {
                e.target.value = Math.floor(e.target.value);
            }
            sessionStorage.setItem('duration_amount',e.target.value);
            Durations.select_amount(e.target.value);
            processPriceRequest();
            submitForm(document.getElementById('websocket_form'));
        }
        var durationAmountElement = document.getElementById('duration_amount'),
            inputEventTriggered = false;          // For triggering one of the two events.
        if (durationAmountElement) {
            // jquery needed for datepicker
            $('#duration_amount').on('input', debounce(function (e) {
                triggerOnDurationChange(e);
                inputEventTriggered = true;
            }));
            $('#duration_amount').on('change', debounce(function (e) {
                if(inputEventTriggered === false)
                    triggerOnDurationChange(e);
                else
                    inputEventTriggered = false;
            }));
        }

        /*
         * attach event to expiry time change, event need to populate duration
         * and request new price
         */
        var expiryTypeElement = document.getElementById('expiry_type');
        if (expiryTypeElement) {
            expiryTypeElement.addEventListener('change', function(e) {
                onExpiryTypeChange(e.target.value);
                processPriceRequest();
            });
        }

        /*
         * bind event to change in duration units, populate duration and request price
         */
        var durationUnitElement = document.getElementById('duration_units');
        if (durationUnitElement) {
            durationUnitElement.addEventListener('change', function (e) {
                onDurationUnitChange(e.target.value);
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
            $('#expiry_date').on('change input', function () {
                Durations.selectEndDate(this.value);
            });
        }

        var endTimeElement = document.getElementById('expiry_time');
        if (endTimeElement) {
            $('#expiry_time').on('change input', function () {
                Durations.setTime(endTimeElement.value);
                processPriceRequest();
            });
        }

        /*
         * attach event to change in amount, request new price only
         */
        var amountElement = document.getElementById('amount');
        if (amountElement) {
            amountElement.addEventListener('keypress', function(e) {
                var key = e.keyCode;
                var char = String.fromCharCode(e.which);
                if((char === '.' && e.target.value.indexOf(char) >= 0) ||
                    (!/[0-9\.]/.test(char) && [8, 37, 39, 46].indexOf(key) < 0) || // delete, backspace, arrow keys
                    /['%]/.test(char)) { // similarity to arrows key code in some browsers
                        e.returnValue = false;
                        e.preventDefault();
                }
            });

            amountElement.addEventListener('input', debounce( function(e) {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
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
        var dateStartElement = StartDates.node();
        if (dateStartElement) {
            dateStartElement.addEventListener('change', function (e) {
                var r = onStartDateChange(e.target.value);
                if(r>=0){
                    processPriceRequest();
                }
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
            for(var attr in this.attributes){
                if(attr && this.attributes[attr] && this.attributes[attr].name){
                    var m = this.attributes[attr].name.match(/data\-(.+)/);

                    if(m && m[1] && m[1]!=="purchase-id" && m[1]!=="passthrough"){
                        params.passthrough[m[1]] = this.attributes[attr].value;
                    }
                }
            }
            if (id && askPrice) {
                BinarySocket.send(params);
                Price.incrFormId();
                processForgetProposals();
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

            predictionElement.addEventListener('change', debounce( function (e) {
                sessionStorage.setItem('prediction',e.target.value);
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
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                sessionStorage.setItem('amount_per_point',e.target.value);
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }

        /*
         * attach an event to change in stop type for spreads
         */
        var stopTypeEvent = function (e) {
            sessionStorage.setItem('stop_type',e.target.value);
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
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                sessionStorage.setItem('stop_loss',e.target.value);
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
                if (isStandardFloat(e.target.value)) {
                    e.target.value = parseFloat(e.target.value).toFixed(2);
                }
                sessionStorage.setItem('stop_profit',e.target.value);
                processPriceRequest();
                submitForm(document.getElementById('websocket_form'));
            }));
        }
        
        // For verifying there are 2 digits after decimal
        var isStandardFloat = (function(value){
            return (value % 1 !== 0 && ((+parseFloat(value)).toFixed(10)).replace(/^-?\d*\.?|0+$/g, '').length>2);
        });

        var jhighBarrierElement = document.getElementById('jbarrier_high');
        if (jhighBarrierElement) {
            jhighBarrierElement.addEventListener('change', function (e) {
                processPriceRequest();
            });
        }


        var jlowBarrierElement = document.getElementById('jbarrier_low');
        if (jlowBarrierElement) {
            jlowBarrierElement.addEventListener('change', function (e) {
                var options = jhighBarrierElement.getElementsByTagName('option');
                var f = 0;
                if(jhighBarrierElement.value > jlowBarrierElement.value){
                    f = 1;
                }
                for(var i=0; i<options.length; i++){
                    option = options[i];

                    if(option.value <= jlowBarrierElement.value){
                        option.setAttribute('disabled', true);
                    }
                else{
                    if(!f){
                        jhighBarrierElement.value = option.value;
                        f=1;
                    }
                    option.removeAttribute('disabled');
                }
                }
                processPriceRequest();
            });
        }

        var jbarrierElement = document.getElementById('jbarrier');
        if (jbarrierElement) {
            jbarrierElement.addEventListener('change', function (e) {
                processPriceRequest();
            });
        }

        var period = document.getElementById('period');
        if(period){
            period.addEventListener('change', function (e) {
                Periods.displayBarriers();
                processPriceRequest();
                var japan_info = TradingAnalysis.japan_info();
                if(japan_info && TradingAnalysis.getActiveTab() === 'tab_japan_info'){
                    japan_info.show();
                }
            });
        }

        if(typeof is_japan === 'function'){
            var amount_type = document.getElementById('amount_type');
            var options = amount_type.getElementsByTagName('option');
            for(var d=0; d<options.length; d++){
                if(options[d].value!='payout'){
                    options[d].setAttribute('disabled', true);
                }
            }
        }

        var init_logo = document.getElementById('trading_init_progress');
        if(init_logo){
            init_logo.addEventListener('click', debounce( function (e) {
                reloadPage();
            }));
        }

        var tip = document.getElementById('symbol_tip');
        if(init_logo){
            tip.addEventListener('click', debounce( function (e) {
                var url = e.target.getAttribute('target');
                load_with_pjax(url);
            }));
        }

        /*
         * attach datepicker and timepicker to end time durations
         * have to use jquery
         */
        $(".pickadate").datepicker({
            minDate: new Date(),
            dateFormat: "yy-mm-dd"
        });
        var date = new Date();
        $(".pickatime" ).timepicker({minTime:{hour: date.getUTCHours(), minute: date.getUTCMinutes()}});
    };

    return {
        init: initiate,
        onStartDateChange: onStartDateChange,
        onExpiryTypeChange: onExpiryTypeChange,
        onDurationUnitChange: onDurationUnitChange
    };
})();
