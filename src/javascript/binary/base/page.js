var Login                 = require('./login').Login;
var showLocalTimeOnHover  = require('./utility').showLocalTimeOnHover;
var toJapanTimeIfNeeded   = require('./utility').toJapanTimeIfNeeded;
var template              = require('./utility').template;
var parseLoginIDList      = require('./utility').parseLoginIDList;
var isStorageSupported    = require('./storage').isStorageSupported;
var Store                 = require('./storage').Store;
var InScriptStore         = require('./storage').InScriptStore;
var CookieStorage         = require('./storage').CookieStorage;
var localizeForLang       = require('./localize').localizeForLang;
var localize              = require('./localize').localize;
var getLanguage           = require('./language').getLanguage;
var setCookieLanguage     = require('./language').setCookieLanguage;
var GTM                   = require('./gtm').GTM;
var Url                   = require('./url').Url;
var TrafficSource         = require('../common_functions/traffic_source').TrafficSource;
var RiskClassification    = require('../common_functions/risk_classification').RiskClassification;
var checkClientsCountry   = require('../common_functions/country_base').checkClientsCountry;
var japanese_client       = require('../common_functions/country_base').japanese_client;
var checkLanguage         = require('../common_functions/country_base').checkLanguage;
var FinancialAssessmentws = require('../websocket_pages/user/account/settings/financial_assessment').FinancialAssessmentws;
var ViewBalance           = require('../websocket_pages/user/viewbalance/viewbalance.init').ViewBalance;
var CashierJP             = require('../../binary_japan/cashier').CashierJP;
var Cookies               = require('../../lib/js-cookie');
var moment                = require('moment');
var MenuContent           = require('./menu_content').MenuContent;
var pjax                  = require('../../lib/pjax-lib');
require('../../lib/polyfills/array.includes');
require('../../lib/polyfills/string.includes');
require('../../lib/mmenu/jquery.mmenu.min.all.js');


var clock_started = false;

var SessionStore,
    LocalStore;
if (isStorageSupported(window.localStorage)) {
    LocalStore = new Store(window.localStorage);
}

if (isStorageSupported(window.sessionStorage)) {
    if (!LocalStore) {
        LocalStore = new Store(window.sessionStorage);
    }
    SessionStore = new Store(window.sessionStorage);
}

if (!SessionStore || !LocalStore) {
    if (!LocalStore) {
        LocalStore = new InScriptStore();
    }
    if (!SessionStore) {
        SessionStore = new InScriptStore();
    }
}

var TUser = (function () {
    var data = {};
    return {
        extend: function(ext) { $.extend(data, ext); },
        set   : function(a) { data = a; },
        get   : function() { return data; },
    };
})();

var User = function() {
    this.email   = Cookies.get('email');
    this.loginid = Cookies.get('loginid');
    this.loginid_array = parseLoginIDList(Cookies.get('loginid_list') || '');
    this.is_logged_in = !!(
        this.loginid &&
        this.loginid_array.length > 0 &&
        localStorage.getItem('client.tokens')
    );
};

var Client = function() {
    this.loginid      = Cookies.get('loginid');
    this.residence    = Cookies.get('residence');
    this.is_logged_in = !!(this.loginid && this.loginid.length > 0 && localStorage.getItem('client.tokens'));
};

