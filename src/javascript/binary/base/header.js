const BinaryPjax          = require('./binary_pjax');
const Client              = require('./client');
const GTM                 = require('./gtm');
const localize            = require('./localize').localize;
const Login               = require('./login');
const State               = require('./storage').State;
const Url                 = require('./url');
const checkClientsCountry = require('../common_functions/country_base').checkClientsCountry;
const jpClient            = require('../common_functions/country_base').jpClient;
const toTitleCase         = require('../common_functions/string_util').toTitleCase;
const BinarySocket        = require('../websocket_pages/socket');
const MetaTrader          = require('../websocket_pages/user/metatrader/metatrader');
const getCurrencies       = require('../websocket_pages/user/get_currency').getCurrencies;

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
            BinaryPjax.load(Client.isLoggedIn() ? Url.defaultRedirectUrl() : Url.urlFor(''));
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
        BinarySocket.wait('authorize').then(() => {
            const loginid_select = $('<div/>');
            Client.getAllLoginids().forEach((loginid) => {
                if (!Client.get('is_disabled', loginid)) {
                    const account_title = Client.getAccountTitle(loginid);
                    const is_real = /real/i.test(account_title);
                    const currency = Client.get('currency', loginid);
                    const localized_type = localize('[_1] Account', [is_real && currency ? currency : account_title]);
                    if (loginid === Client.get('loginid')) { // default account
                        $('.account-type').html(localized_type);
                        $('.account-id').html(loginid);
                    } else {
                        loginid_select.append($('<a/>', { href: `${'java'}${'script:;'}`, 'data-value': loginid })
                            .append($('<li/>', { text: localized_type }).append($('<div/>', { text: loginid }))))
                            .append($('<div/>', { class: 'separator-line-thin-gray' }));
                    }
                }
                let $this;
                $('.login-id-list').html(loginid_select)
                    .find('a').off('click')
                    .on('click', function(e) {
                        e.preventDefault();
                        $this = $(this);
                        $this.attr('disabled', 'disabled');
                        switchLoginid($this.attr('data-value'));
                    });
            });
        });
    };

    const metatraderMenuItemVisibility = (landing_company_response) => {
        if (MetaTrader.isEligible(landing_company_response)) {
            $('#all-accounts').find('#user_menu_metatrader').setVisibility(1);
        }
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
        Client.set('loginid', loginid);
        $('.login-id-list a').removeAttr('disabled');
        window.location.reload();
    };

    const upgradeMessageVisibility = () => {
        BinarySocket.wait('authorize', 'landing_company', 'get_settings').then(() => {
            const landing_company = State.getResponse('landing_company');
            const $upgrade_msg = $('.upgrademessage');

            const showUpgrade = (url, msg) => {
                $upgrade_msg.setVisibility(1)
                    .find('a').setVisibility(1)
                    .attr('href', Url.urlFor(url))
                    .html($('<span/>', { text: localize(msg) }));
            };

            const jp_account_status = State.getResponse('get_settings.jp_account_status.status');
            const upgrade_info = Client.getUpgradeInfo(landing_company, jp_account_status);
            const show_upgrade_msg = upgrade_info.can_upgrade;

            if (Client.get('is_virtual')) {
                $upgrade_msg.setVisibility(1)
                    .find('> span').setVisibility(1).end()
                    .find('a')
                    .setVisibility(0);

                if (jp_account_status) {
                    const has_disabled_jp = jpClient() && Client.getAccountOfType('real').is_disabled;
                    if (/jp_knowledge_test_(pending|fail)/.test(jp_account_status)) { // do not show upgrade for user that filled up form
                        showUpgrade('/new_account/knowledge_testws', '{JAPAN ONLY}Take knowledge test');
                    } else if (show_upgrade_msg || (has_disabled_jp && jp_account_status !== 'disabled')) {
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
                    showUpgrade(upgrade_info.upgrade_link, `Upgrade to a ${toTitleCase(upgrade_info.type)} Account`);
                } else {
                    $upgrade_msg.find('a').setVisibility(0).html('');
                }
            } else if (show_upgrade_msg) {
                $('#virtual-text').parent().setVisibility(0);
                showUpgrade(upgrade_info.upgrade_link, 'Open a Financial Account');
            } else {
                $upgrade_msg.setVisibility(0);
            }
            showHideNewAccount(show_upgrade_msg);
        });
    };

    const showHideNewAccount = (can_upgrade) => {
        const landing_company = State.getResponse('landing_company');
        // only allow opening of multi account to costarica clients with remaining currency
        if (can_upgrade || (Client.get('landing_company_shortcode') === 'costarica' && getCurrencies(landing_company).length)) {
            changeAccountsText(1, 'Create Account');
        } else {
            changeAccountsText(0, 'Accounts List');
        }
    };

    const changeAccountsText = (add_new_style, text) => {
        $('#user_accounts')[`${add_new_style ? 'add' : 'remove'}Class`]('create_new_account').find('li').text(localize(text));
    };

    const displayNotification = (message, is_error, msg_code = '') => {
        const $msg_notification = $('#msg_notification');
        if ($msg_notification.attr('data-code') === 'STORAGE_NOT_SUPPORTED') return;
        $msg_notification.html(message).attr({ 'data-message': message, 'data-code': msg_code });
        if ($msg_notification.is(':hidden')) {
            $msg_notification.slideDown(500, () => { if (is_error) $msg_notification.addClass('error'); });
        } else if (is_error) {
            $msg_notification.addClass('error');
        } else {
            $msg_notification.removeClass('error');
        }
    };

    const hideNotification = (msg_code) => {
        const $msg_notification = $('#msg_notification');
        if ($msg_notification.attr('data-code') === 'STORAGE_NOT_SUPPORTED') return;
        if (msg_code && $msg_notification.attr('data-code') !== msg_code) return;
        if ($msg_notification.is(':visible')) $msg_notification.removeClass('error').slideUp(500, () => { $msg_notification.html('').removeAttr('data-message data-code'); });
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
                authenticate   : () => buildMessage('[_1]Authenticate your account[_2] now to take full advantage of all payment methods available.',     'user/authenticate'),
                currency       : () => buildMessage('Please set the [_1]currency[_2] of your account.',                                                   'user/set-currency'),
                financial_limit: () => buildMessage('Please set your [_1]30-day turnover limit[_2] to remove deposit limits.',                            'user/security/self_exclusionws'),
                residence      : () => buildMessage('Please set [_1]country of residence[_2] before upgrading to a real-money account.',                  'user/settings/detailsws'),
                risk           : () => buildMessage('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.',  'user/settings/assessmentws'),
                tax            : () => buildMessage('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.',           'user/settings/detailsws'),
                tnc            : () => buildMessage('Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.', 'user/tnc_approvalws'),
                unwelcome      : () => buildMessage('Your account is restricted. Kindly [_1]contact customer support[_2] for assistance.',                'contact'),
            };

            const validations = {
                authenticate   : () => +get_account_status.prompt_client_to_authenticate,
                currency       : () => !Client.get('currency'),
                financial_limit: () => /ukrts_max_turnover_limit_not_set/.test(status),
                residence      : () => !Client.get('residence'),
                risk           : () => riskAssessment(),
                tax            : () => Client.shouldCompleteTax(),
                tnc            : () => Client.shouldAcceptTnc(),
                unwelcome      : () => /unwelcome|(cashier|withdrawal)_locked/.test(status),
            };

            // real account checks in order
            const check_statuses_real = [
                'tnc',
                'financial_limit',
                'risk',
                'tax',
                'currency',
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
                    status = get_account_status.status;
                    checkStatus(check_statuses_real);
                });
            }
        });
    };

    return {
        onLoad: onLoad,

        showOrHideLoginForm         : showOrHideLoginForm,
        upgradeMessageVisibility    : upgradeMessageVisibility,
        metatraderMenuItemVisibility: metatraderMenuItemVisibility,
        displayNotification         : displayNotification,
        hideNotification            : hideNotification,
        displayAccountStatus        : displayAccountStatus,
    };
})();

module.exports = Header;
