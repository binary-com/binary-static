const Client              = require('../../../base/client');
const localize            = require('../../../base/localize').localize;
const createElement       = require('../../../base/utility').createElement;
const applyToAllElements  = require('../../../base/utility').applyToAllElements;
const Url                 = require('../../../base/url');
const jpClient            = require('../../../common_functions/country_base').jpClient;
const toTitleCase         = require('../../../common_functions/string_util').toTitleCase;
const State               = require('../../../base/storage').State;

const WelcomePage = (() => {

    const onLoad = () => {
        checkIsVirtual();
    };

    const landing_company = State.getResponse('landing_company');
    const upgrade_msg     = document.getElementsByClassName('upgrademessage');

    const showUpgrade = (url, msg) => {
        applyToAllElements(upgrade_msg, (el) => {
            el.setVisibility(1);
            applyToAllElements('a', (ele) => {
                ele.html(createElement('span', { text: localize(msg) })).setVisibility(1).setAttribute('href', Url.urlFor(url));
            }, '', el);
        });
    };

    const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
    const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
    const show_upgrade_msg  = upgrade_info.can_upgrade;
    const virtual_text      = document.getElementById('virtual-text');

    const checkIsVirtual = () => {
        if (Client.get('is_virtual')) {
            applyToAllElements(upgrade_msg, (el) => {
                el.setVisibility(1);
                const span = el.getElementsByTagName('span')[0];
                if (span) {
                    span.setVisibility(1);
                }
                applyToAllElements('a', (ele) => { ele.setVisibility(0); }, '', el);
            });

            if (jp_account_status) {
                const has_disabled_jp = jpClient() && Client.getAccountOfType('real').is_disabled;
                if (/jp_knowledge_test_(pending|fail)/.test(jp_account_status)) { // do not show upgrade for user that filled up form
                    showUpgrade('/new_account/knowledge_testws', '{JAPAN ONLY}Take knowledge test');
                } else if (show_upgrade_msg || (has_disabled_jp && jp_account_status !== 'disabled')) {
                    applyToAllElements(upgrade_msg, (el) => { el.setVisibility(1); });
                    if (!virtual_text) {
                        return;
                    }
                    if (jp_account_status === 'jp_activation_pending' && !document.getElementsByClassName('activation-message')) {
                        virtual_text.appendChild(createElement('div', { class: 'activation-message', text: ` ${localize('Your Application is Being Processed.')}` }));
                    } else if (jp_account_status === 'activated' && !document.getElementsByClassName('activated-message')) {
                        virtual_text.appendChild(createElement('div', { class: 'activated-message', text: ` ${localize('{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.')}` }));
                    }
                }
            } else if (show_upgrade_msg) {
                showUpgrade(upgrade_info.upgrade_link, `Open a ${toTitleCase(upgrade_info.type)} Account`);
            } else {
                applyToAllElements(upgrade_msg, (el) => {
                    applyToAllElements('a', (ele) => {
                        ele.setVisibility(0).innerHTML = '';
                    }, '', el);
                });
            }
        } else if (show_upgrade_msg) {
            if (virtual_text.parentNode) {
                virtual_text.parentNode.setVisibility(0);
            }
            showUpgrade(upgrade_info.upgrade_link, 'Open a Financial Account');
        } else {
            applyToAllElements(upgrade_msg, (el) => { el.setVisibility(0); });
        }
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
