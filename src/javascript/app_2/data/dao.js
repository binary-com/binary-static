import BinarySocket from '../../app/base/socket';

/* TODO:
      1. to manage subscriptions and subscription ids
      2. to handle forget and then resubscribe when needed
      3. to handle another request with the same values while the previous one still valid (either stream or not)
      4. to ...
*/
const DAO = (() => {
    const getActiveSymbols = () => BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    const getTicks = (symbol, cb) => BinarySocket.send({ ticks: symbol, subscribe: 1 }, { callback: cb });

    return {
        getActiveSymbols,
        getContractsFor,
        getPayoutCurrencies,
        getWebsiteStatus,
        getTicks,
    };
})();

module.exports = DAO;
