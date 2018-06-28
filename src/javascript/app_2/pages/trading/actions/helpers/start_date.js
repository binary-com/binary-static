import moment from 'moment';

export const buildForwardStartingConfig = (contract, forward_starting_dates) => {
    const forward_starting_config = [];

    if ((contract.forward_starting_options || []).length) {
        contract.forward_starting_options.forEach(option => {
            const duplicated_option = forward_starting_config.find(opt => opt.value === option.date);
            const current_session   = { open: moment.unix(option.open).utc(), close: moment.unix(option.close).utc() };
            if (duplicated_option) {
                duplicated_option.sessions.push(current_session);
            } else {
                forward_starting_config.push({
                    text    : moment.unix(option.date).format('ddd - DD MMM, YYYY'),
                    value   : option.date,
                    sessions: [current_session],
                });
            }
        });
    }

    return forward_starting_config.length ? forward_starting_config : forward_starting_dates;
};

// returns false if same as now
const isBeforeNow = (compare_moment, should_only_check_hour) => {
    const now_moment = should_only_check_hour ? moment.utc().minute(0).second(0) : moment.utc();
    return compare_moment.isBefore(now_moment) && now_moment.unix() !== compare_moment.unix();
};

export const isSessionAvailable = (
    sessions               = [],
    compare_moment         = moment.utc(),
    start_moment           = moment.utc(),
    should_only_check_hour = false,
) => (
    !isBeforeNow(compare_moment, should_only_check_hour) && !compare_moment.isBefore(start_moment) &&
        (!sessions.length ||
            !!sessions.find(session =>
                compare_moment.isBetween(should_only_check_hour ? session.open.clone().minute(0) : session.open, session.close, null, '[]')))
);
