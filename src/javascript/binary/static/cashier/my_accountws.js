var MyAccountWS = (function() {
    "use strict";

    var loginid,
        isReal,
        get_account_status,
        is_authenticated_payment_agent,
        terms_conditions_version,
        client_tnc_status;
    var hiddenClass,
        welcomeTextID,
        virtualTopupID,
        authButtonID;

    var init = function() {
        hiddenClass    = 'invisible';
        welcomeTextID  = '#welcome_text';
        virtualTopupID = '#VRT_topup_link';
        authButtonID   = '#authenticate_button';

        loginid = page.client.loginid || $.cookie('loginid');

        BinarySocket.send({"get_settings"      : 1});
        BinarySocket.send({"website_status"    : 1});
        BinarySocket.send({"get_account_status": 1});

        //checkDisabledAccount();
    };

    var responseGetSettings = function(response) {
        var get_settings = response.get_settings;
        if (get_settings.country === null || $.cookie('residence') === '') {
          var documentDomain = document.domain.split('.').slice(-2).join('.');
          if ($.cookie('residence') !== '') {
            $.cookie('residence', '', {path: '/', domain: documentDomain});
          } else if (get_settings.country_code) {
            $.cookie('residence', get_settings.country_code, {path: '/', domain: documentDomain});
          }
          page.client.residence = get_settings.country_code;
          page.contents.topbar_message_visibility();
        }
        client_tnc_status = get_settings.client_tnc_status || '-';
        is_authenticated_payment_agent = get_settings.is_authenticated_payment_agent;

        checkAll();

        addGTMDataLayer(get_settings);
    };

    var responseAccountStatus = function(response) {
        get_account_status = response.get_account_status;
        checkAll();
    };

    var checkAll = function() {
        if(!terms_conditions_version || !client_tnc_status || !get_account_status) {
            return;
        }

        if(isReal && terms_conditions_version !== client_tnc_status) {
            window.location.href = page.url.url_for('user/tnc_approvalws');
            return;
        }

        showWelcomeMessage();
        if(!isReal) {
            showTopUpLink();
        }
        else {
            if(is_authenticated_payment_agent) {
                $('#payment_agent').removeClass(hiddenClass);
            }
        }

        if(get_account_status[0] === 'unwelcome'){
            $(authButtonID).removeClass(hiddenClass);
        }

        $('#cashier-portfolio, #profit-statement').removeClass(hiddenClass);
        $('#loading').remove();
    };

    var showWelcomeMessage = function() {
        var landing_company = page.client.get_storage_value('landing_company_name');
        $(welcomeTextID)
            .text(
                text.localize(
                    isReal ?
                        'You are currently logged in to your real money account with [_1] ([_2]).' :
                        'You are currently logged in to your virtual money account ([_2]).'
                )
                    .replace('[_1]', landing_company || '')
                    .replace('[_2]', loginid)
            )
            .removeClass(hiddenClass);
    };

    var showTopUpLink = function() {
        if(TUser.get().balance < 1000) {
            $(virtualTopupID + ' a')
                .text(
                    text.localize('Deposit [_1] [_2] virtual money into your account [_3]')
                        .replace('[_1]', TUser.get().currency)
                        .replace('[_2]', '10000')
                        .replace('[_3]', loginid)
                );
            $(virtualTopupID).removeClass(hiddenClass);
        }
    };

    var addGTMDataLayer = function(get_settings) {
        var is_login = page.url.param('login'),
            is_newaccount = localStorage.getItem('new_account') === '1';
        if(is_login || is_newaccount) {
            localStorage.removeItem('new_account');
            var oldUrl = window.location.href;
            var newUrl = oldUrl.replace(/(login=true&|newaccounttype=real&|newaccounttype=virtual&)/gi, '');

            var affiliateToken = $.cookie('affiliate_tracking');
            if (affiliateToken) {
                GTM.push_data_layer({'bom_affiliate_token': JSON.parse(affiliateToken).t});
            }

            var data = {
                'visitorID'   : page.client.loginid,
                'bom_country' : get_settings.country,
                'bom_email'   : get_settings.email,
                'url'         : oldUrl,
                'bom_today'   : Math.floor(Date.now() / 1000),
                'event'       : is_newaccount ? 'new_account' : 'log_in'
            };

            if(is_newaccount) {
                data['bom_date_joined'] = data['bom_today'];
            }

            if(isReal) {
                data['bom_age']       = parseInt((moment().unix() - get_settings.date_of_birth) / 31557600);
                data['bom_firstname'] = get_settings.first_name;
                data['bom_lastname']  = get_settings.last_name;
                data['bom_phone']     = get_settings.phone;
            }

            GTM.push_data_layer(data);

            window.history.replaceState('My Account', document.title, newUrl);
        }
    };

    var checkDisabledAccount = function() {
        var disabledAccount = [];
        page.user.loginid_array.map(function(loginObj) {
            if (loginObj.disabled && loginObj.real) {
                disabledAccount.push(loginObj.id);
            }
        });

        if(disabledAccount.length > 0) {
            var msgSingular = text.localize('Your [_1] account is unavailable. For any questions please contact [_2].'),
                msgPlural   = text.localize('Your [_1] accounts are unavailable. For any questions please contact [_2].');
            $('<p/>', {class: 'notice-msg'})
                .html(
                    (disabledAccount.length === 1 ? msgSingular : msgPlural)
                        .replace('[_1]', disabledAccount.join(', '))
                        .replace('[_2]', $('<a/>', {class: 'pjaxload', href: page.url.url_for('contact'), text: text.localize('Customer Support')}).prop('outerHTML'))
                )
                .insertAfter($(welcomeTextID));
        }
    };

    var apiResponse = function(response) {
        if('error' in response){
            if('message' in response.error) {
                console.warn(response.error.message);
            }
            return false;
        }

        isReal = !page.client.is_virtual();

        switch(response.msg_type) {
            case 'get_account_status':
                responseAccountStatus(response);
                break;
            case 'get_settings':
                responseGetSettings(response);
                break;
            case 'landing_company_details':
                showWelcomeMessage();
                break;
            case 'website_status':
                terms_conditions_version = response.website_status.terms_conditions_version;
                checkAll();
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
            if (page.client.redirect_if_logout()) {
                return;
            }

            showLoadingImage($('<div/>', {id: 'loading'}).insertAfter('#welcome'));

            if(page.url.param('login')) {
                page.client.clear_storage_values();
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
