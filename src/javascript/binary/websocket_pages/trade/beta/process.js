const TradingAnalysis_Beta           = require('./analysis').TradingAnalysis_Beta;
const Barriers_Beta                  = require('./barriers').Barriers_Beta;
const Contract_Beta                  = require('./contract').Contract_Beta;
const Durations_Beta                 = require('./duration').Durations_Beta;
const Price_Beta                     = require('./price').Price_Beta;
const Purchase_Beta                  = require('./purchase').Purchase_Beta;
const StartDates_Beta                = require('./starttime').StartDates_Beta;
const TickDisplay_Beta               = require('./tick_trade');
const Defaults                       = require('../defaults').Defaults;
const Symbols                        = require('../symbols').Symbols;
const Tick                           = require('../tick').Tick;
const State                          = require('../../../base/storage').State;
const localize                       = require('../../../base/localize').localize;
const displayUnderlyings             = require('../common').displayUnderlyings;
const setFormPlaceholderContent_Beta = require('../set_values').setFormPlaceholderContent_Beta;
const hidePriceOverlay               = require('../common').hidePriceOverlay;
const hideFormOverlay                = require('../common').hideFormOverlay;
const showFormOverlay                = require('../common').showFormOverlay;
const hideOverlayContainer           = require('../common').hideOverlayContainer;
const getContractCategoryTree        = require('../common').getContractCategoryTree;
const getDefaultMarket               = require('../common').getDefaultMarket;
const selectOption                   = require('../common').selectOption;
const updateWarmChart                = require('../common').updateWarmChart;
const displayContractForms           = require('../common').displayContractForms;
const displayMarkets                 = require('../common').displayMarkets;
const displayTooltip_Beta            = require('../common').displayTooltip_Beta;
const processTradingTimesAnswer      = require('../common_independent').processTradingTimesAnswer;
const moment = require('moment');
const elementTextContent             = require('../../../common_functions/common_functions').elementTextContent;
const elementInnerHtml               = require('../../../common_functions/common_functions').elementInnerHtml;

/*
 * This function process the active symbols to get markets
 * and underlying list
 */
function processActiveSymbols_Beta(data) {
    'use strict';

    // populate the Symbols object
    Symbols.details(data);

    const market = getDefaultMarket();

    // store the market
    Defaults.set('market', market);

    displayMarkets('contract_markets', Symbols.markets(), market);
    processMarket_Beta();
    // setTimeout(function(){
    // if(document.getElementById('underlying')){
    //     Symbols.getSymbols(0);
    // }
    // }, 60*1000);
}


/*
 * Function to call when market has changed
 */
function processMarket_Beta(flag) {
    'use strict';

    // we can get market from sessionStorage as allowed market
    // is already set when this function is called
    let market = Defaults.get('market'),
        symbol = Defaults.get('underlying');
    const update_page = Symbols.need_page_update() || flag;

    // change to default market if query string contains an invalid market
    if (!market || !Symbols.underlyings()[market]) {
        market = getDefaultMarket();
        Defaults.set('market', market);
    }
    if (update_page && (!symbol || !Symbols.underlyings()[market][symbol])) {
        symbol = undefined;
    }
    displayUnderlyings('underlying', Symbols.underlyings()[market], symbol);

    if (update_page) {
        processMarketUnderlying_Beta();
    }
}

/*
 * Function to call when underlying has changed
 */
function processMarketUnderlying_Beta() {
    'use strict';

    const underlyingElement = document.getElementById('underlying');
    if (!underlyingElement) {
        return;
    }

    if (underlyingElement.selectedIndex < 0) {
        underlyingElement.selectedIndex = 0;
    }
    const underlying = underlyingElement.value;
    Defaults.set('underlying', underlying);

    showFormOverlay();

    // forget the old tick id i.e. close the old tick stream
    processForgetTicks_Beta();
    // get ticks for current underlying
    Tick.request(underlying);

    Tick.clean();

    updateWarmChart();

    BinarySocket.clearTimeouts();

    Contract_Beta.getContracts(underlying);

    displayTooltip_Beta(Defaults.get('market'), underlying);
}

