import BinarySocket        from '../../_common/base/socket_base';
import SubscriptionManager from './subscription_manager';

const DAO = (() => {
    const getAccountStatus = () =>
        BinarySocket.send({ get_account_status: 1 });

    const getActiveSymbols = () =>
        BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) =>
        BinarySocket.send({ contracts_for: symbol });

    const getLandingCompany = (residence) =>
        BinarySocket.send({ landing_company: residence });

    const getMt5LoginList = () =>
        BinarySocket.send({ mt5_login_list: 1 });

    const getPayoutCurrencies = () =>
        BinarySocket.send({ payout_currencies: 1 });

    const getSelfExclusion = () =>
        BinarySocket.send({ get_self_exclusion: 1 });

    const getSettings = () =>
        BinarySocket.send({ get_settings: 1 });

    const getWebsiteStatus = () =>
        BinarySocket.send({ website_status: 1 });

    const sendLogout = () =>
        BinarySocket.send({ logout: 1 });

    // ----- Streaming calls -----
    const subscribeBalance = (cb) =>
        SubscriptionManager.subscribe('balance', { balance: 1, subscribe: 1 }, cb);

    const subscribeTicks = (symbol, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);

    const subscribeWebsiteStatus = (cb) =>
        SubscriptionManager.subscribe('website_status', { website_status: 1, subscribe: 1 }, cb);

    const forget = (msg_type, cb) =>
        SubscriptionManager.forget(msg_type, cb);

    const forgetAll = (...msg_types) =>
        SubscriptionManager.forgetAll(...msg_types);

    return {
        getAccountStatus,
        getActiveSymbols,
        getContractsFor,
        getLandingCompany,
        getMt5LoginList,
        getPayoutCurrencies,
        getSelfExclusion,
        getSettings,
        getWebsiteStatus,
        sendLogout,

        // streams
        subscribeBalance,
        subscribeTicks,
        subscribeWebsiteStatus,
        forget,
        forgetAll,
    };
})();

export default DAO;
