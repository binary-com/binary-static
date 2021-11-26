const Cookies        = require('js-cookie');
const getElementById = require('../../_common/common_functions').getElementById;
const createElement  = require('../../_common/utility').createElement;
const getLanguage       = require('../../_common/language').get;
const BinarySocket = require('../base/socket');
const State = require('../../_common/storage').State;
const Client = require('../base/client');
const isEuCountrySelected      = require('../../_common/utility').isEuCountrySelected;

const DerivBanner = (() => {
    let el_multiplier_banner_container,
        el_close_button,
        multiplier_link;

    const redBanner = () => {
        const is_deriv_banner_dismissed = localStorage.getItem('is_deriv_banner_dismissed');

        if (!is_deriv_banner_dismissed) {
            const affiliate_cookie = Cookies.getJSON('affiliate_tracking');
            let affiliate_token;

            if (affiliate_cookie) affiliate_token = affiliate_cookie.t;
            else {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                affiliate_token = urlParams.get('t');
            }
            
            el_multiplier_banner_container = getElementById('multiplier_banner_container');
            multiplier_link = getElementById('multiplier-link');

            const lang = getLanguage().toLowerCase();
            const multiplier_href = `https://deriv.com/${lang}/trade-types/multiplier/?utm_source=binary&utm_medium=referral&utm_campaign=ww-banner-deriv-1020-en&utm_content=multiplier-banner-synthetic-indices-amplified`;

            multiplier_link.href = affiliate_token ? `${multiplier_href}&t=${affiliate_token}` : multiplier_href;

            el_multiplier_banner_container.setVisibility(1);
            el_close_button = el_multiplier_banner_container.querySelector('.deriv_banner_close') || createElement('div');
            el_close_button.addEventListener('click', onClose);
        }
    };

    const onLoad = () => {

        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {

            const eu_country = isEuCountrySelected(Client.get('residence')) || isEuCountrySelected(State.getResponse('website_status.clients_country'));

            if (eu_country) return;
            redBanner();
        });
    };

    const loginOnLoad = () => {

        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {

            const client_account = Client.get('landing_company_shortcode') === 'svg';

            if (!client_account) return;
            redBanner();

        });
    };

    const onClose = () => {
        el_multiplier_banner_container.setVisibility(0);
        localStorage.setItem('is_deriv_banner_dismissed', 1);
    };

    const onUnload = () => {
        if (el_close_button) {
            el_close_button.removeEventListener('click', onClose);
        }
    };

    return {
        onLoad,
        onUnload,
        loginOnLoad,
        redBanner,
    };
})();

module.exports = DerivBanner;
