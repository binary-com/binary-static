import { observable, action } from 'mobx';
import Client from '../../../../app/base/client';
import getCurrencies from './logic/currency';
import getDurationUnits from './logic/duration';
import getStartDates from './logic/start_date';
import getContractTypes from './logic/contract_type';
import { getCountry, getTicks, onAmountChange } from './logic/test';

const event_map = {
    amount: onAmountChange,
};

export default class TradeStore {
    @action.bound init() {
        getContractTypes(this.symbol).then(r => {
            this.contract_type_list = r.contract_types;
            this.categories         = r.categories;
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

    @action.bound Dispatch(name, value) {
        const handler = event_map[name];
        if (typeof handler === 'function') {
            const result = handler(value);
            Object.keys(result).forEach((key) => { // update state
                this[key] = result[key];
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
    @observable symbol = 'AS51';

    // Contract type
    @observable contract_type      = 'risefall';
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

    @observable message = '';
    @observable tick = '';
};
