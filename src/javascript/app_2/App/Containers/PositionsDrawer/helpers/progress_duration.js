import moment from 'moment';

export const getTimePercentage = (start_time, purchase_time, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(purchase_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(start_time));
    let percentage = 100;
    const duration_unit = getDurationUnit(duration_from_now);

    if (duration_unit === 'days') {
        percentage = (duration_from_now.asDays() / duration_from_purchase.asDays()) * 100;
    } else if (duration_unit === 'hours') {
        percentage = (duration_from_now.asHours() / duration_from_purchase.asHours()) * 100;
    } else if (duration_unit === 'minutes') {
        percentage = (duration_from_now.asMinutes() / duration_from_purchase.asMinutes()) * 100;
    } else if (duration_unit === 'seconds') {
        percentage = (duration_from_now.asSeconds() / duration_from_purchase.asSeconds()) * 100;
    }
    return percentage;
};

const getDurationUnit = (obj_duration) => {
    if (obj_duration) {
        if (obj_duration.asDays() > 1) {
            return 'days';
        } else if (obj_duration.asHours() > 1 && obj_duration.asDays() <= 1) {
            return 'hours';
        } else if (obj_duration.asMinutes() > 1 && obj_duration.asHours() <= 1) {
            return 'minutes';
        } else if (obj_duration.asSeconds() > 1 && obj_duration.asMinutes() <= 1) {
            return 'seconds';
        }
    }
    return null;
};
