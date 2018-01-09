import DAO from '../data/dao';
import Client from '../../../base/client';

const Logic = (() => {
    let setState;

    const init = (fnc) => {
        setState = fnc;
        getCountry();
        getTicks();
    };

    const getState = () => ({
        // Amount
        basis   : 'stake',
        currency: Client.get('currency'),
        amount  : 5,

        // Duration
        expiry_type  : 'duration',
        duration     : 15,
        duration_unit: 's',
        expiry_date  : null,
        expiry_time  : null,

        // Start Time
        // Barrier
        // Last Digit

        message: '',
        tick   : '',
    });

    const getCountry = () => { DAO.getWebsiteStatus().then(r => { setState({ message: `Your country is: ${r.website_status.clients_country}`}); }); };

    const getTicks = () => { DAO.getTicks('frxEURUSD', (r) => { setState({ tick: `${new Date(r.tick.epoch * 1000).toUTCString()}: ${r.tick.quote}` }); }); };

    return {
        init,
        getState,
    };
})();

module.exports = Logic;
