import BinarySocket from '../../app/base/socket';
import SubscriptionManager from './subscription_manager';

const DAO = (() => {
    const getActiveSymbols = () => BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getOauthApps = () =>  BinarySocket.send({ oauth_apps: 1 });

    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getPortfolio = () => BinarySocket.send({ portfolio: 1 });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    const sellExpired = () => BinarySocket.send({ sell_expired: 1 });

    // ----- Streaming calls -----
    const subscribeProposalOpenContract = (cb, should_forget_first) => 
        SubscriptionManager.subscribe('proposal_open_contract', { proposal_open_contract: 1, subscribe: 1 }, cb, should_forget_first);

    const subscribeTicks = (symbol, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);

    const subscribeTransaction = (cb, should_forget_first) =>
        SubscriptionManager.subscribe('transaction', { transaction: 1, subscribe: 1 }, cb, should_forget_first);

    const forget = (msg_type, cb) => SubscriptionManager.forget(msg_type, cb);

    const forgetAll = (...msg_types) => SubscriptionManager.forgetAll(...msg_types);

    return {
        getActiveSymbols,
        getContractsFor,
        getOauthApps,
        getPayoutCurrencies,
        getPortfolio,
        getWebsiteStatus,
        sellExpired,
        subscribeProposalOpenContract,
        subscribeTicks,
        subscribeTransaction,
        forget,
        forgetAll,
    };
})();

export default DAO;
