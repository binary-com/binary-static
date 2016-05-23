/*
 * Handles trading page default values
 * 
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Query string parameters: will change session storage values
 * 3. Session storage values: if none of the above, it will be the source
 *
 */

var Defaults = (function(){
    'use strict';

    var params = {};
    var getDefault = function(key) {
        var pValue = params[key] || page.url.param(key),
            sValue = sessionStorage.getItem(key);
        if(pValue && (!sValue || pValue != sValue)) {
            sessionStorage.setItem(key, pValue);
        }
        if(!pValue && sValue) {
            setDefault(key, sValue);
        }
        return pValue || sValue;
    };

    var setDefault = function(key, value) {
        if(key) {
            value = value || '';
            if(Object.keys(params).length === 0) params = page.url.params_hash();
            if(params[key] != value) {
                params[key] = value;
                // to increase speed, do not set values when form is still loading
                if(!isVisible(document.getElementById('trading_init_progress'))) {
                    sessionStorage.setItem(key, value);
                    updateURL();
                }
            }
        }
    };

    var removeDefault = function() {
        if(Object.keys(params).length === 0) params = page.url.params_hash();
        var isUpdated = false;
        for (var i = 0; i < arguments.length; i++) {
            if(params.hasOwnProperty(arguments[i])) {
                sessionStorage.removeItem(arguments[i]);
                delete(params[arguments[i]]);
                isUpdated = true;
            }
        }
        if(isUpdated) {
            updateURL();
        }
    };

    var updateAll = function() {
        for(var key in params)
            if (params.hasOwnProperty(key)) {
                sessionStorage.setItem(key, params[key]);
            }
        updateURL();
    };

    var updateURL = function() {
        window.history.replaceState(null, null, window.location.pathname + '?' + page.url.params_hash_to_string(params));
    };

    return {
        get   : getDefault,
        set   : setDefault,
        update: updateAll,
        remove: removeDefault,
        clear : function(){params = {};}
    };
})();
