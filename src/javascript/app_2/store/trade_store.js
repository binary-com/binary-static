import {
    action,
    observable }           from 'mobx';
import ContractType        from '../pages/trading/actions/helpers/contract_type';
import { updateStore }     from '../pages/trading/actions/index';
import { processPurchase } from '../pages/trading/actions/purchase';
import Client              from '../../_common/base/client_base';

export default class TradeStore {
    @action.bound init() {
        if (this.symbol) {
            ContractType.buildContractTypesConfig(this.symbol).then(action(() => {
                updateStore(this, ContractType.getContractCategories());
            }));
        }
    }

    @action.bound handleChange(e) {
        const { name, value, type } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        updateStore(this, { [name]: (type === 'number' ? +value : value) }, true);
    }

    @action.bound onPurchase(proposal_id, price) {
        if (proposal_id) {
            processPurchase(proposal_id, price).then(action((response) => {
                updateStore(this, { purchase_info: response });
            }));
        }
    }

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
    @observable expiry_time         = '09:40 pm';
    @observable expiry_type         = 'duration';

    // Barrier
    @observable barrier_1     = '';
    @observable barrier_2     = '';
    @observable barrier_count = 0;

    // Start Time
    @observable start_date       = Number(0); // Number(0) refers to 'now'
    @observable start_dates_list = [];
    @observable start_time       = '12:30 am';

    // Last Digit
    @observable last_digit = 3;

    // Purchase
    @observable proposal_info = {};
    @observable purchase_info = {};

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
