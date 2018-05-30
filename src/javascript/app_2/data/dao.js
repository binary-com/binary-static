import BinarySocket        from '../../_common/base/socket_base';
import SubscriptionManager from './subscription_manager';
import { convertDateTimetoUnix } from '../common/date_time';

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

    const getStatement = (limit, offset, date_boundaries) => BinarySocket.send({
        statement  : 1,
        description: 1,
        limit,
        offset,
        ...date_boundaries,
    });

    // ----- Streaming calls -----
    const subscribeBalance = (cb) =>
        SubscriptionManager.subscribe('balance', { balance: 1, subscribe: 1 }, cb);

    const subscribeProposal = (store, type_of_contract, cb, should_forget_first) => {
        const req = {
            proposal     : 1,
            subscribe    : 1,
            amount       : parseFloat(store.amount),
            basis        : store.basis,
            contract_type: type_of_contract,
            currency     : store.currency,
            symbol       : store.symbol,
            ...(
                store.start_date !== 'now' &&
                { date_start: convertDateTimetoUnix(store.start_date, store.start_time) }
            ),
            ...(
                store.expiry_type === 'duration' ?
                {
                    duration     : parseInt(store.duration),
                    duration_unit: store.duration_unit,
                }
                :
                { date_expiry: convertDateTimetoUnix(store.expiry_date, store.expiry_time) }
            ),
            ...(
                (store.barrier_count > 0 || store.form_components.indexOf('last_digit') !== -1) &&
                { barrier: store.barrier_1 || store.last_digit }
            ),
            ...(
                store.barrier_count === 2 &&
                { barrier2: store.barrier_2 }
            ),
        };

        SubscriptionManager.subscribe('proposal', req, cb, should_forget_first);
    };

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
        getStatement,
        sendLogout,

        // streams
        subscribeBalance,
        subscribeProposal,
        subscribeTicks,
        subscribeWebsiteStatus,
        forget,
        forgetAll,
    };
})();

export default DAO;
