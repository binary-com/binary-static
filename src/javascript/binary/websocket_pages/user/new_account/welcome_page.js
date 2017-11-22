const Client             = require('../../../base/client');
const localize           = require('../../../base/localize').localize;
const createElement      = require('../../../base/utility').createElement;
const Url                = require('../../../base/url');
const State              = require('../../../base/storage').State;
const BinarySocket       = require('../../../websocket_pages/socket');

const WelcomePage = (() => {
    const onLoad = () => {

        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            if (Client.hasAccountType('real')) {
                Url.defaultRedirectUrl();
            }

            const landing_company   = State.getResponse('landing_company');
            const account_type      = Client.getAccountType();
            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const upgrade_btn       = document.getElementById('upgrade_btn');
            const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_welcome_msg  = upgrade_info.can_upgrade;

            if (/^virtual/.test(account_type)) {

                const arr_landing_company = Object.keys(landing_company).map(key => landing_company[key]);
                const allowed_currency = arr_landing_company[0].legal_allowed_currencies;

                if (allowed_currency && allowed_currency.length > 0) {
                    for (let i=0; i < allowed_currency.length; i++) {
                        const el = document.getElementById(allowed_currency[i]);
                        if (el) {
                            el.classList.remove('invisible');
                        }
                    }
                }
            }

            const setButtonLink = (url, msg) => {
                if (upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize(msg) })).setAttribute('href', Url.urlFor(url));
                    upgrade_btn.classList.remove('button-disabled');
                }
            };

            const welcome_msg = document.getElementById('welcome_container');
            if (welcome_msg) {
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
