const Client             = require('./client_base');
const getLanguage        = require('../language').get;
const isMobile           = require('../os_detect').isMobile;
const isStorageSupported = require('../storage').isStorageSupported;
const LocalStore         = require('../storage').LocalStore;
const getAppId           = require('../../config').getAppId;

const Login = (() => {
    const redirectToLogin = () => {
        if (!Client.isLoggedIn() && !isLoginPages() && isStorageSupported(sessionStorage)) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl();
        }
    };

    const loginUrl = () => {
        const server_url = localStorage.getItem('config.server_url');
        const language   = getLanguage();
        const signup_device      = LocalStore.get('signup_device') || (isMobile() ? 'mobile' : 'desktop');
        const date_first_contact = LocalStore.get('date_first_contact');
        const marketing_queries   = `&signup_device=${signup_device}${date_first_contact && `&date_first_contact=${date_first_contact}`}`;

        return ((server_url && /qa/.test(server_url)) ?
            `https://www.${server_url.split('.')[1]}.com/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}` :
            `https://oauth.binary.com/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}`
        );
    };

    const isLoginPages = () => /logged_inws|redirect/i.test(window.location.pathname);

    const socialLoginUrl = brand => (`${loginUrl()}&social_signup=${brand}`);

    return {
        redirectToLogin,
        isLoginPages,
        socialLoginUrl,
    };
})();

module.exports = Login;
