const Cookies          = require('js-cookie');
const DerivBanner = require('./deriv_banner');
const BinarySocket = require('../base/socket');
const State = require('../../_common/storage').State;
const Client = require('../base/client');
const isEuCountrySelected      = require('../../_common/utility').isEuCountrySelected;

const RedirectBanner = (() => {

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {

            const eu_country = isEuCountrySelected(Client.get('residence')) || isEuCountrySelected(State.getResponse('website_status.clients_country'));
            if (eu_country) {
                handleRedirect();
            } else {
                handleRedirectROW();
            }
            
        });

    };

    const handleRedirect = () => {
        window.location.href = 'https://www.binary.bot/movetoderiv.html';
    
    };
    
    const handleRedirectROW = () => {
        
        // Check if param have ?binary-com-lp
        const redirectBinary = new URLSearchParams(window.location.search);
       
        if (redirectBinary.has('binary-com-lp') || Cookies.get('binary-com-show')){
            // Set cookie if they wanted to stay at binary.com and no redirect
            Cookies.set('binary-com-show', true, { expires: 7 });
        } else {
            window.location.replace('https://www.binary.bot/movetoderiv.html');
        }
    
    };

    const loginOnLoad = () => {
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
            }

        });

    };

    return { onLoad, loginOnLoad };

})();

module.exports = RedirectBanner;
