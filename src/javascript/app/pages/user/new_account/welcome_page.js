const BinarySocket   = require('../../../base/socket');
const Client         = require('../../../base/client');
const localize       = require('../../../../_common/localize').localize;
const createElement  = require('../../../../_common/utility').createElement;
const getElementById = require('../../../../_common/common_functions').getElementById;
const toTitleCase    = require('../../../../_common/string_util').toTitleCase;
const Url            = require('../../../../_common/url');

const WelcomePage = (() => {
    const onLoad = () => {

        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            if (Client.hasAccountType('real')) {
                Url.defaultRedirectUrl();
            }

            const upgrade_btn       = getElementById('upgrade_btn');
            const upgrade_info      = Client.getUpgradeInfo();
            const show_welcome_msg  = upgrade_info.can_upgrade;

            const setButtonLink = (url, msg) => {
                if (upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize(msg) })).setAttribute('href', Url.urlFor(url));
                    upgrade_btn.classList.remove('button-disabled');
                }
            };

            const welcome_msg = getElementById('welcome_container');

            if (welcome_msg) {
                const upgrade_title_el = getElementById('upgrade_title');
                upgrade_title_el.html(localize(`${toTitleCase(upgrade_info.type)} Account`));
                welcome_msg.setVisibility(1);
            }

            if (show_welcome_msg) {
                setButtonLink(upgrade_info.upgrade_link, 'Upgrade now');
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
