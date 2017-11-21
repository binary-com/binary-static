const Client        = require('../../../base/client');
const localize      = require('../../../base/localize').localize;
const createElement = require('../../../base/utility').createElement;
const Url           = require('../../../base/url');
const State         = require('../../../base/storage').State;
const BinarySocket  = require('../../../websocket_pages/socket');

const WelcomePage = (() => {
    const onLoad = () => {

        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            if (Client.hasAccountType('real')) {
                Url.defaultRedirectUrl();
            }

            const landing_company   = State.getResponse('landing_company');
            const account_type      = Client.getAccountType();
            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const crypto_icon       = document.getElementById('crypto_icons');
            const upgrade_btn       = document.getElementById('upgrade_btn');
            const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_welcome_msg  = upgrade_info.can_upgrade;

            if(/^virtual|^real/.test(account_type)) {
                if(crypto_icon) {
                    crypto_icon.setVisibility(1);
                }
            }

            const setButtonLink = (url, msg) => {
                if(upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize(msg) })).setAttribute('href', Url.urlFor(url));
                    upgrade_btn.classList.remove('button-disabled');
                }
            };

            const welcome_msg = document.getElementById('welcome_container');
            if(welcome_msg) {
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
