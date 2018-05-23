const BinarySocket       = require('./socket');
const RealityCheckData   = require('../pages/user/reality_check/reality_check.data');
const ClientBase         = require('../../_common/base/client_base');
const SocketCache        = require('../../_common/base/socket_cache');
const getElementById     = require('../../_common/common_functions').getElementById;
const urlLang            = require('../../_common/language').urlLang;
const removeCookies      = require('../../_common/storage').removeCookies;
const State              = require('../../_common/storage').State;
const urlFor             = require('../../_common/url').urlFor;
const applyToAllElements = require('../../_common/utility').applyToAllElements;
const getPropertyValue   = require('../../_common/utility').getPropertyValue;

const Client = (() => {
    const processNewAccount = (options) => {
        if (ClientBase.setNewAccount(options)) {
            window.location.href = options.redirect_url || defaultRedirectUrl(); // need to redirect not using pjax
        }
    };

    const shouldShowJP = (el) => (
        isJPClient() ? (!/ja-hide/.test(el.classList) || /ja-show/.test(el.classList)) : !/ja-show/.test(el.classList)
    );

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
                    if (shouldShowJP(el)) {
                        el.setVisibility(1);
                    }
                });

                if (ClientBase.get('is_virtual')) {
                    applyToAllElements('.client_virtual', (el) => { el.setVisibility(1); }, '', el_section);
                    topbar_class.add(secondary_bg_color);
                    topbar_class.remove(primary_bg_color_dark);
                } else {
                    applyToAllElements('.client_real', (el) => {
                        if (shouldShowJP(el)) {
                            el.setVisibility(1);
                        }
                    }, '', el_section);
                    topbar_class.add(primary_bg_color_dark);
                    topbar_class.remove(secondary_bg_color);
                }
            });
        } else {
            applyToAllElements('.client_logged_out', (el) => {
                if (shouldShowJP(el)) {
                    el.setVisibility(1);
                }
            }, '', el_section);
            topbar_class.add(primary_bg_color_dark);
            topbar_class.remove(secondary_bg_color);
        }
    };

    const sendLogoutRequest = (show_login_page) => {
        if (show_login_page) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1' });
    };

    const doLogout = (response) => {
        if (response.logout !== 1) return;
        removeCookies('login', 'loginid', 'loginid_list', 'email', 'residence', 'settings'); // backward compatibility
        removeCookies('reality_check', 'affiliate_token', 'affiliate_tracking');
        ClientBase.clearAllAccounts();
        ClientBase.set('loginid', '');
        SocketCache.clear();
        RealityCheckData.clear();
        const redirect_to = getPropertyValue(response, ['echo_req', 'passthrough', 'redirect_to']);
        if (redirect_to) {
            window.location.href = redirect_to;
        } else {
            window.location.reload();
        }
    };

    const getUpgradeInfo = () => {
        const upgrade_info = ClientBase.getBasicUpgradeInfo();

        let upgrade_link;
        if (upgrade_info.can_upgrade_to) {
            const upgrade_link_map = {
                realws       : ['costarica', 'iom', 'malta'],
                maltainvestws: ['maltainvest'],
                japanws      : ['japan'],
            };
            upgrade_link = Object.keys(upgrade_link_map).find(link =>
                upgrade_link_map[link].indexOf(upgrade_info.can_upgrade_to) !== -1
            );
        }

        return Object.assign(upgrade_info, {
            upgrade_link   : upgrade_link ? `new_account/${upgrade_link}` : undefined,
            is_current_path: upgrade_link ? new RegExp(upgrade_link, 'i').test(window.location.pathname) : undefined,
        });
    };

    const defaultRedirectUrl = () => urlFor(isJPClient() ? 'multi_barriers_trading' : 'trading');

    const setJPFlag = () => {
        const is_jp_client = urlLang() === 'ja' || ClientBase.get('residence') === 'jp';
        State.set('is_jp_client', is_jp_client); // accessible by files that cannot call Client
    };

    const isJPClient = () => State.get('is_jp_client');

    return Object.assign({
        processNewAccount,
        activateByClientType,
        sendLogoutRequest,
        doLogout,
        getUpgradeInfo,
        defaultRedirectUrl,
        setJPFlag,
        isJPClient,
    }, ClientBase);
})();

module.exports = Client;
