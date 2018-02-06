import { observable, action } from 'mobx';
import Client from '../../../../app/base/client';
import getCurrencies from './logic/currency';
import getDurationUnits from './logic/duration';
import getStartDates from './logic/start_date';
import { getContractTypes, onContractTypeChange } from './logic/contract_type';
import { getCountry, getTicks, onAmountChange } from './logic/test';
import onSymbolChange from './logic/symbol';

const event_map = {
    amount       : onAmountChange,
    contract_type: onContractTypeChange,
    symbol       : onSymbolChange,
};

export default class TradeStore {
    @action.bound init() {
        getContractTypes(this.symbol).then(r => {
            Object.keys(r).forEach((key) => { // update state
                this[key] = r[key];
            });
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

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!this.hasOwnProperty(name)) { // eslint-disable-line
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
        this.Dispatch(name, value);
    }

    @action.bound handleDropDownChange(e) {
        const name = e.target.getAttribute('name');
        const value = e.target.getAttribute('value');
        if (name && value) {
            this[name] = value;
            this.Dispatch(name, value);
        }
    }

    @action.bound Dispatch(name, value) {
        const handler = event_map[name];
        if (typeof handler === 'function') {
            Promise.resolve(handler(value)).then((result) => {
                Object.keys(result).forEach((key) => { // update state
                    this[key] = result[key];
                });
            });
        }
    }

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

    // Underlying
    @observable symbol_list = { frxAUDJPY: 'AUD/JPY', AS51: 'Australian Index', DEAIR: 'Airbus', frxXAUUSD: 'Gold/USD', R_10: 'Volatility 10 Index' };
    @observable symbol      = Object.keys(this.symbol_list)[0];

    // Contract type
    @observable contract_type      = '';
    @observable contract_type_list = {};
    @observable categories         = {};

    // Barrier
    @observable barrier_1 = 0;
    @observable barrier_2 = 0;

    // Start Time
    @observable start_dates_list = [];
    @observable start_date       = 'now';
    @observable start_time       = '';

    // Last Digit
    @observable last_digit_visible = 0;
    @observable last_digit = 3;

    @observable message = '';
    @observable tick = '';
};
