const Client   = require('./client');
const Language = require('./language');
const getAppId = require('../../config').getAppId;

const Login = (() => {
    'use strict';

    const redirectToLogin = () => {
        if (!Client.isLoggedIn() && !isLoginPages()) {
            try {
                sessionStorage.setItem('redirect_url', window.location.href);
            } catch (e) {
                window.alert('The website needs features which are not enabled on private mode browsing. Please use normal mode.');
            }
            window.location.href = loginUrl();
        }
    };

    const loginUrl = () => {
        const server_url = localStorage.getItem('config.server_url');
        return ((server_url && /qa/.test(server_url)) ?
            'https://www.' + server_url.split('.')[1] + '.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + Language.get() :
            'https://oauth.binary.com/oauth2/authorize?app_id=' + getAppId() + '&l=' + Language.get()
        );
    };

    const isLoginPages = () => /logged_inws/.test(document.URL);

    return {
        redirectToLogin: redirectToLogin,
        isLoginPages   : isLoginPages,
        loginUrl       : loginUrl,
    };
})();

module.exports = Login;
