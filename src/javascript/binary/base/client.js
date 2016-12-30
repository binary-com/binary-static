var Cookies          = require('../../lib/js-cookie');
var CookieStorage    = require('./storage').CookieStorage;
var LocalStore       = require('./storage').LocalStore;
var url_for          = require('./url').url_for;
var default_redirect_url = require('./url').default_redirect_url;
var moment           = require('moment');
var japanese_client  = require('../common_functions/country_base').japanese_client;

var Client = (function () {
    var client_object = {};

    var parseLoginIDList = function(string) {
        if (!string) return [];
        return string.split('+').sort().map(function(str) {
            var items = str.split(':');
            var id = items[0];
            return {
                id           : id,
                real         : items[1] === 'R',
                disabled     : items[2] === 'D',
                financial    : /^MF/.test(id),
                non_financial: /^MLT/.test(id),
            };
        });
    };

    var init = function () {
        var loginid = Cookies.get('loginid');
        client_object.loginid_array = parseLoginIDList(Cookies.get('loginid_list') || '');
        var is_logged_in = !!(
            loginid &&
            client_object.loginid_array.length > 0 &&
            get_storage_value('tokens')
        );

        set_storage_value('email', Cookies.get('email'));
        set_storage_value('loginid', loginid);
        set_storage_value('is_logged_in', is_logged_in);
        set_storage_value('residence', Cookies.get('residence'));
    };

    var validate_loginid = function() {
        var loginid_list = Cookies.get('loginid_list');
        var client_id    = Cookies.get('loginid');
        if (!client_id || !loginid_list) return;

        var valid_loginids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');

        if (!valid_loginids.test(client_id)) {
            send_logout_request();
        }

        var accIds = loginid_list.split('+');
        accIds.forEach(function(acc_id) {
            if (!valid_loginids.test(acc_id.split(':')[0])) {
                send_logout_request();
            }
        });
    };

    var redirect_if_is_virtual = function(redirectPage) {
        var is_virtual = get_boolean('is_virtual');
        if (is_virtual) {
            window.location.href = url_for(redirectPage || '');
        }
        return is_virtual;
    };

    var redirect_if_login = function() {
        if (get_boolean('is_logged_in')) {
            window.location.href = default_redirect_url();
        }
        return get_boolean('is_logged_in');
    };

    var set_storage_value = function(key, value) {
        client_object[key] = value;
        return LocalStore.set('client.' + key, value);
    };

    // use this function to get variables that have values
    var get_storage_value = function(key) {
        return client_object[key] || LocalStore.get('client.' + key) || '';
    };

    // use this function to get variables that are a boolean
    var get_boolean = function(value) {
        return JSON.parse(get_storage_value(value) || false);
    };

    var check_storage_values = function(origin) {
        var is_ok = true;

        // currencies
        if (!get_storage_value('currencies')) {
            BinarySocket.send({
                payout_currencies: 1,
                passthrough      : {
                    handler: 'client',
                    origin : origin || '',
                },
            });
            is_ok = false;
        }

        if (get_boolean('is_logged_in')) {
            if (
                !get_boolean('is_virtual') &&
                Cookies.get('residence') &&
                !get_boolean('has_reality_check')
            ) {
                BinarySocket.send({
                    landing_company: Cookies.get('residence'),
                    passthrough    : {
                        handler: 'client',
                        origin : origin || '',
                    },
                });
                is_ok = false;
            }
        }

        // website TNC version
        if (!LocalStore.get('website.tnc_version')) {
            BinarySocket.send({ website_status: 1 });
        }

        return is_ok;
    };

    var response_authorize = function(response) {
        var authorize = response.authorize;
        if (!Cookies.get('email')) {
            set_cookie('email', authorize.email);
            set_storage_value('email', authorize.email);
        }
        set_storage_value('session_start', parseInt(moment().valueOf() / 1000));
        set_storage_value('is_virtual', authorize.is_virtual);
        set_storage_value('landing_company_name', authorize.landing_company_name);
        set_storage_value('landing_company_fullname', authorize.landing_company_fullname);
        set_storage_value('currency', authorize.currency);
        check_storage_values();
        client_object.values_set = true;
        activate_by_client_type();
    };

    var check_tnc = function() {
        if (/user\/tnc_approvalws/.test(window.location.href) ||
            /terms\-and\-conditions/.test(window.location.href) ||
            get_boolean('is_virtual') ||
            sessionStorage.getItem('check_tnc') !== 'check') {
            return;
        }
        var client_tnc_status   = get_storage_value('tnc_status'),
            website_tnc_version = LocalStore.get('website.tnc_version');
        if (client_tnc_status && website_tnc_version && client_tnc_status !== website_tnc_version) {
            sessionStorage.setItem('tnc_redirect', window.location.href);
            window.location.href = url_for('user/tnc_approvalws');
        }
    };

    var set_check_tnc = function () {
        if (!$('body').hasClass('BlueTopBack')) {
            sessionStorage.setItem('check_tnc', 'check');
            localStorage.removeItem('client.tnc_status');
            localStorage.removeItem('website.tnc_version');
        }
    };

    var clear_storage_values = function() {
        // clear all client values from local storage
        Object.keys(localStorage).forEach(function(c) {
            if (/^client\.(?!(tokens$))/.test(c)) {
                LocalStore.set(c, '');
            }
        });
        set_check_tnc();
        sessionStorage.setItem('currencies', '');
    };

    var get_token = function(client_loginid) {
        var token,
            tokens = get_storage_value('tokens');
        if (client_loginid && tokens) {
            var tokensObj = JSON.parse(tokens);
            if (tokensObj.hasOwnProperty(client_loginid) && tokensObj[client_loginid]) {
                token = tokensObj[client_loginid];
            }
        }
        return token;
    };

    var add_token = function(client_loginid, token) {
        if (!client_loginid || !token || get_token(client_loginid)) {
            return false;
        }
        var tokens = get_storage_value('tokens');
        var tokensObj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
        tokensObj[client_loginid] = token;
        set_storage_value('tokens', JSON.stringify(tokensObj));
        return true;
    };

    var set_cookie = function(cookieName, Value, domain) {
        var cookie_expire = new Date();
        cookie_expire.setDate(cookie_expire.getDate() + 60);
        var cookie = new CookieStorage(cookieName, domain);
        cookie.write(Value, cookie_expire, true);
    };

    var process_new_account = function(client_email, client_loginid, token, virtual_client) {
        if (!client_email || !client_loginid || !token) {
            return;
        }
        // save token
        add_token(client_loginid, token);
        // set cookies
        set_cookie('email',        client_email);
        set_cookie('login',        token);
        set_cookie('loginid',      client_loginid);
        set_cookie('loginid_list', virtual_client ? client_loginid + ':V:E' : client_loginid + ':R:E+' + Cookies.get('loginid_list'));
        // set local storage
        localStorage.setItem('GTM_newaccount', '1');
        localStorage.setItem('active_loginid', client_loginid);
        window.location.href = default_redirect_url();
    };

    var can_upgrade_gaming_to_financial = function(data) {
        return (data.hasOwnProperty('financial_company') && data.financial_company.shortcode === 'maltainvest');
    };

    var can_upgrade_virtual_to_financial = function(data) {
        return (data.hasOwnProperty('financial_company') && !data.hasOwnProperty('gaming_company') && data.financial_company.shortcode === 'maltainvest');
    };

    var can_upgrade_virtual_to_japan = function(data) {
        return (data.hasOwnProperty('financial_company') && !data.hasOwnProperty('gaming_company') && data.financial_company.shortcode === 'japan');
    };

    var has_gaming_financial_enabled = function() {
        var has_financial = false,
            has_gaming = false,
            looping_user;
        for (var i = 0; i < client_object.loginid_array.length; i++) {
            looping_user = client_object.loginid_array[i];
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
        if (get_boolean('is_logged_in')) {
            if (!client_object.values_set) {
                return;
            }
            $('#client-logged-in').addClass('gr-centered');
            $('.client_logged_in').removeClass('invisible');
            if (!get_boolean('is_virtual')) {
                // control-class is a fake class, only used to counteract ja-hide class
                $('.by_client_type.client_real').not((japanese_client() ? '.ja-hide' : '.control-class')).removeClass('invisible');
                $('.by_client_type.client_real').show();

                $('#topbar').addClass('primary-color-dark');
                $('#topbar').removeClass('secondary-bg-color');

                if (!/^CR/.test(get_storage_value('loginid'))) {
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
            $('.by_client_type.client_logged_out').removeClass('invisible');
            $('.by_client_type.client_logged_out').show();

            $('#topbar').removeClass('secondary-bg-color');
            $('#topbar').addClass('primary-color-dark');
        }
    };

    var send_logout_request = function(showLoginPage) {
        if (showLoginPage) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1' });
    };

    var do_logout = function(response) {
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
        window.location.reload();
    };

    // type can take one or more params, separated by comma
    // e.g. one param = 'authenticated', two params = 'unwelcome, authenticated'
    // match_type can be `any` `all`, by default is `any`
    // should be passed when more than one param in type.
    // `any` will return true if any of the params in type are found in client status
    // `all` will return true if all of the params in type are found in client status
    var status_detected = function(type, match_type) {
        var client_status = sessionStorage.getItem('client_status');
        if (!client_status || client_status.length === 0) return false;
        var require_auth = /\,/.test(type) ? type.split(/, */) : [type];
        client_status = client_status.split(',');
        match_type = match_type && match_type === 'all' ? 'all' : 'any';
        for (var i = 0; i < require_auth.length; i++) {
            if (match_type === 'any' && (client_status.indexOf(require_auth[i]) > -1)) return true;
            if (match_type === 'all' && (client_status.indexOf(require_auth[i]) < 0)) return false;
        }
        return (match_type !== 'any');
    };

    return {
        init                  : init,
        validate_loginid      : validate_loginid,
        redirect_if_is_virtual: redirect_if_is_virtual,
        redirect_if_login     : redirect_if_login,
        set_value             : set_storage_value,
        get_value             : get_storage_value,
        get_boolean           : get_boolean,
        check_storage_values  : check_storage_values,
        response_authorize    : response_authorize,
        check_tnc             : check_tnc,
        set_check_tnc         : set_check_tnc,
        clear_storage_values  : clear_storage_values,
        get_token             : get_token,
        add_token             : add_token,
        set_cookie            : set_cookie,
        process_new_account   : process_new_account,

        can_upgrade_gaming_to_financial : can_upgrade_gaming_to_financial,
        can_upgrade_virtual_to_financial: can_upgrade_virtual_to_financial,
        can_upgrade_virtual_to_japan    : can_upgrade_virtual_to_japan,
        activate_by_client_type         : activate_by_client_type,

        send_logout_request: send_logout_request,
        do_logout          : do_logout,
        status_detected    : status_detected,
    };
})();

module.exports = {
    Client          : Client,
    validate_loginid: Client.validate_loginid,
};
