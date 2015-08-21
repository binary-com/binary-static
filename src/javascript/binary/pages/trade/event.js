/*
 * attach event to market list, so when client change market we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
var marketNavElement = document.getElementById('contract_market_nav');
if (marketNavElement) {
    marketNavElement.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'LI') {
            var clickedMarket = e.target;
            var isMarketActive = clickedMarket.classList.contains('active');
            sessionStorage.setItem('market', clickedMarket.id);
            setMarketPlaceholderContent();
            // as different markets have different forms so remove from sessionStorage
            // it will default to proper one
            sessionStorage.removeItem('formname');
            toggleMobileNavMenu(marketNavElement, clickedMarket);
            // if market is already active then no need to send same request again
            if (!isMarketActive) {
                processMarketOfferings();
            }
        }
    });
}

/*
 * attach event to form list, so when client click on different form we need to update form
 * and request for new Contract details to populate the form and request price accordingly
 */
var formNavElement = document.getElementById('contract_form_name_nav');
if (formNavElement) {
    formNavElement.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'LI') {
            var clickedForm = e.target;
            var isFormActive = clickedForm.classList.contains('active');
            sessionStorage.setItem('formname', clickedForm.id);
            setFormPlaceholderContent();
            // if form is already active then no need to send same request again
            toggleMobileNavMenu(formNavElement, clickedForm);
            if (!isFormActive) {
                contractFormEventChange(clickedForm.id);
            }
        }
    });
}

var contractFormEventChange = function (formName) {
    'use strict';

    var market = sessionStorage.getItem('market') || 'Forex';

    market = market.charAt(0).toUpperCase() + market.substring(1);

    // pass the original offerings as we don't want to request offerings again and again
    Offerings.details(Offerings.offerings(), market, formName);

    // change only submarkets and underlyings as per formName change
    displayOptions('submarket',Offerings.submarkets());
    displayUnderlyings();

    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as formName has changed
    TradeSocket.send({ contracts_for: underlying });
};

/*
 * attach event to underlying change, event need to request new contract details and price
 */
var underlyingElement = document.getElementById('underlying');
if (underlyingElement) {
    underlyingElement.addEventListener('change', function(e) {
        if (e.target) {
            sessionStorage.setItem('underlying', e.target.value);
            underlyingEventChange(e.target.value);
        }
    });
}

var underlyingEventChange = function (underlying) {
    'use strict';
    TradeSocket.send({ contracts_for: underlying });
};

/*
 * bind event to change in duration amount, request new price
 */
var durationAmountElement = document.getElementById('duration_amount');
if (durationAmountElement) {
    durationAmountElement.addEventListener('input', function (e) {
        processPriceRequest();
    });
}

/*
 * attach event to expiry time change, event need to populate duration
 * and request new price
 */
var expiryTypeElement = document.getElementById('expiry_type');
if (expiryTypeElement) {
    expiryTypeElement.addEventListener('change', function(e) {
        durationPopulate();
        if(e.target && e.target.value === 'endtime') {
            var current_moment = moment().add(5, 'minutes').utc();
            document.getElementById('expiry_date').value = current_moment.format('YYYY-MM-DD');
            document.getElementById('expiry_time').value = current_moment.format('HH:mm');
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
        durationPopulate();
        processPriceRequest();
    });
}

/*
 * bind event to change in endtime date and time
 */
var endDateElement = document.getElementById('expiry_date');
if (endDateElement) {
    endDateElement.addEventListener('change', function () {
        processPriceRequest();
    });
}

var endTimeElement = document.getElementById('expiry_time');
if (endTimeElement) {
    endTimeElement.addEventListener('change', function () {
        processPriceRequest();
    });
}

/*
 * attach event to change in amount, request new price only
 */
var amountElement = document.getElementById('amount');
if (amountElement) {
    amountElement.addEventListener('input', function(e) {
        sessionStorage.setItem('amount', e.target.value);
        processPriceRequest();
    });
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
            displayDurations('spot');
        } else {
            displayDurations('forward');
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
        processPriceRequest();
    });
}

/*
 * attach event to purchase buttons to buy the current contract
 */
var purchaseContractEvent = function () {
    var id = this.getAttribute('data-purchase-id'),
        askPrice = this.getAttribute('data-ask-price');

    if (id && askPrice) {
        TradeSocket.send({buy: id, price: askPrice});
        processForgetPriceIds();
    }
};

var purchaseButtonElements = document.getElementsByClassName('purchase_button');
if (purchaseButtonElements) {
    for (var i = 0, len = purchaseButtonElements.length; i < len; i++) {
        purchaseButtonElements[i].addEventListener('click', purchaseContractEvent);
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
            processPriceRequest();
        }
    });
}

/*
 * attach an event to change in barrier
 */
var barrierElement = document.getElementById('barrier');
if (barrierElement) {
    barrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}

/*
 * attach an event to change in low barrier
 */
var lowBarrierElement = document.getElementById('barrier_low');
if (lowBarrierElement) {
    lowBarrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}

/*
 * attach an event to change in high barrier
 */
var highBarrierElement = document.getElementById('barrier_high');
if (highBarrierElement) {
    highBarrierElement.addEventListener('change', function (e) {
        processPriceRequest();
    });
}
