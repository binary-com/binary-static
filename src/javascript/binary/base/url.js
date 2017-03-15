const getLanguage     = require('./language').getLanguage;
const japanese_client = require('../common_functions/country_base').japanese_client;

const Url = function (url) {
    this.history_supported = typeof window !== 'undefined' && window.history && window.history.pushState;
    if (typeof url !== 'undefined') {
        this.location = $('<a>', { href: decodeURIComponent(url) })[0];
    } else if (typeof window !== 'undefined') {
        this.location = window.location;
    }
};

Url.prototype = {
    reset: function() {
        if (typeof window !== 'undefined') {
            this.location = window.location;
        }
        this._param_hash = undefined;
        $(this).trigger('change', [this]);
    },
    update: function(url) {
        const state_info = { container: 'content', url: url };
        if (this.history_supported) {
            history.pushState(state_info, '', url);
            this.reset();
        }
    },
    param: function(name) {
        const param_hash = this.params_hash();
        return param_hash[name];
    },
    path_matches: function(url) {
        const this_pathname = this.location.pathname,
            url_pathname  = url.location.pathname;
        return (this_pathname === url_pathname || '/' + this_pathname === url_pathname);
    },
    params_hash_to_string: function(params) {
        return Object.keys(params)
            .map(function(key) { return key + '=' + params[key]; })
            .join('&');
    },
    is_in: function(url) {
        if (this.path_matches(url)) {
            const this_params = this.params();
            let param_count = this_params.length,
                match_count = 0;
            while (param_count--) {
                if (url.param(this_params[param_count][0]) === this_params[param_count][1]) {
                    match_count++;
                }
            }
            if (match_count === this_params.length) {
                return true;
            }
        }

        return false;
    },
    params_hash: function() {
        if (!this._param_hash || (this._param_hash && Object.keys(this._param_hash).length === 0)) {
            this._param_hash = {};
            const params = this.params();
            let param = params.length;
            while (param--) {
                if (params[param][0]) {
                    this._param_hash[params[param][0]] = params[param][1];
                }
            }
        }
        return this._param_hash;
    },
    params: function() {
        const params = [],
            parsed = this.location.search.substr(1).split('&');
        let p_l = parsed.length;
        while (p_l--) {
            const param = parsed[p_l].split('=');
            params.push(param);
        }
        return params;
    },
};

const url_for = function(path, params) {
    if (!path) {
        path = '';
    } else if (path.length > 0 && path[0] === '/') {
        path = path.substr(1);
    }
    const lang = getLanguage().toLowerCase();
    let url = '';
    if (typeof window !== 'undefined') {
        url  = window.location.href;
    }
    return url.substring(0, url.indexOf('/' + lang + '/') + lang.length + 2) + (path || ('home' + (lang === 'ja' ? '-jp' : ''))) + '.html' + (params ? '?' + params : '');
};

const url_for_static = function(path) {
    if (!path) {
        path = '';
    } else if (path.length > 0 && path[0] === '/') {
        path = path.substr(1);
    }

    let staticHost;
    if (typeof window !== 'undefined') {
        staticHost = window.staticHost;
    }
    if (!staticHost || staticHost.length === 0) {
        staticHost = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src');

        if (staticHost && staticHost.length > 0) {
            staticHost = staticHost.substr(0, staticHost.indexOf('/js/') + 1);
        } else {
            staticHost = 'https://www.binary.com/';
        }

        if (typeof window !== 'undefined') {
            window.staticHost = staticHost;
        }
    }

    return staticHost + path;
};

const default_redirect_url = function() {
    return url_for(japanese_client() ? 'multi_barriers_trading' : 'trading');
};

const url = new Url();

module.exports = {
    Url                 : Url,
    url_for             : url_for,
    url_for_static      : url_for_static,
    default_redirect_url: default_redirect_url,
    url                 : url,
};
