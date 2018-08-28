import debounce                         from 'lodash.debounce';
import {
    action,
    observable,
    reaction }                          from 'mobx';
import { processPurchase }              from './Actions/purchase';
import * as Symbol                      from './Actions/symbol';
import { 
    allowed_query_string_variables,
    non_proposal_query_string_variable} from './Constants/query_string';
import validation_rules                 from './Constants/validation_rules';
import { setChartBarrier }              from './Helpers/chart';
import ContractType                     from './Helpers/contract_type';
import { convertDurationLimit }         from './Helpers/duration';
import { processTradeParams }           from './Helpers/process';
import {
    createProposalRequests,
    getProposalInfo,
    getProposalParametersName }         from './Helpers/proposal';
import { pickDefaultSymbol }            from './Helpers/symbol';
import BaseStore                        from '../../base_store';
import { WS }                           from '../../../Services';
import URLHelper                        from '../../../Utils/URL/url_helper';
import Client                           from '../../../../_common/base/client_base';
import { cloneObject, isEmptyObject }   from '../../../../_common/utility';

export default class TradeStore extends BaseStore {
    // Control values
    @observable is_trade_component_mounted = false;
    @observable is_purchase_enabled        = false;
    @observable is_trade_enabled           = false;

    // Underlying
    @observable symbol;

    // Contract Type
    @observable contract_expiry_type = '';
    @observable contract_start_type  = '';
    @observable contract_type        = '';
    @observable contract_types_list  = {};
    @observable form_components      = [];
    @observable trade_types          = {};

    // Amount
    @observable amount          = 10;
    @observable basis           = '';
    @observable basis_list      = [];
    @observable currencies_list = {};
    @observable currency        = Client.get('currency');

    // Duration
    @observable duration            = 5;
    @observable duration_unit       = '';
    @observable duration_units_list = [];
    @observable duration_min_max    = {};
    @observable expiry_date         = '';
    @observable expiry_time         = '09:40';
    @observable expiry_type         = 'duration';

    // Barrier
    @observable barrier_1     = '';
    @observable barrier_2     = '';
    @observable barrier_count = 0;

    // Start Time
    @observable start_date       = Number(0); // Number(0) refers to 'now'
    @observable start_dates_list = [];
    @observable start_time       = '12:30';
    @observable sessions         = [];

    // Last Digit
    @observable last_digit = 5;

    // Purchase
    @observable proposal_info = {};
    @observable purchase_info = {};

    // Chart
    chart_id = 1;

    debouncedProposal = debounce(this.requestProposal, 500);

    constructor({ root_store }) {
        const session_storage_properties = allowed_query_string_variables;
        const options = {
            root_store,
            session_storage_properties,
            validation_rules,
        };

        URLHelper.pruneQueryString(allowed_query_string_variables);

        super(options);

        Object.defineProperty(
            this,
            'is_query_string_applied',
            {
                enumerable: false,
                value     : false,
                writable  : true,
            }
        );

        if (Client.isLoggedIn) {
            this.processNewValuesAsync({currency: Client.get('currency')});
        }

        // Adds intercept to change min_max value of duration validation
        reaction(
            ()=> [this.duration_min_max, this.contract_expiry_type, this.duration_unit],
            () => {
                this.changeDurationValidationRules();
            }
        );
    }

    @action.bound
    async init() {
        const query_string_values = this.updateQueryString();
        this.smart_chart = this.root_store.modules.smart_chart;

        if (!this.symbol) {
            const active_symbols = await WS.activeSymbols();
            await this.processNewValuesAsync({
                symbol: pickDefaultSymbol(active_symbols.active_symbols),
                ...query_string_values,
            });
        }

        if (this.symbol) {
            ContractType.buildContractTypesConfig(this.symbol).then(action(() => {
                this.processNewValuesAsync({
                    ...ContractType.getContractValues(this),
                    ...ContractType.getContractCategories(),
                    ...query_string_values,
                });
            }));
        }
    }

    @action.bound
    onChange(e) {
        const { name, value } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        this.processNewValuesAsync({ [name]: value }, true);
    }

    @action.bound
    onHoverPurchase(is_over, contract_type) {
        this.smart_chart.updateBarrierShade(is_over, contract_type);
    }

