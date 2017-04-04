const isEmptyObject = require('../../base/utility').isEmptyObject;
const isVisible     = require('../../common_functions/common_functions').isVisible;
const Url           = require('../../base/url');

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Query string parameters: will change session storage values
 * 3. Session storage values: if none of the above, it will be the source
 *
 */

const Defaults = (function() {
    'use strict';

    let params = {};
    const getDefault = function(key) {
        const pValue = params[key] || Url.param(key),
            sValue = sessionStorage.getItem(key);
        if (pValue && (!sValue || pValue !== sValue)) {
            sessionStorage.setItem(key, pValue);
        }
        if (!pValue && sValue) {
            setDefault(key, sValue);
        }
        return pValue || sValue;
    };

    const setDefault = function(key, value) {
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

    const removeDefault = function() {
        if (isEmptyObject(params)) params = Url.paramsHash();
        let isUpdated = false;
        for (let i = 0; i < arguments.length; i++) {
            if (params.hasOwnProperty(arguments[i])) {
                sessionStorage.removeItem(arguments[i]);
                delete (params[arguments[i]]);
                isUpdated = true;
            }
        }
        if (isUpdated) {
            updateURL();
        }
    };

    const updateAll = function() {
        Object.keys(params).forEach(function(key) {
            sessionStorage.setItem(key, params[key]);
        });
        updateURL();
    };

    const updateURL = function() {
        const updated_url = window.location.origin + window.location.pathname + '?' + Url.paramsHashToString(params);
        window.history.replaceState({ url: updated_url }, null, updated_url);
    };

    return {
        get   : getDefault,
        set   : setDefault,
        update: updateAll,
        remove: removeDefault,
        clear : function() { params = {}; },
    };
})();

module.exports = {
    Defaults: Defaults,
};
