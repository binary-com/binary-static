import moment       from 'moment';
import { localize } from '_common/localize';

/**
 * Convert epoch to moment object
 * @param  {Number} epoch
 * @return {moment} the moment object of provided epoch
 */
export const toMoment = epoch => moment.unix(epoch).utc();

/**
 * Set specified time on moment object
 * @param  {moment} moment_obj  the moment to set the time on
 * @param  {String} time        24 hours format, may or may not include seconds
 * @return {moment} a new moment object of result
 */
const setTime = (moment_obj, time) => {
    const [hour, minute, second] = time.split(':');
    moment_obj.hour(hour).minute(minute || 0).second(second || 0);
    return moment_obj;
};

/**
 * return the unix value of provided epoch and time
 * @param  {Number} epoch  the date to update with provided time
 * @param  {String} time   the time to set on the date
 * @return {Number} unix value of the result
 */
export const convertToUnix = (epoch, time) => setTime(toMoment(epoch), time).unix();

export const toGMTFormat = (time) => moment(time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');

export const formatDate = (date, date_format = 'YYYY-MM-DD') => moment(date || undefined, date_format).format(date_format);

/**
 * return the number of days from today to date specified
 * @param  {String} date   the date to calculate number of days from today
 * @return {Number} an integer of the number of days
 */
export const daysFromTodayTo = (date) => {
    const diff = moment(date).utc().diff(moment().utc(), 'days');
    return (!date || diff < 0) ? '' : diff + 1;
};

/**
 * return moment duration between two dates
 * @param  {Number} epoch start time
 * @param  {Number} epoch end time
 * @return {moment.duration} moment duration between start time and end time
 */
export const getDiffDuration = (start_time, end_time) =>
    moment.duration(moment.unix(end_time).diff(moment.unix(start_time)));

/**
 * return formatted duration `2 days 01:23:59`
 * @param  {moment.duration} moment duration object
 * @return {String} formatted display string
 */
export const formatDuration = (duration) => {
    const d = Math.floor(duration.asDays()); // duration.days() does not include months/years
    const h = duration.hours();
    const m = duration.minutes();
    const s = duration.seconds();
    let formatted_str = moment(0).hour(h).minute(m).seconds(s).format('HH:mm:ss');
    if (d > 0) {
        formatted_str = `${d} ${d > 1 ? localize('days') : localize('day')} ${formatted_str}`;
    }
    return formatted_str;
};
