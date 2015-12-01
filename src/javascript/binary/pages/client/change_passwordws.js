var PasswordWS = (function(){

	var $form, $result;

	var init = function() {
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

		// Min length
		if(new_pass.length < 6) {
			$form.find("p[data-error='too-short']").removeClass("hidden");
			isValid = false;
		} else {
			$form.find("p[data-error='too-short']").addClass("hidden");
		}

		// Max length
		if(new_pass.length > 25) {
			$form.find("p[data-error='too-long']").removeClass("hidden");
			isValid = false;
		} else {
			$form.find("p[data-error='too-long']").addClass("hidden");
		}

		// Invalid characters
		var regexp = new RegExp('^[\\s.A-Za-z0-9@_:+-\/=]*$');
		if(new_pass.length && !regexp.test(new_pass)){
			$form.find("p[data-error='bad-chars']").removeClass("hidden");
			isValid = false;
		} else {
			$form.find("p[data-error='bad-chars']").addClass("hidden");
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
		return true;

	};

	return {
		init: init,
		sendRequest: sendRequest,
		apiResponse: apiResponse
	};

})();

pjax_config_page("user/change_password", function() {
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
