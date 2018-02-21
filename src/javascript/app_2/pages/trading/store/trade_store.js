import { observable, action } from 'mobx';
import Client from '../../../../app/base/client';
import ContractType from './logic/contract_type';
import actions from '../actions';

export default class TradeStore {
    time_interval = undefined;

    @action.bound init() {
        actions.getCountryAsync();
        actions.getStartDates();

        actions.getTicks(action('getTicks', (r) => { this.tick = r; }));

        if (!Client.get('currency')) {
            actions.getCurrenciesAsync();
        }
        actions.getDurationUnits();
        ContractType.getContractsList(this.symbol).then(action(r => {
            this.contract_types_list = r;
        }));
        this.time_interval = setInterval(actions.initTime, 1000);
    }

    @action.bound dispose() {
        clearInterval(this.time_interval);
        this.time_interval = undefined;
    }

    @action.bound handleChange(e) {
        const { name, value } = e.target;
        if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }
        this[name] = value;
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
    @observable tick    = '';

    // TODO: retrieve from upper state
    @observable server_time = undefined;
};
