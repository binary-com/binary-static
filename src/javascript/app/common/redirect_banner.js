const DerivBanner = require('./deriv_banner');
const BinarySocket = require('../base/socket');
const State = require('../../_common/storage').State;
const Client = require('../base/client');
const isEuCountrySelected      = require('../../_common/utility').isEuCountrySelected;

const RedirectBanner = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status').then(() => {
            if (isEuCountrySelected(State.getResponse('website_status.clients_country'))) {
                handleRedirect();
            }
        });
    };

    const handleRedirect = () => {
        window.location.href = '/move-to-deriv/';
    };

    const loginOnLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const eu_country = isEuCountrySelected(Client.get('residence')) || isEuCountrySelected(State.getResponse('website_status.clients_country'));

            const client_account = Client.get('landing_company_shortcode') === 'maltainvest';
            const virtual_account = Client.get('landing_company_shortcode') === 'virtual';

            const maltainvest = State.getResponse('authorize.account_list').filter(item => item.landing_company_name === 'maltainvest').length;
            const iom = State.getResponse('authorize.account_list').filter(item => item.landing_company_name === 'iom').length;
            const malta = State.getResponse('authorize.account_list').filter(item => item.landing_company_name === 'malta').length;
            const svg = State.getResponse('authorize.account_list').filter(item => item.landing_company_name === 'svg').length;
            
            if (eu_country && State.getResponse('authorize.account_list').length === 1) {
                handleRedirect();
            } else if (eu_country && virtual_account && maltainvest && !iom && !malta) {
                handleRedirect();
            } else if (eu_country && client_account) {
                handleRedirect();
            } else if (svg && virtual_account) {
                DerivBanner.redBanner();
            }

        });

    };

    return { onLoad, loginOnLoad };

})();

module.exports = RedirectBanner;
