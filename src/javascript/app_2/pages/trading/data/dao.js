import BinarySocket from '../../../../app/base/socket';

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
