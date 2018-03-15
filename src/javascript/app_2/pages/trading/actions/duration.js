import moment from 'moment';
import { localize } from '../../../../_common/localize';
import ContractType from './helpers/contract_type';

export const getDurationUnits = (/* store */) => {
    const units_map = {
        t: 'ticks',
        s: 'seconds',
        m: 'minutes',
        h: 'hours',
        d: 'days',
    };

    return {
        duration_units_list: Object.keys(units_map).reduce((o, c) => (
            [...o, { text: localize(units_map[c]), value: c }]
        ), []),
    };
};

export const onChangeExpiry = ({ expiry_type, duration_unit, expiry_date, expiry_time, contract_type }) => {
    let contract_expiry_type = 'intraday';
    if (expiry_type === 'duration') {
        if (duration_unit === 'd') {
            contract_expiry_type = 'daily';
        }
    } else {
        const time    = ((expiry_time.split(' ') || [])[0] || '').split(':');
        const expires = moment().utc(expiry_date);
        if (time.length > 1) {
            expires.hour(time[0]).minute(time[1]);
        }
        if (expires.diff(moment().utc(), 'days') >= 1) {
            contract_expiry_type = 'daily';
        }
    }

    const new_values = { contract_expiry_type };

    if (contract_type) {
        // barrier value changes for intraday/daily
        const obj_barriers = ContractType.getBarriers(contract_type, contract_expiry_type);
        Object.assign(new_values, obj_barriers);
    }

    return new_values;
};
