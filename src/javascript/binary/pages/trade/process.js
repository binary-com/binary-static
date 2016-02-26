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
    // setTimeout(function(){
    // if(document.getElementById('underlying')){
    //     Symbols.getSymbols(0);
    // }
    // }, 60*1000);
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

    if (update_page && (!symbol || !Symbols.underlyings()[market][symbol] || !Symbols.underlyings()[market][symbol].is_active)) {
        symbol = undefined;
    }
    displayUnderlyings('underlying', Symbols.underlyings()[market], symbol);

    if (update_page) {
        processMarketUnderlying();
    }
}

/*
 * Function to call when underlying has changed
 */
function processMarketUnderlying() {
    'use strict';

    var underlyingElement = document.getElementById('underlying');
    if (!underlyingElement) {
        return;
    }

    if(underlyingElement.selectedIndex < 0) {
        underlyingElement.selectedIndex = 0;
    }
    var underlying = underlyingElement.value;
    sessionStorage.setItem('underlying', underlying);

    showFormOverlay();

    // forget the old tick id i.e. close the old tick stream
    processForgetTicks();
    // get ticks for current underlying
    Tick.request(underlying);

    Tick.clean();

    updateWarmChart();

    BinarySocket.clearTimeouts();

    Contract.getContracts(underlying);

    displayTooltip(sessionStorage.getItem('market'), underlying);
}

/*
 * Function to display contract form for current underlying
 */
function processContract(contracts) {
    'use strict';

    document.getElementById('trading_socket_container').classList.add('show');
    document.getElementById('trading_init_progress').style.display = 'none';

    Contract.setContracts(contracts);

    if (typeof contracts.contracts_for !== 'undefined') {
        Tick.setQuote(contracts.contracts_for.spot);
        Tick.display(contracts.contracts_for.spot);
    }

    var contract_categories = Contract.contractForms();
    var formname;
    if (sessionStorage.getItem('formname') && contract_categories[sessionStorage.getItem('formname')]) {
        formname = sessionStorage.getItem('formname');
    } else {
        var tree = getContractCategoryTree(contract_categories);
        if (tree[0]) {
            if (typeof tree[0] === 'object') {
                formname = tree[0][1][0];
            } else {
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

    hideFormOverlay();
}

function processContractForm() {

    Contract.details(sessionStorage.getItem('formname'));

    StartDates.display();

    displayPrediction();

    displaySpreads();

    var r1;
    if (StartDates.displayed() && sessionStorage.getItem('date_start')) {
        r1 = TradingEvents.onStartDateChange(sessionStorage.getItem('date_start'));
        if (!r1) Durations.display();
    } else {
        Durations.display();
    }

    var expiry_type = sessionStorage.getItem('expiry_type') ? sessionStorage.getItem('expiry_type') : 'duration';
    var make_price_request = TradingEvents.onExpiryTypeChange(expiry_type);

    if (sessionStorage.getItem('amount')) $('#amount').val(sessionStorage.getItem('amount'));
    if (sessionStorage.getItem('amount_type')) selectOption(sessionStorage.getItem('amount_type'), document.getElementById('amount_type'));
    if (sessionStorage.getItem('currency')) selectOption(sessionStorage.getItem('currency'), document.getElementById('currency'));

    if (make_price_request >= 0) {
        processPriceRequest();
    }
}

function displayPrediction() {
    var predictionElement = document.getElementById('prediction_row');
    if (Contract.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
        predictionElement.show();
        if (sessionStorage.getItem('prediction')) {
            selectOption(sessionStorage.getItem('prediction'), document.getElementById('prediction'));
        }
    } else {
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

    if (sessionStorage.getItem('formname') === 'spreads') {
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
    if (sessionStorage.getItem('stop_type')) {
        var el = document.querySelectorAll('input[name="stop_type"][value="' + sessionStorage.getItem('stop_type') + '"]');
        if (el) {
            console.log(el);
            el[0].setAttribute('checked', 'checked');
        }
    }
    if (sessionStorage.getItem('amount_per_point')) {
        document.getElementById('amount_per_point').value = sessionStorage.getItem('amount_per_point');
    }
    if (sessionStorage.getItem('stop_loss')) {
        document.getElementById('stop_loss').value = sessionStorage.getItem('stop_loss');
    }
    if (sessionStorage.getItem('stop_profit')) {
        document.getElementById('stop_profit').value = sessionStorage.getItem('stop_profit');
    }
}

function forgetTradingStreams() {
    processForgetProposals();
    processForgetTicks();
}
/*
 * Function to request for cancelling the current price proposal
 */
function processForgetProposals() {
    'use strict';
    showPriceOverlay();
    BinarySocket.send({
        forget_all: "proposal"
    });
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
    var types = Contract.contractType()[Contract.form()];
    if (Contract.form() === 'digits') {
        switch (sessionStorage.getItem('formname')) {
            case 'matchdiff':
                types = {
                    'DIGITMATCH': 1,
                    'DIGITDIFF': 1
                };
                break;
            case 'evenodd':
                types = {
                    'DIGITEVEN': 1,
                    'DIGITODD': 1
                };
                break;
            case 'overunder':
                types = {
                    'DIGITOVER': 1,
                    'DIGITUNDER': 1
                };
        }
    }
    for (var typeOfContract in types) {
        if (types.hasOwnProperty(typeOfContract)) {
            BinarySocket.send(Price.proposal(typeOfContract));
        }
    }
}

/*
 * Function to cancel the current tick stream
 * this need to be invoked before makin
 */
function processForgetTicks() {
    'use strict';
    BinarySocket.send({
        forget_all: 'ticks'
    });
}

/*
 * Function to process ticks stream
 */
function processTick(tick) {
    'use strict';
    var symbol = sessionStorage.getItem('underlying');
    var digit_info = TradingAnalysis.digit_info();
    if(tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)){
        Tick.details(tick);
        Tick.display();
        if (digit_info && tick.tick) {
            digit_info.update_chart(tick);
        }
        WSTickDisplay.updateChart(tick);
        Purchase.update_spot_list(tick);
        if (!Barriers.isBarrierUpdated()) {
            Barriers.display();
            Barriers.setBarrierUpdate(true);
        }
        updateWarmChart();
    } else {
        if(digit_info)
            digit_info.update_chart(tick);
    }
}

function processProposal(response) {
    'use strict';
    var form_id = Price.getFormId();
    if(response.echo_req.passthrough.form_id===form_id){
        hideOverlayContainer();
        Price.display(response, Contract.contractType()[Contract.form()]);
        hidePriceOverlay();
    }
}

function processTradingTimesRequest(date) {
    var trading_times = Durations.trading_times();
    if (trading_times.hasOwnProperty(date)) {
        processPriceRequest();
    } else {
        showPriceOverlay();
        BinarySocket.send({
            trading_times: date
        });
    }
}

function processTradingTimes(response) {
    Durations.processTradingTimesAnswer(response);

    processPriceRequest();
}
