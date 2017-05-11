const BinaryPjax          = require('./binary_pjax');
const Client              = require('./client');
const GTM                 = require('./gtm');
const localize            = require('./localize').localize;
const Login               = require('./login');
const State               = require('./storage').State;
const urlFor              = require('./url').urlFor;
const isEmptyObject       = require('./utility').isEmptyObject;
const checkClientsCountry = require('../common_functions/country_base').checkClientsCountry;
const jpClient            = require('../common_functions/country_base').jpClient;
const BinarySocket        = require('../websocket_pages/socket');
const MetaTrader          = require('../websocket_pages/user/metatrader/metatrader');

const Header = (() => {
    'use strict';

    const onLoad = () => {
        showOrHideLoginForm();
        bindClick();
        if (!Login.isLoginPages()) {
            checkClientsCountry();
        }
        if (Client.isLoggedIn()) {
            $('ul#menu-top').addClass('smaller-font');
            displayAccountStatus();
        }
    };

    const bindClick = () => {
        $('#logo').off('click').on('click', () => {
            BinaryPjax.load(urlFor(Client.isLoggedIn() ? (jpClient() ? 'multi_barriers_trading' : 'trading') : ''));
        });
        $('#btn_login').off('click').on('click', (e) => {
            e.preventDefault();
            Login.redirectToLogin();
        });
        $('a.logout').off('click').on('click', () => {
            Client.sendLogoutRequest();
        });
    };

    const showOrHideLoginForm = () => {
        if (!Client.isLoggedIn()) return;
        const loginid_select = $('<div/>');
        const loginid_array = Client.get('loginid_array');
        loginid_array.forEach((client) => {
            if (!client.disabled) {
                let type = 'Virtual';
                if (client.real) {
                    if (client.financial)          type = 'Investment';
                    else if (client.non_financial) type = 'Gaming';
                    else                           type = 'Real';
                }
                type += ' Account';

                const curr_id = client.id;
                const localized_type = localize(type);
                if (curr_id === Client.get('loginid')) { // default account
                    $('.account-type').html(localized_type);
                    $('.account-id').html(curr_id);
                } else {
                    loginid_select.append($('<a/>', { href: `${'java'}${'script:;'}`, 'data-value': curr_id })
                        .append($('<li/>', { text: localized_type }).append($('<div/>', { text: curr_id }))))
                        .append($('<div/>', { class: 'separator-line-thin-gray' }));
                }
            }
        });
        let $this;
        $('.login-id-list').html(loginid_select)
            .find('a').off('click')
            .on('click', function(e) {
                e.preventDefault();
                $this = $(this);
                $this.attr('disabled', 'disabled');
                switchLoginid($this.attr('data-value'));
            });
    };

    const metatraderMenuItemVisibility = (landing_company_response) => {
        if (MetaTrader.isEligible(landing_company_response)) {
            $('#all-accounts').find('#user_menu_metatrader').setVisibility(1);
        }
    };

    const switchLoginid = (loginid) => {
        if (!loginid || loginid.length === 0) return;
        const token = Client.getToken(loginid);
        if (!token || token.length === 0) {
            Client.sendLogoutRequest(true);
            return;
        }

        // cleaning the previous values
        Client.clear();
        sessionStorage.setItem('active_tab', '1');
        // set cookies: loginid, login
        Client.setCookie('loginid', loginid);
        Client.setCookie('login',   token);
        // set local storage
        GTM.setLoginFlag();
        localStorage.setItem('active_loginid', loginid);
        $('.login-id-list a').removeAttr('disabled');
        window.location.reload();
    };

    const upgradeMessageVisibility = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            const landing_company = State.get(['response', 'landing_company', 'landing_company']);
            const loginid_array = Client.get('loginid_array');

            const $upgrade_msg = $('.upgrademessage');

            const showUpgrade = (url, msg) => {
                $upgrade_msg.setVisibility(1)
                    .find('a').setVisibility(1)
                    .attr('href', urlFor(url))
                    .html($('<span/>', { text: localize(msg) }));
            };

            if (Client.get('is_virtual')) {
                const show_upgrade_msg = !loginid_array.some(client => client.real);

                $upgrade_msg.setVisibility(1)
                    .find('> span').setVisibility(1).end()
                    .find('a')
                    .setVisibility(0);

                const jp_account_status = (State.get(['response', 'get_settings', 'get_settings', 'jp_account_status']) || {}).status;
                if (jp_account_status && show_upgrade_msg) {
                    if (/jp_knowledge_test_(pending|fail)/.test(jp_account_status)) { // do not show upgrade for user that filled up form
                        showUpgrade('/new_account/knowledge_testws', '{JAPAN ONLY}Take knowledge test');
                    } else {
                        $upgrade_msg.setVisibility(1);
                        if (jp_account_status === 'jp_activation_pending') {
                            if ($('.activation-message').length === 0) {
                                $('#virtual-text').append($('<div/>', { class: 'activation-message', text: ` ${localize('Your Application is Being Processed.')}` }));
                            }
                        } else if (jp_account_status === 'activated') {
                            if ($('.activated-message').length === 0) {
                                $('#virtual-text').append($('<div/>', { class: 'activated-message', text: ` ${localize('{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.')}` }));
                            }
                        }
                    }
                } else if (show_upgrade_msg) {
                    $upgrade_msg.find('> span').setVisibility(1);
                    if (Client.canUpgradeVirtualToFinancial(landing_company)) {
                        showUpgrade('new_account/maltainvestws', 'Upgrade to a Financial Account');
                    } else if (Client.canUpgradeVirtualToJapan(landing_company)) {
                        showUpgrade('new_account/japanws', 'Upgrade to a Real Account');
                    } else {
                        showUpgrade('new_account/realws', 'Upgrade to a Real Account');
                    }
                } else {
                    $upgrade_msg.find('a').setVisibility(0).html('');
                }
            } else {
                let show_financial = false;
                // also allow UK MLT client to open MF account
                if (Client.canUpgradeGamingToFinancial(landing_company) || (Client.get('residence') === 'gb' && /^MLT/.test(Client.get('loginid')))) {
                    show_financial = !loginid_array.some(client => client.financial);
                }
                if (show_financial) {
                    $('#virtual-text').parent().setVisibility(0);
                    showUpgrade('new_account/maltainvestws', 'Open a Financial Account');
                } else {
                    $upgrade_msg.setVisibility(0);
                }
            }
        });
    };

    const displayNotification = (message, is_error) => {
        const $msg_notification = $('#msg_notification');
        $msg_notification.html(message).attr('data-message', message);
        if ($msg_notification.is(':hidden')) $msg_notification.removeClass('error').slideDown(500, () => { if (is_error) $msg_notification.addClass('error'); });
    };

    const hideNotification = () => {
        const $msg_notification = $('#msg_notification');
        if ($msg_notification.is(':visible')) $msg_notification.removeClass('error').slideUp(500, () => { $msg_notification.html('').removeAttr('data-message'); });
    };

    const displayAccountStatus = () => {
        BinarySocket.wait('authorize').then(() => {
            let get_account_status,
                status,
                should_authenticate = false;

            const riskAssessment = () => {
                if (get_account_status.risk_classification === 'high') {
                    return isEmptyObject(State.get(['response', 'get_financial_assessment', 'get_financial_assessment']));
                }
                return false;
            };

            const buildMessage = (string, path, hash = '') => localize(string, [`<a href="${urlFor(path)}${hash}">`, '</a>']);


            const messages = {
                authenticate   : () => buildMessage('[_1]Authenticate your account[_2] now to take full advantage of all withdrawal options available.',        'user/authenticate'),
                financial_limit: () => buildMessage('Please set your 30-day turnover limit in our [_1]self-exclusion facilities[_2] to remove deposit limits.', 'user/security/self_exclusionws', '#max_30day_turnover'),
                residence      : () => buildMessage('Please set [_1]country of residence[_2] before upgrading to a real-money account.',                        'user/settings/detailsws'),
                risk           : () => buildMessage('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.',        'user/settings/assessmentws'),
                tax            : () => buildMessage('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.',                 'user/settings/detailsws'),
                tnc            : () => buildMessage('Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.',       'user/tnc_approvalws'),
                unwelcome      : () => buildMessage('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.',                      'contact'),
            };

            const validations = {
                authenticate: () =>
                    (!/authenticated/.test(status) || !/age_verification/.test(status)) && !jpClient() && should_authenticate,
                financial_limit: () => /ukrts_max_turnover_limit_not_set/.test(status),
                residence      : () => !Client.get('residence'),
                risk           : () => riskAssessment(),
                tax            : () => Client.shouldCompleteTax(),
                tnc            : () => Client.shouldAcceptTnc(),
                unwelcome      : () => /(unwelcome|(cashier|withdrawal)_locked)/.test(status),
            };

            // real account checks in order
            const check_statuses_real = [
                'tnc',
                'financial_limit',
                'risk',
                'tax',
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
                BinarySocket.wait('website_status', 'get_account_status', 'get_settings', 'get_financial_assessment', 'balance').then(() => {
                    get_account_status = State.get(['response', 'get_account_status', 'get_account_status']) || {};
                    status = get_account_status.status;
                    if (/costarica/.test(Client.get('landing_company_name')) && +Client.get('balance') < 200) {
                        BinarySocket.send({ mt5_login_list: 1 }).then((response) => {
                            if (response.mt5_login_list.length) {
                                should_authenticate = true;
                            }
                            checkStatus(check_statuses_real);
                        });
                    } else {
                        should_authenticate = true;
                        checkStatus(check_statuses_real);
                    }
                });
            }
        });
    };

    return {
        onLoad: onLoad,

        upgradeMessageVisibility    : upgradeMessageVisibility,
        metatraderMenuItemVisibility: metatraderMenuItemVisibility,
        displayNotification         : displayNotification,
        hideNotification            : hideNotification,
        displayAccountStatus        : displayAccountStatus,
    };
})();

module.exports = Header;
