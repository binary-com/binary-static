import DAO from '../data/dao';

export const getCountryAsync = function *() {
    const r = yield DAO.getWebsiteStatus();
    return {
        message: `Your country is: ${r.website_status.clients_country}`,
    };
};

/* This action does not modify state directlly.
 * The payload will be the callback that get's called for each tick
 */
export const getTicks = function(store, callback) {
    DAO.getTicks('frxEURUSD', (r) => {
        const data = `${new Date(r.tick.epoch * 1000).toUTCString()}: ${r.tick.quote}`;
        callback(data);
    });
    return { };
};

export const onAmountChange = ({amount}) => {
    const barrier_2 = amount * 2;
    console.log('Amount: ', amount, 'Low Barrier: ', barrier_2);
    return {
        barrier_2,
    };
};

export const getStartDates = () => ({
    start_dates_list: [
        { open: 1517356800, close: 1517443199 },
        { open: 1517443200, close: 1517529599 },
        { open: 1517529600, close: 1517615999 },
    ],
});
