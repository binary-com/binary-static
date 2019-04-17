import moment     from 'moment';
import ServerTime from '_common/base/server_time';

export const getChartConfig = (contract_info) => {
    const start_epoch = contract_info.date_start;
    const end_epoch   = getEndSpotTime(contract_info) || contract_info.date_expiry;

    return {
        end_epoch,
        start_epoch,
    };
};

export const calculateGranularityFromTime = (start_time, expiry_time) => {
    const beginning_time = start_time || ServerTime.get().unix();
    const duration = moment.duration(moment.unix(expiry_time).diff(moment.unix(beginning_time))).asHours();
    return (duration < 1) ? 0 : 3600;
};

export const getDisplayStatus = (contract_info) => {
    let status = 'purchased';
    if (isEnded(contract_info)) {
        status = contract_info.profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

export const getEndSpot = (contract_info) => (
    isUserSold(contract_info) ? contract_info.sell_spot : contract_info.exit_tick
);

export const getEndSpotTime = (contract_info) => (
    isUserSold(contract_info) ? +contract_info.sell_spot_time : +contract_info.exit_tick_time
);

export const getFinalPrice = (contract_info) => (
    +(contract_info.sell_price || contract_info.bid_price)
);

export const getIndicativePrice = (contract_info) => (
    getFinalPrice(contract_info) && isEnded(contract_info) ?
        getFinalPrice(contract_info) :
        (+contract_info.bid_price || null)
);

export const getLastTickFromTickStream = (tick_stream = []) => (
    tick_stream[tick_stream.length - 1] || {}
);

export const isEnded = (contract_info) => !!(
    (contract_info.status && contract_info.status !== 'open') ||
    contract_info.is_expired        ||
    contract_info.is_settleable
);

export const isSoldBeforeStart = (contract_info) => (
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start
);

export const isStarted = (contract_info) => (
    !contract_info.is_forward_starting || contract_info.current_spot_time > contract_info.date_start
);

export const isUserSold = (contract_info) => (
    contract_info.status === 'sold'
);

export const isValidToSell = (contract_info) => (
    !isEnded(contract_info) && !isUserSold(contract_info) && +contract_info.is_valid_to_sell === 1
);
