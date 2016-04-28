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
    Defaults.set('market', market);

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
    var market = Defaults.get('market');
    var symbol = Defaults.get('underlying');
    var update_page = Symbols.need_page_update() || flag;

    // change to default market if query string contains an invalid market
    if(!market || !Symbols.underlyings()[market]) {
        market = getDefaultMarket();
        Defaults.set('market', market);
    }
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
    Defaults.set('underlying', underlying);

    showFormOverlay();

    // forget the old tick id i.e. close the old tick stream
    processForgetTicks();
    // get ticks for current underlying
    Tick.request(underlying);

    Tick.clean();

    updateWarmChart();

    BinarySocket.clearTimeouts();

    Contract.getContracts(underlying);

    displayTooltip(Defaults.get('market'), underlying);
}

/*
 * Function to display contract form for current underlying
 */
function processContract(contracts) {
    'use strict';
    if(contracts.hasOwnProperty('error') && contracts.error.code === 'InvalidSymbol') {
        processForgetProposals();
        var container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message'),
            confirmation_error = document.getElementById('confirmation_error'),
            contracts_list = document.getElementById('contracts_list');
        container.style.display = 'block';
        contracts_list.style.display = 'none';
        message_container.hide();
        confirmation_error.show();
        confirmation_error.innerHTML = contracts.error.message + ' <a href="javascript:;" onclick="TradePage.reload();">' + text.localize('Please reload the page') + '</a>';
        return;
    }

    window.chartAllowed = true;
    if (contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly') {
      window.chartAllowed = false;
    }

    document.getElementById('trading_socket_container').classList.add('show');
    var init_logo = document.getElementById('trading_init_progress');
    if(init_logo.style.display !== 'none') {
        init_logo.style.display = 'none';
        Defaults.update();
    }

    Contract.setContracts(contracts);

    var contract_categories = Contract.contractForms();
    var formname;
    if (Defaults.get('formname') && contract_categories[Defaults.get('formname')]) {
        formname = Defaults.get('formname');
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
    Defaults.set('formname', formname);

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
    if (StartDates.displayed() && Defaults.get('date_start') && Defaults.get('date_start') !== 'now') {
        r1 = TradingEvents.onStartDateChange(Defaults.get('date_start'));
        if (!r1 || Defaults.get('expiry_type') === 'endtime') Durations.display();
    } else {
        Durations.display();
    }

    if (Defaults.get('amount')) $('#amount').val(Defaults.get('amount'));
        else Defaults.set('amount', document.getElementById('amount').value);
    if (Defaults.get('amount_type')) selectOption(Defaults.get('amount_type'), document.getElementById('amount_type'));
        else Defaults.set('amount_type', document.getElementById('amount_type').value);
    if (Defaults.get('currency')) selectOption(Defaults.get('currency'), document.getElementById('currency'));

    var expiry_type = Defaults.get('expiry_type') || 'duration';
    var make_price_request = TradingEvents.onExpiryTypeChange(expiry_type);

    if (make_price_request >= 0) {
        processPriceRequest();
    }

    if(Defaults.get('formname') === 'spreads') {
        Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time', 'amount', 'amount_type');
    } else {
        Defaults.remove('amount_per_point', 'stop_type', 'stop_loss', 'stop_profit');
    }
}

function displayPrediction() {
    var predictionElement = document.getElementById('prediction_row');
    if (Contract.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
        predictionElement.show();
        if (Defaults.get('prediction')) {
            selectOption(Defaults.get('prediction'), document.getElementById('prediction'));
        }
        else {
            Defaults.set('prediction', document.getElementById('prediction').value);
        }
    } else {
        predictionElement.hide();
        Defaults.remove('prediction');
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
        if (Defaults.get('stop_type')) {
            var el = document.querySelectorAll('input[name="stop_type"][value="' + Defaults.get('stop_type') + '"]');
            if (el) {
                el[0].setAttribute('checked', 'checked');
            }
        } else {
            Defaults.set('stop_type', document.getElementById('stop_type_points').checked ? 'point' : 'dollar');
        }
        if (Defaults.get('amount_per_point')) amountPerPoint.value = Defaults.get('amount_per_point');
            else Defaults.set('amount_per_point', amountPerPoint.value);
        if (Defaults.get('stop_loss')) document.getElementById('stop_loss').value = Defaults.get('stop_loss');
            else Defaults.set('stop_loss', document.getElementById('stop_loss').value);
        if (Defaults.get('stop_profit')) document.getElementById('stop_profit').value = Defaults.get('stop_profit');
            else Defaults.set('stop_profit', document.getElementById('stop_profit').value);
    } else {
        amountPerPointLabel.hide();
        amountPerPoint.hide();
        spreadContainer.hide();
        expiryTypeRow.show();
        amountType.show();
        amount.show();
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
