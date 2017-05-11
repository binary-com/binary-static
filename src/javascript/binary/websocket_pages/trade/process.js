const moment                    = require('moment');
const TradingAnalysis           = require('./analysis');
const commonTrading             = require('./common');
const processTradingTimesAnswer = require('./common_independent').processTradingTimesAnswer;
const Contract                  = require('./contract');
const Defaults                  = require('./defaults');
const Durations                 = require('./duration');
const GetTicks                  = require('./get_ticks');
const Notifications             = require('./notifications');
const Price                     = require('./price');
const setFormPlaceholderContent = require('./set_values').setFormPlaceholderContent;
const StartDates                = require('./starttime').StartDates;
const Symbols                   = require('./symbols');
const Tick                      = require('./tick');
const BinarySocket              = require('../socket');
const localize                  = require('../../base/localize').localize;
const State                     = require('../../base/storage').State;
const elementInnerHtml          = require('../../common_functions/common_functions').elementInnerHtml;

const Process = (() => {
    'use strict';

    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    const processActiveSymbols = () => {
        BinarySocket.send({ active_symbols: 'brief' }).then((response) => {
            // populate the Symbols object
            Symbols.details(response);

            const market = commonTrading.getDefaultMarket();

            // store the market
            Defaults.set('market', market);

            commonTrading.displayMarkets('contract_markets', Symbols.markets(), market);
            processMarket();
        });
    };


    /*
     * Function to call when market has changed
     */
    const processMarket = () => {
        // we can get market from sessionStorage as allowed market
        // is already set when this is called
        let market = Defaults.get('market'),
            symbol = Defaults.get('underlying');

        // change to default market if query string contains an invalid market
        if (!market || !Symbols.underlyings()[market]) {
            market = commonTrading.getDefaultMarket();
            Defaults.set('market', market);
        }
        if ((!symbol || !Symbols.underlyings()[market][symbol])) {
            symbol = undefined;
        }
        commonTrading.displayUnderlyings('underlying', Symbols.underlyings()[market], symbol);

        processMarketUnderlying();
    };

    /*
     * Function to call when underlying has changed
     */
    const processMarketUnderlying = () => {
        const underlying_element = document.getElementById('underlying');
        if (!underlying_element) {
            return;
        }

        if (underlying_element.selectedIndex < 0) {
            underlying_element.selectedIndex = 0;
        }
        const underlying = underlying_element.value;
        Defaults.set('underlying', underlying);

        commonTrading.showFormOverlay();

        // get ticks for current underlying
        GetTicks.request(underlying);

        Tick.clean();

        commonTrading.updateWarmChart();

        BinarySocket.clearTimeouts();

        getContracts(underlying);

        commonTrading.displayTooltip(Defaults.get('market'), underlying);
    };

    const getContracts = (underlying) => {
        BinarySocket.send({ contracts_for: underlying }).then((response) => {
            Notifications.hide('CONNECTION_ERROR');
            processContract(response);
        });
    };

    /*
     * Function to display contract form for current underlying
     */
    const processContract = (contracts) => {
        if (contracts.hasOwnProperty('error') && contracts.error.code === 'InvalidSymbol') {
            Price.processForgetProposals();
            const container          = document.getElementById('contract_confirmation_container');
            const message_container  = document.getElementById('confirmation_message');
            const confirmation_error = document.getElementById('confirmation_error');
            const contracts_list     = document.getElementById('contracts_list');
            container.style.display = 'block';
            contracts_list.style.display = 'none';
            message_container.hide();
            confirmation_error.show();
            elementInnerHtml(confirmation_error, `${contracts.error.message} <a href="javascript:;" onclick="sessionStorage.removeItem('underlying'); window.location.reload();">${localize('Please reload the page')}</a>`);
            return;
        }

        State.set('is_chart_allowed', !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly'));

        document.getElementById('trading_socket_container').classList.add('show');
        const init_logo = document.getElementById('trading_init_progress');
        if (init_logo.style.display !== 'none') {
            init_logo.style.display = 'none';
            Defaults.update();
        }

        Contract.setContracts(contracts);

        const contract_categories = Contract.contractForms();
        let formname;
        if (Defaults.get('formname') && contract_categories && contract_categories[Defaults.get('formname')]) {
            formname = Defaults.get('formname');
        } else {
            const tree = commonTrading.getContractCategoryTree(contract_categories);
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

        commonTrading.displayContractForms('contract_form_name_nav', contract_categories, formname);

        processContractForm();

        TradingAnalysis.request();

        commonTrading.hideFormOverlay();
    };

    const processContractForm = () => {
        Contract.details(sessionStorage.getItem('formname'));

        StartDates.display();

        displayPrediction();

        let r1;
        if (State.get('is_start_dates_displayed') && Defaults.get('date_start') && Defaults.get('date_start') !== 'now') {
            r1 = Durations.onStartDateChange(Defaults.get('date_start'));
            if (!r1 || Defaults.get('expiry_type') === 'endtime') Durations.display();
        } else {
            Durations.display();
        }

        if (Defaults.get('amount')) $('#amount').val(Defaults.get('amount'));
        else Defaults.set('amount', document.getElementById('amount').value);
        if (Defaults.get('amount_type')) commonTrading.selectOption(Defaults.get('amount_type'), document.getElementById('amount_type'));
        else Defaults.set('amount_type', document.getElementById('amount_type').value);
        if (Defaults.get('currency')) commonTrading.selectOption(Defaults.get('currency'), document.getElementById('currency'));

        const expiry_type = Defaults.get('expiry_type') || 'duration';
        const make_price_request = onExpiryTypeChange(expiry_type);

        if (make_price_request >= 0) {
            Price.processPriceRequest();
        }
    };

    const displayPrediction = () => {
        const prediction_element = document.getElementById('prediction_row');
        if (Contract.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
            prediction_element.show();
            if (Defaults.get('prediction')) {
                commonTrading.selectOption(Defaults.get('prediction'), document.getElementById('prediction'));
            } else {
                Defaults.set('prediction', document.getElementById('prediction').value);
            }
        } else {
            prediction_element.hide();
            Defaults.remove('prediction');
        }
    };

    const forgetTradingStreams = () => {
        Price.processForgetProposals();
        processForgetTicks();
    };

    /*
     * cancel the current tick stream
     * this need to be invoked before makin
     */
    const processForgetTicks = () => {
        BinarySocket.send({
            forget_all: 'ticks',
        });
    };

    const processTradingTimes = (response) => {
        processTradingTimesAnswer(response);
        Price.processPriceRequest();
    };

    const onExpiryTypeChange = (value) => {
        const $expiry_type = $('#expiry_type');
        if (!value || !$expiry_type.find(`option[value=${value}]`).length) {
            value = 'duration';
        }
        $expiry_type.val(value);

        let make_price_request = 0;
        if (value === 'endtime') {
            Durations.displayEndTime();
            if (Defaults.get('expiry_date')) {
                Durations.selectEndDate(moment(Defaults.get('expiry_date')));
                make_price_request = -1;
            }
            Defaults.remove('duration_units', 'duration_amount');
        } else {
            StartDates.enable();
            Durations.display();
            if (Defaults.get('duration_units')) {
                onDurationUnitChange(Defaults.get('duration_units'));
            }
            const duration_amount = Defaults.get('duration_amount');
            if (duration_amount && duration_amount > $('#duration_minimum').text()) {
                $('#duration_amount').val(duration_amount);
            }
            make_price_request = 1;
            Defaults.remove('expiry_date', 'expiry_time', 'end_date');
            Durations.validateMinDurationAmount();
        }

        return make_price_request;
    };

    const onDurationUnitChange = (value) => {
        const $duration_units = $('#duration_units');
        if (!value || !$duration_units.find(`option[value=${value}]`).length) {
            return 0;
        }

        $duration_units.val(value);
        Defaults.set('duration_units', value);

        Durations.selectUnit(value);
        Durations.populate();

        return 1;
    };

    return {
        processActiveSymbols: processActiveSymbols,
        processMarket       : processMarket,
        processContract     : processContract,
        processContractForm : processContractForm,
        forgetTradingStreams: forgetTradingStreams,
        processForgetTicks  : processForgetTicks,
        processTradingTimes : processTradingTimes,
        onExpiryTypeChange  : onExpiryTypeChange,
        onDurationUnitChange: onDurationUnitChange,
    };
})();

module.exports = Process;
