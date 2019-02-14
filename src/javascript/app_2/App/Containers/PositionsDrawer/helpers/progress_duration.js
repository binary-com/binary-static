import { getDiffDuration } from '../../../../Utils/Date';

export const getTimePercentage = (start_time, end_time) => {
    const duration = getDiffDuration(start_time, end_time);
    return duration;
};

export const getDurationUnit = (start_time, end_time) => {
    const duration = getDiffDuration(start_time, end_time);
    return duration;
};
