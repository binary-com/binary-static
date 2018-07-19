import moment from 'moment';

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