var objectNotEmpty = require('../../base/utility').objectNotEmpty;
var isVisible      = require('../../common_functions/common_functions').isVisible;
var url            = require('../../base/url').url;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Query string parameters: will change session storage values
 * 3. Session storage values: if none of the above, it will be the source
 *
 */

var Defaults = (function() {
    'use strict';

    var params = {};
    var getDefault = function(key) {
        var pValue = params[key] || url.param(key),
            sValue = sessionStorage.getItem(key);
        if (pValue && (!sValue || pValue !== sValue)) {
            sessionStorage.setItem(key, pValue);
        }
        if (!pValue && sValue) {
            setDefault(key, sValue);
        }
        return pValue || sValue;
    };

    var setDefault = function(key, value) {
        if (!key) return;
        value = value || '';
        if (!objectNotEmpty(params)) params = url.params_hash();
        if (params[key] !== value) {
            params[key] = value;
            // to increase speed, do not set values when form is still loading
            if (!isVisible(document.getElementById('trading_init_progress'))) {
                sessionStorage.setItem(key, value);
                updateURL();
            }
        }
    };

    var removeDefault = function() {
        if (!objectNotEmpty(params)) params = url.params_hash();
        var isUpdated = false;
        for (var i = 0; i < arguments.length; i++) {
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

    var updateAll = function() {
        Object.keys(params).forEach(function(key) {
            sessionStorage.setItem(key, params[key]);
        });
        updateURL();
    };

    var updateURL = function() {
        var updated_url = window.location.pathname + '?' + url.params_hash_to_string(params);
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
