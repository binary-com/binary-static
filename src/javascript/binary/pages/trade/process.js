/*
 * Function to process offerings, this function is called
 * when market is changed or for processing offerings response
 */
function processMarketOfferings() {
    'use strict';

    var market = getDefaultMarket(),
        formname = sessionStorage.getItem('formname') || 'risefall',
        offerings = sessionStorage.getItem('offerings');

    // store the market
    sessionStorage.setItem('market', market);

    // populate the Offerings object
    Offerings.details(JSON.parse(offerings), market.charAt(0).toUpperCase() + market.substring(1), formname);

    // change the market placeholder content as per current market (used for mobile menu)
    setMarketPlaceholderContent(market);

    // display markets, submarket, underlyings corresponding to market selected
    displayListElements('contract_market_nav', getAllowedMarkets(Offerings.markets().sort(compareMarkets)), market);
    displayListElements('contract_form_name_nav', Object.keys(getAllowedContractCategory(Offerings.contractForms())).sort(compareContractCategory), formname);

    // change the form placeholder content as per current form (used for mobile menu)
    setFormPlaceholderContent(formname);

    displayOptions('submarket',Offerings.submarkets());
    displayUnderlyings();

    // get the underlying selected
    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);
    sessionStorage.setItem('formname', formname);

    // get the contract details based on underlying as market has changed
    TradeSocket.send({ contracts_for: underlying });
    requestTradeAnalysis();
}

/*
 * Function to display contract form for current underlying
 */
function processContractFormOfferings(contracts) {
    'use strict';

    Contract.details(contracts);

    // forget the old tick id i.e. close the old tick stream
    processForgetTickId();
    // get ticks for current underlying
    TradeSocket.send({ ticks : sessionStorage.getItem('underlying') });

    displayDurations('spot');

    displayStartDates();

    processPriceRequest();
}

/*
 * Function to request for cancelling the current price proposal
 */
function processForgetPriceIds() {
    'use strict';
    if (Price) {
        var priceIds = Price.bufferedIds();
        for (var id in priceIds) {
            if (priceIds.hasOwnProperty(id)) {
                TradeSocket.send({ forget: id });
                delete priceIds[id];
            }
        }
        Price.clearMapping();
    }
}

/*
 * Function to process and calculate price based on current form
 * parameters or change in form parameters
 */
function processPriceRequest() {
    'use strict';

    showPriceLoadingIcon();
    processForgetPriceIds();
    for (var typeOfContract in Contract.contractType()[Offerings.form()]) {
        if(Contract.contractType()[Offerings.form()].hasOwnProperty(typeOfContract)) {
            TradeSocket.send(Price.proposal(typeOfContract));
        }
    }
}

/*
 * Function to cancel the current tick stream
 * this need to be invoked before makin
 */
function processForgetTickId() {
    'use strict';
    if (Tick) {
        var tickIds = Tick.bufferedIds();
        for (var id in tickIds) {
            if (tickIds.hasOwnProperty(id)) {
                TradeSocket.send({ forget: id });
                delete tickIds[id];
            }
        }
    }
}

/*
 * Function to process ticks stream
 */
function processTick(tick) {
    'use strict';
    Tick.details(tick);
    Tick.display();
    if (!Barriers.isBarrierUpdated()) {
        Barriers.display();
        Barriers.setBarrierUpdate(true);
    }
}
