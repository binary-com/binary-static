var getLanguage = require('./language').getLanguage;
var japanese_client = require('../common_functions/country_base').japanese_client;

var Url = function (url) {
    this.history_supported = window.history && window.history.pushState;
    if (typeof url !== 'undefined') {
        this.location = $('<a>', { href: decodeURIComponent(url) })[0];
    } else {
        this.location = window.location;
    }
};

Url.prototype = {
    url_for: function(path, params) {
        if (!path) {
            path = '';
        } else if (path.length > 0 && path[0] === '/') {
            path = path.substr(1);
        }
        var lang = getLanguage().toLowerCase(),
            url  = window.location.href;
        return url.substring(0, url.indexOf('/' + lang + '/') + lang.length + 2) + (path || 'home') + '.html' + (params ? '?' + params : '');
    },
    url_for_static: function(path) {
        if (!path) {
            path = '';
        } else if (path.length > 0 && path[0] === '/') {
            path = path.substr(1);
        }

        var staticHost = window.staticHost;
        if (!staticHost || staticHost.length === 0) {
            staticHost = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src');

            if (staticHost && staticHost.length > 0) {
                staticHost = staticHost.substr(0, staticHost.indexOf('/js/') + 1);
            } else {
                staticHost = 'https://www.binary.com/';
            }

            window.staticHost = staticHost;
        }

        return staticHost + path;
    },
    reset: function() {
        this.location = window.location;
        this._param_hash = undefined;
        $(this).trigger('change', [this]);
    },
    update: function(url) {
        var state_info = { container: 'content', url: url, useClass: 'pjaxload' };
        if (this.history_supported) {
            history.pushState(state_info, '', url);
            this.reset();
        }
    },
    param: function(name) {
        var param_hash = this.params_hash();
        return param_hash[name];
    },
    path_matches: function(url) {
        var this_pathname = this.location.pathname,
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
            var this_params = this.params();
            var param_count = this_params.length;
            var match_count = 0;
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
        if (!this._param_hash) {
            this._param_hash = {};
            var params = this.params();
            var param = params.length;
            while (param--) {
                if (params[param][0]) {
                    this._param_hash[params[param][0]] = params[param][1];
                }
            }
        }
        return this._param_hash;
    },
    params: function() {
        var params = [];
        var parsed = this.location.search.substr(1).split('&');
        var p_l = parsed.length;
        while (p_l--) {
            var param = parsed[p_l].split('=');
            params.push(param);
        }
        return params;
    },
    default_redirect_url: function() {
        return this.url_for(japanese_client() ? 'multi_barriers_trading' : 'trading');
    },
};

module.exports = {
    Url: Url,
};
