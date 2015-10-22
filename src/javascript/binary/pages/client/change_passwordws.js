
var PasswrdWS = (function(){


	var validateForm = function() {

		var errors = [];
		var inputs = ['old', 'new', 'repeat'];
		var $form = $("#changePasswordForm");

		inputs.forEach(function(i){
			value = $form.find("input."+i).val();

			// Password too short
			if(value.length < 5) {
				
			}

			// Password too long
			console.log(i);
		});


		var rules = {
			minLength: {

			}
		};
	};

	var minLength = function(str) {

	}

	return {
		validateForm: validateForm,
		sendRequest: sendRequest
	};
})();

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
		