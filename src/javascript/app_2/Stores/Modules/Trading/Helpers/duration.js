import moment       from 'moment';
import { localize } from '../../../../../_common/localize';

const duration_maps = {
    t: { display: 'ticks',   order: 1 },
    s: { display: 'seconds', order: 2, to_second: 1 },
    m: { display: 'minutes', order: 3, to_second: 60 },
    h: { display: 'hours',   order: 4, to_second: 60 * 60 },
    d: { display: 'days',    order: 5, to_second: 60 * 60 * 24 },
};

const buildDurationConfig = (contract, durations = { min_max: {}, units_display: {} }) => {
    durations.min_max[contract.start_type]       = durations.min_max[contract.start_type] || {};
    durations.units_display[contract.start_type] = durations.units_display[contract.start_type] || [];

    const obj_min = getDurationFromString(contract.min_contract_duration);
    const obj_max = getDurationFromString(contract.max_contract_duration);

    durations.min_max[contract.start_type][contract.expiry_type] = {
        min: convertDurationUnit(obj_min.duration, obj_min.unit, 's'),
        max: convertDurationUnit(obj_max.duration, obj_max.unit, 's'),
    };

    const arr_units = [];
    durations.units_display[contract.start_type].forEach(obj => {
        arr_units.push(obj.value);
    });
    if (/^tick|daily$/.test(contract.expiry_type)) {
        if (arr_units.indexOf(obj_min.unit) === -1) {
            arr_units.push(obj_min.unit);
        }
    } else {
        Object.keys(duration_maps).forEach(u => {
            if (arr_units.indexOf(u) === -1 &&
                duration_maps[u].order >= duration_maps[obj_min.unit].order &&
                duration_maps[u].order <= duration_maps[obj_max.unit].order) {
                arr_units.push(u);
            }
        });
    }

    durations.units_display[contract.start_type] = arr_units
        .sort((a, b) => (duration_maps[a].order > duration_maps[b].order ? 1 : -1))
        .reduce((o, c) => (
            [...o, { text: localize(duration_maps[c].display), value: c }]
        ), []);

    return durations;
};

const convertDurationUnit = (value, from_unit, to_unit) => {
    if (!value || !from_unit || !to_unit) return null;
    if (from_unit === to_unit || !('to_second' in duration_maps[from_unit])) return value;
    return (value * duration_maps[from_unit].to_second) / duration_maps[to_unit].to_second;
};

const getDurationFromString = (duration_string) => {
    const duration = duration_string.toString().match(/[a-zA-Z]+|[0-9]+/g);
    return {
        duration: duration[0],
        unit    : duration[1],
    };
};

const getExpiryType = (store) => {
    const { duration_unit, expiry_date, expiry_type } = store;
    const server_time = store.root_store.common.server_time;

    const duration_is_day       = expiry_type === 'duration' && duration_unit === 'd';
    const expiry_is_after_today = expiry_type === 'endtime' && moment.utc(expiry_date).isAfter(moment(server_time).utc(), 'day');

    let contract_expiry_type = 'daily';
    if (!duration_is_day && !expiry_is_after_today) {
        contract_expiry_type = duration_unit === 't' ? 'tick' : 'intraday';
    }

    return contract_expiry_type;
};

module.exports = {
    buildDurationConfig,
    getExpiryType,
};
