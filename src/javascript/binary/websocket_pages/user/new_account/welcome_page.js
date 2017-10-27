const Client              = require('../../../base/client');
const localize            = require('../../../base/localize').localize;
const createElement       = require('../../../base/utility').createElement;
const applyToAllElements  = require('../../../base/utility').applyToAllElements;
const Url                 = require('../../../base/url');
const State               = require('../../../base/storage').State;
const BinarySocket        = require('../../../websocket_pages/socket');

const WelcomePage = (() => {
    const onLoad = () => {

        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            const landing_company = State.getResponse('landing_company');
            const welcome_msg     = document.getElementsByClassName('show_welcome');
            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            
            const upgrade_info      = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_welcome_msg  = upgrade_info.can_upgrade;

            const showButton = (url, msg) => {
                applyToAllElements(welcome_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a.virtual-btn', (ele) => {
                        ele.html(createElement('span', { text: localize(msg) })).setVisibility(1).setAttribute('href', Url.urlFor(url));
                    }, '', el);
                });
            };

            if (Client.get('is_virtual')) {
                applyToAllElements(welcome_msg, (el) => {
                    el.setVisibility(1);
                });

                if (jp_account_status) {
                    if (/jp_knowledge_test_(pending|fail)/.test(jp_account_status)) { // do not show upgrade for user that filled up form
                        showButton('/new_account/knowledge_testws', 'Upgrade now');
                    }
                } else if (show_welcome_msg) {
                    showButton(upgrade_info.upgrade_link, 'Upgrade now');
                } else {
                    applyToAllElements(welcome_msg, (el) => {
                        applyToAllElements('a', (ele) => {
                            ele.setVisibility(0).innerHTML = '';
                        }, '', el);
                    });
                }
            } else if (show_welcome_msg) {
                showButton(upgrade_info.upgrade_link, 'Upgrade now');
            } else {
                applyToAllElements(welcome_msg, (el) => { el.setVisibility(0); });
            }
        });
    };

    return {
        onLoad,
    };
})();

module.exports = WelcomePage;
