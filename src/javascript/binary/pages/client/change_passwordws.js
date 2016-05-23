var PasswordWS = (function(){

  var $form, $result;

  var init = function() {
    $('#change-password').removeClass('invisible');
    $form   = $("#change-password > form");
    $result = $("#change-password > div[data-id='success-result']");
    $form.find("button").on("click", function(e){
      e.preventDefault();
      e.stopPropagation();
      PasswordWS.sendRequest();
    });
  };

  var validateForm = function() {

    var isValid 	= true,
      old_pass 	= $form.find("input[name='oldpassword']").val(),
      new_pass 	= $form.find("input[name='new-password']").val(),
      repeat_pass = $form.find("input[name='repeat-password']").val();

    /**
     * Validation for new-password
    **/

    // Old passwrod cannot be blank. We leave the actual matching to backend
    if(0 === old_pass.length) {
      $form.find("p[data-error='old-blank']").removeClass("hidden");
      isValid = false;
    } else {
      $form.find("p[data-error='old-blank']").addClass("hidden");
    }

    // New password cannot be the same as the old password
    if(new_pass.length > 0 && new_pass === old_pass) {
      $form.find("p[data-error='same-as-old']").removeClass("hidden");
      isValid = false;
    } else {
      $form.find("p[data-error='same-as-old']").addClass("hidden");
    }

    if (!Validate.errorMessagePassword(document.getElementById('password').value, document.getElementById('repeat-password').value, document.getElementById('error-password'), document.getElementById('error-repeat-password'))){
      isValid = false;
    }

    // New and Repeat should be the same
    if(new_pass !== repeat_pass) {
      $form.find("p[data-error='not-the-same']").removeClass("hidden");
      isValid = false;
    } else {
      $form.find("p[data-error='not-the-same']").addClass("hidden");
    }

    if(isValid) return {
      old_pass: old_pass,
      new_pass: new_pass
    };

    return false;

  };

  var sendRequest = function() {

    $form.find("p[data-error='server-sent-error']").addClass("hidden");

    var passwords = validateForm();
    if(false === passwords) return false;

    BinarySocket.send({
        "change_password": "1",
        "old_password": passwords.old_pass,
        "new_password": passwords.new_pass
    });

  };

  var apiResponse = function(resp) {

    console.log("apiResponse:", resp);

    /**
     * Failed
    **/
    if("error" in resp) {
      var errorMsg = text.localize("Old password is wrong.");
      if("message" in resp.error) {
        errorMsg = resp.error.message;
      }
      $form.find("p[data-error='server-sent-error']").text(errorMsg).removeClass("hidden");
      return false;
    }

    /**
     * Succeeded
    **/
    $form.addClass("hidden");
    $result.removeClass("hidden");
    setTimeout(function(){page.client.send_logout_request(true);}, 5000);
    return true;

  };

  return {
    init: init,
    sendRequest: sendRequest,
    apiResponse: apiResponse
  };

})();

pjax_config_page_require_auth("user/change_password", function() {
    return {
        onLoad: function() {
          Content.populate();
          if (isIE() === false) {
            $('#password').on('input', function() {
              $('#password-meter').attr('value', testPassword($('#password').val())[0]);
            });
          } else {
            $('#password-meter').remove();
          }

          BinarySocket.init({
                onmessage: function(msg){
                    var response = JSON.parse(msg.data);
                    if (response) {
                        var type = response.msg_type;
                        if (type === "change_password" || (type === "error" && "change_password" in response.echo_req)){
                            PasswordWS.apiResponse(response);
                        }
                    }
                }
            });
            PasswordWS.init();
        }
    };
});
