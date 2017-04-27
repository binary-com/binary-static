const isEmptyObject = require('../../base/utility').isEmptyObject;

/*
 * Handles trading page default values
 *
 * Priorities:
 * 1. Client's input: on each change to form, it will reflect to both query string & session storage
 * 2. Local storage values: if none of the above, it will be the source
 *
 */

const MBDefaults = (() => {
    'use strict';

    let params = {};
    const getDefault = (key) => {
        loadParams();
        return params[key];
    };

    const loadParams = () => {
        if (isEmptyObject(params)) params = JSON.parse(localStorage.getItem('mb_trading')) || {};
    };

    const saveParams = () => {
        localStorage.setItem('mb_trading', JSON.stringify(params));
    };

    const setDefault = (key, value) => {
        if (!key) return;
        value = value || '';
        loadParams();
        if (params[key] !== value) {
            params[key] = value;
            saveParams();
        }
    };

    const removeDefault = () => {
        loadParams();
        let is_updated = false;
        for (let i = 0; i < arguments.length; i++) {
            if (params.hasOwnProperty(arguments[i])) {
                delete params[arguments[i]];
                is_updated = true;
            }
        }
        if (is_updated) {
            saveParams();
        }
    };

    return {
        get   : getDefault,
        set   : setDefault,
        remove: removeDefault,
        clear : () => { params = {}; },
    };
})();

module.exports = MBDefaults;
