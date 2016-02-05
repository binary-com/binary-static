var MyAccountWS = (function() {
    "use strict";

    var loginid,
        isReal;
    var hiddenClass,
        welcomeTextID,
        virtualTopupID,
        authButtonID;

    var init = function() {
        hiddenClass    = 'invisible';
        welcomeTextID  = '#welcome_text';
        virtualTopupID = '#VRT_topup_link';
        authButtonID   = '#authenticate_button';

        loginid = $.cookie('loginid');
        isReal = !(/VRT/.test(loginid));

        BinarySocket.send({"get_settings": 1});
        BinarySocket.send({"payout_currencies": 1});
        BinarySocket.send({"get_account_status": 1});

        if(!isReal) {
            BinarySocket.send({"balance": 1, "req_id": 1});
            shoWelcomeMessage();
            recheckLegacyTradeMenu();
        }
        
        //checkDisabledAccount();
    };

    var responseGetSettings = function(response) {
        var get_settings = response.get_settings;

        if(isReal) {
            var country_code = get_settings.country_code;
            if(country_code) {
                BinarySocket.send({"landing_company": country_code});
            }

            if(get_settings.is_authenticated_payment_agent) {
                $('#payment_agent').removeClass(hiddenClass);
            }
        }

        addGTMDataLayer(get_settings);
    };

    var responseBalance = function(response) {
        if(!response.echo_req.req_id || parseInt(response.req_id, 10) !== 1) {
            return;
        }

        if(response.balance.balance < 1000) {
            $(virtualTopupID + ' a')
                .text(
                    (text.localize('Deposit %1 virtual money into your account ') + loginid)
                    .replace('%1', response.balance.currency + ' 10000')
                );
        }
    };

    var responseAccountStatus = function(response) {
        if(response.get_account_status[0] === 'unwelcome'){
            $(authButtonID).removeClass(hiddenClass);
        }
    };

    var responseLandingCompany = function(response) {
        var landing_company = response.landing_company,
            company,
            allowed_markets = [];
        if(/MLT/.test(loginid) && landing_company.hasOwnProperty('gaming_company')) {
            company = landing_company.gaming_company.name;
            allowed_markets = landing_company.gaming_company.legal_allowed_markets;
        }
        else {
            company = landing_company.financial_company.name;
            allowed_markets = landing_company.financial_company.legal_allowed_markets;
        }
        shoWelcomeMessage(company);

        setCookie('allowed_markets', allowed_markets.length === 0 ? '' : allowed_markets.join(','));
        recheckLegacyTradeMenu();

        showNoticeMsg();
    };

    var responsePayoutCurrencies = function (response) {
        var currencies = {'client.currencies': response.payout_currencies};
        setCookie('settings', JSON.stringify(currencies));
    };

    var shoWelcomeMessage = function(landing_company) {
        $(welcomeTextID)
            .text(
                text.localize(
                    isReal ? 
                        "You're currently logged in to your real money account with %1 " : 
                        "You're currently logged in to your virtual money account "
                ).replace('%1', landing_company || '') + 
                ' (' + loginid + ').'
            )
            .removeClass(hiddenClass);

        $('#cashier-portfolio').removeClass(hiddenClass);
        $('#profit-statement').removeClass(hiddenClass);
    };

    var showNoticeMsg = function() {
        var loginid_list = $.cookie('loginid_list');
        var res = loginid_list.split('+');
        if(res.length === 2 && (/MLT/.test(res[0]) || /MLT/.test(res[1]))) {
            $('#investment_message').removeClass(hiddenClass);
        }
    };

    var recheckLegacyTradeMenu = function() {
        page.header.menu.disable_not_allowed_markets();
        page.header.register_dynamic_links();
    };

    var addGTMDataLayer = function(get_settings) {
        if(page.url.param('login') || page.url.param('newaccounttype')) {
            var oldUrl = window.location.href;
            var newUrl = oldUrl.replace(/(login=true&|newaccounttype=real&|newaccounttype=virtual&)/gi, '');
            var title  = document.title;
            var name   = TUser.get().fullname.split(' ');
            var data   = {};
            var affiliateToken = $.cookie('affiliate_tracking');
            if (affiliateToken) {
                dataLayer.push({'bom_affiliate_token': affiliateToken});
            }
            data['bom_country'] = get_settings.country;
            data['bom_email']   = TUser.get().email;
            data['language']    = page.url.param('l');
            data['pageTitle']   = title;
            data['url']         = oldUrl;
            data['visitorID']   = TUser.get().loginid;
            data['bom_today']   = Math.floor(Date.now() / 1000);

            if(isReal) {
                data['bom_age']       = parseInt((moment(str).unix() - get_settings.date_of_birth) / 31557600);
                data['bom_firstname'] = name[1];
                data['bom_lastname']  = name[2];
                data['bom_phone']     = get_settings.phone;
            }

            data['event'] = 
                page.url.param('newaccounttype') ? 
                    'new_account' : 
                    page.url.param('login') ?
                        'log_in' :
                        'page_load'; //TODO: pjax?

            dataLayer.push(data);
            window.history.replaceState('My Account', title, newUrl);
        }
    };

    var setCookie = function (name, value) {
        $.cookie(name, value, {
            expires : new Date('Thu, 1 Jan 2037 12:00:00 GMT'),
            path    : '/',
            domain  : '.' + document.domain.split('.').slice(-2).join('.')
        });
    };

    var checkDisabledAccount = function() {
        var disabledAccount = [];
        page.user.loginid_array.map(function(loginObj) {
            if (loginObj.disabled && loginObj.real) {
                disabledAccount.push(loginObj.id);
            }
        });

        if(disabledAccount.length > 0) {
            var msgSingular = text.localize('Your %1 account is unavailable. For any questions please contact <a href="%2">Customer Support</a>.'),
                msgPlural   = text.localize('Your %1 accounts are unavailable. For any questions please contact <a href="%2">Customer Support</a>.');
            $('<p/>', {class: 'notice-msg'})
                .html(
                    (disabledAccount.length === 1 ? msgSingular : msgPlural)
                        .replace('%1', disabledAccount.join(', '))
                        .replace('%2', page.url.url_for('contact'))
                )
                .insertAfter($(welcomeTextID));
        }
    };

    var apiResponse = function(response) {
        if('error' in response){
            if('message' in response.error) {
                console.log(response.error.message);
            }
            return false;
        }

        switch(response.msg_type) {
            case 'balance':
                responseBalance(response);
                break;
            case 'get_account_status':
                responseAccountStatus(response);
                break;
            case 'get_settings':
                responseGetSettings(response);
                break;
            case 'landing_company':
                responseLandingCompany(response);
                break;
            case 'payout_currencies':
                responsePayoutCurrencies(response);
                break;
            default:
                break;
        }
    };

    return {
        init : init,
        apiResponse : apiResponse
    };
}());


pjax_config_page("user/my_accountws", function() {
    return {
        onLoad: function() {
            if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }

            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response) {
                        MyAccountWS.apiResponse(response);
                    }
                }
            });

            Content.populate();
            MyAccountWS.init();
        }
    };
});
