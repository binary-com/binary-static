import BinarySocket from '../../app/base/socket';
import SubscriptionManager from './subscription_manager';

const DAO = (() => {
    const getActiveSymbols = () => BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    // ----- Streaming calls -----
    const subscribeTicks = (symbol, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);

    const forget = (msg_type, cb) => SubscriptionManager.forget(msg_type, cb);

    const forgetAll = (...msg_types) => SubscriptionManager.forgetAll(...msg_types);

    return {
        getActiveSymbols,
        getContractsFor,
        getPayoutCurrencies,
        getWebsiteStatus,
        subscribeTicks,
        forget,
        forgetAll,
    };
})();

export default DAO;
