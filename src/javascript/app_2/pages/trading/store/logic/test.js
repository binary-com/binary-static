import DAO from '../../data/dao';

export const getCountry = () => DAO.getWebsiteStatus()
    .then(r => `Your country is: ${r.website_status.clients_country}`);

export const getTicks = (func) => DAO.getTicks('frxEURUSD', (r) => {
    func(`${new Date(r.tick.epoch * 1000).toUTCString()}: ${r.tick.quote}`);
});
