const State          = require('../../_common/storage').State;
const Client         = require('../../app/base/client');
const BinarySocket   = require('../../app/base/socket');
const getElementById = require('../../../javascript/_common/common_functions').getElementById;

const ResponsibleTrading = (() => {

    const onLoad = () => new Promise(resolve => {
        BinarySocket.wait('landing_company').then(() => {
            const current_landing_company_shortcode = State.getResponse('authorize.landing_company_name') || 'default';
            const residence = Client.get('residence');

            if (residence === 'gb' && current_landing_company_shortcode !== 'malta') {
                getElementById('except_uk_without_mlt').setVisibility(0);
            }

            resolve();
        });
    });

    return {
        onLoad,
    };
})();

module.exports = ResponsibleTrading;
