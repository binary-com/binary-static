import { observable, action, reaction } from 'mobx';
import Client from '../../../../app/base/client';
import getBarrierValues from './logic/barrier';
import ContractType from './logic/contract_type';
import getCurrencies from './logic/currency';
import getDurationUnits from './logic/duration';
import getStartDates from './logic/start_date';
import onSymbolChange from './logic/symbol';
import { getCountry, getTicks, onAmountChange } from './logic/test';
import { cloneObject } from '../../../../_common/utility';

const event_map = {
    amount: onAmountChange,
    symbol: onSymbolChange,
};

// TODO: define the function somewhere else
const reaction_map = {
    contract_types_list: (new_list, store) => ContractType.getContractType(new_list, store.contract_type),
    contract_type      : (new_type, store) => {
        const obj_contract_type = ContractType.onContractChange(new_type);
        const obj_barrier       = getBarrierValues(ContractType.getContractInfoValues(['barrier', 'high_barrier', 'low_barrier'], store));
        const obj_trade_types   = ContractType.getTradeTypes(store);
        return $.extend(obj_contract_type, obj_barrier, obj_trade_types);
    },
};

export default class TradeStore {
    @action.bound init() {
        this._initReactions();

        ContractType.getContractsList(this.symbol).then(r => {
            this.contract_types_list = r;
        });
        getCountry().then(r => { this.message = r; });
        getTicks((r) => { this.tick = r; });
        this.start_dates_list = getStartDates();
        if (!Client.get('currency')) {
            getCurrencies().then(currencies => {
                this.currencies_list = currencies;
                if (!this.currency) {
                    this.currency = Object.values(currencies).reduce((a, b) => [...a, ...b]).find(c => c);
                }
            });
        }
        this.duration_units_list = getDurationUnits();
    }

    _reaction_disposers = [];
    _initReactions() {
        Object.keys(reaction_map).forEach((reaction_key) => {
            const disposer = reaction(() => this[reaction_key], (new_value) => {
                Promise
                    .resolve(reaction_map[reaction_key](new_value, this._cloneState()))
                    .then(this.updateState);
            });
            this._reaction_disposers.push(disposer);
        });
    }

    // TODO: call this on unload of trade
    disposeReactions() {
        this._reaction_disposers.forEach((disposer) => { disposer(); });
    }

    _cloneState() {
        return cloneObject(this);
    }

    @action.bound updateState(new_state) {
        Object.keys(new_state).forEach((key) => {
            this[key] = new_state[key];
        });
    }

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
        this.dispatch(name, value);
    }

    @action.bound dispatch(name, value) {
        const handler = event_map[name];
        if (typeof handler === 'function') {
            Promise
                .resolve(handler(value))
                .then(this.updateState);
        }
    }

    // Underlying
    @observable symbols_list = { frxAUDJPY: 'AUD/JPY', AS51: 'Australian Index', DEAIR: 'Airbus', frxXAUUSD: 'Gold/USD', R_10: 'Volatility 10 Index' };
    @observable symbol       = Object.keys(this.symbols_list)[0];

    // Contract Type
    @observable contract_type        = '';
    @observable contract_types_list  = {};
    @observable trade_types          = [];
    // TODO: add logic for contract_start_type and contract_expiry_type dynamic values
    @observable contract_start_type  = 'spot';
    @observable contract_expiry_type = 'intraday';
    @observable form_components      = [];

    // Amount
    @observable basis           = 'stake';
    @observable currency        = Client.get('currency');
    @observable currencies_list = {};
    @observable amount          = 5;

    // Duration
    @observable expiry_type         = 'duration';
    @observable duration            = 15;
    @observable duration_unit       = 's';
    @observable duration_units_list = {};
    @observable expiry_date         = null;
    @observable expiry_time         = null;

    // Barrier
    @observable barrier_1 = 0;
    @observable barrier_2 = 0;

    // Start Time
    @observable start_dates_list = [];
    @observable start_date       = 'now';
    @observable start_time       = '';

    // Last Digit
    @observable last_digit = 3;

    // Test
    @observable message = '';
    @observable tick = '';
};