/*
 * Function to display contract form for current underlying
 */
function processContract_Beta(contracts) {
    'use strict';

    if (contracts.hasOwnProperty('error') && contracts.error.code === 'InvalidSymbol') {
        Price_Beta.processForgetProposals_Beta();
        const container = document.getElementById('contract_confirmation_container'),
            message_container = document.getElementById('confirmation_message'),
            confirmation_error = document.getElementById('confirmation_error'),
            confirmation_error_contents = document.getElementById('confirmation_error_contents'),
            contracts_list = document.getElementById('contracts_list');
        container.style.display = 'block';
        contracts_list.style.display = 'none';
        message_container.hide();
        confirmation_error.show();
        elementInnerHtml(confirmation_error_contents, contracts.error.message + ' <a href="javascript:;" onclick="sessionStorage.removeItem(\'underlying\'); window.location.reload();">' + localize('Please reload the page') + '</a>');
        return;
    }

    window.chartAllowed = !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly');

    document.getElementById('trading_socket_container_beta').classList.add('show');
    const init_logo = document.getElementById('trading_init_progress');
    if (init_logo.style.display !== 'none') {
        init_logo.style.display = 'none';
        Defaults.update();
    }

    Contract_Beta.setContracts(contracts);

    const contract_categories = Contract_Beta.contractForms();
    let formname;
    if (Defaults.get('formname') && contract_categories && contract_categories[Defaults.get('formname')]) {
        formname = Defaults.get('formname');
    } else {
        const tree = getContractCategoryTree(contract_categories);
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
    setFormPlaceholderContent_Beta(formname);

    displayContractForms('contract_form_name_nav', contract_categories, formname);

    processContractForm_Beta();

    TradingAnalysis_Beta.request();

    hideFormOverlay();
}

function processContractForm_Beta() {
    Contract_Beta.details(sessionStorage.getItem('formname'));

    StartDates_Beta.display();

    displayPrediction_Beta();

    displaySpreads_Beta();

    let r1;
    if (State.get('is_start_dates_displayed') && Defaults.get('date_start') && Defaults.get('date_start') !== 'now') {
        r1 = Durations_Beta.onStartDateChange(Defaults.get('date_start'));
        if (!r1 || Defaults.get('expiry_type') === 'endtime') Durations_Beta.display();
    } else {
        Durations_Beta.display();
    }

    if (Defaults.get('amount')) $('#amount').val(Defaults.get('amount'));
    else Defaults.set('amount', document.getElementById('amount').value);

    if (Defaults.get('amount_type')) selectOption(Defaults.get('amount_type'), document.getElementById('amount_type'));
    else Defaults.set('amount_type', document.getElementById('amount_type').value);

    if (Defaults.get('currency')) selectOption(Defaults.get('currency'), document.getElementById('currency'));

    const expiry_type = Defaults.get('expiry_type') || 'duration';
    const make_price_request = onExpiryTypeChange(expiry_type);

    if (make_price_request >= 0) {
        Price_Beta.processPriceRequest_Beta();
    }

    if (Defaults.get('formname') === 'spreads') {
        Defaults.remove('expiry_type', 'duration_amount', 'duration_units', 'expiry_date', 'expiry_time', 'amount', 'amount_type');
    } else {
        Defaults.remove('amount_per_point', 'stop_type', 'stop_loss', 'stop_profit');
    }
}

function displayPrediction_Beta() {
    const predictionElement = document.getElementById('prediction_row');
    if (Contract_Beta.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
        predictionElement.show();
        if (Defaults.get('prediction')) {
            selectOption(Defaults.get('prediction'), document.getElementById('prediction'));
        } else {
            Defaults.set('prediction', document.getElementById('prediction').value);
        }
    } else {
        predictionElement.hide();
        Defaults.remove('prediction');
    }
}

function displaySpreads_Beta() {
    const amountType = document.getElementById('amount_type'),
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
        elementTextContent(stopTypeDollarLabel, document.getElementById('currency').value || Defaults.get('currency'));
        if (Defaults.get('stop_type')) {
            const el = document.querySelectorAll('input[name="stop_type"][value="' + Defaults.get('stop_type') + '"]');
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

function forgetTradingStreams_Beta() {
    Price_Beta.processForgetProposals_Beta();
    processForgetTicks_Beta();
}

/*
 * Function to cancel the current tick stream
 * this need to be invoked before makin
 */
function processForgetTicks_Beta() {
    'use strict';

    BinarySocket.send({
        forget_all: 'ticks',
    });
}

/*
 * Function to process ticks stream
 */
function processTick_Beta(tick) {
    'use strict';

    const symbol = sessionStorage.getItem('underlying');
    const digit_info = TradingAnalysis_Beta.digit_info();
    if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
        Tick.details(tick);
        Tick.display();
        if (digit_info && tick.tick) {
            digit_info.update_chart(tick);
        }
        TickDisplay_Beta.updateChart(tick);
        Purchase_Beta.update_spot_list();
        if (!Barriers_Beta.isBarrierUpdated()) {
            Barriers_Beta.display();
            Barriers_Beta.setBarrierUpdate(true);
        }
        updateWarmChart();
    } else if (digit_info) {
        digit_info.update_chart(tick);
    }
}

function processProposal_Beta(response) {
    'use strict';

    const form_id = Price_Beta.getFormId();
    if (response.echo_req && response.echo_req !== null && response.echo_req.passthrough &&
            response.echo_req.passthrough.form_id === form_id) {
        hideOverlayContainer();
        Price_Beta.display(response, Contract_Beta.contractType()[Contract_Beta.form()]);
        hidePriceOverlay();
    }
}

function processTradingTimes_Beta(response) {
    processTradingTimesAnswer(response);
    Price_Beta.processPriceRequest_Beta();
}

function onExpiryTypeChange(value) {
    const $expiry_type = $('#expiry_type');
    if (!value || !$expiry_type.find('option[value=' + value + ']').length) {
        value = 'duration';
    }
    $expiry_type.val(value);

    let make_price_request = 0;
    if (value === 'endtime') {
        Durations_Beta.displayEndTime();
        if (Defaults.get('expiry_date')) {
            Durations_Beta.selectEndDate(moment(Defaults.get('expiry_date')));
            make_price_request = -1;
        }
        Defaults.remove('duration_units', 'duration_amount');
    } else {
        StartDates_Beta.enable();
        Durations_Beta.display();
        if (Defaults.get('duration_units')) {
            onDurationUnitChange(Defaults.get('duration_units'));
        }
        const duration_amount = Defaults.get('duration_amount');
        if (duration_amount && duration_amount > $('#duration_minimum').text()) {
            $('#duration_amount').val(duration_amount);
        }
        make_price_request = 1;
        Defaults.remove('expiry_date', 'expiry_time', 'end_date');
        Durations_Beta.validateMinDurationAmount();
    }

    return make_price_request;
}

function onDurationUnitChange(value) {
    const $duration_units = $('#duration_units');
    if (!value || !$duration_units.find('option[value=' + value + ']').length) {
        return 0;
    }

    $duration_units.val(value);
    Defaults.set('duration_units', value);

    Durations_Beta.select_unit(value);
    Durations_Beta.populate();

    return 1;
}

module.exports = {
    processActiveSymbols_Beta: processActiveSymbols_Beta,
    processMarket_Beta       : processMarket_Beta,
    processContract_Beta     : processContract_Beta,
    processContractForm_Beta : processContractForm_Beta,
    forgetTradingStreams_Beta: forgetTradingStreams_Beta,
    processForgetTicks_Beta  : processForgetTicks_Beta,
    processTick_Beta         : processTick_Beta,
    processProposal_Beta     : processProposal_Beta,
    processTradingTimes_Beta : processTradingTimes_Beta,
    onExpiryTypeChange       : onExpiryTypeChange,
    onDurationUnitChange     : onDurationUnitChange,
};
