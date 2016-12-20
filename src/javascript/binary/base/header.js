var Menu                      = require('./menu').Menu;
var LocalStore                = require('./storage').LocalStore;
var Client                    = require('./client').Client;
var checkClientsCountry       = require('../common_functions/country_base').checkClientsCountry;
var localize                  = require('./localize').localize;
var Cookies                   = require('../../lib/js-cookie');
var check_risk_classification = require('../common_functions/check_risk_classification').check_risk_classification;
var Login                     = require('./login').Login;

var Header = function(url) {
    this.menu = new Menu(url);
};

Header.prototype = {
    on_load: function() {
        this.show_or_hide_login_form();
        this.show_or_hide_language();
        this.logout_handler();
        check_risk_classification();
        if (!$('body').hasClass('BlueTopBack') && !Login.is_login_pages()) {
            checkClientsCountry();
        }
        if (Client.get_value('is_logged_in')) {
            $('ul#menu-top').addClass('smaller-font');
        }
    },
    on_unload: function() {
        this.menu.reset();
    },
    animate_disappear: function(element) {
        element.animate({ opacity: 0 }, 100, function() {
            element.css({ visibility: 'hidden', display: 'none' });
        });
    },
    animate_appear: function(element) {
        element.css({ visibility: 'visible', display: 'block' })
            .animate({ opacity: 1 }, 100);
    },
    show_or_hide_language: function() {
        var that = this;
        var $el = $('#select_language'),
            $all_accounts = $('#all-accounts');
        $('.languages').on('click', function(event) {
            event.stopPropagation();
            that.animate_disappear($all_accounts);
            if (+$el.css('opacity') === 1) {
                that.animate_disappear($el);
            } else {
                that.animate_appear($el);
            }
        });
        $(document).unbind('click').on('click', function() {
            that.animate_disappear($all_accounts);
            that.animate_disappear($el);
        });
    },
    show_or_hide_login_form: function() {
        if (!Client.get_value('is_logged_in')) return;
        var all_accounts = $('#all-accounts'),
            language = $('#select_language'),
            that = this;
        $('.nav-menu').unbind('click').on('click', function(event) {
            event.stopPropagation();
            that.animate_disappear(language);
            if (+all_accounts.css('opacity') === 1) {
                that.animate_disappear(all_accounts);
            } else {
                that.animate_appear(all_accounts);
            }
        });
        var loginid_select = '';
        var loginid_array = Client.loginid_array();
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
    },
    logout_handler: function() {
        $('a.logout').unbind('click').click(function() {
            Client.send_logout_request();
        });
    },
    do_logout: function(response) {
        if (response.logout !== 1) return;
        Client.clear_storage_values();
        LocalStore.remove('client.tokens');
        LocalStore.set('reality_check.ack', 0);
        sessionStorage.removeItem('client_status');
        var cookies = ['login', 'loginid', 'loginid_list', 'email', 'settings', 'reality_check', 'affiliate_token', 'affiliate_tracking', 'residence'];
        var domains = [
            '.' + document.domain.split('.').slice(-2).join('.'),
            '.' + document.domain,
        ];

        var parent_path = window.location.pathname.split('/', 2)[1];
        if (parent_path !== '') {
            parent_path = '/' + parent_path;
        }

        cookies.forEach(function(c) {
            var regex = new RegExp(c);
            Cookies.remove(c, { path: '/', domain: domains[0] });
            Cookies.remove(c, { path: '/', domain: domains[1] });
            Cookies.remove(c);
            if (regex.test(document.cookie) && parent_path) {
                Cookies.remove(c, { path: parent_path, domain: domains[0] });
                Cookies.remove(c, { path: parent_path, domain: domains[1] });
                Cookies.remove(c, { path: parent_path });
            }
        });
        localStorage.removeItem('risk_classification');
        localStorage.removeItem('risk_classification.response');
        page.reload();
    },
    show_login_if_logout: function(shouldReplacePageContents) {
        if (!Client.get_value('is_logged_in') && shouldReplacePageContents) {
            $('#content > .container').addClass('center-text')
                .html($('<p/>', {
                    class: 'notice-msg',
                    html : localize('Please [_1] to view this page',
                        ['<a class="login_link" href="javascript:;">' + localize('login') + '</a>']),
                }));
            $('.login_link').click(function() { Login.redirect_to_login(); });
        }
        return !Client.get_value('is_logged_in');
    },
};

module.exports = {
    Header: Header,
};
