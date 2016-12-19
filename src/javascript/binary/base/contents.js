var Login           = require('./login').Login;
var japanese_client = require('../common_functions/country_base').japanese_client;
var localize        = require('./localize').localize;

var Contents = function(client, user) {
    this.client = client;
    this.user = user;
};

Contents.prototype = {
    on_load: function() {
        this.activate_by_client_type();
        this.activate_by_login();
        this.update_content_class();
        this.init_draggable();
    },
    on_unload: function() {
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
        }
    },
    has_gaming_financial_enabled: function() {
        var has_financial = false,
            has_gaming = false,
            user;
        for (var i = 0; i < page.user.loginid_array.length; i++) {
            user = page.user.loginid_array[i];
            if (user.financial && !user.disabled && !user.non_financial) {
                has_financial = true;
            } else if (!user.financial && !user.disabled && user.non_financial) {
                has_gaming = true;
            }
        }
        return has_gaming && has_financial;
    },
    activate_by_client_type: function() {
        $('.by_client_type').addClass('invisible');
        if (this.client.is_logged_in) {
            if (page.client.get_storage_value('is_virtual').length === 0) {
                return;
            }
            $('#client-logged-in').addClass('gr-centered');
            if (!page.client.is_virtual()) {
                // control-class is a fake class, only used to counteract ja-hide class
                $('.by_client_type.client_real').not((japanese_client() ? '.ja-hide' : '.control-class')).removeClass('invisible');
                $('.by_client_type.client_real').show();

                $('#topbar').addClass('primary-color-dark');
                $('#topbar').removeClass('secondary-bg-color');

                if (!/^CR/.test(this.client.loginid)) {
                    $('#payment-agent-section').addClass('invisible');
                    $('#payment-agent-section').hide();
                }

                if (this.has_gaming_financial_enabled()) {
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
    },
    activate_by_login: function() {
        if (this.client.is_logged_in) {
            $('.client_logged_in').removeClass('invisible');
        }
    },
    update_content_class: function() {
        // This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    },
    init_draggable: function() {
        $('.draggable').draggable();
    },
    topbar_message_visibility: function(c_config) {
        if (this.client.is_logged_in) {
            if (page.client.get_storage_value('is_virtual').length === 0 || !c_config) {
                return;
            }
            var loginid_array = this.user.loginid_array;

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

            if (page.client.is_virtual()) {
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
                    if (page.client.can_upgrade_virtual_to_financial(c_config)) {
                        show_upgrade('new_account/maltainvestws', 'Upgrade to a Financial Account');
                    } else if (page.client.can_upgrade_virtual_to_japan(c_config)) {
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
                if (page.client.can_upgrade_gaming_to_financial(c_config) || (this.client.residence === 'gb' && /^MLT/.test(this.client.loginid))) {
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
    },
};

module.exports = {
    Contents: Contents,
};
