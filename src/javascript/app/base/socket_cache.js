const moment           = require('moment');
const getStaticHash    = require('../../_common/check_new_release').getStaticHash;
const LocalStore       = require('../../_common/storage').LocalStore;
const getPropertyValue = require('../../_common/utility').getPropertyValue;
const isEmptyObject    = require('../../_common/utility').isEmptyObject;

/*
 * Caches WS responses to reduce delay time and number of requests
 * Stores data in LocalStore which is the first one available in: localStorage, sessionStorage, InScriptStore
 *
 * 1. It caches only the response of those calls which determined in `config`
 * 2. It doesn't cache responses which returned error
 * 3. The value is requested by BinarySocket,
 *    if this returns a value according to the logic here, socket code take it as response
 *    and won't trigger a `send` request, therefore, no code change needed anywhere else
 * 4. Uses client's time to set and check for expiry, as the expire durations are not so long to need a more precise one
 *    (And doesn't worth to wait for the response of time call)
 * 5. Some responses should be cached by a particular value from request (e.g. contracts_for_frxAUDJPY)
 *    so there can be more than one value for a particular call
 * 6. Clears the whole cache regardless their expire time on the following events:
 *    6.1. Client changes: login / logout / switch loginid
 *    6.2. Detect a new release (static hash changed)
 */
const SocketCache = (() => {
    // keys are msg_type
    // expire: how long to keep the value (in minutes)
    // map_to: if presents, stores the response based on the value of the provided key in the echo_req
    const config = {
        payout_currencies: { expire: 10 },
        active_symbols   : { expire: 10 },
        contracts_for    : { expire: 10, map_to: 'contracts_for' },
    };

    const storage_key = 'ws_cache';

    const set = (response) => {
        const msg_type = response.msg_type;

        if (!config[msg_type] || response.error || !response[msg_type]) return;

        const key      = makeKey(response.echo_req, msg_type);
        const expires  = moment().add(config[msg_type].expire, 'm').valueOf();
        const data_obj = LocalStore.getObject(storage_key);

        if (!data_obj.static_hash) {
            data_obj.static_hash = getStaticHash();
        }

        data_obj[key] = { value: response, expires };
        LocalStore.setObject(storage_key, data_obj);
    };

    const get = (request, msg_type) => {
        let response;

        let data_obj = LocalStore.getObject(storage_key);
        if (isEmptyObject(data_obj)) return undefined;
        if (data_obj.static_hash !== getStaticHash()) { // new release
            clear();
            data_obj = {};
        }

        const key          = makeKey(request, msg_type);
        const response_obj = getPropertyValue(data_obj, key) || {};

        if (moment().isBefore(response_obj.expires)) {
            response = response_obj.value;
        } else { // remove if expired
            remove(key);
        }

        return response;
    };

    const makeKey = (source_obj, msg_type) => {
        let key = msg_type || Object.keys(source_obj).find(type => config[type]);

        if (key && !isEmptyObject(source_obj)) {
            const map_key = (config[key] || {}).map_to || '';
            key += map_key && source_obj[map_key] ? `_${source_obj[map_key]}` : '';
        }

        return key;
    };

    const remove = (key) => {
        const data_obj = LocalStore.getObject(storage_key);
        if (!isEmptyObject(data_obj[key])) {
            delete data_obj[key];
            LocalStore.setObject(storage_key, data_obj);
        }
    };

    const clear = () => {
        LocalStore.remove(storage_key);
    };

    return {
        set,
        get,
        clear,
    };
})();

module.exports = SocketCache;
