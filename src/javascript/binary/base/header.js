var Client                    = require('./client').Client;
var checkClientsCountry       = require('../common_functions/country_base').checkClientsCountry;
var localize                  = require('./localize').localize;
var check_risk_classification = require('../common_functions/check_risk_classification').check_risk_classification;
var Login                     = require('./login').Login;
var url_for                   = require('./url').url_for;
var GTM                       = require('./gtm').GTM;

var Header = (function() {
    var on_load = function() {
        show_or_hide_login_form();
        show_or_hide_language();
        logout_handler();
        check_risk_classification();
        if (!$('body').hasClass('BlueTopBack') && !Login.is_login_pages()) {
            checkClientsCountry();
        }
        if (Client.get_boolean('is_logged_in')) {
            $('ul#menu-top').addClass('smaller-font');
        }
    };

    var logout_handler = function() {
        $('a.logout').unbind('click').click(function() {
            Client.send_logout_request();
        });
    };

    var animate_disappear = function(element) {
        element.animate({ opacity: 0 }, 100, function() {
            element.css({ visibility: 'hidden', display: 'none' });
        });
    };

    var animate_appear = function(element) {
        element.css({ visibility: 'visible', display: 'block' })
            .animate({ opacity: 1 }, 100);
    };

    var show_or_hide_language = function() {
        var $el = $('#select_language'),
            $all_accounts = $('#all-accounts');
        $('.languages').off('click').on('click', function(event) {
            event.stopPropagation();
            animate_disappear($all_accounts);
            if (+$el.css('opacity') === 1) {
                animate_disappear($el);
            } else {
                animate_appear($el);
            }
        });
        $(document).unbind('click').on('click', function() {
            animate_disappear($all_accounts);
            animate_disappear($el);
        });
    };

    var show_or_hide_login_form = function() {
        if (!Client.get_boolean('is_logged_in')) return;
        var all_accounts = $('#all-accounts'),
            language = $('#select_language');
        $('.nav-menu').unbind('click').on('click', function(event) {
            event.stopPropagation();
            animate_disappear(language);
            if (+all_accounts.css('opacity') === 1) {
                animate_disappear(all_accounts);
            } else {
                animate_appear(all_accounts);
            }
        });
        var loginid_select = '';
        var loginid_array = Client.get_value('loginid_array');
        for (var i = 0; i < loginid_array.length; i++) {
            var login = loginid_array[i];
            if (!login.disabled) {
                var curr_id = login.id;
                var type = 'Virtual';
                if (login.real) {
                    if (login.financial)          type = 'Investment';
                    else if (login.non_financial) type = 'Gaming';
                    else                          type = 'Real';
                }
                type += ' Account';

                // default account
                if (curr_id === Client.get_value('loginid')) {
                    $('.account-type').html(localize(type));
                    $('.account-id').html(curr_id);
                } else {
                    loginid_select += '<a href="#" value="' + curr_id + '"><li>' + localize(type) + '<div>' + curr_id + '</div>' +
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

    var switch_loginid = function(loginid) {
        if (!loginid || loginid.length === 0) {
            return;
        }
        var token = Client.get_token(loginid);
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

    var topbar_message_visibility = function(c_config) {
        if (Client.get_boolean('is_logged_in')) {
            if (Client.is_virtual() || !c_config) {
                return;
            }
            var loginid_array = Client.get_value('loginid_array');

            var $upgrade_msg = $('.upgrademessage'),
                hiddenClass  = 'invisible';
            var hide_upgrade = function() {
                $upgrade_msg.addClass(hiddenClass);
            };
            var show_upgrade = function(url, msg) {
                $upgrade_msg.removeClass(hiddenClass)
                    .find('a').removeClass(hiddenClass)
                    .attr('href', url_for(url))
                    .html($('<span/>', { text: localize(msg) }));
            };

            if (Client.is_virtual()) {
                var show_upgrade_msg = true;
                var show_virtual_msg = true;
                var show_activation_msg = false;
                if (localStorage.getItem('jp_test_allowed') === '1') {
                    show_virtual_msg = false;
                    show_upgrade_msg = false; // do not show upgrade for user that filled up form
                } else if ($('.jp_activation_pending').length !== 0) {
                    show_upgrade_msg = false;
                    show_activation_msg = true;
                }
                for (var i = 0; i < loginid_array.length; i++) {
                    if (loginid_array[i].real) {
                        hide_upgrade();
                        show_upgrade_msg = false;
                        break;
                    }
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
                } else if (show_virtual_msg) {
                    $upgrade_msg.removeClass(hiddenClass).find('> span').removeClass(hiddenClass + ' gr-hide-m');
                    if (show_activation_msg && $('.activation-message').length === 0) {
                        $('#virtual-text').append(' <div class="activation-message">' + localize('Your Application is Being Processed.') + '</div>');
                    }
                }
            } else {
                var show_financial = false;

                // also allow UK MLT client to open MF account
                if (Client.can_upgrade_gaming_to_financial(c_config) || (Client.get_value('residence') === 'gb' && /^MLT/.test(Client.get_value('loginid')))) {
                    show_financial = true;
                    for (var j = 0; j < loginid_array.length; j++) {
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

    return {
        on_load: on_load,

        topbar_message_visibility: topbar_message_visibility,
    };
})();

module.exports = {
    Header: Header,
};
