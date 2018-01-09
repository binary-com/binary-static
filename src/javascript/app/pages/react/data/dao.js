import BinarySocket from '../../../base/socket';

const DAO = (() => {
    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    const getTicks = (symbol, cb) => BinarySocket.send({ ticks: symbol, subscribe: 1 }, { callback: cb });

    return {
        getWebsiteStatus,
        getTicks,
    };
})();

module.exports = DAO;
