var text;
var clock_started = false;

var GTM = (function() {
    "use strict";

    var gtm_data_layer_info = function(data) {
        var data_layer_info = {
            language  : page.language(),
            pageTitle : page_title(),
            pjax      : page.is_loaded_by_pjax,
            url       : document.URL,
            event     : 'page_load',
        };
        if(page.client.is_logged_in) {
            data_layer_info['visitorID'] = page.client.loginid;
        }

        $.extend(true, data_layer_info, data);

        var event = data_layer_info.event;
        delete data_layer_info['event'];

        return {
            data : data_layer_info,
            event: event,
        };
    };

    var push_data_layer = function(data) {
        if(!(/logged_inws/i).test(window.location.pathname)) {
            var info = gtm_data_layer_info(data && typeof(data) === 'object' ? data : null);
            dataLayer[0] = info.data;
            dataLayer.push(info.data);
            dataLayer.push({"event": info.event});
        }
    };

    var page_title = function() {
        var t = /^.+[:-]\s*(.+)$/.exec(document.title);
        return t && t[1] ? t[1] : document.title;
    };

    var event_handler = function(get_settings) {
        var is_login      = localStorage.getItem('GTM_login')      === '1',
            is_newaccount = localStorage.getItem('GTM_newaccount') === '1';
        if(!is_login && !is_newaccount) {
            return;
        }

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_newaccount');

        var affiliateToken = $.cookie('affiliate_tracking');
        if (affiliateToken) {
            GTM.push_data_layer({'bom_affiliate_token': JSON.parse(affiliateToken).t});
        }

        var data = {
            'visitorID'   : page.client.loginid,
            'bom_country' : get_settings.country,
            'bom_email'   : get_settings.email,
            'url'         : window.location.href,
            'bom_today'   : Math.floor(Date.now() / 1000),
            'event'       : is_newaccount ? 'new_account' : 'log_in'
        };
        if(is_newaccount) {
            data['bom_date_joined'] = data['bom_today'];
        }
        if(!page.client.is_virtual()) {
            data['bom_age']       = parseInt((moment().unix() - get_settings.date_of_birth) / 31557600);
            data['bom_firstname'] = get_settings.first_name;
            data['bom_lastname']  = get_settings.last_name;
            data['bom_phone']     = get_settings.phone;
        }
        GTM.push_data_layer(data);
    };

    var set_login_flag = function() {
        localStorage.setItem('GTM_login', '1');
    };

    var set_newaccount_flag = function() {
        localStorage.setItem('GTM_newaccount', '1');
    };

    return {
        push_data_layer     : push_data_layer,
        event_handler       : event_handler,
        set_login_flag      : set_login_flag,
        set_newaccount_flag : set_newaccount_flag,
    };
}());

var User = function() {
    this.email =  $.cookie('email');
    var loginid_list = $.cookie('loginid_list');

    if(this.email === null || typeof this.email === "undefined") {
        this.is_logged_in = false;
    } else {
        this.is_logged_in = true;

        if(loginid_list !== null && typeof loginid_list !== "undefined") {
            var loginid_array = [];
            var loginids = loginid_list.split('+').sort();

            for (var i = 0; i < loginids.length; i++) {
                var real = false;
                var disabled = false;
                var items = loginids[i].split(':');
                if (items[1] == 'R') {
                    real = true;
                }
                if (items[2] == 'D') {
                    disabled = true;
                }

                var id_obj = { 'id':items[0], 'real':real, 'disabled':disabled };
                if (/MLT/.test(items[0])) {
                    id_obj['non_financial']= true;
                }
                if (/MF/.test(items[0])) {
                    id_obj['financial']= true;
                }
                loginid_array.push(id_obj);
            }

            this.loginid_array = loginid_array;
        }
    }
};

var Client = function() {
    this.loginid      =  $.cookie('loginid');
    this.residence    =  $.cookie('residence');
    this.is_logged_in = this.loginid && this.loginid.length > 0;
};

