const Client              = require('../../../base/client');
const localize            = require('../../../base/localize').localize;
const createElement       = require('../../../base/utility').createElement;
const Url                 = require('../../../base/url');
const State               = require('../../../base/storage').State;
const BinarySocket        = require('../../../websocket_pages/socket');

const WelcomePage = (() => {
    const onLoad = () => {

        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            const landing_company   = State.getResponse('landing_company');
            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const upgrade_btn       = document.getElementById('upgrade_btn');
            const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_welcome_msg  = upgrade_info.can_upgrade;

            const setButtonLink = (url, msg) => {
                if(upgrade_btn) upgrade_btn.html(createElement('span', { text: localize(msg) })).setAttribute('href', Url.urlFor(url)); ;
            };

            const welcome_msg = document.getElementById('welcome_container');
            welcome_msg.setVisibility(1);

            if (show_welcome_msg) {
                setButtonLink(upgrade_info.upgrade_link, 'Upgrade now');
            } else {
                upgrade_btn.setVisibility(0);
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
