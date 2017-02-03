const japanese_client = require('../../../common_functions/country_base').japanese_client;

const MarketTimesData = (function() {
    'use strict';

    const sendRequest = function(date, shouldRequestActiveSymbols) {
        const req = { active_symbols: 'brief' };
        if (japanese_client()) {
            req.landing_company = 'japan';
        }
        if (shouldRequestActiveSymbols) {
            BinarySocket.send(req);
        }
        BinarySocket.send({ trading_times: date || 'today' });
    };

    return {
        sendRequest: sendRequest,
    };
})();

module.exports = {
    MarketTimesData: MarketTimesData,
};
