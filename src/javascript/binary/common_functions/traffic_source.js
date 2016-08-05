/*
 * Handles utm parameters/referrer to use on signup
 * 
 * Priorities:
 * 1. Cookie having utm data (utm_source, utm_medium, utm_campaign) [Expires in 3 months]
 * 2. Query string utm parameters
 * 3. document.referrer
 *
 */

var TrafficSource = (function(){
    'use strict';

    var cookie,
        expire_months = 3;

    var initCookie = function() {
        if (!cookie) {
            cookie = new CookieStorage('utm_data');
            cookie.read();
            // expiration date is used when writing cookie
            var now = new Date();
            cookie.expires = now.setMonth(now.getMonth() + expire_months);
        }
    };

    var getData = function() {
        initCookie();
        return cookie.value;
    };

    var setData = function() {
        if (page.client.is_logged_in) return clearData();

        var utm_data = getData(),
            params = page.url.params_hash(),
            param_keys = ['utm_source', 'utm_medium', 'utm_campaign'];

        param_keys.map(function(key) {
            if (params[key] && !utm_data[key]) {
                cookie.set(key, params[key]);
            }
        });

        if(document.referrer && !utm_data.referrer) {
            var referrer = (new URL(document.referrer)).location.hostname;
            cookie.set('referrer', referrer);
        }
    };

    var clearData = function() {
        initCookie();
        cookie.remove();
    };

    return {
        getData  : getData,
        setData  : setData,
        clearData: clearData
    };
})();
