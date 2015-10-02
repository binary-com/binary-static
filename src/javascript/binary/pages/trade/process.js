/*
 * This function process the active symbols to get markets
 * and underlying list
 */
function processActiveSymbols(data) {
    'use strict';

    // populate the Symbols object
    Symbols.details(data);

    var market = getDefaultMarket();

    // store the market
    sessionStorage.setItem('market', market);

    displayMarkets('contract_markets', Symbols.markets(), market);
    processMarket();
    setTimeout(function(){
        if(TradeSocket.socket().readyState === 1){
            var underlying = document.getElementById('underlying').value;
            Symbols.getSymbols(0);
        }
    }, 60*1000);
}


/*
 * Function to call when market has changed
 */
function processMarket(flag) {
    'use strict';

    // we can get market from sessionStorage as allowed market
    // is already set when this function is called
    var market = sessionStorage.getItem('market');
    var symbol = sessionStorage.getItem('underlying');
    var update_page = Symbols.need_page_update() || flag;

    if(!update_page && market && symbol && (!Symbols.underlyings()[market] || !Symbols.underlyings()[market][symbol] || !Symbols.underlyings()[market][symbol].is_active)){
        onMarketChange(Object.keys(Symbols.underlyings())[0]);
        return false;
    }
    
    displayUnderlyings('underlying', Symbols.underlyings()[market], symbol);

    if(update_page){
        processMarketUnderlying();
    }
}

/*
 * Function to call when underlying has changed
 */
function processMarketUnderlying() {
    'use strict';

    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // forget the old tick id i.e. close the old tick stream
    processForgetTickId();
    // get ticks for current underlying
    TradeSocket.send({ ticks : underlying });

    Contract.getContracts(underlying);

    requestTradeAnalysis();
}

/*
 * Function to display contract form for current underlying
 */
function processContract(contracts) {
    'use strict';

    Contract.setContracts(contracts);

    var contract_categories = getAllowedContractCategory(Contract.contractForms());
    var formname;
    if(sessionStorage.getItem('formname') && contract_categories[sessionStorage.getItem('formname')]){
        formname = sessionStorage.getItem('formname');
    }
    else{
        var tree = getContractCategoryTree(contract_categories);
        if(tree[0]){
            if(typeof tree[0] === 'object'){
                formname = tree[0][1][0];
            }
            else{
                formname = tree[0];
            }
        }
    }
    
    // set form to session storage
    sessionStorage.setItem('formname', formname);

    // change the form placeholder content as per current form (used for mobile menu)
    setFormPlaceholderContent(formname);

    displayContractForms('contract_form_name_nav', contract_categories, formname);

    processContractForm();
}

function processContractForm() {
    Contract.details(sessionStorage.getItem('formname'));

    displayStartDates();

    displayDurations();

    displayPrediction();

    processPriceRequest();
}

function displayPrediction(){
    var predictionElement = document.getElementById('prediction_row');
    if(sessionStorage.getItem('formname') === 'digits'){
        predictionElement.show();
    }
    else{
        predictionElement.hide();
    }
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

    processForgetPriceIds();
    showLoadingOverlay();
    for (var typeOfContract in Contract.contractType()[Contract.form()]) {
        if(Contract.contractType()[Contract.form()].hasOwnProperty(typeOfContract)) {
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
    TickDisplay.updateChart(tick);
    Purchase.update_spot_list(tick);
    if (!Barriers.isBarrierUpdated()) {
        Barriers.display();
        Barriers.setBarrierUpdate(true);
    }
}
