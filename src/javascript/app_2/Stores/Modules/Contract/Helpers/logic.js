export const getDisplayStatus = (is_ended, profit) => {
    let status = 'purchased';
    if (is_ended) {
        status = profit >= 0 ? 'won' : 'lost';
    }
    return status;
};

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
