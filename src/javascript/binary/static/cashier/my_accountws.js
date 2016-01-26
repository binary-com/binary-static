var my_accountws = (function(){

    "use strict";
    var currType;

    var init = function(){
        $("#welcome").hide();
      $("#VRT_topup_link").hide();
      $("#authenticate_button").hide();
      $("#welcome_text").hide();
      BinarySocket.send({"balance": 1, "req_id": 1 });
    };

    var getBalance = function(response){
      var str , bal ;
      if(response.echo_req.req_id){
        if("error" in response) {
              if("message" in response.error) {
                  console.log(response.error.message);
              }
              return false;
          }
        else{
          currType = response.balance.currency;
          bal =  response.balance.balance;
          var isReal = !(/VRT/.test($.cookie('loginid')));
          if(parseInt(response.req_id,10) === 1){
            if(!isReal){
                str = "You're currently logged in to your virtual money account ";
                $("#welcome").show();
                $("#welcome").text(text.localize("Welcome!"));
                $("#welcome_text").show();
                $("#welcome_text .clientid").text("("+ $.cookie('loginid') +").");
                $("#welcome_text").html(text.localize(str)+$("#welcome_text").html());
                $("#cashier-portfolio").removeClass('invisible');
                      $("#profit-statement").removeClass('invisible');
                      if(bal<1000){
                    str = "Deposit %1 virtual money into your account ";
                    $("#VRT_topup_link").show();
                    $("#VRT_topup_link a").text(text.localize(str).replace("%1",currType + " 10000 "));
                }
                BinarySocket.send({"get_settings": 1, "req_id":3});
            }
            else{
               BinarySocket.send({"get_settings": 1, "req_id":4});
            }
            BinarySocket.send({"get_account_status": 1, "req_id":2});
          }


        }
      }

    };

    var showAuthenticate = function(response){
        var status;
        if("error" in response){
            if("message" in response.error) {
              console.log(response.error.message);
          }
            return false;
        }
        else{
            status = response.get_account_status[0];
            if(status === "unwelcome"){
                $("#authenticate_button").show();
                $("#authenticate_button").removeClass("invisible");
                $("#authenticate_button span").text(text.localize("Authenticate your account"));
            }
        }
    };

    var getLandingCompany = function(response){
        var country_code;
        if("error" in response){
            if("message" in response.error) {
              console.log(response.error.message);
          }
            return false;
        }
        else{
            country_code = response.get_settings.country_code;
            BinarySocket.send({"landing_company": country_code, "req_id":4});
        }
    };

    var showWelcomeText = function(response){
        var landing_company, str;
        if("error" in response){
            if("message" in response.error) {
              console.log(response.error.message);
          }
            return false;
        }
        else{
            if(/MLT/.test($.cookie('loginid'))){
                landing_company = response.landing_company.gaming_company.name;
            }
            else{
                landing_company = response.landing_company.financial_company.name;
            }
            str = "You're currently logged in to your real money account with %1 ";
            $("#welcome").show();
        $("#welcome").text(text.localize("Welcome!"));
        $("#welcome_text").show();
        $("#welcome_text .clientid").text(" ("+ $.cookie('loginid') +").");
        $("#welcome_text").html(text.localize(str).replace("%1", landing_company) + $("#welcome_text").html());
        $("#cashier-portfolio").removeClass('invisible');
          $("#profit-statement").removeClass('invisible');
          showNoticeMsg();
        }
    };

    var showNoticeMsg = function(){
        var loginid_list = $.cookie('loginid_list');
        var res = loginid_list.split("+");
        if(res.length == "2" &&(/MLT/.test(res[0]) || /MLT/.test(res[1]))){
            $("#investment_message").removeClass("invisible");
        }
    };

    var addGTMDataLayer = function(response){
        if("error" in response){
            if("message" in response.error) {
              console.log(response.error.message);
          }
            return false;
        }
        else{
            if(page.url.param('login') || page.url.param('newaccounttype')){
                var oldUrl = window.location.href;
                var newUrl = oldUrl.replace(/(login=true&|newaccounttype=real&|newaccounttype=virtual&)/gi, "");
                var title = document.title;
                var age = parseInt((moment(str).unix()-response.get_settings.date_of_birth)/31557600);
                var name = TUser.get().fullname.split(' ');
                var data = {};
                data['bom_balance'] = TUser.get().balance;
                data['bom_country'] = response.get_settings.country;
                data['bom_email'] = TUser.get().email;
                data['language'] = page.url.param("l");
                data['pageTitle'] = title;
                data['url'] = oldUrl;
                data['visitorID'] = TUser.get().loginid;
                data['bom_today'] = Math.floor(Date.now() / 1000);

                if(response.req_id === 4){
                    data['bom_age'] = age;
                    data['bom_firstname'] = name[1];
                    data['bom_lastname'] = name[2];
                    data['bom_phone'] = response.get_settings.phone;
                    data['bom_pl'] = '';
                    data['bom_withdrawals'] = '';
                    data['bom_date_joined'] = '';
                    data['bom_deposits'] = '';
                    data['bom_gender'] = '';
                }

                if(page.url.param('newaccounttype'))
                    data['event'] = 'new_account';
                else
                    data['event'] = 'log_in';

                dataLayer.push(data);
                window.history.replaceState("My Account", title, newUrl);
            }
        }
    };

    var apiResponse = function(response){
      var type = response.msg_type;
      if(type === "balance" || (type === "error" && "balance" in response.echo_req))
        {
            getBalance(response);
        }
        if(type === "get_account_status" || (type === "error" && "get_account_status" in response.echo_req)){
            showAuthenticate(response);
        }
        if(type === "get_settings" && response.req_id === 3 || (type === "error" && "get_settings" in response.echo_req)){
            addGTMDataLayer(response);
        }
        if(type === "get_settings" && response.req_id === 4 || (type === "error" && "get_settings" in response.echo_req)){
            getLandingCompany(response);
            addGTMDataLayer(response);
        }
        if(type === "landing_company" || (type === "error" && "landing_company" in response.echo_req)){
            showWelcomeText(response);
        }
    };

    return {
      init : init,
      apiResponse : apiResponse

    };

})();



pjax_config_page("user/my_accountws", function() {
    return {
        onLoad: function() {
          if (!getCookieItem('login')) {
                window.location.href = page.url.url_for('login');
                return;
            }
          BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        my_accountws.apiResponse(response);

                    }
                }
            });
            Content.populate();
            my_accountws.init();
        }
    };
});
