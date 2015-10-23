/**
 * Notice
 * Some comments are used as a temporary reminder and will be removed before
 * PR being ready.
**/
var PasswordWS = (function(){


	var $form   = $("#change-password > form");
	var $result = $("#change-password > div[data-id='success-result']");
	var validateForm = function() {

		var isValid 	= true
		,	
		,	old_pass 	= $form.find("input.old-password").val()
		,	new_pass 	= $form.find("input.new-password").val()
		,	repeat_pass = $form.find("input.repeat-password").val();

		/**
		 * Validation for new-password
		**/

		// New password cannot be the same as the old password
		// https://github.com/regentmarkets/bom-websocket-api/blob/c1bfcfcf78e7ac3bfd7a8ff587e62f313bf9ac81/lib/BOM/WebSocketAPI/v3/Accounts.pm#L190
		if(new_pass.length > 0 && new_pass === old_pass) {

		}

		// Min length
		if(new_pass.length < 6) {
			$form.find("p[data-error='too-short']").addClass("show");
			isValid = false;
		} else {
			$form.find("p[data-error='too-short']").removeClass("show");
		}

		// Max length
		if(new_pass.length > 25) {
			$form.find("p[data-error='too-long']").addClass("show");
			isValid = false;
		} else {
			$form.find("p[data-error='too-long']").removeClass("show");
		}


		// New and Repeat should be the same
		if(new_pass !== repeat_pass) {
			$form.find("p[data-error='not-the-same']").addClass("show");
			isValid = false;
		} else {
			$form.find("p[data-error='not-the-same']").removeClass("show");
		}

		if(isValid) return {
			old_pass: old_pass,
			new_pass: new_pass
		};

		return false;

	};

	var sendRequest = function() {

		var passwords = validateForm();
		if(false === passwords) return false;

		TradeSocket.send({
		    "change_password": "1", // or 1 ?
		    "old_password": passwords.old_pass,
		    "new_password": passwords.new_pass
		});

	};

	var apiResponse = function(resp) {

		/** 
		 * Failed
		**/
		if("error" in resp) {

			/**
			 * The following have been extracted from https://github.com/regentmarkets/bom-websocket-api/blob/c1bfcfcf78e7ac3bfd7a8ff587e62f313bf9ac81/lib/BOM/WebSocketAPI/v3/Accounts.pm#L171
			**/

			// ChangePasswordError
			//  /Old password is wrong/

			// InputValidationFailed

			// ChangePasswordError
			// /New password is same as old password/

			return false;
		}

		$form.addClass('hidden');
		$result.removeClass('hidden');
		setInterval(function() { window.location.hostname + "/login"; }, 5000);

		return true;

	};

	return {
		sendRequest: sendRequest,
		apiResponse: apiResponse
	};

})();

/*******************************************************************************

Old onsubmit handler code. Will later be removed. For now, kept for easy lookup


function () { 
	var bResult = true; 
	var input_element_oldpassword = document.getElementById('oldpassword');
	var error_element_erroroldpassword = document.getElementById('erroroldpassword');
	document.getElementById('erroroldpassword').innerHTML = '';
	if (input_element_oldpassword && error_element_erroroldpassword) {
		var regexp;
		var bInputResult = true;
		regexp = new RegExp('^.+$');
		if (bInputResult && !regexp.test(input_element_oldpassword.value)){
			error_element_erroroldpassword.innerHTML = 'Please enter a password.';
			bInputResult = false;
		}
		regexp = new RegExp('^[ -~]+$');
		if (bInputResult && !regexp.test(input_element_oldpassword.value)){
			error_element_erroroldpassword.innerHTML = 'Your password contains invalid characters.';
			bInputResult = false;
		}
		regexp = new RegExp('^.{5}.*$');
		if (bInputResult && !regexp.test(input_element_oldpassword.value)){
			error_element_erroroldpassword.innerHTML = 'Your password should be at least 5 characters.';
			bInputResult = false;
		}
		regexp = new RegExp('^.{0,25}$');
		if (bInputResult && !regexp.test(input_element_oldpassword.value)){
			error_element_erroroldpassword.innerHTML = 'Your password should not be more then 25 characters.';
			bInputResult = false;
		}
		if (!bInputResult){
			bResult = bInputResult;
		}
	}
	var input_element_npassword = document.getElementById('npassword');
	var error_element_errornpassword = document.getElementById('errornpassword');
	document.getElementById('errornpassword').innerHTML = '';
	if (input_element_npassword && error_element_errornpassword) {
		var regexp;
		var bInputResult = true;
		regexp = new RegExp('^.+$');
		if (bInputResult && !regexp.test(input_element_npassword.value)){
			error_element_errornpassword.innerHTML = decodeURIComponent('Please enter a password.');
			bInputResult = false;
		}
		regexp = new RegExp('^[ -~]+$');
		if (bInputResult && !regexp.test(input_element_npassword.value)){
			error_element_errornpassword.innerHTML = decodeURIComponent('Your password contains invalid characters.');
			bInputResult = false;
		}
		regexp = new RegExp('^.{6}.*$');
		if (bInputResult && !regexp.test(input_element_npassword.value)){
			error_element_errornpassword.innerHTML = decodeURIComponent('Your password should be at least 6 characters.');
			bInputResult = false;
		}
		regexp = new RegExp('^.{0,25}$');
		if (bInputResult && !regexp.test(input_element_npassword.value)){
			error_element_errornpassword.innerHTML = decodeURIComponent('Your password should not be more then 25 characters.');
			bInputResult = false;
		}
		if (!bInputResult){
			bResult = bInputResult;
		}
	}
	var input_element_npassword2 = document.getElementById('npassword2');
	var error_element_errornpassword2 = document.getElementById('errornpassword2');
	document.getElementById('errornpassword2').innerHTML = '';
	if (input_element_npassword2 &&  error_element_errornpassword2) {
		var regexp;var bInputResult = true;
		regexp = new RegExp('^.+$');
		if (bInputResult && !regexp.test(input_element_npassword2.value)){
			error_element_errornpassword2.innerHTML = decodeURIComponent('Please enter a password.');
			bInputResult = false;
		}
		regexp = new RegExp('^[ -~]+$');
		if (bInputResult && !regexp.test(input_element_npassword2.value)){
			error_element_errornpassword2.innerHTML = decodeURIComponent('Your password contains invalid characters.');
			bInputResult = false;
		}
		regexp = new RegExp('^.{6}.*$');
		if (bInputResult && !regexp.test(input_element_npassword2.value)){
			error_element_errornpassword2.innerHTML = decodeURIComponent('Your password should be at least 6 characters.');
			bInputResult = false;
		}
		regexp = new RegExp('^.{0,25}$');
		if (bInputResult && !regexp.test(input_element_npassword2.value)){
			error_element_errornpassword2.innerHTML = decodeURIComponent('Your password should not be more then 25 characters.');
			bInputResult = false;
		}
		if (bInputResult && !client_form.compare_new_password(input_element_npassword.value, input_element_npassword2.value)){
			error_element_errornpassword2.innerHTML = decodeURIComponent('The two passwords that you entered do not match.');bInputResult = false;}if (!bInputResult){bResult = bInputResult;}};  return bResult; })();

End of old code
*******************************************************************************/	