Client.prototype = {
    show_login_if_logout: function(shouldReplacePageContents) {
        if(!this.is_logged_in) {
            if(shouldReplacePageContents) {
                $('#content > .grd-container').addClass('center').empty()
                    .append($('<p/>', {class: 'notice-msg', html: text.localize('Please [_1] to view this page')
                        .replace('[_1]', '<a class="login_link" href="javascript:;">' + text.localize('login') + '</a>')}));
                $('.login_link').click(function(){Login.redirect_to_login();});
            }
        }
        return !this.is_logged_in;
    },
    redirect_if_is_virtual: function(redirectPage) {
        var is_virtual = this.is_virtual();
        if(is_virtual) {
            window.location.href = page.url.url_for(redirectPage || '');
        }
        return is_virtual;
    },
    redirect_if_login: function() {
        if(page.client.is_logged_in) {
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

        if(!this.get_storage_value('is_virtual') && TUser.get().hasOwnProperty('is_virtual')) {
            this.set_storage_value('is_virtual', TUser.get().is_virtual);
        }

        // currencies
        if(!this.get_storage_value('currencies')) {
            BinarySocket.send({
                'payout_currencies': 1,
                'passthrough': {
                    'handler': 'page.client',
                    'origin' : origin || ''
                }
            });
            is_ok = false;
        }

        // allowed markets
        if(this.is_logged_in) {
            if(
                !this.get_storage_value('is_virtual') &&
                !this.get_storage_value('allowed_markets') &&
                TUser.get().landing_company_name &&
                !this.get_storage_value('has_reality_check')
            ) {
                $('#topMenuStartBetting').addClass('invisible');
                BinarySocket.send({
                    'landing_company_details': TUser.get().landing_company_name,
                    'passthrough': {
                        'handler': 'page.client',
                        'origin' : origin || ''
                    }
                });
                is_ok = false;
            }
        }

        // website TNC version
        if(!LocalStore.get('website.tnc_version')) {
            BinarySocket.send({'website_status': 1});
        }

        return is_ok;
    },
    response_payout_currencies: function(response) {
        if (!response.hasOwnProperty('error')) {
            this.set_storage_value('currencies', response.payout_currencies.join(','));
            if(response.echo_req.hasOwnProperty('passthrough') && response.echo_req.passthrough.origin === 'attributes.restore.currency') {
                BetForm.attributes.restore.currency();
            }
        }
    },
    response_landing_company_details: function(response) {
        if (!response.hasOwnProperty('error')) {
            var allowed_markets = response.landing_company_details.legal_allowed_markets;
            var company = response.landing_company_details.name;
            var has_reality_check = response.landing_company_details.has_reality_check;

            this.set_storage_value('allowed_markets', allowed_markets.length === 0 ? '' : allowed_markets.join(','));
            this.set_storage_value('landing_company_name', company);
            this.set_storage_value('has_reality_check', has_reality_check);

            page.header.menu.disable_not_allowed_markets();
            page.header.menu.register_dynamic_links();
            $('#topMenuStartBetting').removeClass('invisible');
        }
    },
    response_authorize: function(response) {
        page.client.set_storage_value('session_start', parseInt(moment().valueOf() / 1000));
        TUser.set(response.authorize);
        this.set_storage_value('is_virtual', TUser.get().is_virtual);
        this.check_storage_values();
        page.contents.activate_by_client_type();
        page.contents.topbar_message_visibility();
    },
    check_tnc: function() {
        if(!page.client.is_virtual() && sessionStorage.getItem('check_tnc') === '1') {
            var client_tnc_status   = this.get_storage_value('tnc_status'),
                website_tnc_version = LocalStore.get('website.tnc_version');
            if(client_tnc_status && website_tnc_version) {
                sessionStorage.removeItem('check_tnc');
                if(client_tnc_status !== website_tnc_version) {
                    sessionStorage.setItem('tnc_redirect', window.location.href);
                    window.location.href = page.url.url_for('user/tnc_approvalws');
                }
            }
        }
    },
    clear_storage_values: function() {
        var that  = this;
        var items = ['currencies', 'allowed_markets', 'landing_company_name', 'is_virtual',
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
        if(showLoginPage) {
            sessionStorage.setItem('showLoginPage', 1);
        }
        BinarySocket.send({'logout': '1'});
    },
    get_token: function(loginid) {
        var token,
            tokens = page.client.get_storage_value('tokens');
        if(loginid && tokens) {
            tokensObj = JSON.parse(tokens);
            if(tokensObj.hasOwnProperty(loginid) && tokensObj[loginid]) {
                token = tokensObj[loginid];
            }
        }
        return token;
    },
    add_token: function(loginid, token) {
        if(!loginid || !token || this.get_token(loginid)) {
            return false;
        }
        var tokens = page.client.get_storage_value('tokens');
        var tokensObj = tokens && tokens.length > 0 ? JSON.parse(tokens) : {};
        tokensObj[loginid] = token;
        this.set_storage_value('tokens', JSON.stringify(tokensObj));
    },
    set_cookie: function(cookieName, Value) {
        var cookie_expire = new Date();
        cookie_expire.setDate(cookie_expire.getDate() + 60);
        var cookie = new CookieStorage(cookieName);
        cookie.write(Value, cookie_expire, true);
    },
    process_new_account: function(email, loginid, token, is_virtual) {
        if(!email || !loginid || !token) {
            return;
        }
        // save token
        this.add_token(loginid, token);
        // set cookies
        this.set_cookie('email'       , email);
        this.set_cookie('login'       , token);
        this.set_cookie('loginid'     , loginid);
        this.set_cookie('loginid_list', is_virtual ? loginid + ':V:E' : loginid + ':R:E' + '+' + $.cookie('loginid_list'));
        // set local storage
        GTM.set_newaccount_flag();
        localStorage.setItem('active_loginid', loginid);
        window.location.href = page.url.url_for('trading');
    }
};

var URL = function (url) { // jshint ignore:line
    this.is_valid = true;
    this.history_supported = window.history && window.history.pushState;
    if(typeof url !== 'undefined') {
        this.location = $('<a>', { href: decodeURIComponent(url) } )[0];
    } else {
        this.location = window.location;
    }
};

URL.prototype = {
    url_for: function(path, params, type) {
        var mid_path = '/';
        if(/.cgi/.test(path)) {
            if(type == 'cached') {
                mid_path = '/c/';
            } else {
                mid_path = '/d/';
            }
        }

        var url = "https://" + this.location.host + mid_path + path;
        if(params) {
            url += '?' + params;
            url += '&l=' + page.language();
        } else {
            url += '?l=' + page.language();
        }

        return url;
    },
    url_for_static: function(path) {
        if(!path) {
            path = '';
        }
        else if (path.length > 0 && path[0] === '/') {
            path = path.substr(1);
        }

        var staticHost = window.staticHost;
        if(!staticHost || staticHost.length === 0) {
            staticHost = $('script[src*="binary.min.js"]').attr('src');

            if(staticHost && staticHost.length > 0) {
                staticHost = staticHost.substr(0, staticHost.indexOf('/js/') + 1);
            }
            else {
                staticHost = 'https://static.binary.com/';
            }

            window.staticHost = staticHost;
        }

        return staticHost + path;
    },
    reset: function() {
        this.location = window.location;
        this._param_hash = undefined;
        this.is_valid = true;
        $(this).trigger("change", [ this ]);
    },
    invalidate: function() {
        this.is_valid = false;
    },
    update: function(url) {
        var state_info = { container: 'content', url: url, useClass: 'pjaxload' };
        if(this.history_supported) {
            history.pushState(state_info, '', url);
            this.reset();
        }
        this.is_valid = true;
    },
    param: function(name) {
        var param_hash= this.params_hash();
        return param_hash[name];
    },
    replaceQueryParam: function (param, newval, search) {
      var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
      var query = search.replace(regex, "$1").replace(/&$/, '');
      return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
    },
    param_if_valid: function(name) {
        if(this.is_valid) {
           return this.param(name);
        }
        return;
    },
    path_matches: function(url) {
        //pathname is /d/page.cgi. Eliminate /d/ and /c/ from both urls.
        var this_pathname = this.location.pathname.replace(/\/[d|c]\//g, '');
        var url_pathname = url.location.pathname.replace(/\/[d|c]\//g, '');
        return (this_pathname == url_pathname || '/' + this_pathname == url_pathname);
    },
    params_hash_to_string: function(params) {
        var as_array = [];
        for(var p_key in params) if (params.hasOwnProperty(p_key)) {
            as_array.push(p_key + '=' + params[p_key]);
        }

        return as_array.join('&');
    },
    is_in: function(url) {
        if(this.path_matches(url)) {
            var this_params = this.params();
            var param_count = this_params.length;
            var match_count = 0;
            while(param_count--) {
                if(url.param(this_params[param_count][0]) == this_params[param_count][1]) {
                    match_count++;
                }
            }
            if(match_count == this_params.length) {
                return true;
            }
        }

        return false;
    },
    params_hash: function() {
        if(!this._param_hash) {
            this._param_hash = {};
            var params = this.params();
            var param = params.length;
            while(param--) {
                if(params[param][0]) {
                    this._param_hash[params[param][0]] = params[param][1];
                }
            }
        }
        return this._param_hash;
    },
    params: function() {
        var params = [];
        var parsed = this.location.search.substr(1).split('&');
        var p_l = parsed.length;
        while(p_l--) {
            var param = parsed[p_l].split('=');
            params.push(param);
        }
        return params;
    },
    default_redirect_url: function() {
        return this.url_for('trading');
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
        var trading = $('#menu-top li:eq(4)');
        if(active) {
            active.addClass('active');
            if(trading.is(active)) {
                this.show_main_menu();
            }
        } else {
            var is_mojo_page = /^\/$|\/login|\/home|\/ad|\/open-source-projects|\/bulk-trader-facility|\/partners|\/payment-agent|\/about-us|\/group-information|\/group-history|\/careers|\/contact|\/terms-and-conditions|\/terms-and-conditions-jp|\/responsible-trading|\/us_patents|\/lost_password|\/realws|\/virtualws|\/open-positions|\/job-details|\/user-testing|\/japanws|\/maltainvestws|\/reset_passwordws|\/supported-browsers$/.test(window.location.pathname);
            if(!is_mojo_page) {
                trading.addClass('active');
                this.show_main_menu();
            }
        }
    },
    show_main_menu: function() {
        $("#main-menu").removeClass('hidden');
        this.activate_main_menu();
    },
    hide_main_menu: function() {
        $("#main-menu").addClass('hidden');
    },
    activate_main_menu: function() {
        //First unset everything.
        $("#main-menu li.item").removeClass('active');
        $("#main-menu li.item").removeClass('hover');
        $("#main-menu li.sub_item a").removeClass('a-active');

        var active = this.active_main_menu();
        if(active.subitem) {
            active.subitem.addClass('a-active');
        }

        if(active.item) {
            active.item.addClass('active');
            active.item.addClass('hover');
        }

        this.on_mouse_hover(active.item);

        this.disable_not_allowed_markets();
    },
    disable_not_allowed_markets: function() {
        // enable only allowed markets
        var allowed_markets = page.client.get_storage_value('allowed_markets');
        if(!allowed_markets && page.client.is_logged_in) {
            if(TUser.get().hasOwnProperty('is_virtual') && !TUser.get().is_virtual) {
                $('#topMenuStartBetting').addClass('invisible');
            }
            return;
        }

        var markets_array = allowed_markets ? allowed_markets.split(',') : [];
        var sub_items = $('li#topMenuStartBetting ul.sub_items');
        sub_items.find('li').each(function () {
            var link_id = $(this).attr('id').split('_')[1];
            if(markets_array.indexOf(link_id) < 0 && page.client.is_logged_in && !page.client.is_virtual()) {
                var link = $(this).find('a');
                var link_text = link.text();
                var link_href = link.attr('href');
                link.replaceWith($('<span/>', {class: 'link disabled-link', text: link_text, link_url: link_href}));
            } else {
                var span = $(this).find('span');
                var span_text = span.text();
                var span_href = span.attr('link_url');
                span.replaceWith($('<a/>', {class: 'link', text: span_text, href: span_href}));
            }
        });
        $('#topMenuStartBetting').removeClass('invisible');
    },
    reset: function() {
        $("#main-menu .item").unbind();
        $("#main-menu").unbind();
    },
    on_mouse_hover: function(active_item) {
        $("#main-menu .item").on( 'mouseenter', function() {
            $("#main-menu li.item").removeClass('hover');
            $(this).addClass('hover');
        });

        $("#main-menu").on('mouseleave', function() {
            $("#main-menu li.item").removeClass('hover');
            if(active_item)
                active_item.addClass('hover');
        });
    },
    active_menu_top: function() {
        var active;
        var path = window.location.pathname;
        $('#menu-top li a').each(function() {
            if(path.indexOf(this.pathname) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    },
    active_main_menu: function() {
        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);

        var item;
        var subitem;

        var that = this;
        //Is something selected in main items list
        $("#main-menu .items a").each(function () {
            var url = new URL($(this).attr('href'));
            if(url.is_in(that.page_url)) {
                item = $(this).closest('.item');
            }
        });

        $("#main-menu .sub_items a").each(function(){
            var link_href = $(this).attr('href');
            if (link_href) {
                var url = new URL(link_href);
                if(url.is_in(that.page_url)) {
                    item = $(this).closest('.item');
                    subitem = $(this);
                }
            }
        });

        return { item: item, subitem: subitem };
    },
    register_dynamic_links: function() {
        var stored_market = page.url.param('market') || LocalStore.get('bet_page.market') || 'forex';
        var allowed_markets = page.client.get_storage_value('allowed_markets');
        if(!allowed_markets && page.client.is_logged_in && !TUser.get().is_virtual) {
            return;
        }

        var markets_array = allowed_markets ? allowed_markets.split(',') : [];
        if(!TUser.get().is_virtual && markets_array.indexOf(stored_market) < 0) {
            stored_market = markets_array[0];
            LocalStore.set('bet_page.market', stored_market);
        }
        var start_trading = $('#topMenuStartBetting a:first');
        var trade_url = start_trading.attr("href");
        if(stored_market) {
            if(/market=/.test(trade_url)) {
                trade_url = trade_url.replace(/market=\w+/, 'market=' + stored_market);
            } else {
                trade_url += '&market=' + stored_market;
            }
            start_trading.attr("href", trade_url);

            $('#mobile-menu #topMenuStartBetting a.trading_link').attr('href', trade_url);
        }
    }
};

var Header = function(params) {
    this.user = params['user'];
    this.client = params['client'];
    this.settings = params['settings'];
    this.menu = new Menu(params['url']);
};

Header.prototype = {
    on_load: function() {
        this.show_or_hide_login_form();
        this.register_dynamic_links();
        this.simulate_input_placeholder_for_ie();
        this.logout_handler();
        this.check_risk_classification();
        if (isNotBackoffice()) {
          checkClientsCountry();
        }
    },
    on_unload: function() {
        this.menu.reset();
    },
    show_or_hide_login_form: function() {
        if (this.user.is_logged_in && this.client.is_logged_in) {
            var loginid_select = '';
            var loginid_array = this.user.loginid_array;
            for (var i=0;i<loginid_array.length;i++) {
                if (loginid_array[i].disabled) continue;

                var curr_loginid = loginid_array[i].id;
                var real = loginid_array[i].real;
                var selected = '';
                if (curr_loginid == this.client.loginid) {
                    selected = ' selected="selected" ';
                }

                var loginid_text;
                if (real) {
                    if(loginid_array[i].financial){
                        loginid_text = text.localize('Investment Account') + ' (' + curr_loginid + ')';
                    } else if(loginid_array[i].non_financial) {
                        loginid_text = text.localize('Gaming Account') + ' (' + curr_loginid + ')';
                    } else {
                        loginid_text = text.localize('Real Account') + ' (' + curr_loginid + ')';
                    }
                } else {
                    loginid_text = text.localize('Virtual Account') + ' (' + curr_loginid + ')';
                }

                loginid_select += '<option value="' + curr_loginid + '" ' + selected + '>' + loginid_text +  '</option>';
            }
            $("#client_loginid").html(loginid_select);
        }
    },
    simulate_input_placeholder_for_ie: function() {
        var test = document.createElement('input');
        if ('placeholder' in test)
            return;
        $('input[placeholder]').each(function() {
            var input = $(this);
            $(input).val(input.attr('placeholder'));
            $(input).focus(function() {
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            });
            $(input).blur(function() {
                if (input.val() === '' || input.val() == input.attr('placeholder')) {
                    input.val(input.attr('placeholder'));
                }
            });
        });
    },
    register_dynamic_links: function() {
        var logged_in_url = page.url.url_for('');
        if(this.client.is_logged_in) {
            logged_in_url = page.url.url_for('user/my_accountws');
        }

        $('#logo').attr('href', logged_in_url).on('click', function(event) {
            event.preventDefault();
            load_with_pjax(logged_in_url);
        }).addClass('unbind_later');

        this.menu.register_dynamic_links();
    },
    start_clock_ws : function(){
        var that = this;

        function init(){
            clock_started = true;
            BinarySocket.send({ "time": 1,"passthrough":{"client_time" :  moment().valueOf()}});
        }
        that.run = function(){
            setInterval(init, 30000);
        };

        init();
        that.run();

        return;
    },
    time_counter : function(response){
        if(isNaN(response.echo_req.passthrough.client_time) || response.error){
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
            window.time = moment(that.server_time_at_response + moment().valueOf() - that.client_time_at_response).utc();
            clock.html(window.time.format("YYYY-MM-DD HH:mm") + ' GMT');
            showLocalTimeOnHover('#gmt-clock');
            window.HeaderTimeUpdateTimeOutRef = setTimeout(update_time, 1000);
        };
        update_time();
    },
    logout_handler : function(){
        $('a.logout').unbind('click').click(function(){
            page.client.send_logout_request();
        });
    },
    check_risk_classification: function() {
      if (page.client.is_logged_in && !page.client.is_virtual() && page.client.residence !== 'jp' && isNotBackoffice() &&
          localStorage.getItem('risk_classification.response') === 'high' && localStorage.getItem('risk_classification') === 'high' &&
          (localStorage.getItem('reality_check.ack') === '1' || !localStorage.getItem('reality_check.interval'))) {
            RiskClassification.renderRiskClassificationPopUp();
      }
    },
    validate_cookies: function(){
        if (getCookieItem('login') && getCookieItem('loginid_list')){
            var accIds = $.cookie("loginid_list").split("+");
            var loginid = $.cookie("loginid");

            if(!client_form.is_loginid_valid(loginid)){
                page.client.send_logout_request();
            }

            for(var i=0;i<accIds.length;i++){
                if(!client_form.is_loginid_valid(accIds[i].split(":")[0])){
                    page.client.send_logout_request();
                }
            }
        }
    },
    do_logout : function(response){
        if("logout" in response && response.logout === 1){
            page.client.clear_storage_values();
            LocalStore.remove('client.tokens');
            LocalStore.set('reality_check.ack', 0);
            var cookies = ['login', 'loginid', 'loginid_list', 'email', 'settings', 'reality_check', 'affiliate_token', 'affiliate_tracking', 'residence', 'allowed_markets'];
            var current_domain = ['.' + document.domain.split('.').slice(-2).join('.'), document.domain];
            var cookie_path = ['/'];
            if (window.location.pathname.split('/')[1] !== '') {
              cookie_path.push('/' + window.location.pathname.split('/')[1]);
            }
            var regex;

            cookies.map(function(c){
              regex = new RegExp(c);
              $.removeCookie(c, {path: cookie_path[0], domain: current_domain[0]});
              $.removeCookie(c);
              if (regex.test(document.cookie) && cookie_path[1]) {
                  $.removeCookie(c, {path: cookie_path[1], domain: current_domain[0]});
                  $.removeCookie(c, {path: cookie_path[1]});
              }
            });
            localStorage.removeItem('risk_classification');
            localStorage.removeItem('risk_classification.response');
            page.reload();
        }
    },
};

var ToolTip = function() {
    this.tooltip = $('#tooltip');

    if (this.tooltip.length === 0) {
        this.tooltip = $('<div id="tooltip"></div>');
        this.tooltip.css('display', 'none')
            .appendTo('body');
    }

    this.showing = {};
    var that = this;
    $(window).resize(function() { that.resize_tooltip(); });
};

ToolTip.prototype = {
    attach: function() {
        var that = this;
        this.detach();

        var targets = $( '[rel~=tooltip]' ),
            target  = false,
            tip     = false,
            title   = false;

        targets.on('mouseenter', function(e) {
            tip = $(this).attr( 'title' );

            if( !tip || tip === '' )
                return false;

            that.showing.target = $(this);
            that.showing.tip = tip;

            that.showing.target.removeAttr( 'title' );

            that.tooltip.html(tip);
            that.resize_tooltip();
            that.reposition_tooltip_for(that.showing.target);
            that.show_tooltip($(this));
        });

        targets.on('mouseleave', function() {
            if(that.showing.target) {
                that.showing.target.attr( 'title', that.showing.tip );
            }
            that.hide_tooltip();
        });

        targets.on('click', function() {
            if(that.showing.target) {
                that.showing.target.attr( 'title', that.showing.tip );
            }
            that.hide_tooltip();
        });
    },
    detach: function() {
        $( '[rel~=tooltip]' ).off('mouseenter');
        $( '[rel~=tooltip]' ).off('mouseleave');
        this.tooltip.off('click');
    },
    show_tooltip: function(target) {
        this.tooltip.css({ display: ''});
        this.tooltip.zIndex(target.zIndex() + 100);
    },
    hide_tooltip: function(tooltip) {
        this.tooltip.html("");
        this.tooltip.css({ top: 0, left: 0, display: 'none'});
        this.tooltip.addClass('invisible');
    },
    resize_tooltip: function() {
        if( $( window ).width() < this.tooltip.outerWidth() * 1.5 )
            this.tooltip.css( 'max-width', $( window ).width() / 2 );
        else
            this.tooltip.css( 'max-width', 340 );
    },
    reposition_tooltip_for: function(target) {
        this.tooltip.removeClass('invisible');

        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( this.tooltip.outerWidth() / 2 ),
            pos_top = target.offset().top - (this.tooltip.outerHeight() + 10);

        this.tooltip.removeClass( 'left' );
        this.tooltip.removeClass( 'right' );
        this.tooltip.removeClass( 'top' );

        if( pos_left < 0 ) {
            pos_left = target.offset().left + target.outerWidth() / 2 - 20;
            this.tooltip.addClass( 'left' );
        }

        if( pos_left + this.tooltip.outerWidth() > $( window ).width() ) {
            pos_left = target.offset().left - this.tooltip.outerWidth() + target.outerWidth() / 2 + 20;
            this.tooltip.addClass( 'right' );
        }

        if( pos_top < 0 ) {
            pos_top  = target.offset().top + target.outerHeight() + 20;
            this.tooltip.addClass( 'top' );
        }

        this.tooltip.css( { left: pos_left, top: pos_top} );
    },
};

var Contents = function(client, user) {
    this.client = client;
    this.user = user;
    this.tooltip = new ToolTip();
};

Contents.prototype = {
    on_load: function() {
        this.activate_by_client_type();
        this.topbar_message_visibility();
        this.update_body_id();
        this.update_content_class();
        this.tooltip.attach();
        this.init_draggable();
    },
    on_unload: function() {
        this.tooltip.detach();
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
        }
    },
    activate_by_client_type: function() {
        $('.by_client_type').addClass('invisible');
        if(this.client.is_logged_in) {
            if(page.client.get_storage_value('is_virtual').length === 0) {
                return;
            }
            if(!page.client.is_virtual()) {
                $('.by_client_type.client_real').removeClass('invisible');
                $('.by_client_type.client_real').show();

                $('#topbar').addClass('dark-blue');
                $('#topbar').removeClass('orange');

                if (!/^CR/.test(this.client.loginid)) {
                    $('#payment-agent-section').addClass('invisible');
                    $('#payment-agent-section').hide();
                }

                if (!/^MF|MLT/.test(this.client.loginid)) {
                    $('#account-transfer-section').addClass('invisible');
                    $('#account-transfer-section').hide();
                }
            } else {
                $('.by_client_type.client_virtual').removeClass('invisible');
                $('.by_client_type.client_virtual').show();

                $('#topbar').addClass('orange');
                $('#topbar').removeClass('dark-blue');

                $('#account-transfer-section').addClass('invisible');
                $('#account-transfer-section').hide();
            }
        } else {
            $('#btn_login').unbind('click').click(function(){Login.redirect_to_login();});

            $('.by_client_type.client_logged_out').removeClass('invisible');
            $('.by_client_type.client_logged_out').show();

            $('#topbar').removeClass('orange');
            $('#topbar').addClass('dark-blue');

            $('#account-transfer-section').addClass('invisible');
            $('#account-transfer-section').hide();
        }
    },
    update_body_id: function() {
        //This is required for our css to work.
        $('body').attr('id', '');
        $('body').attr('id', $('#body_id').html());
    },
    update_content_class: function() {
        //This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    },
    init_draggable: function() {
        $('.draggable').draggable();
    },
    topbar_message_visibility: function() {
        if(this.client.is_logged_in) {
            if(page.client.get_storage_value('is_virtual').length === 0) {
                return;
            }
            var loginid_array = this.user.loginid_array;
            var countries_list = page.settings.get('countries_list');
            if(!countries_list || countries_list.length === 0) {
                return;
            }
            var c_config = countries_list[this.client.residence];

            if (page.client.is_virtual()) {
                var show_upgrade = true;
                if (localStorage.getItem('jp_test_allowed')) {
                    $('.virtual-upgrade-link').addClass('invisible');
                    $('.vr-japan-upgrade-link').addClass('invisible');
                    $('.vr-financial-upgrade-link').addClass('invisible');
                    show_upgrade = false;           // do not show upgrade for user that filled up form
                }
                for (var i=0;i<loginid_array.length;i++) {
                    if (loginid_array[i].real) {
                        $('.virtual-upgrade-link').addClass('invisible');
                        $('.vr-japan-upgrade-link').addClass('invisible');
                        $('.vr-financial-upgrade-link').addClass('invisible');
                        show_upgrade = false;
                        break;
                    }
                }
                if (show_upgrade) {
                    if (c_config && c_config['gaming_company'] == 'none' && c_config['financial_company'] == 'maltainvest') {
                        $('.vr-financial-upgrade-link').removeClass('invisible');
                        $('.virtual-upgrade-link').addClass('invisible');
                        $('.vr-japan-upgrade-link').addClass('invisible');
                    } else if (c_config && c_config['gaming_company'] == 'none' && c_config['financial_company'] == 'japan') {
                        $('.vr-japan-upgrade-link').removeClass('invisible');
                        $('.virtual-upgrade-link').addClass('invisible');
                        $('.vr-financial-upgrade-link').addClass('invisible');
                    } else {
                        $('.virtual-upgrade-link').removeClass('invisible');
                        $('.vr-japan-upgrade-link').addClass('invisible');
                        $('.vr-financial-upgrade-link').addClass('invisible');
                    }
                }
            } else {
                var show_financial = false;

                // also allow UK MLT client to open MF account
                if ( (c_config && c_config['financial_company'] == 'maltainvest') ||
                     (this.client.residence == 'gb' && /^MLT/.test(this.client.loginid)) )
                {
                    show_financial = true;
                    for (var j=0;j<loginid_array.length;j++) {
                        if (loginid_array[j].financial) {
                            show_financial = false;
                            break;
                        }
                    }
                }
                if (show_financial) {
                    $('.financial-upgrade-link').removeClass('invisible');
                } else {
                    $('.financial-upgrade-link').addClass('invisible');
                }
            }
        }
    },
};

var Page = function(config) {
    this.is_loaded_by_pjax = false;
    config = typeof config !== 'undefined' ? config : {};
    this.user = new User();
    this.client = new Client();
    this.url = new URL();
    this.settings = new InScriptStore(config['settings']);
    this.header = new Header({ user: this.user, client: this.client, settings: this.settings, url: this.url});
    this.contents = new Contents(this.client, this.user);
    onLoad.queue(GTM.push_data_layer);
};

Page.prototype = {
    language: function() {
        if ($('#language_select').length > 0) {
            return $('#language_select').attr('class').toUpperCase(); //Required as mojo still provides lower case lang codes and most of our system expects upper case.
        } else if(page.url.param('l')) {
            return page.url.param('l');
        } else if($.cookie('language')) {
            return $.cookie('language');
        } else {
            return 'EN';
        }
    },
    on_load: function() {
        this.url.reset();
        this.localize_for(this.language());
        this.header.on_load();
        this.on_change_language();
        this.on_change_loginid();
        this.record_affiliate_exposure();
        this.contents.on_load();
        this.on_click_acc_transfer();
        if(getCookieItem('login')){
            ViewBalance.init();
        } else {
            LocalStore.set('reality_check.ack', 0);
        }
        $('#current_width').val(get_container_width());//This should probably not be here.
        if(sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirect_to_login();
        }
    },
    on_unload: function() {
        this.header.on_unload();
        this.contents.on_unload();
    },
    on_change_language: function() {
        var that = this;
        $('#language_select').on('change', 'select', function() {
            var language = $(this).find('option:selected').attr('class');
            document.location = that.url_for_language(language);
        });
    },
    on_change_loginid: function() {
        var that = this;
        $('#client_loginid').on('change', function() {
            $(this).attr('disabled','disabled');
            that.switch_loginid($(this).val());
        });
    },
    switch_loginid: function(loginid) {
        if(!loginid || loginid.length === 0) {
            return;
        }
        var token = page.client.get_token(loginid);
        if(!token || token.length === 0) {
            page.client.send_logout_request(true);
            return;
        }

        // cleaning the previous values
        page.client.clear_storage_values();
        sessionStorage.setItem('active_tab', '1');
        // set cookies: loginid, login
        page.client.set_cookie('loginid', loginid);
        page.client.set_cookie('login'  , token);
        // set local storage
        GTM.set_login_flag();
        localStorage.setItem('active_loginid', loginid);
        $('#client_loginid').removeAttr('disabled');
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
        });
    },
    localize_for: function(language) {
        text = texts[language];
        moment.locale(language.toLowerCase());
    },
    url_for_language: function(lang) {
        lang = lang.trim().toUpperCase();
        SessionStore.set('selected.language', lang);
        var loc = document.location; // quick access
        var qs = loc.search || '?';
        var url = loc.protocol + '//' + loc.host + loc.pathname;
        if (qs.indexOf('l=') >= 0) {
            url += qs.replace(/(\?|&)l=[A-Z_]{2,5}/, "$1l=" + lang);
        } else {
            if (qs.length > 1) {
                lang = '&l=' + lang;
            } else {
                lang = 'l=' + lang;
            }
            url += qs + lang;
        }
        return url;
    },
    record_affiliate_exposure: function() {
        var token = this.url.param('t');
        if (!token || token.length !== 32) {
            return false;
        }
        var token_length = token.length;
        var is_subsidiary = /\w{1}/.test(this.url.param('s'));

        var cookie_value = $.cookie('affiliate_tracking');
        if(cookie_value) {
            var cookie_token = JSON.parse(cookie_value);

            //Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token["t"]) {
                return false;
            }
        }

        //Record the affiliate exposure. Overwrite existing cookie, if any.
        var cookie_hash = {};
        if (token_length === 32) {
            cookie_hash["t"] = token.toString();
        }
        if (is_subsidiary) {
            cookie_hash["s"] = "1";
        }

        $.cookie("affiliate_tracking", JSON.stringify(cookie_hash), {
            expires: 365, //expires in 365 days
            path: '/',
            domain: '.' + location.hostname.split('.').slice(-2).join('.')
        });
    },
    reload: function() {
        window.location.reload();
    },
};
