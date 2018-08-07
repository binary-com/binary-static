export const getDisplayStatus = (is_ended, profit) => {
    let status = 'purchased';
    if (is_ended) {
        status = profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

// for path dependent contracts the contract is sold from server side
// so we need to use sell spot and sell spot time instead
export const getEndSpot = (contract_info) => (
    contract_info.is_path_dependent ? contract_info.sell_spot : contract_info.exit_tick
);

export const getEndSpotTime = (contract_info) => (
    contract_info.is_path_dependent ? contract_info.sell_spot_time : contract_info.exit_tick_time
);

export const getFinalPrice = (contract_info) => (
    contract_info.sell_price || contract_info.bid_price
);

export const getIndicativePrice = (store) => (
    store.final_price && store.is_ended ?
        store.final_price :
        (store.contract_info.bid_price || null)
);

export const isEnded = (contract_info) => (
    contract_info.status !== 'open' ||
    contract_info.is_expired        ||
    contract_info.is_settleable
);

export const isSoldBeforeStart = (contract_info) => (
    contract_info.sell_time && +contract_info.sell_time < +contract_info.date_start
);

export const isUserSold = (contract_info) => (
    contract_info.status === 'sold'
);
