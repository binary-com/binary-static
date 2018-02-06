import { observable, action, reaction } from 'mobx';
import Client from '../../../../app/base/client';
import getCurrencies from './logic/currency';
import getDurationUnits from './logic/duration';
import getStartDates from './logic/start_date';
import Contract from './logic/contract_type';
import { getCountry, getTicks, onAmountChange } from './logic/test';
import onSymbolChange from './logic/symbol';

const event_map = {
    amount       : onAmountChange,
    contract_type: Contract.onContractChange,
    symbol       : onSymbolChange,
};

export default class TradeStore {
    @action.bound init() {
        Contract.getContractsList(this.symbol).then(r => {
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

        // TODO: use a map and iterate it to register reactions, and also dispose them on unload
        reaction(() => this.contract_types_list, (new_list) => {
            this.contract_type = Contract.getContractType(new_list, this.contract_type);
        });
        reaction(() => this.contract_type, (c_type) => {
            this.form_components = Contract.getComponents(c_type);
        });
    }

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!this.hasOwnProperty(name)) { // eslint-disable-line
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
        this.dispatch(name, value);
    }

    @action.bound dispatch(name, value) {
        const handler = event_map[name];
        if (typeof handler === 'function') {
            Promise.resolve(handler(value)).then((result) => {
                Object.keys(result).forEach((key) => { // update state
                    this[key] = result[key];
                });
            });
        }
    }

    // Underlying
    @observable symbols_list = { frxAUDJPY: 'AUD/JPY', AS51: 'Australian Index', DEAIR: 'Airbus', frxXAUUSD: 'Gold/USD', R_10: 'Volatility 10 Index' };
    @observable symbol       = Object.keys(this.symbols_list)[0];

    // Contract Type
    @observable contract_type       = '';
    @observable contract_types_list = {};
    @observable form_components     = [];

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
