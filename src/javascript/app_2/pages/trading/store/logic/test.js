import DAO from '../../data/dao';

export const getCountry = () => DAO.getWebsiteStatus()
    .then(r => `Your country is: ${r.website_status.clients_country}`);

export const getTicks = (func) => DAO.getTicks('frxEURUSD', (r) => {
    if (r.tick) {
        func(`${new Date(r.tick.epoch * 1000).toUTCString()}: ${r.tick.quote}`);
    }
});

export const onAmountChange = (new_value) => {
    const barrier_2 = new_value * 2;
    console.log('Amount: ', new_value, 'Low Barrier: ', barrier_2);
    return {
        barrier_2,
    };
};
