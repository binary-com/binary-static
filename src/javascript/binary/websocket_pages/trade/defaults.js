const Url           = require('../../base/url');
const isEmptyObject = require('../../base/utility').isEmptyObject;
const isVisible     = require('../../common_functions/common_functions').isVisible;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Query string parameters: will change session storage values
 * 3. Session storage values: if none of the above, it will be the source
 *
 */

const Defaults = (() => {
    'use strict';

    let params = {};
    const getDefault = (key) => {
        const p_value = params[key] || Url.param(key);
        const s_value = sessionStorage.getItem(key);
        if (p_value && (!s_value || p_value !== s_value)) {
            sessionStorage.setItem(key, p_value);
        }
        if (!p_value && s_value) {
            setDefault(key, s_value);
        }
        return p_value || s_value;
    };

    const setDefault = (key, value) => {
        if (!key) return;
        value = value || '';
        if (isEmptyObject(params)) params = Url.paramsHash();
        if (params[key] !== value) {
            params[key] = value;
            // to increase speed, do not set values when form is still loading
            if (!isVisible(document.getElementById('trading_init_progress'))) {
                sessionStorage.setItem(key, value);
                updateURL();
            }
        }
    };

    const removeDefault = () => {
        if (isEmptyObject(params)) params = Url.paramsHash();
        let is_updated = false;
        for (let i = 0; i < arguments.length; i++) {
            if (params.hasOwnProperty(arguments[i])) {
                sessionStorage.removeItem(arguments[i]);
                delete (params[arguments[i]]);
                is_updated = true;
            }
        }
        if (is_updated) {
            updateURL();
        }
    };

    const updateAll = () => {
        Object.keys(params).forEach((key) => {
            sessionStorage.setItem(key, params[key]);
        });
        updateURL();
    };

    const updateURL = () => {
        const updated_url = `${window.location.origin}${window.location.pathname}?${Url.paramsHashToString(params)}`;
        window.history.replaceState({ url: updated_url }, null, updated_url);
    };

    return {
        get   : getDefault,
        set   : setDefault,
        update: updateAll,
        remove: removeDefault,
        clear : () => { params = {}; },
    };
})();

module.exports = Defaults;
