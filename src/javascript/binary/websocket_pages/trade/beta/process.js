const moment                         = require('moment');
const TradingAnalysis_Beta           = require('./analysis');
const Barriers_Beta                  = require('./barriers');
const DigitInfo_Beta                 = require('./charts/digit_info');
const Contract_Beta                  = require('./contract');
const Durations_Beta                 = require('./duration');
const Price_Beta                     = require('./price');
const Purchase_Beta                  = require('./purchase');
const StartDates_Beta                = require('./starttime');
const TickDisplay_Beta               = require('./tick_trade');
const commonTrading                  = require('../common');
const processTradingTimesAnswer      = require('../common_independent').processTradingTimesAnswer;
const Defaults                       = require('../defaults');
const GetTicks                       = require('../get_ticks');
const Symbols                        = require('../symbols');
const setFormPlaceholderContent_Beta = require('../set_values').setFormPlaceholderContent_Beta;
const Tick                           = require('../tick');
const AssetIndexUI                   = require('../../resources/asset_index/asset_index.ui');
const TradingTimesUI                 = require('../../resources/trading_times/trading_times.ui');
const localize                       = require('../../../base/localize').localize;
const State                          = require('../../../base/storage').State;
const elementInnerHtml               = require('../../../common_functions/common_functions').elementInnerHtml;
const elementTextContent             = require('../../../common_functions/common_functions').elementTextContent;

