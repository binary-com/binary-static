import { action, observable }             from 'mobx';
import { processPurchase }                from './Actions/purchase';
import * as Symbol                        from './Actions/symbol';
import { allowed_query_string_variables } from './Constants/query_string';
import { updateBarrierShade }             from './Helpers/chart';
import ContractType                       from './Helpers/contract_type';
import { processTradeParams }             from './Helpers/process';
import { requestProposal }                from './Helpers/proposal';
import URLHelper                          from '../../../Utils/URL';
import Client                             from '../../../../_common/base/client_base';
import { cloneObject }                    from '../../../../_common/utility';

export default class TradeStore {
    // Control values
    @observable is_purchase_enabled = false;
    @observable is_trade_enabled    = false;

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
    @observable last_digit = 3;

    // Purchase
    @observable proposal_info = {};
    @observable purchase_info = {};

    // Chart
    @observable chart_barriers = observable.object({});

    constructor(root_store) {
        this.root_store = root_store;
    }

    @action.bound
    init() {
        // Update the url's query string by default values of the store
        const queryParams = URLHelper.updateQueryString(this, allowed_query_string_variables);

        // update state values from query string
        const config = {};
        [...queryParams].forEach(param => {
            config[param[0]] = isNaN(param[1]) ? param[1] : +param[1];
        });
        this.processNewValuesAsync(this, config);

        if (this.symbol) {
            ContractType.buildContractTypesConfig(this.symbol).then(action(() => {
                this.processNewValuesAsync(this, ContractType.getContractCategories());
            }));
        }
    }

    @action.bound
    onChange(e) {
        const { name, value, type } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        this.processNewValuesAsync(this, { [name]: (type === 'number' ? +value : value) }, true);
    }

    @action.bound
    onHoverPurchase(is_over, contract_type) {
        if (this.chart_barriers.main) {
            this.chart_barriers.main.shade = updateBarrierShade(this.chart_barriers, is_over, contract_type);
        }
    }

    @action.bound
    onPurchase(proposal_id, price) {
        if (proposal_id) {
            processPurchase(proposal_id, price).then(action((response) => {
                this.purchase_info = response;
            }));
        }
    }

    @action.bound
    updateStore(new_state) {
        Object.keys(new_state).forEach((key) => {
            if (key === 'root_store') return;
            if (JSON.stringify(this[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled    = false;
                }

                // Add changes to queryString of the url
                if (allowed_query_string_variables.indexOf(key) !== -1) {
                    URLHelper.setQueryParam({ [key]: new_state[key] });
                }

                this[key] = new_state[key];
            }
        });

        return new_state;
    }

    async processNewValuesAsync(store, obj_new_values = {}, is_by_user) {
        const new_state = this.updateStore(cloneObject(obj_new_values));

        if (is_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state))) {
            if ('symbol' in new_state) {
                await Symbol.onChangeSymbolAsync(new_state.symbol);
            }

            this.updateStore({ // disable purchase button(s), clear contract info, cleanup chart
                is_purchase_enabled: false,
                proposal_info      : {},
                chart_barriers     : {},
            });

            const snapshot = await processTradeParams(store, new_state);
            snapshot.is_trade_enabled = true;
            this.updateStore(snapshot);

            requestProposal(store, this.updateStore);
        }
    }
};
