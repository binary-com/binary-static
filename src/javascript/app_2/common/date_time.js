import moment from 'moment';

/**
 * Convert epoch to moment object
 * @param  {Number} epoch
 * @return {moment} the moment object of provided epoch
 */
const toMoment = epoch => moment.unix(epoch).utc();

/**
 * Set specified time on moment object
 * @param  {moment} moment_obj  the moment to set the time on
 * @param  {String} time        12 hours format
 * @return {moment} a new moment object of result
 */
const setTime = (moment_obj, time) => (
    moment.utc(`${moment_obj.format('L')} ${time}`, 'L LT') // TODO: use 24 hours format once there is a new design for time_picker
);

/**
 * return the unix value of provided epoch and time
 * @param  {Number} epoch  the date to update with provided time
 * @param  {String} time   the time to set on the date
 * @return {Number} unix value of the result
 */
export const convertToUnix = (epoch, time) => setTime(toMoment(epoch), time).unix();

export const toGMTFormat = (time) => moment(time || undefined).utc().format('YYYY-MM-DD HH:mm:ss [GMT]');