const Process_Beta = (() => {
    'use strict';

    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    const processActiveSymbols_Beta = () => {
        BinarySocket.send({ active_symbols: 'brief' }).then((response) => {
            // populate the Symbols object
            Symbols.details(response);

            const market = commonTrading.getDefaultMarket();

            // store the market
            Defaults.set('market', market);

            commonTrading.displayMarkets('contract_markets', Symbols.markets(), market);
            processMarket_Beta();
            AssetIndexUI.setActiveSymbols(response);
            TradingTimesUI.setActiveSymbols(response);
        });
    };


    /*
     * Function to call when market has changed
     */
    const processMarket_Beta = () => {
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

        marketUnderlying_Beta();
    };

    /*
     * Function to call when underlying has changed
     */
    const marketUnderlying_Beta = () => {
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

        // forget the old tick id i.e. close the old tick stream
        processForgetTicks_Beta();
        // get ticks for current underlying
        GetTicks.request(underlying);

        Tick.clean();

        commonTrading.updateWarmChart();

        BinarySocket.clearTimeouts();

        Contract_Beta.getContracts(underlying);

        commonTrading.displayTooltip_Beta(Defaults.get('market'), underlying);
    };

    /*
     * Function to display contract form for current underlying
     */
    const processContract_Beta = (contracts) => {
        if (contracts.hasOwnProperty('error') && contracts.error.code === 'InvalidSymbol') {
            Price_Beta.processForgetProposals_Beta();
            const container                   = document.getElementById('contract_confirmation_container');
            const message_container           = document.getElementById('confirmation_message');
            const confirmation_error          = document.getElementById('confirmation_error');
            const confirmation_error_contents = document.getElementById('confirmation_error_contents');
            const contracts_list              = document.getElementById('contracts_list');
            container.style.display = 'block';
            contracts_list.style.display = 'none';
            message_container.hide();
            confirmation_error.show();
            elementInnerHtml(confirmation_error_contents, `${contracts.error.message} <a href="javascript:;" onclick="sessionStorage.removeItem('underlying'); window.location.reload();">${localize('Please reload the page')}</a>`);
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
        setFormPlaceholderContent_Beta(formname);

        commonTrading.displayContractForms('contract_form_name_nav', contract_categories, formname);

        processContractForm_Beta();

        TradingAnalysis_Beta.request();

        commonTrading.hideFormOverlay();
    };

    const processContractForm_Beta = () => {
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

        if (Defaults.get('amount_type')) commonTrading.selectOption(Defaults.get('amount_type'), document.getElementById('amount_type'));
        else Defaults.set('amount_type', document.getElementById('amount_type').value);

        if (Defaults.get('currency')) commonTrading.selectOption(Defaults.get('currency'), document.getElementById('currency'));

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
    };

    const displayPrediction_Beta = () => {
        const prediction_element = document.getElementById('prediction_row');
        if (Contract_Beta.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
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

    const displaySpreads_Beta = () => {
        const amount_type            = document.getElementById('amount_type');
        const amount_per_point_label = document.getElementById('amount_per_point_label');
        const amount                 = document.getElementById('amount');
        const amount_per_point       = document.getElementById('amount_per_point');
        const spread_container       = document.getElementById('spread_element_container');
        const stop_type_dollar_label = document.getElementById('stop_type_dollar_label');
        const expiry_type_row        = document.getElementById('expiry_row');

        if (sessionStorage.getItem('formname') === 'spreads') {
            amount_type.hide();
            amount.hide();
            expiry_type_row.hide();
            amount_per_point_label.show();
            amount_per_point.show();
            spread_container.show();
            elementTextContent(stop_type_dollar_label, document.getElementById('currency').value || Defaults.get('currency'));
            if (Defaults.get('stop_type')) {
                const el = document.querySelectorAll(`input[name="stop_type"][value="${Defaults.get('stop_type')}"]`);
                if (el) {
                    el[0].setAttribute('checked', 'checked');
                }
            } else {
                Defaults.set('stop_type', document.getElementById('stop_type_points').checked ? 'point' : 'dollar');
            }
            if (Defaults.get('amount_per_point')) amount_per_point.value = Defaults.get('amount_per_point');
            else Defaults.set('amount_per_point', amount_per_point.value);

            if (Defaults.get('stop_loss')) document.getElementById('stop_loss').value = Defaults.get('stop_loss');
            else Defaults.set('stop_loss', document.getElementById('stop_loss').value);

            if (Defaults.get('stop_profit')) document.getElementById('stop_profit').value = Defaults.get('stop_profit');
            else Defaults.set('stop_profit', document.getElementById('stop_profit').value);
        } else {
            amount_per_point_label.hide();
            amount_per_point.hide();
            spread_container.hide();
            expiry_type_row.show();
            amount_type.show();
            amount.show();
        }
    };

    const forgetTradingStreams_Beta = () => {
        Price_Beta.processForgetProposals_Beta();
        processForgetTicks_Beta();
    };

    /*
     * cancel the current tick stream
     * this need to be invoked before makin
     */
    const processForgetTicks_Beta = () => {
        BinarySocket.send({
            forget_all: 'ticks',
        });
    };

    /*
     * process ticks stream
     */
    const processTick_Beta = (tick) => {
        const symbol = sessionStorage.getItem('underlying');
        if (tick.echo_req.ticks === symbol || (tick.tick && tick.tick.symbol === symbol)) {
            Tick.details(tick);
            Tick.display();
            if (tick.tick) {
                DigitInfo_Beta.updateChart(tick);
            }
            TickDisplay_Beta.updateChart(tick);
            Purchase_Beta.updateSpotList();
            if (!Barriers_Beta.isBarrierUpdated()) {
                Barriers_Beta.display();
                Barriers_Beta.setBarrierUpdate(true);
            }
            commonTrading.updateWarmChart();
        } else {
            DigitInfo_Beta.updateChart(tick);
        }
    };

    const processProposal_Beta = (response) => {
        const form_id = Price_Beta.getFormId();
        if (response.echo_req && response.echo_req !== null && response.echo_req.passthrough &&
                response.echo_req.passthrough.form_id === form_id) {
            commonTrading.hideOverlayContainer();
            Price_Beta.display(response, Contract_Beta.contractType()[Contract_Beta.form()]);
            commonTrading.hidePriceOverlay();
        }
    };

    const processTradingTimes_Beta = (response) => {
        processTradingTimesAnswer(response);
        Price_Beta.processPriceRequest_Beta();
    };

    const onExpiryTypeChange = (value) => {
        const $expiry_type = $('#expiry_type');
        if (!value || !$expiry_type.find(`option[value=${value}]`).length) {
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
    };

    const onDurationUnitChange = (value) => {
        const $duration_units = $('#duration_units');
        if (!value || !$duration_units.find(`option[value=${value}]`).length) {
            return 0;
        }

        $duration_units.val(value);
        Defaults.set('duration_units', value);

        Durations_Beta.selectUnit(value);
        Durations_Beta.populate();

        return 1;
    };

    return {
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
})();

module.exports = Process_Beta;