    @action.bound
    onPurchase(proposal_id, price) {
        if (proposal_id) {
            processPurchase(proposal_id, price).then(action((response) => {
                WS.forgetAll('proposal');
                this.purchase_info = response;
            }));
        }
    }

    @action.bound
    onClickNewTrade(e) {
        this.requestProposal();
        e.preventDefault();
    }

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    @action.bound
    updateStore(new_state) {
        Object.keys(cloneObject(new_state)).forEach((key) => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors'].indexOf(key) > -1) return;
            if (JSON.stringify(this[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled    = false;
                }

                // Add changes to queryString of the url
                if (
                    allowed_query_string_variables.indexOf(key) !== -1 &&
                    this.is_trade_component_mounted
                ) {
                    URLHelper.setQueryParam({ [key]: new_state[key] });
                }

                this[key] = new_state[key];
            }
        });

        return new_state;
    }

    async processNewValuesAsync(obj_new_values = {}, is_changed_by_user) {
        const new_state = this.updateStore(cloneObject(obj_new_values));

        if (is_changed_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state))) {
            if ('symbol' in new_state) {
                await Symbol.onChangeSymbolAsync(new_state.symbol);
            }

            this.updateStore({ // disable purchase button(s), clear contract info
                is_purchase_enabled: false,
                proposal_info      : {},
            });

            if (!this.smart_chart.is_contract_mode) {
                const is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;
                if (is_barrier_changed) {
                    this.smart_chart.updateBarriers(this.barrier_1, this.barrier_2);
                } else {
                    this.smart_chart.removeBarriers();
                }
            }

            const snapshot = await processTradeParams(this, new_state);
            const query_string_values = this.updateQueryString();
            snapshot.is_trade_enabled = true;

            this.updateStore({
                ...snapshot,
                ...(this.is_query_string_applied ? {} : query_string_values),
            });

            this.is_query_string_applied = true;

            this.debouncedProposal();
        }
    }

    proposal_requests = {};

    @action.bound
    requestProposal() {
        const requests = createProposalRequests(this);
        if (!isEmptyObject(requests)) {
            const proper_proposal_params_for_query_string = getProposalParametersName(requests);

            URLHelper.pruneQueryString(
                [
                    ...proper_proposal_params_for_query_string,
                    ...non_proposal_query_string_variable,
                ]
            );

            this.proposal_requests = requests;
            this.proposal_info     = {};
            this.purchase_info     = {};

            WS.forgetAll('proposal').then(() => {
                Object.keys(this.proposal_requests).forEach((type) => {
                    WS.subscribeProposal(this.proposal_requests[type], this.onProposalResponse);
                });
            });
        }
    }

    @action.bound
    onProposalResponse(response) {
        const contract_type = response.echo_req.contract_type;
        this.proposal_info = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response),
        };

        if (!this.smart_chart.is_contract_mode) {
            setChartBarrier(this.smart_chart, response, this.onChartBarrierChange);
        }

        this.is_purchase_enabled = true;
    }

    @action.bound
    onChartBarrierChange(barrier_1, barrier_2) {
        this.processNewValuesAsync({ barrier_1, barrier_2 }, true);
    }

    @action.bound
    updateQueryString() {

        // Update the url's query string by default values of the store
        const query_params = URLHelper.updateQueryString(
            this,
            allowed_query_string_variables,
            this.is_trade_component_mounted
        );

        // update state values from query string
        const config = {};
        [...query_params].forEach(param => config[param[0]] = param[1]);
        return config;
    }

    @action.bound
    changeDurationValidationRules() {
        const index = this.validation_rules.duration.findIndex(item => item[0] === 'number');
        const limits = this.duration_min_max[this.contract_expiry_type] || false;
        const duration_options = {
            min: convertDurationLimit(+limits.min, this.duration_unit),
            max: convertDurationLimit(+limits.max, this.duration_unit),
        };

        if (limits) {
            if (index > -1) {
                this.validation_rules.duration[index][1] = duration_options;
            } else {
                this.validation_rules.duration.push(['number', duration_options]);
            }
            this.validateProperty('duration', this.duration);
        }
    }

    @action.bound
    onMount() {
        this.is_trade_component_mounted = true;
        this.updateQueryString();
    }

    @action.bound
    onUnmount() {
        this.is_trade_component_mounted = false;
    }
};
