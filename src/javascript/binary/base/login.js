const getAppId    = require('../../config').getAppId;
const getLanguage = require('./language').getLanguage;
const Client      = require('./client').Client;

const Login = (function() {
    'use strict';

    const redirect_to_login = function() {
        if (!Client.is_logged_in() && !is_login_pages()) {
            try {
                sessionStorage.setItem('redirect_url', window.location.href);
            } catch (e) {
                window.alert('The website needs features which are not enabled on private mode browsing. Please use normal mode.');
            }
            window.location.href = this.login_url();
        }
    };

    const login_url = function() {
        const server_url = localStorage.getItem('config.server_url');
        return ((server_url && /qa/.test(server_url)) ?
            'https://www.' + server_url.split('.')[1] + '.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + getLanguage() :
            'https://oauth.binary.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + getLanguage()
        );
    };

    const is_login_pages = function() {
        return /logged_inws|oauth2/.test(document.URL);
    };

    return {
        redirect_to_login: redirect_to_login,
        is_login_pages   : is_login_pages,
        login_url        : login_url,
    };
})();

module.exports = {
    Login: Login,
};
