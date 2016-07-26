var securityws = (function(){
    "use strict";
    var $form,
        init_done;

    var states = {
        GET_LOCK:   'lock_status',
        TRY_LOCK:   'lock_password',
        TRY_UNLOCK: 'unlock_password',
        LOCKED:     'is_locked',
    };

    function clearErrors() {
        $("#SecuritySuccessMsg").text('');
        $("#invalidinputfound").text('');
        $('#errorcashierlockpassword1').contents().filter(function () {
          return this.nodeType === Node.TEXT_NODE;
        }).remove();
    }

    function init() {
        if (init_done) {
            return;
        }
        init_done = true;
        $form     = $("#changeCashierLock");
        clearErrors();

        if (checkIsVirtual()) {
            return;
        }

        var loginToken = CommonData.getApiToken();
        $form.find("button").on("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            if (!validateForm()) {
                return false;
            }
            BinarySocket.send({
                "authorize": loginToken,
                "passthrough": {
                    "value": $(this).attr("value") === "Update" ? "lock_password" : "unlock_password"
                }
            });
        });
        BinarySocket.send({
            "authorize": loginToken,
            "passthrough": {"value": "is_locked"}
        });
    }

    function checkIsVirtual() {
        if (page.client.is_virtual()) {
            $form.hide();
            $('#SecuritySuccessMsg').addClass('notice-msg center-text').text(Content.localize().textFeatureUnavailable);
            return true;
        }
        return false;
    }

    function validateForm(){
        var isValid = true;
        clearErrors();

        var pwd1 = $("#cashierlockpassword1").val(),
            pwd2 = $("#cashierlockpassword2").val(),
            errorPassword  = $('#errorcashierlockpassword1')[0],
            errorRPassword = $('#errorcashierlockpassword2')[0],
            isVisible = $("#repasswordrow").is(':visible');

        if (isVisible) {
          isValid = !!Validate.errorMessagePassword(pwd1, pwd2, errorPassword, errorRPassword);
        } else if (!/[ -~]{6,25}/.test(pwd1)) {
          errorPassword.textContent = Content.errorMessage('min', 6);
          isValid = false;
        }
        return isValid;
    }

    function isAuthorized(response) {
        var passthrough = response.echo_req.passthrough;
        if (!passthrough) return;

        var params;
        var pwd = $("#cashierlockpassword1").val();

        switch(passthrough.value) {
            case states.TRY_LOCK:
                params = {"lock_password": pwd};
                break;
            case states.TRY_UNLOCK:
                params = {"unlock_password": pwd};
                break;
            case states.LOCKED:
                params = {"passthrough" : {"value" : "lock_status"}};
                break;
            default:
                init();
                return;
        }

        params.cashier_password = "1";
        BinarySocket.send(params);
    }

    var responseMessage = function(response){
        var echo = response.echo_req;
        var passthrough = echo.passthrough;

        if (passthrough && passthrough.value === "lock_status") {
            if (+response.cashier_password === 1) {
                $("#repasswordrow").hide();
                $("legend").text(text.localize("Unlock Cashier"));
                $("#lockInfo").text(text.localize("Your cashier is locked as per your request - to unlock it, please enter the password."));
                $form.find("button").attr("value","Unlock Cashier");
                $form.find("button").html(text.localize("Unlock Cashier"));
                $('#changeCashierLock').show();
                return;
            }
            $("#repasswordrow").show();
            $("legend").text(text.localize("Lock Cashier"));
            $("#lockInfo").text(text.localize("An additional password can be used to restrict access to the cashier."));
            $form.find("button").attr("value","Update");
            $form.find("button").html(text.localize("Update"));
            $('#password-meter-div').attr('style', 'display:block');
            if (!isIE()) {
              $('#cashierlockpassword1').on('input', function() {
                $('#password-meter').attr('value', testPassword($('#cashierlockpassword1').val())[0]);
              });
            } else {
              $('#password-meter').remove();
            }
            $('#changeCashierLock').show();
            return;
        }
        if (response.error) {
            $("#invalidinputfound").text(text.localize(response.error.message));
            return;
        }
        if (+echo.cashier_password === 1) {
            $("#changeCashierLock").hide();
            $("#invalidinputfound").text('');
            $("#SecuritySuccessMsg").text(text.localize('Your settings have been updated successfully.'));
        } else {
            $("#invalidinputfound").text(text.localize('Sorry, an error occurred while processing your account.'));
        }
    };

    var SecurityApiResponse = function(response){
        if (checkIsVirtual()) {
            return;
        }
        var type = response.msg_type;
        var echo = response.echo_req;
        if (type === "cashier_password" || "cashier_password" in echo) {
            responseMessage(response);
        } else if (type === "authorize" || "authorize" in echo) {
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
