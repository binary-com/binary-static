const Language        = require('./language');
const japanese_client = require('../common_functions/country_base').japanese_client;

const Url = function(url) {
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
        this.param_hash = undefined;
        $(this).trigger('change', [this]);
    },
    update: function(url) {
        if (this.history_supported) {
            history.pushState({ container: 'content', url: url }, '', url);
            this.reset();
        }
    },
    paramsHash: function() {
        if (!this.param_hash || (this.param_hash && Object.keys(this.param_hash).length === 0)) {
            this.param_hash = {};
            const params = this.params();
            let param = params.length;
            while (param--) {
                if (params[param][0]) {
                    this.param_hash[params[param][0]] = params[param][1];
                }
            }
        }
        return this.param_hash;
    },
    params: function() {
        const params = [];
        const parsed = this.location.search.substr(1).split('&');
        let p_l = parsed.length;
        while (p_l--) {
            const param = parsed[p_l].split('=');
            params.push(param);
        }
        return params;
    },
    param             : function(name) { return this.paramsHash()[name]; },
    paramsHashToString: params        => Object.keys(params).map(function(key) { return key + '=' + params[key]; }).join('&'),
};

const urlFor = (path, params) => {
    if (!path) {
        path = '';
    } else if (path.length > 0 && path[0] === '/') {
        path = path.substr(1);
    }
    const lang = Language.get().toLowerCase();
    let url = '';
    if (typeof window !== 'undefined') {
        url  = window.location.href;
    }
    return url.substring(0, url.indexOf('/' + lang + '/') + lang.length + 2) + (path || ('home' + (lang === 'ja' ? '-jp' : ''))) + '.html' + (params ? '?' + params : '');
};

const urlForStatic = (path) => {
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

const defaultRedirectUrl = () => urlFor(japanese_client() ? 'multi_barriers_trading' : 'trading');

const url = new Url();

module.exports = {
    Url               : Url,
    urlFor            : urlFor,
    urlForStatic      : urlForStatic,
    defaultRedirectUrl: defaultRedirectUrl,
    url               : url,
};
