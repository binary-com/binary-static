var Login           = require('./login').Login;
var japanese_client = require('../common_functions/country_base').japanese_client;
var localize        = require('./localize').localize;

var Contents = (function() {
    var client,
        user;

    var init = function (newClient, newUser) {
        client = newClient;
        user = newUser;
    };

    var on_load = function() {
        activate_by_client_type();
        activate_by_login();
        update_content_class();
        init_draggable();
    };

    var on_unload = function() {
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
        }
    };

    var has_gaming_financial_enabled = function() {
        var has_financial = false,
            has_gaming = false,
            looping_user;
        for (var i = 0; i < user.loginid_array.length; i++) {
            looping_user = user.loginid_array[i];
            if (looping_user.financial && !looping_user.disabled && !looping_user.non_financial) {
                has_financial = true;
            } else if (!looping_user.financial && !looping_user.disabled && looping_user.non_financial) {
                has_gaming = true;
            }
        }
        return has_gaming && has_financial;
    };

    var activate_by_client_type = function() {
        $('.by_client_type').addClass('invisible');
        if (client.is_logged_in) {
            if (client.get_storage_value('is_virtual').length === 0) {
                return;
            }
            $('#client-logged-in').addClass('gr-centered');
            if (!client.is_virtual()) {
                // control-class is a fake class, only used to counteract ja-hide class
                $('.by_client_type.client_real').not((japanese_client() ? '.ja-hide' : '.control-class')).removeClass('invisible');
                $('.by_client_type.client_real').show();

                $('#topbar').addClass('primary-color-dark');
                $('#topbar').removeClass('secondary-bg-color');

                if (!/^CR/.test(client.loginid)) {
                    $('#payment-agent-section').addClass('invisible');
                    $('#payment-agent-section').hide();
                }

                if (has_gaming_financial_enabled()) {
                    $('#account-transfer-section').removeClass('invisible');
                }
            } else {
                $('.by_client_type.client_virtual').removeClass('invisible');
                $('.by_client_type.client_virtual').show();

                $('#topbar').addClass('secondary-bg-color');
                $('#topbar').removeClass('primary-color-dark');
            }
        } else {
            $('#btn_login').unbind('click').click(function(e) { e.preventDefault(); Login.redirect_to_login(); });

            $('.by_client_type.client_logged_out').removeClass('invisible');
            $('.by_client_type.client_logged_out').show();

            $('#topbar').removeClass('secondary-bg-color');
            $('#topbar').addClass('primary-color-dark');
        }
    };

    var activate_by_login = function() {
        if (client.is_logged_in) {
            $('.client_logged_in').removeClass('invisible');
        }
    };

    var update_content_class = function() {
        // This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    };

    var init_draggable = function() {
        $('.draggable').draggable();
    };

    var topbar_message_visibility = function(c_config) {
        if (client.is_logged_in) {
            if (client.get_storage_value('is_virtual').length === 0 || !c_config) {
                return;
            }
            var loginid_array = user.loginid_array;

            var $upgrade_msg = $('.upgrademessage'),
                hiddenClass  = 'invisible';
            var hide_upgrade = function() {
                $upgrade_msg.addClass(hiddenClass);
            };
            var show_upgrade = function(url, msg) {
                $upgrade_msg.removeClass(hiddenClass)
                    .find('a').removeClass(hiddenClass)
                    .attr('href', page.url.url_for(url))
                    .html($('<span/>', { text: localize(msg) }));
            };

            if (client.is_virtual()) {
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
                    if (client.can_upgrade_virtual_to_financial(c_config)) {
                        show_upgrade('new_account/maltainvestws', 'Upgrade to a Financial Account');
                    } else if (client.can_upgrade_virtual_to_japan(c_config)) {
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
                if (client.can_upgrade_gaming_to_financial(c_config) || (client.residence === 'gb' && /^MLT/.test(client.loginid))) {
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
        init     : init,
        on_load  : on_load,
        on_unload: on_unload,

        activate_by_client_type  : activate_by_client_type,
        activate_by_login        : activate_by_login,
        topbar_message_visibility: topbar_message_visibility,
    };
})();

module.exports = {
    Contents: Contents,
};
