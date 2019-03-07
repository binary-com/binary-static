export const isDigitContract = (contract_type) => /digit/i.test(contract_type);

export const getDigitInfo = (digits_info, contract_info) => {
    const start_time = +contract_info.entry_tick_time;
    if (!start_time) return {}; // filter out the responses before contract start

    const entry = start_time in digits_info ? {} :
        createDigitInfo(contract_info.entry_tick, start_time);

    const spot_time       = +contract_info.current_spot_time;
    const exit_time       = +contract_info.exit_tick_time;
    const is_after_expiry = exit_time && spot_time > exit_time;

    const current = (spot_time in digits_info) || is_after_expiry ? {} : // filter out duplicated responses and those after contract expiry
        createDigitInfo(contract_info.current_spot, spot_time);

    const is_expired = contract_info.is_expired;
    const exit = (exit_time in digits_info) || !is_expired ? {} :
        createDigitInfo(contract_info.exit_tick, exit_time);

    return {
        ...entry,
        ...current,
        ...exit,
    };
};

const createDigitInfo = (spot, spot_time) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            spot,
        },
    };
};
