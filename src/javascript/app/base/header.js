const moment                   = require('moment');
const BinaryPjax               = require('./binary_pjax');
const Client                   = require('./client');
const BinarySocket             = require('./socket');
const getCurrencyDisplayCode   = require('../common/currency').getCurrencyDisplayCode;
const isAuthenticationAllowed  = require('../../_common/base/client_base').isAuthenticationAllowed;
const GTM                      = require('../../_common/base/gtm');
const Login                    = require('../../_common/base/login');
const SocketCache              = require('../../_common/base/socket_cache');
const elementInnerHtml         = require('../../_common/common_functions').elementInnerHtml;
const elementTextContent       = require('../../_common/common_functions').elementTextContent;
const getElementById           = require('../../_common/common_functions').getElementById;
const localize                 = require('../../_common/localize').localize;
const localizeKeepPlaceholders = require('../../_common/localize').localizeKeepPlaceholders;
const State                    = require('../../_common/storage').State;
const Url                      = require('../../_common/url');
const applyToAllElements       = require('../../_common/utility').applyToAllElements;
const createElement            = require('../../_common/utility').createElement;
const findParent               = require('../../_common/utility').findParent;
const template                 = require('../../_common/utility').template;
const Currency                 = require('../common/currency');

const Header = (() => {
    const onLoad = () => {
        populateAccountsList();
        bindClick();
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
        if (Client.isLoggedIn()) {
            const url = Client.isAccountOfType('financial') || Client.isOptionsBlocked() ? Url.urlFor('user/metatrader') : Client.defaultRedirectUrl();
            BinaryPjax.load(url);
        } else {
            BinaryPjax.load(Url.urlFor(''));
        }
    };

    const loginOnClick = (e) => {
        e.preventDefault();
        Login.redirectToLogin();
    };

    const logoutOnClick = () => {
        Client.sendLogoutRequest();
    };

    const populateAccountsList = () => {
        if (!Client.isLoggedIn()) return;
        BinarySocket.wait('authorize').then(() => {
            const loginid_select = document.createElement('div');
            Client.getAllLoginids().forEach((loginid) => {
                if (!Client.get('is_disabled', loginid) && Client.get('token', loginid)) {
                    const account_title  = Client.getAccountTitle(loginid);
                    const is_real        = !Client.getAccountType(loginid); // this function only returns virtual/gaming/financial types
                    const currency       = Client.get('currency', loginid);
                    const localized_type = localize('[_1] Account', is_real && currency ? getCurrencyDisplayCode(currency) : account_title);
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

    const switchLoginid = (loginid, redirect_to) => {
        if (!loginid || loginid.length === 0) return;
        const token = Client.get('token', loginid);
        if (!token || token.length === 0) {
            Client.sendLogoutRequest(true);
            return;
        }

        sessionStorage.setItem('active_tab', '1');
        // set local storage
        GTM.setLoginFlag('account_switch');
        Client.set('loginid', loginid);
        SocketCache.clear();

        if (redirect_to === 'deposit') {
            window.location.href = `${Url.urlFor('cashier/forwardws')}?action=deposit`;
        } else if (redirect_to === 'withdrawal') {
            window.location.href = `${Url.urlFor('cashier/forwardws')}?action=withdraw`;
        } else if (redirect_to === 'payment_agent_deposit') {
            window.location.href = Url.urlFor('/cashier/payment_agent_listws');
        } else if (redirect_to === 'payment_agent_withdrawal') {
            window.location.href = Url.urlFor('/paymentagent/withdrawws');
        } else {
            window.location.reload();
        }
    };

    const upgradeMessageVisibility = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings', 'get_account_status').then(() => {
            const upgrade_msg = document.getElementsByClassName('upgrademessage');

            if (!upgrade_msg) {
                return;
            }

            const showUpgrade = (url, params, localized_text) => {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a', (ele) => {
                        ele.html(createElement('span', { text: localized_text })).setVisibility(1).setAttribute('href', Url.urlFor(url, params));
                    }, '', el);
                });
            };

            const showUpgradeBtn = (url, params, localized_text) => {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    applyToAllElements('a.button', (ele) => {
                        ele.html(createElement('span', { text: localized_text })).setVisibility(1).setAttribute('href', Url.urlFor(url, params));
                    }, '', el);
                });
            };

            const upgrade_info     = Client.getUpgradeInfo();
            const show_upgrade_msg = upgrade_info.can_upgrade;
            let upgrade_link_txt = '';
            let upgrade_btn_txt = '';

            if (upgrade_info.can_upgrade_to.length > 1) {
                upgrade_link_txt = localize('Click here to open a Real Account');
                upgrade_btn_txt = localize('Open a Real Account');
            } else if (upgrade_info.can_upgrade_to.length === 1) {
                upgrade_link_txt = upgrade_info.type[0] === 'financial'
                    ? localize('Click here to open a Multipliers Account')
                    : upgrade_info.can_upgrade_to[0] === 'malta' ?
                        localize('Click here to open an Options account') :
                        localize('Click here to open a Real Account');
                upgrade_btn_txt = upgrade_info.type[0] === 'financial'
                    ? localize('Open a Multipliers Account')
                    : localize('Open a Real Account');
            }

            if (Client.get('is_virtual')) {
                applyToAllElements(upgrade_msg, (el) => {
                    el.setVisibility(1);
                    const span = el.getElementsByTagName('span')[0];
                    if (span) {
                        span.setVisibility(1);
                    }
                    applyToAllElements('a', (ele) => { ele.setVisibility(0); }, '', el);
                });

                if (show_upgrade_msg) {
                    const upgrade_url = upgrade_info.can_upgrade_to.length > 1
                        ? 'user/accounts'
                        : 'new_account/real_account';
                    showUpgrade(upgrade_url, `account_type=${upgrade_info.can_upgrade_to[0]}`, upgrade_link_txt);
                    showUpgradeBtn(upgrade_url, `account_type=${upgrade_info.can_upgrade_to[0]}`, upgrade_btn_txt);
                } else {
                    applyToAllElements(upgrade_msg, (el) => {
                        applyToAllElements('a', (ele) => {
                            ele.setVisibility(0).innerHTML = '';
                        }, '', el);
                    });
                }
                if (/accounts/.test(window.location.href)) {
                    showHidePulser(0);
                }
            } else if (show_upgrade_msg) {
                getElementById('virtual-wrapper').setVisibility(0);
                const upgrade_url = upgrade_info.can_upgrade_to.length > 1
                    ? 'user/accounts'
                    : 'new_account/real_account';
                showUpgrade(upgrade_url, `account_type=${upgrade_info.can_upgrade_to[0]}`, upgrade_link_txt);
                showUpgradeBtn(upgrade_url, `account_type=${upgrade_info.can_upgrade_to[0]}`, upgrade_btn_txt);

                if (/new_account/.test(window.location.href)) {
                    showHidePulser(0);
                }
            } else {
                applyToAllElements(upgrade_msg, (el) => { el.setVisibility(0); });
            }
            showHideNewAccount(upgrade_info);
        });
    };

    const showHidePulser = (should_show) => { $('.upgrademessage').children('a').setVisibility(should_show); };

    const showHideNewAccount = (upgrade_info) => {
        if (upgrade_info.can_upgrade || upgrade_info.can_open_multi) {
            changeAccountsText(1, localize('Create Account'));
        } else {
            changeAccountsText(0, localize('Accounts List'));
        }
    };

    const changeAccountsText = (add_new_style, localized_text) => {
        const user_accounts = getElementById('user_accounts');
        user_accounts.classList[add_new_style ? 'add' : 'remove']('create_new_account');
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
        if (/^(STORAGE_NOT_SUPPORTED|MFSA_MESSAGE)$/.test(msg_notification.getAttribute('data-code')) ||
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
        BinarySocket.wait('get_account_status', 'authorize', 'landing_company').then(() => {
            let authentication,
                get_account_status,
                is_fully_authenticated,
                status;
            const is_svg          = Client.get('landing_company_shortcode') === 'svg';
            const buildMessage = (string, path, hash = '') => template(string, [`<a href="${Url.urlFor(path)}${hash}">`, '</a>']);
            const buildMessageHref = (string, href) => template(string, [`<a href="${href}">`, '</a>']);
            const buildSpecificMessage = (string, additional) => template(string, [...additional]);
            const hasStatus = (string) => status && status.findIndex(s => s === string) !== -1
                ? Boolean(true) : Boolean(false);
            const hasVerification = (string) => {
                const { prompt_client_to_authenticate } = get_account_status;
                const { identity, document, needs_verification } = authentication;
                if (!identity || !document || !needs_verification || !isAuthenticationAllowed()) {
                    return false;
                }
                const verification_length = needs_verification.length;
                let result = false;

                switch (string) {
                    case 'unsubmitted': {
                        result = verification_length === 2 && identity.status === 'none' && document.status === 'none';
                        break;
                    }
                    case 'expired': {
                        result = verification_length === 2 && (identity.status === 'expired' && document.status === 'expired');
                        break;
                    }
                    case 'expired_identity': {
                        result = verification_length && identity.status === 'expired';
                        break;
                    }
                    case 'expired_document': {
                        result = verification_length && document.status === 'expired';
                        break;
                    }
                    case 'rejected': {
                        result = verification_length === 2 && (identity.status !== 'none' || document.status !== 'none') && prompt_client_to_authenticate;
                        break;
                    }
                    case 'rejected_identity': {
                        result = verification_length && (identity.status === 'rejected' || identity.status === 'suspected');
                        break;
                    }
                    case 'rejected_document': {
                        result = verification_length && (document.status === 'rejected' || document.status === 'suspected');
                        break;
                    }
                    case 'needs_identity_verification': {
                        result = verification_length === 1 && needs_verification.includes('identity');
                        break;
                    }
                    case 'identity': {
                        result = verification_length && identity.status === 'none';
                        break;
                    }
                    case 'document': {
                        result = verification_length && document.status === 'none';
                        break;
                    }
                    default:
                        break;
                }

                return result;
            };

            const has_no_tnc_limit = is_svg;
            const is_crypto = Currency.isCryptocurrency(Client.get('currency'));
            const getSystemMaintenanceMessage = () => {
                if (is_crypto) {
                    if (hasStatus('deposit_locked')) {
                        return localize('Deposits are temporarily unavailable due to system maintenance. You can make your deposits when the maintenance is complete.');
                    } else if (hasStatus('withdrawal_locked')) {
                        return localize('Withdrawals are temporarily unavailable due to system maintenance. You can make your withdrawals when the maintenance is complete.');
                    }
                    return localize('Our cryptocurrency cashier is temporarily down due to system maintenance. You can access the Cashier in a few minutes when the maintenance is complete.');
                    
                }
                return localize('Our cashier is temporarily down due to system maintenance.You can access the Cashier in a few minutes when the maintenance is complete.');
                
            };

            const messages = {
                cashier_locked    : () => localize('Your cashier is currently locked. Please contact us via live chat to find out how to unlock it.'),
                system_maintenance: () => getSystemMaintenanceMessage(),
                currency          : () => buildMessage(localizeKeepPlaceholders('Please set your [_1]account currency[_2] to enable deposits and withdrawals.'),                                                                                    'user/set-currency'),
                unsubmitted       : () => buildMessage(get_account_status.risk_classification === 'high'
                    ? localizeKeepPlaceholders('Your account has not been authenticated. Please submit your [_1]proof of identity and proof of address[_2] to authenticate your account and request for withdrawals.', 'user/authenticate')
                    : localizeKeepPlaceholders('Your account has not been authenticated. Please submit your [_1]proof of identity and proof of address[_2] to authenticate your account and access your cashier.'), 'user/authenticate'),
                expired                   : () => localize('The identification documents you submitted have expired. Please submit valid identity documents to unlock Cashier.'),
                expired_identity          : () => buildMessage(localizeKeepPlaceholders('Your [_1]proof of identity[_2] has expired.'),                                                                                         'user/authenticate'),
                expired_document          : () => buildMessage(localizeKeepPlaceholders('Your [_1]proof of address[_2] has expired.'),                                                                                          'user/authenticate', '?authentication_tab=poa'),
                rejected                  : () => buildSpecificMessage(localizeKeepPlaceholders('Your [_1]proof of identity[_3] and [_2]proof of address[_3] have not been verified.'),    [`<a href='${Url.urlFor('user/authenticate')}'>`, `<a href='${Url.urlFor('user/authenticate')}?authentication_tab=poa'>`, '</a>']),
                rejected_identity         : () => buildMessage(localizeKeepPlaceholders('Your [_1]proof of identity[_2] has not been verified.'),                                                                               'user/authenticate'),
                rejected_document         : () => buildMessage(localizeKeepPlaceholders('Your [_1]proof of address[_2] has not been verified.'),                                                                                'user/authenticate', '?authentication_tab=poa'),
                identity                  : () => buildMessage(localizeKeepPlaceholders('Please submit your [_1]proof of identity[_2].'),                                                                                       'user/authenticate'),
                document                  : () => buildMessage(localizeKeepPlaceholders('Please submit your [_1]proof of address[_2].'),                                                                                        'user/authenticate', '?authentication_tab=poa'),
                excluded_until            : () => localize('You have chosen to exclude yourself from trading on our website until [_1]. If you are unable to place a trade or deposit after your self-exclusion period, please contact us via live chat.', moment(+Client.get('excluded_until') * 1000).format('DD MMM YYYY')),
                financial_limit           : () => buildMessage(localizeKeepPlaceholders('Your access to Cashier has been temporarily disabled as you have not set your 30-day turnover limit. Please go to [_1]Self-exclusion[_2] and set your 30-day turnover limit.'),                                                             'user/security/self_exclusionws'),
                mt5_withdrawal_locked     : () => localize('MT5 withdrawals have been disabled on your account. Please check your email for more details.'),
                no_withdrawal_or_trading  : () => localize('Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'),
                required_fields           : () => buildMessage(localizeKeepPlaceholders('Your [_1]personal details[_2] are incomplete. Please go to your account settings and complete your personal details to enable deposits and withdrawals.'),                                                                   'user/settings/detailsws'),
                withdrawal_required_fields: () => buildMessage(localizeKeepPlaceholders('Your [_1]personal details[_2] are incomplete. Please go to your account settings and complete your personal details to enable withdrawals.'),                                                                   'user/settings/detailsws'),
                deposit_required_fields   : () => buildMessage(localizeKeepPlaceholders('Your [_1]personal details[_2] are incomplete. Please go to your account settings and complete your personal details to enable deposits.'),                                                                   'user/settings/detailsws'),
                residence                 : () => buildMessage(localizeKeepPlaceholders('You’ve not set your country of residence. To access Cashier, please update your [_1]country of residence[_2] in the Personal details section in your account settings.'),                                                   'user/settings/detailsws'),
                risk                      : () => buildMessage(localizeKeepPlaceholders('Your cashier is locked. Please complete the [_1]financial assessment[_2] to unlock it.'),                                   'user/settings/assessmentws'),
                tax                       : () => buildMessage(localize('You have not provided your tax identification number. This information is necessary for legal and regulatory requirements. Please go to [_1]Personal details[_2] in your account settings, and fill in your latest tax identification number.'), 'user/settings/detailsws'),
                unwelcome                 : () => localize('Unfortunately, you can only make withdrawals. Please contact us via live chat.'),
                withdrawal_locked_review  : () => localize('Withdrawals have been disabled on your account. Please wait until your uploaded documents are verified.'),
                withdrawal_locked         : () => localize('Unfortunately, you can only make deposits. Please contact us via live chat to enable withdrawals.'),
                tnc                       : () => buildMessage(has_no_tnc_limit
                    ? localizeKeepPlaceholders('Please [_1]accept the updated Terms and Conditions[_2].')
                    : localizeKeepPlaceholders('Please [_1]accept the updated Terms and Conditions[_2] to lift your deposit and trading limits.'), 'user/tnc_approvalws'),
                disabled                   : () => localize('Your account is temporarily disabled. Please contact us via live chat to enable deposits and withdrawals again.'),
                financial_risk_approval    : () => localize('Please complete the Appropriateness Test to access your cashier.'),
                ask_uk_funds_protection    : () => buildMessageHref(localizeKeepPlaceholders('Your cashier is locked. See [_1]how we protect your funds[_2] before you proceed.'), `${Url.urlFor('cashier/forwardws')}?action=deposit`),
                needs_identity_verification: () =>buildMessage(localizeKeepPlaceholders('Your account needs authentication. Please submit your [_1]proof of identity[_2] to access Cashier.'), 'user/authenticate'),
            };

            const validations = {
                cashier_locked             : () => hasStatus('cashier_locked_status'),
                system_maintenance         : () => hasStatus('system_maintenance'),
                currency                   : () => hasStatus('ASK_CURRENCY'),
                unsubmitted                : () => hasStatus('ASK_AUTHENTICATE') && hasVerification('unsubmitted'),
                expired                    : () => hasStatus('documents_expired'),
                expired_identity           : () => hasVerification('expired_identity'),
                expired_document           : () => hasVerification('expired_document'),
                rejected                   : () => hasVerification('rejected'),
                rejected_identity          : () => hasVerification('rejected_identity'),
                rejected_document          : () => hasVerification('rejected_document'),
                identity                   : () => hasVerification('identity'),
                document                   : () => hasVerification('document'),
                excluded_until             : () => hasStatus('SelfExclusion'),
                financial_limit            : () => hasStatus('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET'),
                mt5_withdrawal_locked      : () => hasStatus('mt5_withdrawal_locked'),
                no_withdrawal_or_trading   : () => hasStatus('no_withdrawal_or_trading_status'),
                required_fields            : () => hasStatus('cashier_locked') && hasStatus('ASK_FIX_DETAILS'),
                withdrawal_required_fields : () => hasStatus('withdrawal_locked') && hasStatus('ASK_FIX_DETAILS'),
                deposit_required_fields    : () => hasStatus('deposit_locked') && hasStatus('ASK_FIX_DETAILS'),
                residence                  : () => hasStatus('no_residence'),
                risk                       : () => hasStatus('FinancialAssessmentRequired'),
                tax                        : () => hasStatus('ASK_TIN_INFORMATION'),
                tnc                        : () => Client.shouldAcceptTnc(),
                unwelcome                  : () => hasStatus('unwelcome_status'),
                withdrawal_locked_review   : () => hasStatus('withdrawal_locked') && get_account_status.risk_classification === 'high' && !is_fully_authenticated && authentication.document.status === 'pending',
                withdrawal_locked          : () => hasStatus('withdrawal_locked') || hasStatus('withdrawal_locked_status'),
                disabled                   : () => hasStatus('disabled_status'),
                financial_risk_approval    : () => hasStatus('ASK_FINANCIAL_RISK_APPROVAL'),
                ask_uk_funds_protection    : () => hasStatus('ASK_UK_FUNDS_PROTECTION'),
                needs_identity_verification: () => hasVerification('needs_identity_verification'),
            };

            // real account checks in order
            const check_statuses_real = [
                'currency',
                'excluded_until',
                'tnc',
                'required_fields',
                'withdrawal_required_fields',
                'deposit_required_fields',
                'financial_limit',
                'ask_uk_funds_protection',
                'risk',
                'tax',
                'unsubmitted',
                'expired',
                'expired_identity',
                'expired_document',
                'rejected',
                'rejected_identity',
                'rejected_document',
                'needs_identity_verification',
                'identity',
                'document',
                'financial_risk_approval',
                'unwelcome',
                'no_withdrawal_or_trading',
                'system_maintenance',
                'cashier_locked',
                'withdrawal_locked_review',
                'withdrawal_locked',
                'mt5_withdrawal_locked',
                'disabled',
            ];

            // virtual checks
            const check_statuses_virtual = [
                'residence',
            ];

            const checkStatus = (check_statuses) => {
                const notified = check_statuses.some((check_type) => {
                    if (validations[check_type]()) {
                        displayNotification(messages[check_type](), false);
                        return true;
                    }
                    return false;
                });
                if (!notified) hideNotification();
            };

            if (Client.get('is_virtual')) {
                checkStatus(check_statuses_virtual);
            } else {
                const el_account_status = createElement('span', { class: 'authenticated', 'data-balloon': localize('Account Authenticated'), 'data-balloon-pos': 'down' });
                BinarySocket.wait('website_status', 'get_account_status', 'get_settings', 'balance').then(() => {
                    /* eslint-disable max-len */
                    authentication               = State.getResponse('get_account_status.authentication') || {};
                    get_account_status           = State.getResponse('get_account_status') || {};
                    const has_cashier_validation = !!get_account_status.cashier_validation;
                    const cashier_validation     = has_cashier_validation ? [...get_account_status.cashier_validation] : [];
                    status                       = [...cashier_validation , ...get_account_status.status];
                    checkStatus(check_statuses_real);
                    is_fully_authenticated       = hasStatus('authenticated') && !+get_account_status.prompt_client_to_authenticate;
                    $('.account-id')[is_fully_authenticated ? 'append' : 'remove'](el_account_status);
                });
            }
        });
    };

    return {
        onLoad,
        populateAccountsList,
        upgradeMessageVisibility,
        displayNotification,
        hideNotification,
        displayAccountStatus,
        loginOnClick,
        switchLoginid,
        loginIDOnClick,
    };
})();

module.exports = Header;
