const BinarySocket       = require('./socket');
const Defaults           = require('../pages/trade/defaults');
const RealityCheckData   = require('../pages/user/reality_check/reality_check.data');
const ClientBase         = require('../../_common/base/client_base');
const GTM                = require('../../_common/base/gtm');
const SocketCache        = require('../../_common/base/socket_cache');
const LiveChat            = require('../../_common/base/livechat');
const getElementById     = require('../../_common/common_functions').getElementById;
const removeCookies      = require('../../_common/storage').removeCookies;
const urlFor             = require('../../_common/url').urlFor;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;

const Client = (() => {
    
    const processNewAccount = (options) => {
        if (ClientBase.setNewAccount(options)) {
            setTimeout(() => { window.location.replace(options.redirect_url || defaultRedirectUrl()); }, 500); // need to redirect not using pjax
        }
    };

    const activateByClientType = (section_id) => {
        const topbar_class = getElementById('topbar').classList;
        const el_section   = section_id ? getElementById(section_id) : document.body;

        const primary_bg_color_dark = 'primary-bg-color-dark';
        const secondary_bg_color    = 'secondary-bg-color';

        if (ClientBase.isLoggedIn()) {
            BinarySocket.wait('authorize', 'website_status', 'get_account_status').then(() => {
                const client_logged_in = getElementById('client-logged-in');
                client_logged_in.classList.add('gr-centered');

                applyToAllElements('.client_logged_in', (el) => {
                    el.setVisibility(1);
                });

                if (ClientBase.get('is_virtual')) {
                    applyToAllElements('.client_virtual', (el) => { el.setVisibility(1); }, '', el_section);
                    topbar_class.add(secondary_bg_color);
                    topbar_class.remove(primary_bg_color_dark);
                } else {
                    applyToAllElements('.client_real', (el) => {
                        el.setVisibility(1);
                    }, '', el_section);
                    topbar_class.add(primary_bg_color_dark);
                    topbar_class.remove(secondary_bg_color);
                }
            });
        } else {
            applyToAllElements('.client_logged_in', (el) => {
                el.setVisibility(0);
            }, '', el_section);
            applyToAllElements('#client-logged-in', (el) => {
                el.setVisibility(0);
            }, '', el_section);
            getElementById('topbar-msg').setVisibility(0);
            getElementById('menu-top').classList.remove('smaller-font', 'top-nav-menu');

            applyToAllElements('.client_logged_out', (el) => {
                el.setVisibility(1);
            }, '', el_section);
            topbar_class.add(primary_bg_color_dark);
            topbar_class.remove(secondary_bg_color);
        }
    };

    const sendLogoutRequest = (show_login_page, redirect_to) => {
        if (show_login_page) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1', passthrough: { redirect_to } }).then((response) => {
            if (response.logout === 1) {
                GTM.pushDataLayer({ event: 'log_out' });
            }
        });
    };

    const doLogout = (response) => {
        if (response.logout !== 1) return;
        removeCookies('login', 'loginid', 'loginid_list', 'email', 'residence', 'settings'); // backward compatibility
        removeCookies('reality_check', 'affiliate_token', 'affiliate_tracking', 'onfido_token');
        // clear elev.io session storage
        sessionStorage.removeItem('_elevaddon-6app');
        sessionStorage.removeItem('_elevaddon-6create');
        // clear trading session
        Defaults.remove('underlying', 'market');
        ClientBase.clearAllAccounts();
        ClientBase.set('loginid', '');
        SocketCache.clear();
        RealityCheckData.clear();
        LiveChat.endLiveChat().then(() => {
            const redirect_to = getPropertyValue(response, ['echo_req', 'passthrough', 'redirect_to']);
            if (redirect_to) {
                window.location.href = redirect_to;
            } else {
                window.location.reload();
            }
        });
    };

    const getUpgradeInfo = () => {
        const upgrade_info = ClientBase.getBasicUpgradeInfo();

        let upgrade_links = {};
        if (upgrade_info.can_upgrade_to.length) {
            const upgrade_link_map = {
                realws       : ['svg', 'iom', 'malta'],
                maltainvestws: ['maltainvest'],
            };

            Object.keys(upgrade_link_map).forEach(link => {
                const res = upgrade_link_map[link].find(lc => upgrade_info.can_upgrade_to.includes(lc));
                if (res) {
                    upgrade_links = {
                        ...upgrade_links,
                        [res]: link,
                    };
                }
            });
        }

        let transformed_upgrade_links = {};
        Object.keys(upgrade_links).forEach(link => {
            transformed_upgrade_links = {
                ...transformed_upgrade_links,
                [link]: `new_account/${upgrade_links[link]}`,
            };
        });

        return Object.assign(upgrade_info, {
            upgrade_links  : transformed_upgrade_links,
            is_current_path: !!Object.values(upgrade_links)
                .find(link => new RegExp(link, 'i').test(window.location.pathname)),
        });
    };

    const defaultRedirectUrl = () => urlFor('trading');

    return Object.assign({
        processNewAccount,
        activateByClientType,
        sendLogoutRequest,
        doLogout,
        getUpgradeInfo,
        defaultRedirectUrl,
    }, ClientBase);
})();

module.exports = Client;
