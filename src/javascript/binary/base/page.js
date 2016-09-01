var text;
var clock_started = false;

var GTM = (function() {
    "use strict";

    var gtm_applicable = function() {
        return (getAppId() === '1');
    };

    var gtm_data_layer_info = function(data) {
        var data_layer_info = {
            language  : page.language(),
            pageTitle : page_title(),
            pjax      : page.is_loaded_by_pjax,
            url       : document.URL,
            event     : 'page_load',
        };
        if(page.client.is_logged_in) {
            data_layer_info['visitorId'] = page.client.loginid;
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
        if (!gtm_applicable()) return;
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
        if (!gtm_applicable()) return;
        var is_login      = localStorage.getItem('GTM_login')      === '1',
            is_newaccount = localStorage.getItem('GTM_newaccount') === '1';
        if(!is_login && !is_newaccount) {
            return;
        }

        localStorage.removeItem('GTM_login');
        localStorage.removeItem('GTM_newaccount');

        var affiliateToken = Cookies.getJSON('affiliate_tracking');
        if (affiliateToken) {
            GTM.push_data_layer({'bom_affiliate_token': affiliateToken.t});
        }

        var data = {
            'visitorId'   : page.client.loginid,
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

    var push_purchase_data = function(response) {
        if (!gtm_applicable() || page.client.is_virtual()) return;
        var req = response.echo_req.passthrough,
            buy = response.buy;
        if (!buy) return;
        var data = {
            'event'              : 'buy_contract',
            'visitorId'          : page.client.loginid,
            'bom_symbol'         : req.symbol,
            'bom_market'         : markets && markets.by_symbol(req.symbol) ?
                markets.by_symbol(req.symbol).market.name :
                document.getElementById('contract_markets').value,
            'bom_currency'       : req.currency,
            'bom_contract_type'  : req.contract_type,
            'bom_contract_id'    : buy.contract_id,
            'bom_transaction_id' : buy.transaction_id,
            'bom_buy_price'      : buy.buy_price,
            'bom_payout'         : buy.payout,
        };
        // Spread contracts
        if (/spread/i.test(req.contract_type)) {
            $.extend(data, {
                'bom_stop_type'         : req.stop_type,
                'bom_amount_per_point'  : buy.amount_per_point,
                'bom_stop_loss_level'   : buy.stop_loss_level,
                'bom_stop_profit_level' : buy.stop_profit_level,
            });
        } else {
            $.extend(data, {
                'bom_amount'      : req.amount,
                'bom_basis'       : req.basis,
                'bom_expiry_type' : document.getElementById('expiry_type').value,
            });
            if(data.bom_expiry_type === 'duration') {
                $.extend(data, {
                    'bom_duration'      : req.duration,
                    'bom_duration_unit' : req.duration_unit,
                });
            }
            if(isVisible(document.getElementById('barrier'))) {
                data['bom_barrier'] = req.barrier;
            } else if(isVisible(document.getElementById('barrier_high'))) {
                data['bom_barrier_high'] = req.barrier;
                data['bom_barrier_low']  = req.barrier2;
            }
            if(isVisible(document.getElementById('prediction'))) {
                data['bom_prediction']  = req.barrier;
            }
        }

        GTM.push_data_layer(data);
    };

    var set_login_flag = function() {
        if (!gtm_applicable()) return;
        localStorage.setItem('GTM_login', '1');
    };

    var set_newaccount_flag = function() {
        if (!gtm_applicable()) return;
        localStorage.setItem('GTM_newaccount', '1');
    };

    return {
        push_data_layer     : push_data_layer,
        event_handler       : event_handler,
        push_purchase_data  : push_purchase_data,
        set_login_flag      : set_login_flag,
        set_newaccount_flag : set_newaccount_flag,
    };
}());

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
                .html($('<p/>', {class: 'notice-msg', html: text.localize('Please [_1] to view this page', [
                        '<a class="login_link" href="javascript:;">' + text.localize('login') + '</a>'
                    ])}));
            $('.login_link').click(function(){Login.redirect_to_login();});
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
                Cookies.get('residence') &&
                !this.get_storage_value('has_reality_check')
            ) {
                $('#topMenuStartBetting').addClass('invisible');
                BinarySocket.send({
                    'landing_company': Cookies.get('residence'),
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
    response_landing_company: function(response) {
        if (!response.hasOwnProperty('error')) {
            var allowed_markets = response.legal_allowed_markets;
            var company = response.name;
            var has_reality_check = response.has_reality_check;

            this.set_storage_value('allowed_markets', allowed_markets.length === 0 ? '' : allowed_markets.join(','));
            this.set_storage_value('landing_company_name', company);
            this.set_storage_value('has_reality_check', has_reality_check);

            page.header.menu.register_dynamic_links();
        }
    },
    response_authorize: function(response) {
        page.client.set_storage_value('session_start', parseInt(moment().valueOf() / 1000));
        TUser.set(response.authorize);
        if(!Cookies.get('email')) this.set_cookie('email', response.authorize.email);
        this.set_storage_value('is_virtual', TUser.get().is_virtual);
        this.check_storage_values();
        page.contents.activate_by_client_type();
        page.contents.activate_by_login();
    },
    check_tnc: function() {
        if (/user\/tnc_approvalws/.test(window.location.href) || /terms\-and\-conditions/.test(window.location.href)) return;
        if(!page.client.is_virtual() && new RegExp(page.client.loginid).test(sessionStorage.getItem('check_tnc'))) {
            var client_tnc_status   = this.get_storage_value('tnc_status'),
                website_tnc_version = LocalStore.get('website.tnc_version');
            if(client_tnc_status && website_tnc_version) {
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
    set_cookie: function(cookieName, Value, domain) {
        var cookie_expire = new Date();
        cookie_expire.setDate(cookie_expire.getDate() + 60);
        var cookie = new CookieStorage(cookieName, domain);
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
        this.set_cookie('loginid_list', is_virtual ? loginid + ':V:E' : loginid + ':R:E' + '+' + Cookies.get('loginid_list'));
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
    url_for: function(path, params) {
        if(!path) {
            path = '';
        }
        else if (path.length > 0 && path[0] === '/') {
            path = path.substr(1);
        }
        var lang = page.language().toLowerCase(),
            url  = window.location.href;
        return url.substring(0, url.indexOf('/' + lang + '/') + lang.length + 2) + (path || 'home') + '.html' + (params ? '?' + params : '');
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
            staticHost = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src');

            if(staticHost && staticHost.length > 0) {
                staticHost = staticHost.substr(0, staticHost.indexOf('/js/') + 1);
            }
            else {
                staticHost = 'https://www.binary.com/';
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
        return Object.keys(params)
            .map(function(key) { return key + '=' + params[key]; })
            .join('&');
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
        return this.url_for(japanese_client() ? 'jptrading' : 'trading');
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
        var trading = japanese_client() ? $('#main-navigation-jptrading') : $('#main-navigation-trading');
        if(active) {
            active.addClass('active');
            if(page.client.is_logged_in || trading.is(active)) {
                this.show_main_menu();
            }
        } else {
            var is_trading_submenu = /\/cashier|\/resources/.test(window.location.pathname);
            if(!/\/home/.test(window.location.pathname)) {
                if (!page.client.is_logged_in && is_trading_submenu) {
                    trading.addClass('active');
                    this.show_main_menu();
                } else if (page.client.is_logged_in) {
                    this.show_main_menu();
                }
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
            if(path.indexOf(this.pathname.replace(/\.html/i, '')) >= 0) {
                active = $(this).closest('li');
            }
        });

        return active;
    },
    active_main_menu: function() {
        var page_url = this.page_url;
        if(/cashier/i.test(page_url.location.href)) {
            page_url = new URL($('#topMenuCashier a').attr('href'));
        }

        var item;
        var subitem;

        //Is something selected in main items list
        $("#main-menu .items a").each(function () {
            var url = new URL($(this).attr('href'));
            if(url.is_in(page_url)) {
                item = $(this).closest('.item');
            }
        });

        $("#main-menu .sub_items a").each(function(){
            var link_href = $(this).attr('href');
            if (link_href) {
                var url = new URL(link_href);
                if(url.is_in(page_url)) {
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
    },
    check_payment_agent: function(is_authenticated_payment_agent) {
        if(is_authenticated_payment_agent) {
            $('#topMenuPaymentAgent').removeClass('invisible');
        }
    }
};

var Header = function(params) {
    this.user = params['user'];
    this.client = params['client'];
    this.menu = new Menu(params['url']);
};

Header.prototype = {
    on_load: function() {
        this.show_or_hide_login_form();
        this.register_dynamic_links();
        this.logout_handler();
        this.check_risk_classification();
        if (!$('body').hasClass('BlueTopBack')) {
          checkClientsCountry();
        }
        if(page.client.is_logged_in) {
            $('ul#menu-top').addClass('smaller-font');
        }
    },
    on_unload: function() {
        this.menu.reset();
    },
    animate_disappear: function(element) {
        element.animate({'opacity':0}, 100, function() {
            element.css('visibility', 'hidden');
        });
    },
    animate_appear: function(element) {
        element.css('visibility', 'visible')
               .animate({'opacity': 1}, 100);
    },
    show_or_hide_login_form: function() {
        if (!this.user.is_logged_in || !this.client.is_logged_in) return;
        var all_accounts = $('#all-accounts');
        var that = this;
        $('.nav-menu').unbind('click').on('click', function(event){
            event.stopPropagation();
            if (all_accounts.css('opacity') == 1 ) {
                that.animate_disappear(all_accounts);
            } else {
                that.animate_appear(all_accounts);
            }
        });
        $(document).unbind('click'). on('click', function(){
            that.animate_disappear(all_accounts);
        });
        var loginid_select = '';
        var loginid_array = this.user.loginid_array;
        for (var i=0; i < loginid_array.length; i++) {
            var login = loginid_array[i];
            if (login.disabled) continue;

            var curr_id = login.id;
            var type = 'Virtual';
            if (login.real) {
                if (login.financial)          type = 'Investment';
                else if (login.non_financial) type = 'Gaming';
                else                          type = 'Real';
            }
            type = type + ' Account';

            // default account
            if (curr_id == this.client.loginid) {
                $('.account-type').html(text.localize(type));
                $('.account-id').html(curr_id);
            } else {
                loginid_select += '<a href="#" value="' + curr_id + '"><li>' + text.localize(type) + '<div>' + curr_id + '</div>' +
                                  '</li></a>' + '<div class="separator-line-thin-gray"></div>';
            }
        }
        $(".login-id-list").html(loginid_select);
    },
    register_dynamic_links: function() {
        var logged_in_url = this.client.is_logged_in ?
            page.url.url_for('trading') :
            page.url.url_for('');

       $('#logo').attr('href', logged_in_url).on('click', function(event) {
           event.preventDefault();
           load_with_pjax(logged_in_url);
       }).addClass('unbind_later');

       this.menu.register_dynamic_links();
    },
    start_clock_ws: function() {
        function getTime() {
            clock_started = true;
            BinarySocket.send({'time': 1,'passthrough': {'client_time': moment().valueOf()}});
        }
        this.run = function() {
            setInterval(getTime, 30000);
        };

        this.run();
        getTime();
        return;
    },
    time_counter : function(response) {
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
            window.time = moment(that.server_time_at_response + moment().valueOf() - that.client_time_at_response).utc();
            var curr = localStorage.getItem('client.currencies');
            var timeStr = window.time.format("YYYY-MM-DD HH:mm") + ' GMT';
            if(curr === 'JPY'){
                clock.html(toJapanTimeIfNeeded(timeStr, 1, '', 1));
            } else {
                clock.html(timeStr);
                showLocalTimeOnHover('#gmt-clock');
            }
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
      if (localStorage.getItem('risk_classification.response') === 'high' && localStorage.getItem('risk_classification') === 'high' &&
          this.qualify_for_risk_classification()) {
            RiskClassification.renderRiskClassificationPopUp();
      }
    },
    qualify_for_risk_classification: function() {
      if (page.client.is_logged_in && !page.client.is_virtual() && page.client.residence !== 'jp' && !$('body').hasClass('BlueTopBack') &&
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
        var valid_loginids = new RegExp('^(' + page.settings.get('valid_loginids') + ')[0-9]+$', 'i');

        function is_loginid_valid(login_id) {
            return login_id ?
                valid_loginids.test(login_id) :
                true;
        }

        if (!is_loginid_valid(loginid)) {
            page.client.send_logout_request();
        }

        accIds.forEach(function(acc_id) {
            if (!is_loginid_valid(acc_id.split(":")[0])) {
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
        var cookies = ['login', 'loginid', 'loginid_list', 'email', 'settings', 'reality_check', 'affiliate_token', 'affiliate_tracking', 'residence', 'allowed_markets'];
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
            Cookies.remove(c, {path: '/', domain: domains[0]});
            Cookies.remove(c, {path: '/', domain: domains[1]});
            Cookies.remove(c);
            if (regex.test(document.cookie) && parent_path) {
                Cookies.remove(c, {path: parent_path, domain: domains[0]});
                Cookies.remove(c, {path: parent_path, domain: domains[1]});
                Cookies.remove(c, {path: parent_path});
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
    activate_by_client_type: function() {
        $('.by_client_type').addClass('invisible');
        if(this.client.is_logged_in) {
            if(page.client.get_storage_value('is_virtual').length === 0) {
                return;
            }
            $('#client-logged-in').addClass('gr-centered');
            if(!page.client.is_virtual()) {
                // control-class is a fake class, only used to counteract ja-hide class
                $('.by_client_type.client_real').not((japanese_client() ? ".ja-hide" : ".control-class")).removeClass('invisible');
                $('.by_client_type.client_real').show();

                $('#topbar').addClass('primary-color-dark');
                $('#topbar').removeClass('secondary-bg-color');

                if (!/^CR/.test(this.client.loginid)) {
                    $('#payment-agent-section').addClass('invisible');
                    $('#payment-agent-section').hide();
                }

                if (/^MF|MLT/.test(this.client.loginid)) {
                    $('#account-transfer-section').removeClass('invisible');
                }
            } else {
                $('.by_client_type.client_virtual').removeClass('invisible');
                $('.by_client_type.client_virtual').show();

                $('#topbar').addClass('secondary-bg-color');
                $('#topbar').removeClass('primary-color-dark');
            }
        } else {
            $('#btn_login').unbind('click').click(function(e){e.preventDefault(); Login.redirect_to_login();});

            $('.by_client_type.client_logged_out').removeClass('invisible');
            $('.by_client_type.client_logged_out').show();

            $('#topbar').removeClass('secondary-bg-color');
            $('#topbar').addClass('primary-color-dark');
        }
    },
    activate_by_login: function() {
        if(this.client.is_logged_in) {
            $('.client_logged_in').removeClass('invisible');
        }
    },
    update_content_class: function() {
        //This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    },
    init_draggable: function() {
        $('.draggable').draggable();
    },
    topbar_message_visibility: function(c_config) {
        if(this.client.is_logged_in) {
            if(page.client.get_storage_value('is_virtual').length === 0 || !c_config) {
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
                        .attr('href', page.url.url_for(url)).html($('<span/>', {text: text.localize(msg)}));
            };

            if (page.client.is_virtual()) {
                var show_upgrade_msg = true;
                var show_virtual_msg = true;
                if (localStorage.getItem('jp_test_allowed') === "1") {
                    hide_upgrade();
                    show_virtual_msg = false;
                    show_upgrade_msg = false; // do not show upgrade for user that filled up form
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
                    $upgrade_msg.removeClass(hiddenClass).find('> span').removeClass(hiddenClass);
                }
            } else {
                var show_financial = false;

                // also allow UK MLT client to open MF account
                if (page.client.can_upgrade_gaming_to_financial(c_config) || (this.client.residence == 'gb' && /^MLT/.test(this.client.loginid))) {
                    show_financial = true;
                    for (var j=0;j<loginid_array.length;j++) {
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

var Page = function(config) {
    this.is_loaded_by_pjax = false;
    config = typeof config !== 'undefined' ? config : {};
    this.user = new User();
    this.client = new Client();
    this.url = new URL();
    this.settings = new InScriptStore(config['settings']);
    this.header = new Header({ user: this.user, client: this.client, url: this.url});
    this.contents = new Contents(this.client, this.user);
    this._lang = null;
    onLoad.queue(GTM.push_data_layer);
};

Page.prototype = {
    all_languages: function() {
        return ['EN', 'AR', 'DE', 'ES', 'FR', 'ID', 'IT', 'PL', 'PT', 'RU', 'VI', 'JA', 'ZH_CN', 'ZH_TW'];
    },
    language_from_url: function() {
        var regex = new RegExp('^(' + this.all_languages().join('|') + ')$', 'i');
        var langs = window.location.href.split('/').slice(3);
        for (var i = 0; i < langs.length; i++) {
            var lang = langs[i];
            if (regex.test(lang)) return lang.toUpperCase();
        }
        return '';
    },
    language: function() {
        var lang = this._lang;
        if (!lang) {
            lang = (this.language_from_url() || Cookies.get('language') || 'EN').toUpperCase();
            this._lang = lang;
        }
        return lang;
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
        this.show_authenticate_message();
        if (CommonData.getLoginToken()) {
            ViewBalance.init();
        } else {
            LocalStore.set('reality_check.ack', 0);
        }
        if(!Cookies.get('language')) {
            var cookie = new CookieStorage('language');
            cookie.write(this.language());
        }
        if(sessionStorage.getItem('showLoginPage')) {
            sessionStorage.removeItem('showLoginPage');
            Login.redirect_to_login();
        }
        this.check_language();
        TrafficSource.setData();
    },
    on_unload: function() {
        this.header.on_unload();
        this.contents.on_unload();
    },
    on_change_language: function() {
        var that = this;
        $('#language_select').on('change', 'select', function() {
            var language = $(this).find('option:selected').attr('class');
            var cookie = new CookieStorage('language');
            cookie.write(language);
            document.location = that.url_for_language(language);
        });
    },
    on_change_loginid: function() {
        var that = this;
        $('.login-id-list a').on('click', function(e) {
            e.preventDefault();
            $(this).attr('disabled','disabled');
            that.switch_loginid($(this).attr('value'));
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
        sessionStorage.removeItem('client_status');
        // set cookies: loginid, login
        page.client.set_cookie('loginid', loginid);
        page.client.set_cookie('login'  , token);
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
        });
    },
    localize_for: function(language) {
        text = texts[language];
        moment.locale(language.toLowerCase());
    },
    url_for_language: function(lang) {
        lang = lang.trim();
        SessionStore.set('selected.language', lang.toUpperCase());
        return window.location.href.replace(new RegExp('\/' + page.language() + '\/', 'i'), '/' + lang.toLowerCase() + '/');
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
            //Already exposed to some other affiliate.
            if (is_subsidiary && cookie_token && cookie_token.t) {
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

        Cookies.set("affiliate_tracking", cookie_hash, {
            expires: 365, //expires in 365 days
            path: '/',
            domain: '.' + location.hostname.split('.').slice(-2).join('.')
        });
    },
    reload: function(forcedReload) {
        window.location.reload(forcedReload ? true : false);
    },
    check_new_release: function() { // calling this method is handled by GTM tags
        var last_reload = localStorage.getItem('new_release_reload_time');
        if(last_reload && last_reload * 1 + 10 * 60 * 1000 > moment().valueOf()) return; // prevent reload in less than 10 minutes
        var currect_hash = $('script[src*="binary.min.js"],script[src*="binary.js"]').attr('src').split('?')[1];
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var latest_hash = xhttp.responseText;
                if(latest_hash && latest_hash !== currect_hash) {
                    localStorage.setItem('new_release_reload_time', moment().valueOf());
                    page.reload(true);
                }
            }
        };
        xhttp.open('GET', page.url.url_for_static() + 'version?' + Math.random().toString(36).slice(2), true);
        xhttp.send();
    },
    check_language: function() {
        if (page.language() === 'ID') {
          change_blog_link('id');
        }
        if (japanese_client()) {
            $('.ja-hide').addClass('invisible');
            $('.ja-show').attr('style', 'display: inline !important; visibility: visible;');
            $('.ja-show-block').attr('style', 'display: inline-block !important; visibility: visible;');
            $('.ja-no-padding').attr('style', 'padding-top: 0; padding-bottom: 0;');
            $('#regulatory-text').removeClass('gr-9 gr-7-p')
                                 .addClass('gr-12 gr-12-p');
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
            if(match_type === 'any' && (client_status.indexOf(require_auth[i]) > -1)) return true;
            if(match_type === 'all' && (client_status.indexOf(require_auth[i]) < 0)) return false;
        }
        return (match_type === 'any' ? false : true);
    },
    show_authenticate_message: function() {
        if ($('.authenticate-msg').length !== 0) return;

        var p = $('<p/>', {class: 'authenticate-msg notice-msg'}),
            span;

        if (this.client_status_detected('unwelcome')) {
            var purchase_button = $('.purchase_button');
            if (purchase_button.length > 0 && !purchase_button.parent().hasClass('button-disabled')) {
                $.each(purchase_button, function(){
                    $(this).off('click dblclick').removeAttr('data-balloon').parent().addClass('button-disabled');
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
            span = $('<span/>', {html: template(text.localize('Your account is currently suspended. Only withdrawals are now permitted. For further information, please contact [_1].', ['<a href="mailto:support@binary.com">support@binary.com</a>']))});
            $('#content > .container').prepend(p.append(span));
        }
        else if (this.client_status_detected('unwelcome')) {
            span = this.general_authentication_message();
            $('#content > .container').prepend(p.append(span));
        }
        else if (this.client_status_detected('authenticated, cashier_locked', 'all') && /cashier\.html/.test(window.location.href)) {
            span = $('<span/>', {html: template(text.localize('Deposits and withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>']))});
            $('#content > .container').prepend(p.append(span));
        }
        else if (this.client_status_detected('cashier_locked') && /cashier\.html/.test(window.location.href)) {
            span = this.general_authentication_message();
            $('#content > .container').prepend(p.append(span));
        }
        else if (this.client_status_detected('authenticated, withdrawal_locked', 'all') && /cashier\.html/.test(window.location.href)) {
            span = $('<span/>', {html: template(text.localize('Withdrawal for your account is not allowed at this moment. Please contact [_1] to unlock it.', ['<a href="mailto:support@binary.com">support@binary.com</a>']))});
            $('#content > .container').prepend(p.append(span));
        }
        else if (this.client_status_detected('withdrawal_locked') && /cashier\.html/.test(window.location.href)) {
            span = this.general_authentication_message();
            $('#content > .container').prepend(p.append(span));
        }
        return;
    },
    general_authentication_message: function() {
        var span = $('<span/>', {html: template(text.localize('To authenticate your account, kindly email the following to [_1]:', ['<a href="mailto:support@binary.com">support@binary.com</a>']))});
        var ul = $('<ul/>', {class: 'checked'});
        var li1 = $('<li/>', {text: text.localize('A scanned copy of your passport, driving licence (provisional or full) or identity card, showing your name and date of birth. Your document must be valid for at least 6 months after this date.')});
        var li2 = $('<li/>', {text: text.localize('A scanned copy of a utility bill or bank statement (no more than 3 months old)')});
        return span.append(ul.append(li1, li2));
    },
};
