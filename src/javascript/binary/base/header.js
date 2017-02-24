const Client                    = require('./client').Client;
const GTM                       = require('./gtm').GTM;
const localize                  = require('./localize').localize;
const Login                     = require('./login').Login;
const url_for                   = require('./url').url_for;
const template                  = require('./utility').template;
const objectNotEmpty            = require('./utility').objectNotEmpty;
const checkClientsCountry       = require('../common_functions/country_base').checkClientsCountry;
const check_risk_classification = require('../common_functions/check_risk_classification').check_risk_classification;
const MetaTrader                = require('../websocket_pages/user/metatrader/metatrader');

const Header = (function() {
    const on_load = function() {
        show_or_hide_login_form();
        logout_handler();
        check_risk_classification();
        if (!Login.is_login_pages()) {
            checkClientsCountry();
        }
        if (Client.is_logged_in()) {
            $('ul#menu-top').addClass('smaller-font');
            displayAccountStatus();
        }
    };

    const logout_handler = function() {
        $('a.logout').unbind('click').click(function() {
            Client.send_logout_request();
        });
    };

    const show_or_hide_login_form = function() {
        if (!Client.is_logged_in()) return;
        let loginid_select = '';
        const loginid_array = Client.get('loginid_array');
        for (let i = 0; i < loginid_array.length; i++) {
            const login = loginid_array[i];
            if (!login.disabled) {
                const curr_id = login.id;
                let type = 'Virtual';
                if (login.real) {
                    if (login.financial)          type = 'Investment';
                    else if (login.non_financial) type = 'Gaming';
                    else                          type = 'Real';
                }
                type += ' Account';

                // default account
                if (curr_id === Client.get('loginid')) {
                    $('.account-type').html(localize(type));
                    $('.account-id').html(curr_id);
                } else {
                    loginid_select += '<a href="javascript:;" value="' + curr_id + '"><li>' + localize(type) + '<div>' + curr_id + '</div>' +
                        '</li></a><div class="separator-line-thin-gray"></div>';
                }
            }
        }
        $('.login-id-list').html(loginid_select);
        $('.login-id-list a').off('click').on('click', function(e) {
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            switch_loginid($(this).attr('value'));
        });
    };

    const metatrader_menu_item_visibility = function(landing_company_response) {
        if (MetaTrader.isEligible(landing_company_response)) {
            $('#all-accounts #user_menu_metatrader').removeClass('invisible');
        }
    };

    const switch_loginid = function(loginid) {
        if (!loginid || loginid.length === 0) {
            return;
        }
        const token = Client.get_token(loginid);
        if (!token || token.length === 0) {
            Client.send_logout_request(true);
            return;
        }

        // cleaning the previous values
        Client.clear_storage_values();
        sessionStorage.setItem('active_tab', '1');
        sessionStorage.removeItem('client_status');
        // set cookies: loginid, login
        Client.set_cookie('loginid', loginid);
        Client.set_cookie('login',   token);
        // set local storage
        GTM.set_login_flag();
        localStorage.setItem('active_loginid', loginid);
        $('.login-id-list a').removeAttr('disabled');
        window.location.reload();
    };

    const topbar_message_visibility = function(c_config) {
        if (Client.is_logged_in()) {
            if (!Client.get('values_set') || !c_config) {
                return;
            }
            const loginid_array = Client.get('loginid_array');

            const $upgrade_msg = $('.upgrademessage'),
                hiddenClass  = 'invisible';
            const hide_upgrade = function() {
                $upgrade_msg.addClass(hiddenClass);
            };
            const show_upgrade = function(url, msg) {
                $upgrade_msg.removeClass(hiddenClass)
                    .find('a').removeClass(hiddenClass)
                    .attr('href', url_for(url))
                    .html($('<span/>', { text: localize(msg) }));
            };

            if (Client.get('is_virtual')) {
                let show_upgrade_msg = true;
                for (let i = 0; i < loginid_array.length; i++) {
                    if (loginid_array[i].real) {
                        hide_upgrade();
                        show_upgrade_msg = false;
                        break;
                    }
                }
                $upgrade_msg.removeClass(hiddenClass)
                    .find('> span').removeClass(hiddenClass).end()
                    .find('a')
                    .addClass(hiddenClass);
                const jp_account_status = Client.get('jp_status');
                if (jp_account_status && show_upgrade_msg) {
                    if (/jp_knowledge_test_(pending|fail)/.test(jp_account_status)) { // do not show upgrade for user that filled up form
                        show_upgrade('/new_account/knowledge_testws', '{JAPAN ONLY}Take knowledge test');
                    } else {
                        $upgrade_msg.removeClass(hiddenClass);
                        if (jp_account_status === 'jp_activation_pending') {
                            if ($('.activation-message').length === 0) {
                                $('#virtual-text').append(' <div class="activation-message">' + localize('Your Application is Being Processed.') + '</div>');
                            }
                        } else if (jp_account_status === 'activated') {
                            if ($('.activated-message').length === 0) {
                                $('#virtual-text').append(' <div class="activated-message">' +
                                    localize('{JAPAN ONLY}Your Application has Been Processed. Please Re-Login to Access Your Real-Money Account.') +
                                    '</div>');
                            }
                        }
                    }
                    return;
                }
                if (show_upgrade_msg) {
                    $upgrade_msg.find('> span').removeClass(hiddenClass);
                    if (Client.can_upgrade_virtual_to_financial(c_config)) {
                        show_upgrade('new_account/maltainvestws', 'Upgrade to a Financial Account');
                    } else if (Client.can_upgrade_virtual_to_japan(c_config)) {
                        show_upgrade('new_account/japanws', 'Upgrade to a Real Account');
                    } else {
                        show_upgrade('new_account/realws', 'Upgrade to a Real Account');
                    }
                }
            } else {
                let show_financial = false;
                // also allow UK MLT client to open MF account
                if (Client.can_upgrade_gaming_to_financial(c_config) || (Client.get('residence') === 'gb' && /^MLT/.test(Client.get('loginid')))) {
                    show_financial = true;
                    for (let j = 0; j < loginid_array.length; j++) {
                        if (loginid_array[j].financial) {
                            show_financial = false;
                            break;
                        }
                    }
                }
                if (show_financial) {
                    $('#virtual-text').parent().addClass('invisible');
                    show_upgrade('new_account/maltainvestws', 'Open a Financial Account');
                } else {
                    hide_upgrade();
                }
            }
        }
    };

    const displayNotification = (message) => {
        const $msg_notification = $('#msg_notification');
        $msg_notification.html(message);
        if ($msg_notification.is(':hidden')) $msg_notification.slideDown(500);
    };

    const displayAccountStatus = () => {
        BinarySocket.wait('get_account_status').then((response) => {
            const status = response.get_account_status.status;

            const messages = {
                authenticate: () => template(
                    localize('Please [_1]authenticate your account[_2] to lift your withdrawal and trading limits.',
                        ['<a href="' + url_for('user/authenticatews') + '">', '</a>'])),
                risk: () => template(
                    localize('Please complete the [_1]financial assessment form[_2] to lift your withdrawal and trading limits.'),
                    ['<a href="' + url_for('user/settings/assessmentws') + '">', '</a>']),
                tax: () => template(
                    localize('Please [_1]complete your account profile[_2] to lift your withdrawal and trading limits.'),
                    ['<a href="' + url_for('user/settings/detailsws') + '">', '</a>']),
                tnc: () => template(
                    localize('Please [_1]accept the updated Terms and Conditions[_2] to lift your withdrawal and trading limits.'),
                    ['<a href="' + url_for('user/tnc_approvalws') + '">', '</a>']),
                unwelcome: () => template(
                    localize('Your account is restricted - kindly [_1]contact customer support[_2] for assistance.'),
                    ['<a href="mailto:support@binary.com">', '</a>']),
            };

            const riskAssessment = () => {
                if (response.get_account_status.risk_classification === 'high') {
                    BinarySocket.send({ get_financial_assessment: 1 })
                        .then(data => !objectNotEmpty(data.get_financial_assessment));
                }
                return false;
            };

            const check_statuses = [
                { validation: () => !/(authenticated|age_verification)/.test(status),        message: messages.authenticate },
                { validation: riskAssessment,                                                message: messages.risk },
                { validation: () => !/crs_tin_information/.test(status),                     message: messages.tax },
                { validation: Client.should_accept_tnc,                                      message: messages.tnc },
                { validation: () => !/(unwelcome|(cashier|withdrawal)_locked)/.test(status), message: messages.unwelcome },
            ];

            check_statuses.some((object) => {
                if (object.validation()) {
                    displayNotification(object.message());
                    return true;
                }
                return false;
            });
        });
    };

    return {
        on_load: on_load,

        topbar_message_visibility      : topbar_message_visibility,
        metatrader_menu_item_visibility: metatrader_menu_item_visibility,
    };
})();

module.exports = {
    Header: Header,
};
