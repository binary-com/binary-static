import { localize } from '../../../../_common/localize';


export const getDurationUnits = (/* store */) => {
    const units_map = {
        t: 'ticks',
        s: 'seconds',
        m: 'minutes',
        h: 'hours',
        d: 'days',
    };

    return {
        duration_units_list: Object.keys(units_map).reduce((o, c) => ({...o, [c]: localize(units_map[c])}), {}),
    };
};
