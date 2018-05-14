import BinarySocket from '../../_common/base/socket_base';
import SubscriptionManager from './subscription_manager';
import { isEmptyObject } from '../../_common/utility';

const DAO = (() => {
    const getActiveSymbols = () => BinarySocket.send({ active_symbols: 'brief' });

    const getContractsFor = (symbol) => BinarySocket.send({ contracts_for: symbol });

    const getPayoutCurrencies = () => BinarySocket.send({ payout_currencies: 1 });

    const getWebsiteStatus = () => BinarySocket.send({ website_status: 1 });

    // ----- Streaming calls -----
    const subscribeTicks = (symbol, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks', { ticks: symbol, subscribe: 1 }, cb, should_forget_first);

    const forget = (msg_type, cb, match_values) => SubscriptionManager.forget(msg_type, cb, match_values);

    const forgetAll = (...msg_types) => SubscriptionManager.forgetAll(...msg_types);

    // ------ SmartCharts calls ----
    const subscribeTicksHistory = (request_object, cb, should_forget_first) =>
        SubscriptionManager.subscribe('ticks_history', request_object, cb, should_forget_first);

    const sendRequest = (request_object) => (
        Promise.resolve(
            !isEmptyObject(request_object) ?
                BinarySocket.send(request_object) :
                {}
        )
    );

    return {
        getActiveSymbols,
        getContractsFor,
        getPayoutCurrencies,
        getWebsiteStatus,
        sendRequest,
        subscribeTicks,
        subscribeTicksHistory,
        forget,
        forgetAll,
    };
})();

export default DAO;
