import moment from 'moment';

export const buildForwardStartingConfig = (forward_starting_options) => {
    const options = [];

    // TODO: handle multiple sessions (right now will create duplicated items in the list)
    // preferably we should be able to disable the selection in time picker for that day
    forward_starting_options.forEach(option => {
        options.push({
            text : moment.unix(option.open).format('ddd - DD MMM, YYYY'),
            value: option.open,
            end  : option.close,
        });
    });

    return options;
};
