import moment from 'moment';

export const buildForwardStartingConfig = (contract, forward_starting_dates) => (
    // TODO: handle multiple sessions (right now will create duplicated items in the list)
    // preferably we should be able to disable the selection in time picker for that day
    (contract.forward_starting_options || []).length ?
        contract.forward_starting_options.map(option => ({
            text : moment.unix(option.open).format('ddd - DD MMM, YYYY'),
            value: option.open,
            end  : option.close,
        })) :
        forward_starting_dates
);
