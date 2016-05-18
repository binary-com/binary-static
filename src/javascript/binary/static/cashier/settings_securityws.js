var securityws = (function(){
    "use strict";
    var $form,
        init_done;

    var clearErrors = function(){
        $("#SecuritySuccessMsg").text('');
        $("#invalidinputfound").text('');
        $('#errorcashierlockpassword1').contents().filter(function () {
          return this.nodeType === 3;
        }).remove();
    };

    var init = function(){
        init_done = true;

        $form   = $("#changeCashierLock");

        clearErrors();

        if(checkIsVirtual()) {
            return;
        }

        $form   = $("#changeCashierLock");
        clearErrors();

        var loginToken = CommonData.getApiToken();
        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            if(validateForm() === false){
                return false;
            }
            BinarySocket.send({"authorize": loginToken, "passthrough": {"value": $(this).attr("value") === "Update" ? "lock_password" : "unlock_password"}});
        });
        BinarySocket.send({"authorize": loginToken, "passthrough": {"value": "is_locked"}});
    };

    var checkIsVirtual = function(){
        if(page.client.is_virtual()) {
            $form.hide();
            $('#SecuritySuccessMsg').addClass('notice-msg center').text(Content.localize().textFeatureUnavailable);
            return true;
        }
        return false;
    };

    var validateForm = function(){
        var isValid = true;
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
        } else if (!/[ -~]{6,25}/.test(pwd1)) {
          errorPassword.textContent = Content.errorMessage('min', 6);
          isValid = false;
        }
        return isValid;
    };
    var isAuthorized =  function(response){
        if(response.echo_req.passthrough){
            var option = response.echo_req.passthrough.value;
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
                default:
                        if(!init_done) {
                            init();
                        }
                        break;
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
                $('#changeCashierLock').show();
            }
            else if(parseInt(resvalue) === 0){
                $("#repasswordrow").show();
                $("legend").text(text.localize("Lock Cashier"));
                $("#lockInfo").text(text.localize("An additional password can be used to restrict access to the cashier."));
                $form.find("button").attr("value","Update");
                $form.find("button").html(text.localize("Update"));
                $('#password-meter-div').attr('style', 'display:block');
                if (isIE() === false) {
                  $('#cashierlockpassword1').on('input', function() {
                    $('#password-meter').attr('value', testPassword($('#cashierlockpassword1').val())[0]);
                  });
                } else {
                  $('#password-meter').remove();
                }
                $('#changeCashierLock').show();
            }
        }
        else{
            if("error" in response) {
                if("message" in response.error) {
                    $("#invalidinputfound").text(text.localize(response.error.message));
                }
                return false;
            }
            else{
                resvalue = response.echo_req.cashier_password;
                if(parseInt(resvalue) === 1){
                    $("#changeCashierLock").hide();
                    $("#invalidinputfound").text('');
                    $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
                }
                else{
                    $("#invalidinputfound").text(text.localize('Sorry, an error occurred while processing your account.'));
                    return false;
                }
            }
        }
        return;
    };
    var SecurityApiResponse = function(response){
        if(checkIsVirtual()) {
            return;
        }
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

pjax_config_page_require_auth("user/settings/securityws", function() {
    return {
        onLoad: function() {
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
