var isStorageSupported = function(storage) {
    if(typeof storage === 'undefined') {
        return false;
    }

    var testKey = 'test';
    try {
        storage.setItem(testKey, '1');
        storage.removeItem(testKey);
        return true;
    } catch(e) {
        return false;
    }
};

var Store = function(storage) {
    this.storage = storage;
};

Store.prototype = {
      get: function(key) {
          return this.storage.getItem(key) ? this.storage.getItem(key) : undefined;
      },
      set: function(key, value) {
          if(typeof value != "undefined") {
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

var InScriptStore = function(object) { 
    this.store = typeof object !== 'undefined' ? object : {};
};

InScriptStore.prototype = {
    get: function(key) {
        return this.store[key];
    },
    set: function(key, value) {
        this.store[key] = value;
    },
    remove:  function(key) {
        this.store[key] = undefined;
    },
    clear: function() {
        this.store = {};
    }
};

var CookieStorage = function (cookie_name) {
    this.initialized = false;
    this.cookie_name = cookie_name;
    this.domain = '.' + document.domain.split('.').slice(-2).join('.');
    this.expires = new Date('Thu, 1 Jan 2037 12:00:00 GMT');
    this.value = {};
};

CookieStorage.prototype = {
    read: function() {
        var cookie_value = $.cookie(this.cookie_name);
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
        if(expireDate) this.expires = expireDate;
        $.cookie(this.cookie_name, this.value, {
            expires: this.expires,
            path   : '/',
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
        $.cookie(this.cookie_name, JSON.stringify(this.value), {
            expires: this.expires,
            path: '/',
            domain: this.domain,
        });
    }
};

var Localizable = function(hash) {
    this.texts = typeof hash !== 'undefined'? hash : {};
};

Localizable.prototype = {
    localize: function(text, params) {
        var index = text.replace(/[\s|.]/g, '_');
        return this.texts[index] || text;
    }
};
