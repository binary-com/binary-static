import {
    action,
    extendObservable,
    observable }              from 'mobx';
import moment                 from 'moment';
import ContractType           from '../pages/trading/actions/helpers/contract_type';
import
    actions, {
    callProposalOnDidUpdate } from '../pages/trading/actions/index';
import Client                 from '../../_common/base/client_base';

export default class TradeStore {
    time_interval = undefined;

    constructor() {
        extendObservable(this.proposal, {
            symbol       : Object.keys(this.symbols_list)[0],
            contract_type: '',
            amount       : 10,
            basis        : '',
            currency     : Client.get('currency'),
            start_date   : 'now',
            start_time   : '12:30 am',
            duration     : 5,
            duration_unit: '',
            expiry_type  : 'duration',
            expiry_date  : null,
            expiry_time  : '09:40 pm',
            barrier_1    : 0,
            barrier_2    : 0,
            last_digit   : 3,
        });
    }

    @action.bound init() {
        this.time_interval = setInterval(actions.initTime, 1000);
        actions.getCountryAsync();

        actions.getTicks(action('getTicks', (r) => { this.tick = r; }));

        if (!Client.get('currency')) {
            actions.getCurrenciesAsync();
        }

        ContractType.buildContractTypesConfig(this.proposal.symbol).then(action(() => {
            this.contract_types_list = ContractType.getContractCategories();
        }));
    }

    @action.bound dispose() {
        clearInterval(this.time_interval);
        this.time_interval = undefined;
    }

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!(name in this) && !(name in this.proposal)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        const obj_new_values = Object.keys(this.proposal).indexOf(name) !== -1 ?
            Object.assign({}, this.proposal, { [name]: value }) :
            { [name]: value };
        callProposalOnDidUpdate(this, obj_new_values);
    }

    // Underlying
    @observable symbols_list = { frxAUDJPY: 'AUD/JPY', AS51: 'Australian Index', HSI: 'Hong Kong Index', DEAIR: 'Airbus', frxXAUUSD: 'Gold/USD', R_10: 'Volatility 10 Index' };

    // proposal
    @observable proposal = {};

    // Contract Type
    @observable contract_types_list  = {};
    @observable trade_types          = {};
    @observable contract_start_type  = '';
    @observable contract_expiry_type = '';
    @observable form_components      = [];

    // Amount
    @observable basis_list      = [];
    @observable currencies_list = {};

    // Duration
    @observable duration_units_list = [];

    // Barrier
    @observable barrier_count = 0;

    // Start Time
    @observable start_dates_list = [];

    // Test
    @observable message   = '';
    @observable tick      = '';
    @observable proposals = {};

    // TODO: retrieve from upper state
    @observable server_time = moment.utc();

    // TODO: to remove dummy portfolio value
    @observable portfolios = [
        {
            transaction_id: 32355620467,
            contract_id   : 478981052055,
            payout        : 10,
            expiry_time   : 1522886399,
            longcode      : 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-04-04.',
            shortcode     : 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency      : 'USD',
            buy_price     : 1.06,
            app_id        : 1,
            symbol        : 'AUD/JPY',
        },
        {
            transaction_id: 47272620508,
            contract_id   : 432523746528,
            payout        : 10,
            expiry_time   : 15234686345,
            longcode      : 'Win payout if AUD/JPY is strictly higher than entry spot at close on 2018-05-04.',
            shortcode     : 'CALL_FRXAUDJPY_10_1520263325_1522886399_S0P_0',
            currency      : 'USD',
            buy_price     : -55.25,
            app_id        : 1,
            symbol        : 'Australian Index',
        },
    ];
};
