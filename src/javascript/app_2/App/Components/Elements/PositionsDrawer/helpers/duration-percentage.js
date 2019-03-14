import moment from 'moment';

// TODO: Refactor and simplify, handle tick duration
export const getTimePercentage = (start_time, purchase_time, expiry_time) => {
    const duration_from_purchase = moment.duration(moment.unix(expiry_time).diff(moment.unix(purchase_time)));
    const duration_from_now = moment.duration(moment.unix(expiry_time).diff(start_time));
    let percentage = (duration_from_now.asMilliseconds() / duration_from_purchase.asMilliseconds()) * 100;

    if (percentage < 0.5) {
        percentage = 1;
    } else if (percentage > 100) {
        percentage = 100;
    }

    return Math.round(percentage);
};
