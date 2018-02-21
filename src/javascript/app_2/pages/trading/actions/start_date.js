import moment from 'moment';
// import DAO from '../data/dao';
import {localize} from '../../../../_common/localize';

export const getStartDates = () => {
    const start_dates = [
        { open: 1517356800, close: 1517443199 },
        { open: 1517443200, close: 1517529599 },
        { open: 1517529600, close: 1517615999 },
    ];
    return {
        start_dates_list: [
            { text: localize('Now'), value: 'now' },
            ...start_dates.map(date_obj => ({
                text : moment.unix(date_obj.open).format('ddd - DD MMM, YYYY'),
                value: date_obj.open,
                end  : date_obj.close,
            })),
        ],
    };
};
