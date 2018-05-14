const Client             = require('./client');
const getLanguage        = require('../../_common/language').get;
const isStorageSupported = require('../../_common/storage').isStorageSupported;
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
        return ((server_url && /qa/.test(server_url)) ?
            `https://www.${server_url.split('.')[1]}.com/oauth2/authorize?app_id=${getAppId()}&l=${language}` :
            `https://oauth.binary.com/oauth2/authorize?app_id=${getAppId()}&l=${language}`
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
