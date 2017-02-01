const getPropertyValue = require('./utility').getPropertyValue;
const Cookies          = require('../../lib/js-cookie');

const isStorageSupported = function(storage) {
    if (typeof storage === 'undefined') {
        return false;
    }

    const testKey = 'test';
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

const Store = function(storage) {
    this.storage = storage;
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
    remove: function(key) {
        this.storage.removeItem(key);
    },
    clear: function() {
        this.storage.clear();
    },
};

const InScriptStore = function(object) {
    this.store = typeof object !== 'undefined' ? object : {};
};

InScriptStore.prototype = {
    get: function(key) {
        return getPropertyValue(this.store, key);
    },
    set: function(key, value) {
        let obj = this.store;
        if (Array.isArray(key)) {
            key.forEach(function(k) {
                if (k in obj) obj = obj[k];
                else key = k;
            });
        }
        obj[key] = value;
    },
    remove: function(key)        { delete this.store[key]; },
    clear : function()           { this.store = {}; },
    has   : function(key)        { return this.get(key) !== undefined; },
    keys  : function()           { return Object.keys(this.store); },
};

const State = new InScriptStore();
State.set('response', {});

const CookieStorage = function (cookie_name, cookie_domain) {
    this.initialized = false;
    this.cookie_name = cookie_name;
    const hostname = window.location.hostname;
    this.domain = cookie_domain || (/\.binary\.com/i.test(hostname) ? '.' + hostname.split('.').slice(-2).join('.') : hostname);
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
    write: function(value, expireDate, isSecure) {
        if (!this.initialized) this.read();
        this.value = value;
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
    set: function(key, value) {
        if (!this.initialized) this.read();
        this.value[key] = value;
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
if (typeof window !== 'undefined' && isStorageSupported(window.localStorage)) {
    LocalStore = new Store(window.localStorage);
}

if (typeof window !== 'undefined' && isStorageSupported(window.sessionStorage)) {
    if (!LocalStore) {
        LocalStore = new Store(window.sessionStorage);
    }
    SessionStore = new Store(window.sessionStorage);
}

if (!SessionStore || !LocalStore) {
    if (!LocalStore) {
        LocalStore = new InScriptStore();
    }
    if (!SessionStore) {
        SessionStore = new InScriptStore();
    }
}

module.exports = {
    isStorageSupported: isStorageSupported,
    Store             : Store,
    InScriptStore     : InScriptStore,
    CookieStorage     : CookieStorage,
    State             : State,
    SessionStore      : SessionStore,
    LocalStore        : LocalStore,
};
