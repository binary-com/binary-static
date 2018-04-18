const BinarySocket   = require('../../../base/socket');
const Client         = require('../../../base/client');
const localize       = require('../../../../_common/localize').localize;
const State          = require('../../../../_common/storage').State;
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

            const landing_company   = State.getResponse('landing_company');
            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const upgrade_btn       = getElementById('upgrade_btn');
            const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_welcome_msg  = upgrade_info.can_upgrade;

            const allowed_currencies = Client.getLandingCompanyValue({ real: 1 }, landing_company, 'legal_allowed_currencies');

            if (allowed_currencies && allowed_currencies.length > 0) {
                for (let i=0; i < allowed_currencies.length; i++) {
                    const el = getElementById(allowed_currencies[i]);
                    if (el) {
                        el.classList.remove('invisible');
                    }
                }
            }

            const setButtonLink = (url, msg) => {
                if (upgrade_btn) {
                    upgrade_btn.html(createElement('span', { text: localize(msg) })).setAttribute('href', Url.urlFor(url));
                    upgrade_btn.classList.remove('button-disabled');
                }
            };

            const welcome_msg = getElementById('welcome_container');

            if (welcome_msg) {
                const upgrade_title_el = getElementById('upgrade_title');
                const upgrade_text_el  = getElementById('upgrade_text');

                upgrade_title_el.html(localize(`${toTitleCase(upgrade_info.type)} Account`));
                upgrade_text_el.html(localize(`Upgrade to a ${upgrade_info.type} money account and start trading using a wide range of currencies.`));
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
