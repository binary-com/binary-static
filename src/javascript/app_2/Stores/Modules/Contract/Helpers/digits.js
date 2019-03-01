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

    return {
        ...entry,
        ...current,
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
