export const isDigitContract = (contract_type) => /digit/i.test(contract_type);

export const getDigitInfo = (digits_info, contract_info) => {
    const start_time = +contract_info.entry_tick_time;
    if (!start_time) return {}; // filter out the responses before contract start

    const entry = start_time in digits_info ? {} :
        createDigitInfo(contract_info, contract_info.entry_tick, start_time);

    const spot_time       = +contract_info.current_spot_time;
    const exit_time       = +contract_info.exit_tick_time;
    const is_after_expiry = exit_time && spot_time > exit_time;

    const current = (spot_time in digits_info) || is_after_expiry ? {} : // filter out duplicated responses and those after contract expiry
        createDigitInfo(contract_info, contract_info.current_spot, spot_time);

    return {
        ...entry,
        ...current,
    };
};

const createDigitInfo = (contract_info, spot, spot_time) => {
    const digit = +`${spot}`.slice(-1);

    return {
        [+spot_time]: {
            digit,
            is_win : isWin(contract_info, digit),
            is_last: spot_time === +contract_info.exit_tick_time,
            spot,
        },
    };
};

const isWin = (contract_info, current) =>
    (win_checker[contract_info.contract_type] || (() => {}))(+contract_info.barrier, current);

const win_checker = {
    DIGITMATCH: (barrier, current) => current === barrier,
    DIGITDIFF : (barrier, current) => current !== barrier,
    DIGITODD  : (barrier, current) => current % 2,
    DIGITEVEN : (barrier, current) => !(current % 2),
    DIGITOVER : (barrier, current) => current > barrier,
    DIGITUNDER: (barrier, current) => current < barrier,
};
