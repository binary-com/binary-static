const getElementById = require('../../_common/common_functions').getElementById;
const State          = require('../../_common/storage').State;
const BinarySocket   = require('../../app/base/socket');

const ResponsibleTrading = (() => {

    const onLoad = () => {
        BinarySocket.wait('authorize', 'website_status', 'landing_company').then(() => {
            const landing_company_shortcode = State.getResponse('landing_company.gaming_company.shortcode');
            const is_uk_client = State.getResponse('website_status.clients_country') === 'gb';

            if ((!is_uk_client && landing_company_shortcode === 'iom') || (is_uk_client && landing_company_shortcode === 'malta')) {
                getElementById('iom_except_uk_without_mlt').setVisibility(1);
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = ResponsibleTrading;
