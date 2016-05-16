var Login = (function() {
    "use strict";

    var redirect_to_login = function() {
        if (!page.client.is_logged_in && !is_login_pages()) {
            try {
                sessionStorage.setItem('redirect_url', window.location.href);
            } catch(e) {
                alert('The website needs features which are not enabled on private mode browsing. Please use normal mode.');
            }
            window.location.href = this.login_url();
        }
    };

    var login_url = function() {
        return (/\.binary(qa\d+|)\.com/i.test(window.location.hostname) ? '' : 'https://www2.binary.com') + '/oauth2/authorize?app_id=' + app_id + '&l=' + page.language();
    };

    var is_login_pages = function() {
        return /logged_inws|oauth2/.test(document.URL);
    };

    return {
        redirect_to_login: redirect_to_login,
        is_login_pages   : is_login_pages,
        login_url        : login_url,
    };
}());
