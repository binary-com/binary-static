import moment from 'moment';

export const momentDateTime = (date, time) => {
    const moment_date = moment.utc(date);
    const arr_time    = ((time.split(' ') || [])[0] || '').split(':');
    if (arr_time.length > 1) {
        moment_date.hour(arr_time[0]).minute(arr_time[1]);
    }
    return moment_date.utc();
};

export const convertDateTimetoUnix = (date, time) => momentDateTime(date, time).unix();
