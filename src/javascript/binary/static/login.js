var Login = (function() {
    "use strict";

    var redirect_to_login = function() {
        if (!page.client.is_logged_in && !is_login_pages()) {
            try {
                sessionStorage.setItem('redirect_url', window.location.href);
            } catch(e) {
                alert('The website needs features which are not enabled on private mode browsing. Please use normal mode.');
            }
            window.location.href = page.url.url_for('oauth2/authorize', 'app_id=binarycom');
        }
    };

    var is_login_pages = function() {
        return /logged_inws|oauth2/.test(document.URL);
    };

    return {
        redirect_to_login: redirect_to_login,
        is_login_pages   : is_login_pages,
    };
}());
