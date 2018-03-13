const BinaryPjax          = require('./binary_pjax');
const Client              = require('./client');
const GTM                 = require('./gtm');
const Login               = require('./login');
const BinarySocket        = require('./socket');
const SocketCache         = require('./socket_cache');
const checkClientsCountry = require('../common/country_base').checkClientsCountry;
const jpClient            = require('../common/country_base').jpClient;
const MetaTrader          = require('../pages/user/metatrader/metatrader');
const elementInnerHtml    = require('../../_common/common_functions').elementInnerHtml;
const elementTextContent  = require('../../_common/common_functions').elementTextContent;
const getElementById      = require('../../_common/common_functions').getElementById;
const localize            = require('../../_common/localize').localize;
const State               = require('../../_common/storage').State;
const toTitleCase         = require('../../_common/string_util').toTitleCase;
const Url                 = require('../../_common/url');
const applyToAllElements  = require('../../_common/utility').applyToAllElements;
const createElement       = require('../../_common/utility').createElement;
const findParent          = require('../../_common/utility').findParent;

const Header = (() => {
    const onLoad = () => {
        showOrHideLoginForm();
        bindClick();
        if (!Login.isLoginPages()) {
            checkClientsCountry();
        }
        if (Client.isLoggedIn()) {
            getElementById('menu-top').classList.add('smaller-font', 'top-nav-menu');
            displayAccountStatus();
            if (!Client.get('is_virtual')) {
                BinarySocket.wait('website_status', 'authorize', 'balance').then(() => {
                    if (Client.canTransferFunds()) {
                        getElementById('user_menu_account_transfer').setVisibility(1);
                    }
                });
            }
        }
    };

    const bindClick = () => {
        const logo = getElementById('logo');
        logo.removeEventListener('click', logoOnClick);
        logo.addEventListener('click', logoOnClick);

        const btn_login = getElementById('btn_login');
        btn_login.removeEventListener('click', loginOnClick);
        btn_login.addEventListener('click', loginOnClick);

        applyToAllElements('a.logout', (el) => {
            el.removeEventListener('click', logoutOnClick);
            el.addEventListener('click', logoutOnClick);
        });
    };

    const logoOnClick = () => {
        const url = Client.isLoggedIn() ? Client.defaultRedirectUrl() : Url.urlFor('');
        BinaryPjax.load(url);
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    const logoutOnClick = () => {
        Client.sendLogoutRequest();
    };

    const showOrHideLoginForm = () => {
        if (!Client.isLoggedIn()) return;
        BinarySocket.wait('authorize').then(() => {
            const loginid_select = document.createElement('div');
            Client.getAllLoginids().forEach((loginid) => {
                if (!Client.get('is_disabled', loginid)) {
                    const account_title  = Client.getAccountTitle(loginid);
                    const is_real        = /real/i.test(account_title);
                    const currency       = Client.get('currency', loginid);
                    const localized_type = localize('[_1] Account', [is_real && currency ? currency : account_title]);
                    if (loginid === Client.get('loginid')) { // default account
                        applyToAllElements('.account-type', (el) => { elementInnerHtml(el, localized_type); });
                        applyToAllElements('.account-id', (el) => { elementInnerHtml(el, loginid); });
                    } else {
                        const link    = createElement('a', { href: `${'javascript:;'}`, 'data-value': loginid });
                        const li_type = createElement('li', { text: localized_type });

                        li_type.appendChild(createElement('div', { text: loginid }));
                        link.appendChild(li_type);
                        loginid_select.appendChild(link).appendChild(createElement('div', { class: 'separator-line-thin-gray' }));
                    }
                }
                applyToAllElements('.login-id-list', (el) => {
                    el.html(loginid_select.innerHTML);
                    applyToAllElements('a', (ele) => {
                        ele.removeEventListener('click', loginIDOnClick);
                        ele.addEventListener('click', loginIDOnClick);
                    }, '', el);
                });
            });
        });
    };

    const loginIDOnClick =  (e) => {
        e.preventDefault();
        const el_loginid = findParent(e.target, 'a');
        if (el_loginid) {
            el_loginid.setAttribute('disabled', 'disabled');
            switchLoginid(el_loginid.getAttribute('data-value'));
        }
    };

    const metatraderMenuItemVisibility = () => {
        BinarySocket.wait('landing_company', 'get_account_status').then(() => {
            if (MetaTrader.isEligible() && !jpClient()) {
                getElementById('user_menu_metatrader').setVisibility(1);
            }
        });
    };

    const switchLoginid = (loginid) => {
        if (!loginid || loginid.length === 0) return;
        const token = Client.get('token', loginid);
        if (!token || token.length === 0) {
            Client.sendLogoutRequest(true);
            return;
        }

        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag();
        Client.set('cashier_confirmed', 0);
        Client.set('accepted_bch', 0);
        Client.set('loginid', loginid);
        SocketCache.clear();
        window.location.reload();
    };

    const upgradeMessageVisibility = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings', 'get_account_status').then(() => {
            const upgrade_msg = document.getElementsByClassName('upgrademessage');

            if (!upgrade_msg) {
                return;
            }

            const showUpgrade = (url, msg) => {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a', (ele) => {
                        ele.html(createElement('span', { text: localize(msg) })).setVisibility(1).setAttribute('href', Url.urlFor(url));
                    }, '', el);
                });
            };

            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const upgrade_info      = Client.getUpgradeInfo();
            const show_upgrade_msg  = upgrade_info.can_upgrade;
            const virtual_text      = getElementById('virtual-text');

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
                getElementById('virtual-wrapper').setVisibility(0);
                showUpgrade(upgrade_info.upgrade_link, `Open a ${toTitleCase(upgrade_info.type)} Account`);
            } else {
                applyToAllElements(upgrade_msg, (el) => { el.setVisibility(0); });
            }
            showHideNewAccount(upgrade_info);
        });
    };

    const showHideNewAccount = (upgrade_info) => {
        if (upgrade_info.can_upgrade || upgrade_info.can_open_multi) {
            changeAccountsText(1, 'Create Account');
        } else {
            changeAccountsText(0, 'Accounts List');
        }
    };

    const changeAccountsText = (add_new_style, text) => {
        const user_accounts = getElementById('user_accounts');
        user_accounts.classList[add_new_style ? 'add' : 'remove']('create_new_account');
        const localized_text = localize(text);
        applyToAllElements('li', (el) => { elementTextContent(el, localized_text); }, '', user_accounts);
    };

    const displayNotification = (message, is_error = false, msg_code = '') => {
        const msg_notification = getElementById('msg_notification');
        if (msg_notification.getAttribute('data-code') === 'STORAGE_NOT_SUPPORTED') return;

        msg_notification.html(message);
        msg_notification.setAttribute('data-message', message);
        msg_notification.setAttribute('data-code', msg_code);

        if (msg_notification.offsetParent) {
            msg_notification.toggleClass('error', is_error);
        } else {
            $(msg_notification).slideDown(500, () => { if (is_error) msg_notification.classList.add('error'); });
        }
    };

    const hideNotification = (msg_code) => {
        const msg_notification = getElementById('msg_notification');
        if (msg_notification.getAttribute('data-code') === 'STORAGE_NOT_SUPPORTED' ||
            msg_code && msg_notification.getAttribute('data-code') !== msg_code) {
            return;
        }

        if (msg_notification.offsetParent) {
            msg_notification.classList.remove('error');
            $(msg_notification).slideUp(500, () => {
                elementInnerHtml(msg_notification, '');
                msg_notification.removeAttribute('data-message data-code');
            });
        }
    };

    const displayAccountStatus = () => {
        BinarySocket.wait('authorize').then(() => {
            let get_account_status,
                status;

            const riskAssessment = () => (
                (get_account_status.risk_classification === 'high' || Client.isAccountOfType('financial')) &&
                /financial_assessment_not_complete/.test(status) && !jpClient()
            );

            const buildMessage = (string, path, hash = '') => localize(string, [`<a href="${Url.urlFor(path)}${hash}">`, '</a>']);

            const messages = {
                authenticate         : () => buildMessage('[_1]Authenticate your account[_2] now to take full advantage of all payment methods available.',                                      'user/authenticate'),
                currency             : () => buildMessage('Please set the [_1]currency[_2] of your account.',                                                                                    'user/set-currency'),
                document_needs_action: () => buildMessage('[_1]Your Proof of Identity or Proof of Address[_2] did not meet our requirements. Please check your email for further instructions.', 'user/authenticate'),
                document_review      : () => buildMessage('We are reviewing your documents. For more details [_1]contact us[_2].',                                                               'contact'),
                excluded_until       : () => buildMessage('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.',                                                 'contact'),
                financial_limit      : () => buildMessage('Please set your [_1]30-day turnover limit[_2] to remove deposit limits.',                                                             'user/security/self_exclusionws'),
                residence            : () => buildMessage('Please set [_1]country of residence[_2] before upgrading to a real-money account.',                                                   'user/settings/detailsws'),
                risk                 : () => buildMessage('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.',                                   'user/settings/assessmentws'),
                tax                  : () => buildMessage('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.',                                            'user/settings/detailsws'),
                tnc                  : () => buildMessage('Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.',                                  'user/tnc_approvalws'),
                unwelcome            : () => buildMessage('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.',                                                 'contact'),
            };

            const validations = {
                authenticate         : () => +get_account_status.prompt_client_to_authenticate,
                currency             : () => !Client.get('currency'),
                document_needs_action: () => /document_needs_action/.test(status),
                document_review      : () => /document_under_review/.test(status),
                excluded_until       : () => Client.get('excluded_until'),
                financial_limit      : () => /ukrts_max_turnover_limit_not_set/.test(status),
                residence            : () => !Client.get('residence'),
                risk                 : () => riskAssessment(),
                tax                  : () => Client.shouldCompleteTax(),
                tnc                  : () => Client.shouldAcceptTnc(),
                unwelcome            : () => /unwelcome|(cashier|withdrawal)_locked/.test(status),
            };

            // real account checks in order
            const check_statuses_real = [
                'excluded_until',
                'tnc',
                'financial_limit',
                'risk',
                'tax',
                'currency',
                'document_review',
                'document_needs_action',
                'authenticate',
                'unwelcome',
            ];

            // virtual checks
            const check_statuses_virtual = [
                'residence',
            ];

            const checkStatus = (check_statuses) => {
                const notified = check_statuses.some((check_type) => {
                    if (validations[check_type]()) {
                        displayNotification(messages[check_type]());
                        return true;
                    }
                    return false;
                });
                if (!notified) hideNotification();
            };

            if (Client.get('is_virtual')) {
                checkStatus(check_statuses_virtual);
            } else {
                BinarySocket.wait('website_status', 'get_account_status', 'get_settings', 'balance').then(() => {
                    get_account_status = State.getResponse('get_account_status') || {};
                    status             = get_account_status.status;
                    checkStatus(check_statuses_real);
                });
            }
        });
    };

    return {
        onLoad,

        showOrHideLoginForm,
        upgradeMessageVisibility,
        metatraderMenuItemVisibility,
        displayNotification,
        hideNotification,
        displayAccountStatus,
    };
})();

module.exports = Header;
