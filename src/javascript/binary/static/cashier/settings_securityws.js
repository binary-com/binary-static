var securityws = (function(){

    "use strict";
    var $form ;

    var clearErrors = function(){
        $("#SecuritySuccessMsg").text('');
        $("#client_message_content").text('');
        $("#client_message_content").hide();

    };

    var init = function(){
        $form   = $("#changeCashierLock");
        $("#repasswordrow").show();
        $("#changeCashierLock").show();

        clearErrors();
        $form.find("button").attr("value","Update");

        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            if(validateForm() === false){
                return false;
            }
            if($(this).attr("value") === "Update"){
                BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "lock_password"}});
            }
            else{
                BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "unlock_password"}});
            }
        });
        BinarySocket.send({"authorize": $.cookie('login'), "passthrough": {"value": "is_locked"}});
    };

    var validateForm = function(){
        var isValid = true;
        var regexp = new RegExp('^[ -~]+$');

        clearErrors();

        var pwd1 = document.getElementById("cashierlockpassword1").value,
            pwd2 = document.getElementById("cashierlockpassword2").value,
            errorPassword = document.getElementById('errorcashierlockpassword1'),
            errorRPassword = document.getElementById('errorcashierlockpassword2'),
            isVisible = $("#repasswordrow").is(':visible');

        if(isVisible === true){
          if (!Validate.errorMessagePassword(pwd1, pwd2, errorPassword, errorRPassword)){
            isValid = false;
          }
        }

        return isValid;
    };
    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option= response.echo_req.passthrough.value ;
            var pwd = $("#cashierlockpassword1").val();

            switch(option){
                case   "lock_password" :
                        BinarySocket.send({
                            "cashier_password": "1",
                            "lock_password": pwd
                        });
                        break;
                case   "unlock_password" :
                        BinarySocket.send({
                            "cashier_password": "1",
                            "unlock_password": pwd
                        });
                        break;
                case   "is_locked" :
                        BinarySocket.send({
                            "cashier_password": "1",
                            "passthrough" : {"value" : "lock_status"}
                        });
                        break ;
            }
        }
    };
    var responseMessage = function(response){

       var resvalue;

       if(response.echo_req.passthrough && (response.echo_req.passthrough.value === "lock_status") ){
            var passthrough = response.echo_req.passthrough.value;
            resvalue = response.cashier_password;
            if(parseInt(resvalue) === 1){
                $("#repasswordrow").hide();
                $("legend").text(text.localize("Unlock Cashier"));
                $("#lockInfo").text(text.localize("Your cashier is locked as per your request - to unlock it, please enter the password."));
                $form.find("button").attr("value","Unlock Cashier");
                $form.find("button").html(text.localize("Unlock Cashier"));

            }
            else if(parseInt(resvalue) === 0){
                $("#repasswordrow").show();
                $("legend").text(text.localize("lock Cashier"));
                $("#lockInfo").text(text.localize("An additional password can be used to restrict access to the cashier."));
                $form.find("button").attr("value","Update");
                $form.find("button").html(text.localize("Update"));
                $('#password-meter-div').attr('style', 'display:block');
                $('#cashierlockpassword1').attr('style', 'border-bottom:none;');
                $('#cashierlockpassword1').on('input', function() {
                  $('#password-meter').attr('value', testPassword($('#cashierlockpassword1').val())[0]);
                });
            }

        }
        else{
            if("error" in response) {
                if("message" in response.error) {
                    $("#client_message_content").show();
                    $("#client_message_content").text(text.localize(response.error.message));
                }
                return false;
            }
            else{

                resvalue = response.echo_req.cashier_password;
                if(parseInt(resvalue) === 1){
                    $("#changeCashierLock").hide();
                    $("#client_message_content").hide();
                    $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
                }
                else{
                    $("#client_message_content").show();
                    $("#client_message_content").text(text.localize('Sorry, an error occurred while processing your account.'));

                    return false;
                }
            }
        }
        return;
    };
    var SecurityApiResponse = function(response){
        var type = response.msg_type;
        if (type === "cashier_password" || (type === "error" && "cashier_password" in response.echo_req)){
           responseMessage(response);

        }else if(type === "authorize" || (type === "error" && "authorize" in response.echo_req))
        {
            isAuthorized(response);
        }
    };

    return {
        init : init,
        SecurityApiResponse : SecurityApiResponse
    };
})();

pjax_config_page("user/settings/securityws", function() {
    return {
        onLoad: function() {
          if (!getCookieItem('login')) {
              window.location.href = page.url.url_for('login');
              return;
          }
          if((/VRT/.test($.cookie('loginid')))){
              window.location.href = ("/");
          }

          Content.populate();

          BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        securityws.SecurityApiResponse(response);

                    }
                }
            });

            securityws.init();
        }
    };
});
