import moment from 'moment';
import DAO from '../../../data/dao';

export const getCountryAsync = function* () {
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

export const onChangeAmount = ({amount}) => {
    const barrier_2 = amount * 2;
    // console.log('Amount: ', amount, 'Low Barrier: ', barrier_2);
    return {
        barrier_2,
    };
};

export const initTime = () => ({
    server_time: window.time || moment.utc(),
});
