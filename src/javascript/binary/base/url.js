const urlLang       = require('./language').urlLang;
const jpClient      = require('../common_functions/country_base').jpClient;
const isEmptyObject = require('./utility').isEmptyObject;
require('url-polyfill');

const Url = (() => {
    'use strict';

    let location_url,
        static_host;

    const init = (url) => {
        location_url = url ? getLocation(url) : window ? window.location : '';
    };

    const getLocation = url => $('<a>', { href: decodeURIComponent(url) })[0];

    const reset = () => {
        location_url = window ? window.location : location_url;
    };

    const params = (href) => {
        const arr_params = [];
        const parsed = ((href ? new URL(href) : location_url).search || '').substr(1).split('&');
        let p_l = parsed.length;
        while (p_l--) {
            const param = parsed[p_l].split('=');
            arr_params.push(param);
        }
        return arr_params;
    };

    const paramsHash = (href) => {
        const param_hash = {};
        const arr_params = params(href);
        let param = arr_params.length;
        while (param--) {
            if (arr_params[param][0]) {
                param_hash[arr_params[param][0]] = arr_params[param][1] || '';
            }
        }
        return param_hash;
    };

    const paramsHashToString = pars => (isEmptyObject(pars) ? '' : Object.keys(pars).map(key => `${key}=${pars[key] || ''}`).join('&'));

    const normalizePath = path => (path ? path.replace(/(^\/|\/$|[^a-zA-Z0-9-_/])/g, '') : '');

    const urlFor = (path, pars) => {
        const lang = urlLang().toLowerCase();
        const url = window.location.href;
        return `${url.substring(0, url.indexOf(`/${lang}/`) + lang.length + 2)}${(normalizePath(path) || (`home${(lang === 'ja' ? '-jp' : '')}`))}.html${(pars ? `?${pars}` : '')}`;
    };

    const urlForStatic = (path = '') => {
        if (!static_host || static_host.length === 0) {
            static_host = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src');

            if (static_host && static_host.length > 0) {
                static_host = static_host.substr(0, static_host.indexOf('/js/') + 1);
            } else {
                static_host = Url.websiteUrl();
            }
        }

        return static_host + path.replace(/(^\/)/g, '');
    };

    const defaultRedirectUrl = () => urlFor(jpClient() ? 'multi_barriers_trading' : 'trading');

    return {
        init      : init,
        reset     : reset,
        paramsHash: paramsHash,

        param      : name => paramsHash()[name],
        getLocation: getLocation,

        paramsHashToString: paramsHashToString,
        urlFor            : urlFor,
        urlForStatic      : urlForStatic,
        defaultRedirectUrl: defaultRedirectUrl,
        websiteUrl        : () => 'https://www.binary.com/',
    };
})();

module.exports = Url;