Client.prototype = {
    show_login_if_logout: function(shouldReplacePageContents) {
        if (!this.is_logged_in && shouldReplacePageContents) {
            $('#content > .container').addClass('center-text')
                .html($('<p/>', {
                    class: 'notice-msg',
                    html : localize('Please [_1] to view this page',
                        ['<a class="login_link" href="javascript:;">' + localize('login') + '</a>']),
                }));
            $('.login_link').click(function() { Login.redirect_to_login(); });
        }
        return !this.is_logged_in;
    },
    redirect_if_is_virtual: function(redirectPage) {
        var is_virtual = this.is_virtual();
        if (is_virtual) {
            window.location.href = page.url.url_for(redirectPage || '');
        }
        return is_virtual;
    },
    redirect_if_login: function() {
        if (page.client.is_logged_in) {
            window.location.href = page.url.default_redirect_url();
        }
        return page.client.is_logged_in;
    },
    is_virtual: function() {
        return this.get_storage_value('is_virtual') === '1';
    },
    require_reality_check: function() {
        return this.get_storage_value('has_reality_check') === '1';
    },
    get_storage_value: function(key) {
        return LocalStore.get('client.' + key) || '';
    },
    set_storage_value: function(key, value) {
        return LocalStore.set('client.' + key, value);
    },
    check_storage_values: function(origin) {
        var is_ok = true;

        if (!this.get_storage_value('is_virtual') && TUser.get().hasOwnProperty('is_virtual')) {
            this.set_storage_value('is_virtual', TUser.get().is_virtual);
        }

        // currencies
        if (!this.get_storage_value('currencies')) {
            BinarySocket.send({
                payout_currencies: 1,
                passthrough      : {
                    handler: 'page.client',
                    origin : origin || '',
                },
            });
            is_ok = false;
        }

        if (this.is_logged_in) {
            if (
                !this.get_storage_value('is_virtual') &&
                Cookies.get('residence') &&
                !this.get_storage_value('has_reality_check')
            ) {
                BinarySocket.send({
                    landing_company: Cookies.get('residence'),
                    passthrough    : {
                        handler: 'page.client',
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
    },
    response_payout_currencies: function(response) {
        if (!response.hasOwnProperty('error')) {
            this.set_storage_value('currencies', response.payout_currencies.join(','));
        }
    },
    response_landing_company: function(response) {
        if (!response.hasOwnProperty('error')) {
            var has_reality_check = response.has_reality_check;
            this.set_storage_value('has_reality_check', has_reality_check);
        }
    },
    response_authorize: function(response) {
        page.client.set_storage_value('session_start', parseInt(moment().valueOf() / 1000));
        TUser.set(response.authorize);
        if (!Cookies.get('email')) this.set_cookie('email', response.authorize.email);
        this.set_storage_value('is_virtual', TUser.get().is_virtual);
        this.check_storage_values();
        page.contents.activate_by_client_type();
        page.contents.activate_by_login();
        CashierJP.set_email_id();
    },
    response_get_settings: function(response) {
        page.user.first_name = response.get_settings.first_name;
        CashierJP.set_name_id();
    },
    check_tnc: function() {
        if (/user\/tnc_approvalws/.test(window.location.href) || /terms\-and\-conditions/.test(window.location.href)) return;
        if (!page.client.is_virtual() && new RegExp(page.client.loginid).test(sessionStorage.getItem('check_tnc'))) {
            var client_tnc_status   = this.get_storage_value('tnc_status'),
                website_tnc_version = LocalStore.get('website.tnc_version');
            if (client_tnc_status && website_tnc_version) {
                if (client_tnc_status !== website_tnc_version) {
                    sessionStorage.setItem('tnc_redirect', window.location.href);
                    window.location.href = page.url.url_for('user/tnc_approvalws');
                }
            }
        }
    },
    clear_storage_values: function() {
        var that  = this;
        var items = ['currencies', 'landing_company_name', 'is_virtual',
            'has_reality_check', 'tnc_status', 'session_duration_limit', 'session_start'];
        items.forEach(function(item) {
            that.set_storage_value(item, '');
        });
        localStorage.removeItem('website.tnc_version');
        sessionStorage.setItem('currencies', '');
    },
    update_storage_values: function() {
        this.clear_storage_values();
        this.check_storage_values();
    },
    send_logout_request: function(showLoginPage) {
        if (showLoginPage) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({ logout: '1' });
    },
    get_token: function(loginid) {
        var token,
            tokens = page.client.get_storage_value('tokens');
        if (loginid && tokens) {
            var tokensObj = JSON.parse(tokens);
            if (tokensObj.hasOwnProperty(loginid) && tokensObj[loginid]) {
                token = tokensObj[loginid];
            }
        }
        return token;
    },
    add_token: function(loginid, token) {
        if (!loginid || !token || this.get_token(loginid)) {
            return false;
        }
        var tokens = page.client.get_storage_value('tokens');
        var tokensObj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
        tokensObj[loginid] = token;
        this.set_storage_value('tokens', JSON.stringify(tokensObj));
        return true;
    },
    set_cookie: function(cookieName, Value, domain) {
        var cookie_expire = new Date();
        cookie_expire.setDate(cookie_expire.getDate() + 60);
        var cookie = new CookieStorage(cookieName, domain);
        cookie.write(Value, cookie_expire, true);
    },
    process_new_account: function(email, loginid, token, is_virtual) {
        if (!email || !loginid || !token) {
            return;
        }
        // save token
        this.add_token(loginid, token);
        // set cookies
        this.set_cookie('email',        email);
        this.set_cookie('login',        token);
        this.set_cookie('loginid',      loginid);
        this.set_cookie('loginid_list', is_virtual ? loginid + ':V:E' : loginid + ':R:E+' + Cookies.get('loginid_list'));
        // set local storage
        GTM.set_newaccount_flag();
        localStorage.setItem('active_loginid', loginid);
        window.location.href = page.url.default_redirect_url();
    },
    can_upgrade_gaming_to_financial: function(data) {
        return (data.hasOwnProperty('financial_company') && data.financial_company.shortcode === 'maltainvest');
    },
    can_upgrade_virtual_to_financial: function(data) {
        return (data.hasOwnProperty('financial_company') && !data.hasOwnProperty('gaming_company') && data.financial_company.shortcode === 'maltainvest');
    },
    can_upgrade_virtual_to_japan: function(data) {
        return (data.hasOwnProperty('financial_company') && !data.hasOwnProperty('gaming_company') && data.financial_company.shortcode === 'japan');
    },
};

var Menu = function(url) {
    this.page_url = url;
    var that = this;
    $(this.page_url).on('change', function() { that.activate(); });
};

Menu.prototype = {
    on_unload: function() {
        this.reset();
    },
    activate: function() {
        $('#menu-top li').removeClass('active');
        this.hide_main_menu();

        var active = this.active_menu_top();
        var trading = new RegExp('\/(jp_|multi_barriers_|)trading\.html');
        var trading_is_active = trading.test(window.location.pathname);
        if (active) {
            active.addClass('active');
        }
        var is_trading_submenu = /\/cashier|\/resources/.test(window.location.pathname) || trading_is_active;
        if (page.client.is_logged_in || trading_is_active || is_trading_submenu) {
            this.show_main_menu();
        }
    },
    show_main_menu: function() {
        $('#main-menu').removeClass('hidden');
        this.activate_main_menu();
    },
    hide_main_menu: function() {
        $('#main-menu').addClass('hidden');
    },
    activate_main_menu: function() {
        // First unset everything.
        $('#main-menu li.item').removeClass('active');
        $('#main-menu li.item').removeClass('hover');
        $('#main-menu li.sub_item a').removeClass('a-active');

        var active = this.active_main_menu();
        if (active.subitem) {
            active.subitem.addClass('a-active');
        }

        if (active.item) {
            active.item.addClass('active');
            active.item.addClass('hover');
        }

        this.on_mouse_hover(active.item);
    },
    reset: function() {
        $('#main-menu .item').unbind();
        $('#main-menu').unbind();
    },
    on_mouse_hover: function(active_item) {
        $('#main-menu .item').on('mouseenter', function() {
            $('#main-menu li.item').removeClass('hover');
            $(this).addClass('hover');
        });

        $('#main-menu').on('mouseleave', function() {
            $('#main-menu li.item').removeClass('hover');
            if (active_item) active_item.addClass('hover');
        });
    },
    active_menu_top: function() {
        var active;
        var path = window.location.pathname;
        $('#menu-top li a').each(function() {
            if (path.indexOf(this.pathname.replace(/\.html/i, '')) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    },
    active_main_menu: function() {
        var page_url = this.page_url;
        if (/cashier/i.test(page_url.location.href) && !(/cashier_password/.test(page_url.location.href))) {
            page_url = new Url($('#topMenuCashier a').attr('href'));
        }

        var item;
        var subitem;

        // Is something selected in main items list
        $('#main-menu .items a').each(function () {
            var url = new Url($(this).attr('href'));
            if (url.is_in(page_url)) {
                item = $(this).closest('.item');
            }
        });

        $('#main-menu .sub_items a').each(function() {
            var link_href = $(this).attr('href');
            if (link_href) {
                var url = new Url(link_href);
                if (url.is_in(page_url)) {
                    item = $(this).closest('.item');
                    subitem = $(this);
                }
            }
        });

        return { item: item, subitem: subitem };
    },
    check_payment_agent: function(is_authenticated_payment_agent) {
        if (is_authenticated_payment_agent) {
            $('#topMenuPaymentAgent').removeClass('invisible');
        }
    },
};

var Header = function(params) {
    this.user = params.user;
    this.client = params.client;
    this.menu = new Menu(params.url);
};

Header.prototype = {
    on_load: function() {
        this.show_or_hide_login_form();
        this.show_or_hide_language();
        this.logout_handler();
        this.check_risk_classification();
        if (!$('body').hasClass('BlueTopBack')) {
            checkClientsCountry();
        }
        if (page.client.is_logged_in) {
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
        if (!this.user.is_logged_in || !this.client.is_logged_in) return;
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
        var loginid_array = this.user.loginid_array;
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
                if (curr_id === this.client.loginid) {
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
    start_clock_ws: function() {
        function getTime() {
            clock_started = true;
            BinarySocket.send({ time: 1, passthrough: { client_time: moment().valueOf() } });
        }
        this.run = function() {
            setInterval(getTime, 30000);
        };

        this.run();
        getTime();
    },
    time_counter: function(response) {
        if (isNaN(response.echo_req.passthrough.client_time) || response.error) {
            page.header.start_clock_ws();
            return;
        }
        clearTimeout(window.HeaderTimeUpdateTimeOutRef);
        var that = this;
        var clock = $('#gmt-clock');
        var start_timestamp = response.time;
        var pass = response.echo_req.passthrough.client_time;

        that.client_time_at_response = moment().valueOf();
        that.server_time_at_response = ((start_timestamp * 1000) + (that.client_time_at_response - pass));
        var update_time = function() {
            window.time = moment((that.server_time_at_response + moment().valueOf()) -
                that.client_time_at_response).utc();
            var timeStr = window.time.format('YYYY-MM-DD HH:mm') + ' GMT';
            if (japanese_client()) {
                clock.html(toJapanTimeIfNeeded(timeStr, 1, '', 1));
            } else {
                clock.html(timeStr);
                showLocalTimeOnHover('#gmt-clock');
            }
            window.HeaderTimeUpdateTimeOutRef = setTimeout(update_time, 1000);
        };
        update_time();
    },
    logout_handler: function() {
        $('a.logout').unbind('click').click(function() {
            page.client.send_logout_request();
        });
    },
    check_risk_classification: function() {
        if (localStorage.getItem('risk_classification.response') === 'high' &&
            localStorage.getItem('risk_classification') === 'high' && this.qualify_for_risk_classification()) {
            this.renderRiskClassificationPopUp();
        }
    },
    renderRiskClassificationPopUp: function () {
        if (window.location.pathname === '/user/settings/assessmentws') {
            window.location.href = page.url.url_for('user/settingsws');
            return;
        }
        $.ajax({
            url     : page.url.url_for('user/settings/assessmentws'),
            dataType: 'html',
            method  : 'GET',
            success : function(riskClassificationText) {
                if (riskClassificationText.includes('assessment_form')) {
                    var payload = $(riskClassificationText);
                    RiskClassification.showRiskClassificationPopUp(payload.find('#assessment_form'));
                    FinancialAssessmentws.LocalizeText();
                    $('#risk_classification #assessment_form').removeClass('invisible')
                                        .attr('style', 'text-align: left;');
                    $('#risk_classification #high_risk_classification').removeClass('invisible');
                    $('#risk_classification #heading_risk').removeClass('invisible');
                    $('#risk_classification #assessment_form').on('submit', function(event) {
                        event.preventDefault();
                        FinancialAssessmentws.submitForm();
                        return false;
                    });
                }
            },
            error: function() {
                return false;
            },
        });
        $('#risk_classification #assessment_form').on('submit', function(event) {
            event.preventDefault();
            FinancialAssessmentws.submitForm();
            return false;
        });
    },
    qualify_for_risk_classification: function() {
        if (page.client.is_logged_in && !page.client.is_virtual() &&
            page.client.residence !== 'jp' && !$('body').hasClass('BlueTopBack') && $('#assessment_form').length === 0 &&
            (localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval'))) {
            return true;
        }
        return false;
    },
    validate_cookies: function() {
        var loginid_list = Cookies.get('loginid_list');
        var loginid      = Cookies.get('loginid');
        if (!loginid || !loginid_list) return;

        var accIds = loginid_list.split('+');
        var valid_loginids = new RegExp('^(MX|MF|VRTC|MLT|CR|FOG|VRTJ|JP)[0-9]+$', 'i');

        function is_loginid_valid(login_id) {
            return login_id ?
                valid_loginids.test(login_id) :
                true;
        }

        if (!is_loginid_valid(loginid)) {
            page.client.send_logout_request();
        }

        accIds.forEach(function(acc_id) {
            if (!is_loginid_valid(acc_id.split(':')[0])) {
                page.client.send_logout_request();
            }
        });
    },
    do_logout: function(response) {
        if (response.logout !== 1) return;
        page.client.clear_storage_values();
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
};

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

var Page = function() {
    this.is_loaded_by_pjax = false;
    this.user = new User();
    this.client = new Client();
    this.url = new Url();
    this.header = new Header({ user: this.user, client: this.client, url: this.url });
    this.contents = new Contents(this.client, this.user);
    $('#logo').on('click', function() {
        load_with_pjax(page.url.url_for(page.client.is_logged_in ? japanese_client() ? 'multi_barriers_trading' : 'trading' : ''));
    });
};

Page.prototype = {
    on_load: function() {
        this.url.reset();
        localizeForLang(getLanguage());
        this.header.on_load();
        this.on_change_loginid();
        this.record_affiliate_exposure();
        this.contents.on_load();
        this.on_click_acc_transfer();
        if (this.is_loaded_by_pjax) {
            this.show_authenticate_message();
        }
        if (this.client.is_logged_in) {
            ViewBalance.init();
        } else {
            LocalStore.set('reality_check.ack', 0);
        }
        setCookieLanguage();
        if (sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirect_to_login();
        }
        checkLanguage();
        TrafficSource.setData();
        this.endpoint_notification();
        BinarySocket.init();
        this.show_notification_outdated_browser();
    },
    on_unload: function() {
        this.header.on_unload();
        this.contents.on_unload();
    },
    on_change_loginid: function() {
        var that = this;
        $('.login-id-list a').on('click', function(e) {
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            that.switch_loginid($(this).attr('value'));
        });
    },
    switch_loginid: function(loginid) {
        if (!loginid || loginid.length === 0) {
            return;
        }
        var token = page.client.get_token(loginid);
        if (!token || token.length === 0) {
            page.client.send_logout_request(true);
            return;
        }

        // cleaning the previous values
        page.client.clear_storage_values();
        sessionStorage.setItem('active_tab', '1');
        sessionStorage.removeItem('client_status');
        // set cookies: loginid, login
        page.client.set_cookie('loginid', loginid);
        page.client.set_cookie('login',   token);
        // set local storage
        GTM.set_login_flag();
        localStorage.setItem('active_loginid', loginid);
        $('.login-id-list a').removeAttr('disabled');
        page.reload();
    },
    on_click_acc_transfer: function() {
        $('#acc_transfer_submit').on('click', function() {
            var amount = $('#acc_transfer_amount').val();
            if (!/^[0-9]+\.?[0-9]{0,2}$/.test(amount) || amount < 0.1) {
                $('#invalid_amount').removeClass('invisible');
                $('#invalid_amount').show();
                return false;
            }
            $('#acc_transfer_submit').submit();
            return true;
        });
    },
    record_affiliate_exposure: function() {
        var token = this.url.param('t');
        if (!token || token.length !== 32) {
            return false;
        }
        var token_length = token.length;
        var is_subsidiary = /\w{1}/.test(this.url.param('s'));

        var cookie_token = Cookies.getJSON('affiliate_tracking');
        if (cookie_token) {
            // Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token.t) {
                return false;
            }
        }

        // Record the affiliate exposure. Overwrite existing cookie, if any.
        var cookie_hash = {};
        if (token_length === 32) {
            cookie_hash.t = token.toString();
        }
        if (is_subsidiary) {
            cookie_hash.s = '1';
        }

        Cookies.set('affiliate_tracking', cookie_hash, {
            expires: 365, // expires in 365 days
            path   : '/',
            domain : '.' + location.hostname.split('.').slice(-2).join('.'),
        });
        return true;
    },
    reload: function(forcedReload) {
        window.location.reload(!!forcedReload);
    },
    check_new_release: function() { // calling this method is handled by GTM tags
        var last_reload = localStorage.getItem('new_release_reload_time');
        // prevent reload in less than 10 minutes
        if (last_reload && +last_reload + (10 * 60 * 1000) > moment().valueOf()) return;
        var currect_hash = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src').split('?')[1];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (+xhttp.readyState === 4 && +xhttp.status === 200) {
                var latest_hash = xhttp.responseText;
                if (latest_hash && latest_hash !== currect_hash) {
                    localStorage.setItem('new_release_reload_time', moment().valueOf());
                    page.reload(true);
                }
            }
        };
        xhttp.open('GET', page.url.url_for_static() + 'version?' + Math.random().toString(36).slice(2), true);
        xhttp.send();
    },
    endpoint_notification: function() {
        var server  = localStorage.getItem('config.server_url');
        if (server && server.length > 0) {
            var message = (/www\.binary\.com/i.test(window.location.hostname) ? '' :
                localize('This is a staging server - For testing purposes only') + ' - ') +
                localize('The server <a href="[_1]">endpoint</a> is: [_2]', [page.url.url_for('endpoint'), server]);
            $('#end-note').html(message).removeClass('invisible');
            $('#footer').css('padding-bottom', $('#end-note').height());
        }
    },
    // type can take one or more params, separated by comma
    // e.g. one param = 'authenticated', two params = 'unwelcome, authenticated'
    // match_type can be `any` `all`, by default is `any`
    // should be passed when more than one param in type.
    // `any` will return true if any of the params in type are found in client status
    // `all` will return true if all of the params in type are found in client status
    client_status_detected: function(type, match_type) {
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
    },
    show_authenticate_message: function() {
        if ($('.authenticate-msg').length !== 0) return;

        var p = $('<p/>', { class: 'authenticate-msg notice-msg' }),
            span;

        if (this.client_status_detected('unwelcome')) {
            var purchase_button = $('.purchase_button');
            if (purchase_button.length > 0 && !purchase_button.parent().hasClass('button-disabled')) {
                $.each(purchase_button, function() {
                    $(this).off('click dblclick').removeAttr('data-balloon').parent()
                        .addClass('button-disabled');
                });
            }
        }

        if (this.client_status_detected('unwelcome, cashier_locked', 'any')) {
            var if_balance_zero = $('#if-balance-zero');
            if (if_balance_zero.length > 0 && !if_balance_zero.hasClass('button-disabled')) {
                if_balance_zero.removeAttr('href').addClass('button-disabled');
            }
        }

        if (this.client_status_detected('authenticated, unwelcome', 'all')) {
            span = $('<span/>', { html: template(localize('Your account is currently suspended. Only withdrawals are now permitted. For further information, please contact [_1].', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (this.client_status_detected('unwelcome')) {
            span = this.general_authentication_message();
        } else if (this.client_status_detected('authenticated, cashier_locked', 'all') && /cashier\.html/.test(window.location.href)) {
            span = $('<span/>', { html: template(localize('Deposits and withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (this.client_status_detected('cashier_locked') && /cashier\.html/.test(window.location.href)) {
            span = this.general_authentication_message();
        } else if (this.client_status_detected('authenticated, withdrawal_locked', 'all') && /cashier\.html/.test(window.location.href)) {
            span = $('<span/>', { html: template(localize('Withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        } else if (this.client_status_detected('withdrawal_locked') && /cashier\.html/.test(window.location.href)) {
            span = this.general_authentication_message();
        }
        if (span) {
            $('#content > .container').prepend(p.append(span));
        }
    },
    general_authentication_message: function() {
        var span = $('<span/>', { html: template(localize('To authenticate your account, kindly email the following to [_1]:', ['<a href="mailto:support@binary.com">support@binary.com</a>'])) });
        var ul   = $('<ul/>',   { class: 'checked' });
        var li1  = $('<li/>',   { text: localize('A scanned copy of your passport, driving licence (provisional or full) or identity card, showing your name and date of birth. Your document must be valid for at least 6 months after this date.') });
        var li2  = $('<li/>',   { text: localize('A scanned copy of a utility bill or bank statement (no more than 3 months old)') });
        return span.append(ul.append(li1, li2));
    },
    show_notification_outdated_browser: function() {
        window.$buoop = {
            vs : { i: 11, f: -4, o: -4, s: 9, c: -4 },
            api: 4,
            l  : getLanguage().toLowerCase(),
            url: 'https://whatbrowser.org/',
        };
        $(document).ready(function() {
            $('body').append($('<script/>', { src: '//browser-update.org/update.min.js' }));
        });
    },
};

var page = new Page();

// for IE (before 10) we use a jquery plugin called jQuery.XDomainRequest. Explained here,
// http://stackoverflow.com/questions/11487216/cors-with-jquery-and-xdomainrequest-in-ie8-9
//
$(function() {
    $(document).ajaxSuccess(function () {
        var contents = new Contents(page.client, page.user);
        contents.on_load();
    });
});

var make_mobile_menu = function () {
    if ($('#mobile-menu-container').is(':visible')) {
        $('#mobile-menu').mmenu({
            position       : 'right',
            zposition      : 'front',
            slidingSubmenus: false,
            searchfield    : true,
            onClick        : {
                close: true,
            },
        }, {
            selectedClass: 'active',
        });
    }
};

// LocalStorage can be used as a means of communication among
// different windows. The problem that is solved here is what
// happens if the user logs out or switches loginid in one
// window while keeping another window or tab open. This can
// lead to unintended trades. The solution is to reload the
// page in all windows after switching loginid or after logout.

// onLoad.queue does not work on the home page.
// jQuery's ready function works always.

$(document).ready(function () {
    if ($('body').hasClass('BlueTopBack')) return; // exclude BO
    // Cookies is not always available.
    // So, fall back to a more basic solution.
    var match = document.cookie.match(/\bloginid=(\w+)/);
    match = match ? match[1] : '';
    $(window).on('storage', function (jq_event) {
        switch (jq_event.originalEvent.key) {
            case 'active_loginid':
                if (jq_event.originalEvent.newValue === match) return;
                if (jq_event.originalEvent.newValue === '') {
                    // logged out
                    page.reload();
                } else if (!window.is_logging_in) {
                    // loginid switch
                    page.reload();
                }
                break;
            case 'new_release_reload_time':
                if (jq_event.originalEvent.newValue !== jq_event.originalEvent.oldValue) {
                    page.reload(true);
                }
                break;
            // no default
        }
    });
    LocalStore.set('active_loginid', match);
});

// For object shape coherence we create named objects to be inserted into the queue.
var URLPjaxQueueElement = function(exec_function, url) {
    this.method = exec_function;
    if (url) {
        this.url = new RegExp(url);
    } else {
        this.url = /.*/;
    }
};

URLPjaxQueueElement.prototype = {
    fire: function(in_url) {
        if (this.url.test(in_url)) {
            this.method();
        }
    },
};

var IDPjaxQueueElement = function(exec_function, id) {
    this.method = exec_function;
    this.sel = '#' + id;
};

IDPjaxQueueElement.prototype = {
    fire: function() {
        if ($(this.sel).length > 0) {
            this.method();
        }
    },
};

var PjaxExecQueue = function () {
    this.url_exec_queue = [];
    this.id_exec_queue = [];
    this.fired = false;
    this.content = $('#content');
};

PjaxExecQueue.prototype = {
    queue: function (exec_function) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function));
    },
    queue_for_url: function (exec_function, url_pattern) {
        this.url_exec_queue.unshift(new URLPjaxQueueElement(exec_function, url_pattern));
    },
    queue_if_id_present: function(exec_function, id) {
        this.id_exec_queue.unshift(new IDPjaxQueueElement(exec_function, id));
    },
    fire: function () {
        if (!this.fired) {
            var match_loc = window.location.href;
            var i = this.url_exec_queue.length;
            while (i--) {
                this.url_exec_queue[i].fire(match_loc);
            }

            i = this.id_exec_queue.length;
            while (i--) {
                this.id_exec_queue[i].fire(match_loc);
            }
        }
        this.fired = true;
    },
    reset: function() {
        this.fired = false;
    },
    loading: function () {
        this.reset();
    },
};

var pjax_config_page = function(url, exec_functions) {
    var functions = exec_functions();
    if (functions.onLoad) onLoad.queue_for_url(functions.onLoad, url);
    if (functions.onUnload) onUnload.queue_for_url(functions.onUnload, url);
};

var pjax_config = function() {
    return {
        container : 'content',
        beforeSend: function() {
            onLoad.loading();
            onUnload.fire();
        },
        complete: function() {
            page.is_loaded_by_pjax = true;
            onLoad.fire();
            onUnload.reset();
        },
        error: function() {
            var error_text = SessionStore.get('errors.500');
            if (error_text) {
                $('#content').html(error_text);
            } else {
                $.get('/errors/500.html').always(function(content) {
                    var tmp = document.createElement('div');
                    tmp.innerHTML = content;
                    var tmpNodes = tmp.getElementsByTagName('div');
                    for (var i = 0, l = tmpNodes.length; i < l; i++) {
                        if (tmpNodes[i].id === 'content') {
                            SessionStore.set('errors.500', tmpNodes[i].innerHTML);
                            $('#content').html(tmpNodes[i].innerHTML);
                            break;
                        }
                    }
                });
            }
        },
        useClass: 'pjaxload',
    };
};

var init_pjax = function () {
    if (!$('body').hasClass('BlueTopBack')) { // No Pjax for BO.
        pjax.connect(pjax_config());
    }
};

var load_with_pjax = function(url) {
    if (page.url.is_in(new Url(url))) {
        return;
    }

    var config = pjax_config();
    config.url = url;
    config.update_url = url;
    config.history = true;
    pjax.invoke(config);
};

// Reduce duplication as required Auth is a common pattern
var pjax_config_page_require_auth = function(url, exec) {
    var oldOnLoad = exec().onLoad;
    var newOnLoad = function() {
        if (!page.client.show_login_if_logout(true)) {
            oldOnLoad();
        }
    };

    var newExecFn = function() {
        return {
            onLoad  : newOnLoad,
            onUnload: exec().onUnload,
        };
    };
    pjax_config_page(url, newExecFn);
};

var onLoad = new PjaxExecQueue();
var onUnload = new PjaxExecQueue();

init_pjax(); // Pjax-standalone will wait for on load event before attaching.
$(function() { onLoad.fire(); });

onLoad.queue(GTM.push_data_layer);

onLoad.queue(function () {
    page.on_load();
});

onUnload.queue(function () {
    page.on_unload();
});

onLoad.queue(function () {
    $('.tm-ul > li').hover(
        function () {
            $(this).addClass('hover');
        },
        function () {
            $(this).removeClass('hover');
        });

    MenuContent.init($('.content-tab-container').find('.tm-ul'));

    make_mobile_menu();

    var i = window.location.href.split('#');
    if (i.length !== 2) return;
    var o = document.getElementsByTagName('a');
    for (var t = 0; t < o.length; t++) {
        if (o[t].href.substr(o[t].href.length - i[1].length - 1) === '#' + i[1]) {
            o[t].click();
            break;
        }
    }
});

module.exports = {
    getClockStarted : function() { return clock_started; },
    page            : page,
    make_mobile_menu: make_mobile_menu,
    TUser           : TUser,
    SessionStore    : SessionStore,
    LocalStore      : LocalStore,
    load_with_pjax  : load_with_pjax,
    pjax_config_page: pjax_config_page,

    pjax_config_page_require_auth: pjax_config_page_require_auth,
};
