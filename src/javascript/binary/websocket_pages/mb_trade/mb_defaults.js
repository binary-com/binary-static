const isEmptyObject = require('../../base/utility').isEmptyObject;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Local storage values: if none of the above, it will be the source
 *
 */

const MBDefaults = (function() {
    'use strict';

    let params = {};
    const getDefault = function(key) {
        loadParams();
        return params[key];
    };

    const loadParams = function() {
        if (isEmptyObject(params)) params = JSON.parse(localStorage.getItem('mb_trading')) || {};
    };

    const saveParams = function() {
        localStorage.setItem('mb_trading', JSON.stringify(params));
    };

    const setDefault = function(key, value) {
        if (!key) return;
        value = value || '';
        loadParams();
        if (params[key] !== value) {
            params[key] = value;
            saveParams();
        }
    };

    const removeDefault = function() {
        loadParams();
        let isUpdated = false;
        for (let i = 0; i < arguments.length; i++) {
            if (params.hasOwnProperty(arguments[i])) {
                delete params[arguments[i]];
                isUpdated = true;
            }
        }
        if (isUpdated) {
            saveParams();
        }
    };

    return {
        get   : getDefault,
        set   : setDefault,
        remove: removeDefault,
        clear : function() { params = {}; },
    };
})();

module.exports = {
    MBDefaults: MBDefaults,
};
