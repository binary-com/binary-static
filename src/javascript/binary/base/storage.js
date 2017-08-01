const Cookies          = require('js-cookie');
const getPropertyValue = require('./utility').getPropertyValue;
const isEmptyObject    = require('./utility').isEmptyObject;

const getObject = function(key) {
    return JSON.parse(this.getItem(key) || '{}');
};

const setObject = function(key, value) {
    if (value && value instanceof Object) {
        this.setItem(key, JSON.stringify(value));
    }
};

if (typeof Storage !== 'undefined') {
    Storage.prototype.getObject = getObject;
    Storage.prototype.setObject = setObject;
}

const isStorageSupported = (storage) => {
    if (typeof storage === 'undefined') {
        return false;
    }

    const test_key = 'test';
    try {
        storage.setItem(test_key, '1');
        storage.removeItem(test_key);
        return true;
    } catch (e) {
        return false;
    }
};

const Store = function(storage) {
    this.storage = storage;
    this.storage.getObject = getObject;
    this.storage.setObject = setObject;
};

Store.prototype = {
    get: function(key) {
        return this.storage.getItem(key) || undefined;
    },
    set: function(key, value) {
        if (typeof value !== 'undefined') {
            this.storage.setItem(key, value);
        }
    },
    getObject: function (key) {
        return typeof this.storage.getObject === 'function' ? // Prevent runtime error in IE
            this.storage.getObject(key) :
            JSON.parse(this.storage.getItem(key) || '{}');
    },
    setObject: function (key, value) {
        if (typeof this.storage.setObject === 'function') { // Prevent runtime error in IE
            this.storage.setObject(key, value);
        } else {
            this.storage.setItem(key, JSON.stringify(value));
        }
    },
    remove: function(key) { this.storage.removeItem(key); },
    clear : function()    { this.storage.clear(); },
};

const InScriptStore = function(object) {
    this.store = typeof object !== 'undefined' ? object : {};
};

InScriptStore.prototype = {
    get: function(key) {
        return getPropertyValue(this.store, key);
    },
    set: function(key, value, obj = this.store) {
        if (!Array.isArray(key)) key = [key];
        if (key.length > 1) {
            if (!(key[0] in obj) || isEmptyObject(obj[key[0]])) obj[key[0]] = {};
            this.set(key.slice(1), value, obj[key[0]]);
        } else {
            obj[key[0]] = value;
        }
    },
    remove: function(...keys) {
        keys.forEach((key) => { delete this.store[key]; });
    },
    clear: function()    { this.store = {}; },
    has  : function(key) { return this.get(key) !== undefined; },
    keys : function()    { return Object.keys(this.store); },
    call : function(key) { if (typeof this.get(key) === 'function') this.get(key)(); },
};

const State = new InScriptStore();
State.prototype = InScriptStore.prototype;
/**
 * Shorthand function to get values from response object of State
 *
 * @param {String} path
 *     e.g. getResponse('authorize.currency') == get(['response', 'authorize', 'authorize', 'currency'])
 */
State.prototype.getResponse = function(path) {
    if (typeof path === 'string') {
        const keys = path.split('.');
        path = ['response', keys[0]].concat(keys);
    }
    return this.get(path);
};
State.set('response', {});

const CookieStorage = function(cookie_name, cookie_domain) {
    this.initialized = false;
    this.cookie_name = cookie_name;
    const hostname = window.location.hostname;
    this.domain = cookie_domain || (/\.binary\.com/i.test(hostname) ? `.${hostname.split('.').slice(-2).join('.')}` : hostname);
    this.path = '/';
    this.expires = new Date('Thu, 1 Jan 2037 12:00:00 GMT');
    this.value = {};
};

CookieStorage.prototype = {
    read: function() {
        const cookie_value = Cookies.get(this.cookie_name);
        try {
            this.value = cookie_value ? JSON.parse(cookie_value) : {};
        } catch (e) {
            this.value = {};
        }
        this.initialized = true;
    },
    write: function(val, expireDate, isSecure) {
        if (!this.initialized) this.read();
        this.value = val;
        if (expireDate) this.expires = expireDate;
        Cookies.set(this.cookie_name, this.value, {
            expires: this.expires,
            path   : this.path,
            domain : this.domain,
            secure : !!isSecure,
        });
    },
    get: function(key) {
        if (!this.initialized) this.read();
        return this.value[key];
    },
    set: function(key, val) {
        if (!this.initialized) this.read();
        this.value[key] = val;
        Cookies.set(this.cookie_name, this.value, {
            expires: new Date(this.expires),
            path   : this.path,
            domain : this.domain,
        });
    },
    remove: function() {
        Cookies.remove(this.cookie_name, {
            path  : this.path,
            domain: this.domain,
        });
    },
};

let SessionStore,
    LocalStore;

if (isStorageSupported(window.localStorage)) {
    LocalStore = new Store(window.localStorage);
}
if (isStorageSupported(window.sessionStorage)) {
    SessionStore = new Store(window.sessionStorage);
}

if (!LocalStore) {
    LocalStore = new InScriptStore();
}
if (!SessionStore) {
    SessionStore = new InScriptStore();
}

module.exports = {
    isStorageSupported: isStorageSupported,
    CookieStorage     : CookieStorage,
    State             : State,
    SessionStore      : SessionStore,
    LocalStore        : LocalStore,
};
