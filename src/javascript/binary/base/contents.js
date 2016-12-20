var localize        = require('./localize').localize;
var Client          = require('./client').Client;

var Contents = (function() {
    var on_load = function() {
        Client.activate_by_client_type();
        Client.activate_by_login();
        update_content_class();
        init_draggable();
    };

    var on_unload = function() {
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
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
        if (Client.get_value('is_logged_in')) {
            if (Client.is_virtual() || !c_config) {
                return;
            }
            var loginid_array = Client.loginid_array();

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
        on_load  : on_load,
        on_unload: on_unload,

        topbar_message_visibility: topbar_message_visibility,
    };
})();

module.exports = {
    Contents: Contents,
};
