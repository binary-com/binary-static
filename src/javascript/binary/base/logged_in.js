var LoggedInHandler = (function() {
    "use strict";

    var init = function() {
        parent.window['is_logging_in'] = 1; // this flag is used in base.js to prevent auto-reloading this page
        var redirect_url;
        try {
            var tokens  = storeTokens(),
                loginid = Cookies.get('loginid');

            if (!loginid) { // redirected to another domain (e.g. github.io) so those cookie are not accessible here
                var loginids = Object.keys(tokens);
                var loginid_list = '';
                loginids.map(function(id) {
                    loginid_list += (loginid_list ? '+' : '') + id + ':' + (/^V/i.test(id) ? 'V' : 'R') + ':E'; // since there is not any data source to check, so assume all are enabled, disabled accounts will be handled on authorize
                });
                loginid = loginids[0];
                // set cookies
                page.client.set_cookie('loginid'     , loginid);
                page.client.set_cookie('loginid_list', loginid_list);

                if (!$('body').hasClass('BlueTopBack')) sessionStorage.setItem('check_tnc', loginid_list);
            }
            page.client.set_cookie('login', tokens[loginid]);

            // set flags
            if (!$('body').hasClass('BlueTopBack')) localStorage.setItem('risk_classification', 'check');
            GTM.set_login_flag();

            // redirect url
            redirect_url = sessionStorage.getItem('redirect_url');
            sessionStorage.removeItem('redirect_url');
        } catch(e) {console.log('storage is not supported');}

        // redirect back
        var set_default = true;
        if(redirect_url) {
            var do_not_redirect = ['reset_passwordws', 'lost_passwordws', 'change_passwordws', 'home'];
            var reg = new RegExp(do_not_redirect.join('|'), 'i');
            if(!reg.test(redirect_url) && page.url.url_for('') !== redirect_url) {
                set_default = false;
            }
        }
        if(set_default) {
            redirect_url = page.url.default_redirect_url();
            var lang_cookie = Cookies.get('language');
            if (lang_cookie && lang_cookie !== page.language()) {
                redirect_url = redirect_url.replace(new RegExp('\/' + page.language() + '\/', 'i'), '/' + lang_cookie.toLowerCase() + '/');
            }
        }
        document.getElementById('loading_link').setAttribute('href', redirect_url);
        window.location.href = redirect_url;
    };

    var storeTokens = function() {
        // Parse hash for loginids and tokens returned by OAuth
        var hash = (/acct1/i.test(window.location.hash) ? window.location.hash : window.location.search).substr(1).split('&'); // to maintain compatibility till backend change released
        var tokens = {};
        for(var i = 0; i < hash.length; i += 2) {
            var loginid = getHashValue(hash[i], 'acct');
            var token = getHashValue(hash[i+1], 'token');
            if(loginid && token) {
                tokens[loginid] = token;
            }
        }
        if(objectNotEmpty(tokens)) {
            page.client.set_storage_value('tokens', JSON.stringify(tokens));
        }
        return tokens;
    };

    var getHashValue = function(source, key) {
        var match = new RegExp('^' + key);
        return source && source.length > 0 ? (match.test(source.split('=')[0]) ? source.split('=')[1] : '') : '';
    };

    return {
        init: init,
    };
}());
