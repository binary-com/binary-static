import moment       from 'moment';
import { localize } from '_common/localize';

/**
 * Convert epoch to moment object
 * @param  {Number} epoch
 * @return {moment} the moment object of provided epoch
 */
export const epochToMoment = epoch => moment.unix(epoch).utc();

/**
 * Convert date string or epoch to moment object
 * @param  {Number} value   the date in epoch format
 * @param  {String} value   the date in string format
 * @return {moment} the moment object of 'now' or the provided date epoch or string
 */
export const toMoment = value => {
    if (!value) return moment().utc(); // returns 'now' moment object
    if (value instanceof moment && value.isValid() && value.isUTC()) return value; // returns if already a moment object
    const moment_obj = epochToMoment(value);
    return moment_obj.isValid() ? moment_obj : moment.utc(value);
};

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

/**
 * return true if the time_str is in "HH:MM" format, else return false
 * @param {String} time_str time
 */
export const isTimeValid = time_str => /^(\d{1,2}):(\d{2})(:00)?$/.test(time_str);

/**
 * return true if the time_str's hour is between 0 and 23, else return false
 * @param {String} time_str time
 */
export const isHourValid = time_str => isTimeValid(time_str) && /^([01][0-9]|2[0-3])$/.test(time_str.split(':')[0]);

/**
 * return true if the time_str's minute is between 0 and 59, else return false
 * @param {String} time_str time
 */
export const isMinuteValid = time_str => isTimeValid(time_str) && /^[0-5][0-9]$/.test(time_str.split(':')[1]);

/**
 * return true if the date is typeof string and a valid moment date, else return false
 * @param {String} date_str date
 */
export const isDateValid = date_str => typeof date_str === 'string' && moment(date_str).isValid();
