const BinarySocket   = require('../../../base/socket');
const Client         = require('../../../base/client');
const localize       = require('../../../../_common/localize').localize;
const createElement  = require('../../../../_common/utility').createElement;
const getElementById = require('../../../../_common/common_functions').getElementById;
const Url            = require('../../../../_common/url');

const WelcomePage = (() => {
    const onLoad = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            if (Client.hasAccountType('real')) {
                Url.defaultRedirectUrl();
            }

            const upgrade_info = Client.getUpgradeInfo();

            const welcome_msg = getElementById('welcome_container');
            if (welcome_msg) {
                const upgrade_title_el = getElementById('upgrade_title');
                upgrade_title_el.html(upgrade_info.type === 'financial' ? localize('Financial Account') : localize('Real Account'));
                welcome_msg.setVisibility(1);
            }

            if (upgrade_info.can_upgrade) {
                const upgrade_btn = getElementById('upgrade_btn');
                if (upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize('Upgrade now') })).setAttribute('href', Url.urlFor(upgrade_info.upgrade_link));
                    upgrade_btn.classList.remove('button-disabled');
                }
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
