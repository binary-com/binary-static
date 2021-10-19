const Cookies             = require('js-cookie');
const Client              = require('./client_base');
const getLanguage         = require('../language').get;
const isMobile            = require('../os_detect').isMobile;
const isStorageSupported  = require('../storage').isStorageSupported;
const LocalStore          = require('../storage').LocalStore;
const removeCookies       = require('../storage').removeCookies;
const urlForCurrentDomain = require('../url').urlForCurrentDomain;
const isLoginPages        = require('../utility').isLoginPages;
const TrafficSource       = require('../../app/common/traffic_source');
const getAppId            = require('../../config').getAppId;

const Login = (() => {
    const redirectToLogin = (reset_password) => {
        removeCookies('hide_guide');
        if (!Client.isLoggedIn() && !isLoginPages() && isStorageSupported(sessionStorage) || reset_password) {
            sessionStorage.setItem('redirect_url', window.location.href);
            window.location.href = loginUrl();
        }
    };

    const loginUrl = () => {
        const server_url         = localStorage.getItem('config.server_url');
        const language           = getLanguage() || LocalStore.get('preferred_language');
        const signup_device      = LocalStore.get('signup_device') || (isMobile() ? 'mobile' : 'desktop');
        const date_first_contact = LocalStore.get('date_first_contact');
        const marketing_queries  = `&signup_device=${signup_device}${date_first_contact ? `&date_first_contact=${date_first_contact}` : ''}`;

        return ((server_url && /qa/.test(server_url)) ?
            `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}` :
            urlForCurrentDomain(`https://oauth.binary.com/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}`)
        );
    };

    const socialLoginUrl = (brand, affiliate_token, utm_data) => (
        `${loginUrl()}&social_signup=${brand}${affiliate_token}${utm_data}`
    );

    const initOneAll = () => {
        ['google', 'facebook', 'apple'].forEach(provider => {
            $(`#button_${provider}`).off('click').on('click', e => {
                e.preventDefault();

                const affiliate_tracking   = Cookies.getJSON('affiliate_tracking');
                const utm_data             = TrafficSource.getData();
                const affiliate_token_link = affiliate_tracking ? `&affiliate_token=${affiliate_tracking.t}` : '';

                let utm_data_link = '';
                Object.keys(utm_data).forEach((key) => {
                    if (utm_data[key]) utm_data_link += `&${key}=${utm_data[key]}`;
                });
                const social_login_url = socialLoginUrl(provider, affiliate_token_link, utm_data_link);

                window.location.href = social_login_url;
            });
        });
    };

    return {
        redirectToLogin,
        initOneAll,
    };
})();

module.exports = Login;
