const Client         = require('../base/client');
const CookieStorage  = require('../../_common/storage').CookieStorage;
const LocalStore     = require('../../_common/storage').LocalStore;
const Url            = require('../../_common/url');

/*
 * Handles utm parameters/referrer to use on signup
 *
 * Priorities:
 * 1. Cookie having utm data (utm_source, utm_medium, utm_campaign) [Expires in 3 months]
 * 2. Query string utm parameters
 * 3. document.referrer
 *
 */

const TrafficSource = (() => {
    let cookie;

    const initCookie = () => {
        if (!cookie) {
            cookie = new CookieStorage('utm_data');
            cookie.read();
            // expiration date is used when writing cookie
            const now      = new Date();
            cookie.expires = now.setMonth(now.getMonth() + 3);
        }
    };

    const getData = () => {
        initCookie();
        const data = cookie.value;
        Object.keys(data).map((key) => {
            data[key] = (data[key] || '').replace(/[^a-zA-Z0-9\s-._]/gi, '').substring(0, 100);
        });
        return data;
    };

    // get source in order of precedence
    const getSource = (utm_data = getData()) => utm_data.utm_source || utm_data.referrer || 'direct';

    const setData = () => {
        if (Client.isLoggedIn()) {
            clearData();
            return;
        }

        const current_values = getData();
        const params         = Url.paramsHash();
        const param_keys     = ['utm_source', 'utm_medium', 'utm_campaign'];

        // When the user comes to the site with URL params
        if (params.utm_source || params.utm_medium || params.utm_campaign) {

            // if url is missing one of required fields, do nothing
            const has_all_params = param_keys.every((param) => param in params);
            
            if (has_all_params) {
                param_keys.forEach((key) => {
                    if (params[key]) {
                        cookie.set(key, params[key], { sameSite: 'none', secure: true });
                    }
                });
            }
            
        } else if (!current_values.utm_source) {
            cookie.set('utm_source', 'binary_direct', { sameSite: 'none', secure: true });
        }

        // Store gclid
        if (params.gclid && !Client.isLoggedIn()) {
            LocalStore.set('gclid', params.gclid);
        }
    };

    const clearData = () => {
        initCookie();
        cookie.remove();
    };

    return {
        getData,
        setData,
        clearData,
        getSource,
    };
})();

module.exports = TrafficSource;
