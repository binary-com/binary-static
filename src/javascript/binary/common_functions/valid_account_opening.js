var ValidAccountOpening = (function(){
  var redirectCookie = function() {
    if (page.client.show_login_if_logout(true)) {
        return;
    }
    if (!page.client.is_virtual()) {
      window.location.href = page.url.url_for('trading');
      return;
    }
    for (var i = 0; i < page.user.loginid_array.length; i++){
      if (page.user.loginid_array[i].real === true){
        window.location.href = page.url.url_for('trading');
        return;
      }
    }
  };
  var handler = function(response, message) {
    if (response.error) {
      var errorMessage = response.error.message;
      if (response.error.code === 'show risk disclaimer' && document.getElementById('financial-form')) {
        $('#financial-form').addClass('hidden');
        $('#financial-risk').removeClass('hidden');
        return;
      }
      if (document.getElementById('real-form')) {
        $('#real-form').remove();
      } else if (document.getElementById('japan-form')) {
        $('#japan-form').remove();
      } else if (document.getElementById('financial-form')) {
        $('#financial-form').remove();
        $('#financial-risk').remove();
      }
      var error = document.getElementsByClassName('notice-msg')[0];
      error.innerHTML = (response.msg_type === 'sanity_check') ? text.localize('There was some invalid character in an input field.') : errorMessage;
      error.parentNode.parentNode.parentNode.setAttribute('style', 'display:block');
      return;
    } else if (Cookies.get('residence') === 'jp') {
      window.location.href = page.url.url_for('new_account/knowledge_testws');
      $('#topbar-msg').children('a').addClass('invisible');
    } else {     // jp account require more steps to have real account
      page.client.process_new_account(Cookies.get('email'), message.client_id, message.oauth_token, false);
    }
  };
  var letters, numbers, space, hyphen, period, apost;

  var initializeValues = function() {
    letters = Content.localize().textLetters;
    numbers = Content.localize().textNumbers;
    space   = Content.localize().textSpace;
    hyphen  = Content.localize().textHyphen;
    period  = Content.localize().textPeriod;
    apost   = Content.localize().textApost;
  };

  var checkFname = function(fname, errorFname) {
    if (Trim(fname.value).length < 2) {
      errorFname.innerHTML = Content.errorMessage('min', '2');
      Validate.displayErrorMessage(errorFname);
      window.accountErrorCounter++;
    } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(fname.value)){
      initializeValues();
      errorFname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
      Validate.displayErrorMessage(errorFname);
      window.accountErrorCounter++;
    }
    return;
  };
  var checkLname = function(lname, errorLname) {
    if (Trim(lname.value).length < 2) {
      errorLname.innerHTML = Content.errorMessage('min', '2');
      Validate.displayErrorMessage(errorLname);
      window.accountErrorCounter++;
    } else if (/[`~!@#$%^&*)(_=+\[}{\]\\\/";:\?><,|\d]+/.test(lname.value)){
      initializeValues();
      errorLname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
      Validate.displayErrorMessage(errorLname);
      window.accountErrorCounter++;
    }
    return;
  };
  var checkDate = function(dobdd, dobmm, dobyy, errorDob) {
    if (!isValidDate(dobdd.value, dobmm.value, dobyy.value) || dobdd.value === '' || dobmm.value === '' || dobyy.value === '') {
      errorDob.innerHTML = Content.localize().textErrorBirthdate;
      Validate.displayErrorMessage(errorDob);
      window.accountErrorCounter++;
    }
    return;
  };
  var checkPostcode = function(postcode, errorPostcode) {
    if (postcode.value !== '' && !/^[a-zA-Z\d-]+$/.test(postcode.value)){
      initializeValues();
      errorPostcode.innerHTML = Content.errorMessage('reg', [letters, numbers, hyphen]);
      Validate.displayErrorMessage(errorPostcode);
      window.accountErrorCounter++;
    }
    return;
  };
  var checkTel = function(tel, errorTel) {
    if (tel.value.replace(/\+| /g,'').length < 6) {
      errorTel.innerHTML = Content.errorMessage('min', 6);
      Validate.displayErrorMessage(errorTel);
      window.accountErrorCounter++;
    } else if (!/^\+?[0-9\s]{6,35}$/.test(tel.value)){
      initializeValues();
      errorTel.innerHTML = Content.errorMessage('reg', [numbers, space]);
      Validate.displayErrorMessage(errorTel);
      window.accountErrorCounter++;
    }
    return;
  };
  var checkAnswer = function(answer, errorAnswer) {
    if (answer.value.length < 4) {
      errorAnswer.innerHTML = Content.errorMessage('min', 4);
      Validate.displayErrorMessage(errorAnswer);
      window.accountErrorCounter++;
    }
    return;
  };
  return {
    redirectCookie: redirectCookie,
    handler: handler,
    checkFname: checkFname,
    checkLname: checkLname,
    checkDate: checkDate,
    checkPostcode: checkPostcode,
    checkTel: checkTel,
    checkAnswer: checkAnswer
  };
}());
