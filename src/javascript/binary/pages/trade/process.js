/*
 * Function to process offerings, this function is called
 * when market is changed or for processing offerings response
 */
var processMarketOfferings = function () {
    'use strict';

    var market = sessionStorage.getItem('market') || 'forex',
        formname = sessionStorage.getItem('formname') || 'risefall',
        offerings = sessionStorage.getItem('offerings');

    // populate the Offerings object
    Offerings.details(JSON.parse(offerings), market.charAt(0).toUpperCase() + market.substring(1), formname);

    // display markets, submarket, underlyings corresponding to market selected
    displayListElements('contract_market_nav', Offerings.markets().sort(compareMarkets), market);
    // change the market placeholder content as per current market (used for mobile menu)
    setMarketPlaceholderContent(market);
    displayListElements('contract_form_name_nav', Object.keys(Offerings.contractForms()).sort(compareContractCategory), formname);
    // change the form placeholder content as per current form (used for mobile menu)
    setFormPlaceholderContent(formname);
    displayOptions('submarket',Offerings.submarkets());
    displayUnderlyings();

    // get the underlying selected
    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // get the contract details based on underlying as market has changed
    TradeSocket.send({ contracts_for: underlying });
};

/*
 * Function to display contract form for current underlying
 */
var processContractFormOfferings = function (contracts) {
    'use strict';

    Contract.details(contracts);

    // forget the old tick id i.e. close the old tick stream
    processForgetTickId();
    // get ticks for current underlying
    TradeSocket.send({ ticks : sessionStorage.getItem('underlying') });

    displayDurations('spot');

    displayStartDates();

    displayBarriers();

    processPriceRequest();
};

/*
 * Function to request for cancelling the current price proposal
 */
var processForgetPriceIds = function () {
    'use strict';

    Object.keys(Price.idDisplayMapping()).forEach(function (key) {
        TradeSocket.send({ forget: key });
    });
};

/*
 * Function to process and calculate price based on current form
 * parameters or change in form parameters
 */
var processPriceRequest = function () {
    'use strict';

    showPriceLoadingIcon();
    processForgetPriceIds();
    Price.clearMapping();
    for (var typeOfContract in Contract.contractType()[Offerings.form()]) {
        if(Contract.contractType()[Offerings.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
};

/*
 * Function to cancel the current tick stream
 * this need to be invoked before makin
 */
var processForgetTickId = function () {
    'use strict';

    if (Tick && Tick.id()) {
        TradeSocket.send({ forget: Tick.id() });
    }
};

/*
 * Function to process ticks stream
 */
var processTick = function (tick) {
    'use strict';

    Tick.details(tick);
    Tick.display();
};
