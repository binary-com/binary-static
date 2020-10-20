const getElementById = require('../../_common/common_functions').getElementById;
const State          = require('../../_common/storage').State;
const Client         = require('../../app/base/client');
const BinarySocket   = require('../../app/base/socket');

const ResponsibleTrading = (() => {

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const landing_company_shortcode = Client.get('landing_company_shortcode') || State.getResponse('landing_company.gaming_company.shortcode');
            const client_country = Client.get('residence') || State.getResponse('website_status.clients_country');
            const is_uk_client = client_country === 'gb';

            if (landing_company_shortcode === 'iom' || (is_uk_client && landing_company_shortcode === 'malta')) {
                getElementById('iom_except_uk_without_mlt').setVisibility(1);
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ResponsibleTrading;
