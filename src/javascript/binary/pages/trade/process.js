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

    if(update_page && (!symbol || !Symbols.underlyings()[market][symbol] || !Symbols.underlyings()[market][symbol].is_active)){
        symbol = undefined;
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

    var contract_categories = Contract.contractForms();
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

    displaySpreads();

    processPriceRequest();
}

function displayPrediction() {
    var predictionElement = document.getElementById('prediction_row');
    if(sessionStorage.getItem('formname') === 'digits'){
        predictionElement.show();
    }
    else{
        predictionElement.hide();
    }
}

function displaySpreads() {
    var amountType = document.getElementById('amount_type'),
        amountPerPointLabel = document.getElementById('amount_per_point_label'),
        amount = document.getElementById('amount'),
        amountPerPoint = document.getElementById('amount_per_point'),
        spreadContainer = document.getElementById('spread_element_container'),
        stopTypeDollarLabel = document.getElementById('stop_type_dollar_label'),
        expiryTypeRow = document.getElementById('expiry_row');

    if(sessionStorage.getItem('formname') === 'spreads'){
        amountType.hide();
        amount.hide();
        expiryTypeRow.hide();
        amountPerPointLabel.show();
        amountPerPoint.show();
        spreadContainer.show();
        stopTypeDollarLabel.textContent = document.getElementById('currency').value;
    } else {
        amountPerPointLabel.hide();
        amountPerPoint.hide();
        spreadContainer.hide();
        expiryTypeRow.show();
        amountType.show();
        amount.show();
    }
}

/*
 * Function to request for cancelling the current price proposal
 */
function processForgetPriceIds() {
    'use strict';
    if (Price) {
        showPriceOverlay();
        var price_data = Price.bufferRequests();
        var form_id = Price.getFormId();
        var price_id = Price.bufferedIds();

        for (var id in price_data) {
            if(price_data[id] && price_data[id].passthrough.form_id!==form_id){
                TradeSocket.send({ forget: id });
                delete price_data[id];
                delete price_id[id];
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

    Price.incrFormId();
    processForgetPriceIds();
    showPriceOverlay(); 
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
    WSTickDisplay.updateChart(tick);
    Purchase.update_spot_list(tick);
    if (!Barriers.isBarrierUpdated()) {
        Barriers.display();
        Barriers.setBarrierUpdate(true);
    }
}

function processProposal(response){
    'use strict';
    var price_data = Price.bufferRequests();
    var form_id = Price.getFormId();
    // This is crazy condition but there is no way
    if((!price_data[response.proposal.id] && response.echo_req.passthrough && response.echo_req.passthrough.form_id === form_id) || price_data[response.proposal.id].passthrough.form_id === Price.form_id){
        hideOverlayContainer();
        Price.display(response, Contract.contractType()[Contract.form()]);
        hidePriceOverlay();
        if(form_id===1){
            document.getElementById('trading_socket_container').classList.add('show');
            document.getElementById('trading_init_progress').style.display = 'none';
        }
    }
}
