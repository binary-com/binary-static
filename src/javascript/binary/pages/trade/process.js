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
        if(document.getElementById('underlying')){
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

    if (!document.getElementById('underlying')) {
        return;
    }

    var underlying = document.getElementById('underlying').value;
    sessionStorage.setItem('underlying', underlying);

    // forget the old tick id i.e. close the old tick stream
    processForgetTicks();
    // get ticks for current underlying
    TradeSocket.send({ ticks : underlying });

    Tick.clean();
    
    updateWarmChart();

    Contract.getContracts(underlying);

    displayTooltip(sessionStorage.getItem('market'),underlying);
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

    TradingAnalysis.request();
}

function processContractForm() {
    Contract.details(sessionStorage.getItem('formname'));

    StartDates.display();

    if(sessionStorage.getItem('date_start') && moment(sessionStorage.getItem('date_start')*1000).isAfter(moment(),'minutes')){
        selectOption(sessionStorage.getItem('date_start'), document.getElementById('date_start'));
    }

    displayPrediction();

    displaySpreads();  
 
    if(sessionStorage.getItem('amount')){
        document.getElementById('amount').value = sessionStorage.getItem('amount');       
    }

    if(sessionStorage.getItem('amount_type')){
        selectOption(sessionStorage.getItem('amount_type'), document.getElementById('amount_type'));
    }

    Durations.display();
    var no_price_request;
    if(sessionStorage.getItem('expiry_type')==='endtime'){
        var is_selected = selectOption('endtime', document.getElementById('expiry_type'));
        if(is_selected){
            Durations.displayEndTime();
            if(sessionStorage.getItem('end_date') && moment(sessionStorage.getItem('end_date')).isAfter(moment())){
                $( "#expiry_date" ).datepicker( "setDate", sessionStorage.getItem('end_date') );
                Durations.selectEndDate(sessionStorage.getItem('end_date'));
                no_price_request = 1;
            }
        }
    }
    if(!no_price_request){
        if(sessionStorage.getItem('duration_units')){
            selectOption(sessionStorage.getItem('duration_units'), document.getElementById('duration_units'));
        }
        Durations.populate();
        if(sessionStorage.getItem('duration_amount')){
            document.getElementById('duration_amount').value = sessionStorage.getItem('duration_amount');       
        }
    }

    if(!no_price_request){
        processPriceRequest();
    }
}

function displayPrediction() {
    var predictionElement = document.getElementById('prediction_row');
    if(sessionStorage.getItem('formname') === 'digits'){
        predictionElement.show();
        if(sessionStorage.getItem('prediction')){
            selectOption(sessionStorage.getItem('prediction'),document.getElementById('prediction'));
        }
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
    if(sessionStorage.getItem('stop_type')){
       var el = document.querySelectorAll('input[name="stop_type"][value="'+sessionStorage.getItem('stop_type')+'"]');
       if(el){
            console.log(el);
            el[0].setAttribute('checked','checked');
       }
    }
    if(sessionStorage.getItem('amount_per_point')){
        document.getElementById('amount_per_point').value = sessionStorage.getItem('amount_per_point');
    }
    if(sessionStorage.getItem('stop_loss')){
        document.getElementById('stop_loss').value = sessionStorage.getItem('stop_loss');
    }
    if(sessionStorage.getItem('stop_profit')){
        document.getElementById('stop_profit').value = sessionStorage.getItem('stop_profit');
    }
}

function forgetTradingStreams(){
    processForgetProposals();
    processForgetTicks();
}
/*
 * Function to request for cancelling the current price proposal
 */
function processForgetProposals() {
    'use strict';
    showPriceOverlay();
    TradeSocket.send({forget_all: "proposal"});
    Price.clearMapping();   
}

/*
 * Function to process and calculate price based on current form
 * parameters or change in form parameters
 */
function processPriceRequest() {
    'use strict';

    Price.incrFormId();
    processForgetProposals();
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
function processForgetTicks() {
    'use strict';
    TradeSocket.send({ forget_all: 'ticks' });
}

/*
 * Function to process ticks stream
 */
function processTick(tick) {
    'use strict';
    var symbol = sessionStorage.getItem('underlying');
    if(tick.echo_req.ticks === symbol){
        Tick.details(tick);
        Tick.display();
        var digit_info = TradingAnalysis.digit_info();
        if(digit_info && tick.tick){
            digit_info.update(symbol,tick.tick.quote);
        }
        WSTickDisplay.updateChart(tick);
        Purchase.update_spot_list(tick);
        if (!Barriers.isBarrierUpdated()) {
            Barriers.display();
            Barriers.setBarrierUpdate(true);
        }
        updateWarmChart();
    }
}

function processProposal(response){
    'use strict';
    var form_id = Price.getFormId();
    if(response.echo_req.passthrough.form_id===form_id){
        hideOverlayContainer();
        Price.display(response, Contract.contractType()[Contract.form()]);
        hidePriceOverlay();
        if(form_id===1){
            document.getElementById('trading_socket_container').classList.add('show');
            document.getElementById('trading_init_progress').style.display = 'none';
        }
    }
}

function processTradingTimesRequest(date){
    var trading_times = Durations.trading_times();
    if(trading_times.hasOwnProperty(date)){
        processPriceRequest();
    }
    else{
        showPriceOverlay();
        TradeSocket.send({ trading_times: date });
    }
}

function processTradingTimes(response){
    var trading_times = Durations.trading_times();
    Durations.processTradingTimesAnswer(response);
    processPriceRequest();
}
