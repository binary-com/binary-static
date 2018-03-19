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

export const onChangeExpiry = ({
    expiry_type,
    duration_unit,
    expiry_date,
    expiry_time,
    contract_type,
    server_time,
}) => {
    let contract_expiry_type = expiry_type === 'duration' && duration_unit === 'd' ? 'daily' : 'intraday';
    if (expiry_type === 'endtime') {
        const time    = ((expiry_time.split(' ') || [])[0] || '').split(':');
        const expires = moment(expiry_date).utc();
        if (time.length > 1) {
            expires.hour(time[0]).minute(time[1]);
        }
        if (expires.diff(moment(server_time).utc(), 'days') >= 1) {
            contract_expiry_type = 'daily';
        }
    }

    return {
        contract_expiry_type,
        ...(contract_type && ContractType.getBarriers(contract_type, contract_expiry_type)), // barrier value changes for intraday/daily
    };
};
