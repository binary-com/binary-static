import BinarySocket from '../../../../app/base/socket';

const DAO = (() => {
    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    const getTicks = (symbol, cb) => BinarySocket.send({ ticks: symbol, subscribe: 1 }, { callback: cb });

    return {
        getPayoutCurrencies,
        getContractsFor,
        getWebsiteStatus,
        getTicks,
    };
})();

module.exports = DAO;
