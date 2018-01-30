import { observable, action } from 'mobx';
import Client from '../../../../app/base/client';
import getCurrencies from './logic/currency';
import getDurationUnits from './logic/duration';
import { getCountry, getTicks, onAmountChange } from './logic/test';

export default class TradeStore {
    @action.bound init() {
        getCountry().then(r => { this.message = r; });
        getTicks((r) => { this.tick = r; });
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

    call_map = {
        amount: onAmountChange,
    };

    @action.bound Dispatch(name, value) {
        const handler = this.call_map[name];
        if (typeof handler === 'function') {
            const result = handler(value);
            Object.keys(result).forEach((key) => { // update state
                this[key] = result[key];
            });
        }
    }

    @observable basis           = 'stake';
    @observable currency        = Client.get('currency');
    @observable currencies_list = {};
    @observable amount          = 5;

    // Duration
    @observable expiry_type   = 'duration';
    @observable duration      = 15;
    @observable duration_unit = 's';
    @observable duration_units_list = {};
    @observable expiry_date   = null;
    @observable expiry_time   = null;

    // Start Time
    // Barrier
    // Last Digit

    @observable message = '';
    @observable tick = '';
};
