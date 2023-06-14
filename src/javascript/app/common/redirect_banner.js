const Cookies = require('js-cookie');
const DerivBanner = require('./deriv_banner');
const BinarySocket = require('../base/socket');
const State = require('../../_common/storage').State;
const Client = require('../base/client');
const { showLoading, removeLoadingImage } = require('../../_common/utility');
const isEuCountrySelected      = require('../../_common/utility').isEuCountrySelected;

const RedirectBanner = (() => {
    const onLoad = () => {
        showLoading();
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const eu_country = isEuCountrySelected(Client.get('residence')) || isEuCountrySelected(State.getResponse('website_status.clients_country'));
            
            if (eu_country) {
                handleRedirect();
            } else if (!Cookies.get('row-lp-visited')) {
                handleRowRedirect();
            }
            setTimeout(() => {
                removeLoadingImage();
            }, 1000);
        });

    };

    const handleRedirect = () => {
        window.location.href = '/move-to-deriv/';
    };
    const handleRowRedirect = () => {
        window.location.href = '/binary-to-deriv/';
    };

    const loginOnLoad = () => {
        showLoading();
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const eu_country = isEuCountrySelected(Client.get('residence')) || isEuCountrySelected(State.getResponse('website_status.clients_country'));
            const landing_company_shortcode = Client.get('landing_company_shortcode');

            const client_account = ['maltainvest', 'iom', 'malta'].includes(landing_company_shortcode);
            const virtual_account = landing_company_shortcode === 'virtual';

            const svg = State.getResponse('authorize.account_list').filter(item => item.landing_company_name === 'svg').length;
            
            if (eu_country && State.getResponse('authorize.account_list').length === 1) {
                handleRedirect();
            } else if (svg && virtual_account) {
                DerivBanner.redBanner();
            } else if (eu_country && client_account) {
                handleRedirect();
            } else if (eu_country && virtual_account) {
                handleRedirect();
            } else if (!Cookies.get('row-lp-visited')) {
                handleRowRedirect();
            }
            setTimeout(() => {
                removeLoadingImage();
            }, 1000);
        });

    };

    return { onLoad, loginOnLoad };

})();

module.exports = RedirectBanner;
