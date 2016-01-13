var Validate = (function(){
  var errorCounter = 0;

  //give DOM element of error to display
  function displayErrorMessage(error){
    error.setAttribute('style', 'display:block');
  }

  //give DOM element or error to hide
  function hideErrorMessage(error){
    error.setAttribute('style', 'display:none');
    var errorMessage = $('.error-message-password');
    if (errorMessage){
      errorMessage.remove();
    }
  }

  function handleError(error, text){
    var par = document.createElement('p'),
        re = new RegExp(text),
        allText = '';
    par.className = 'error-message-password';
    var parClass = $('.' + par.className);
    if (parClass.length > 1) {
      for (i = 0; i < parClass.length; i++){
        allText = allText + parClass[i].textContent;
      }
      if (!re.test(allText)){
        par.innerHTML = par.innerHTML + ' ' + text;
      }
    } else {
      par.innerHTML = text;
    }
    error.appendChild(par);
    displayErrorMessage(error);
  }

  //check validity of email
  function validateEmail(mail) {
    if (/^\w+([\+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return true;
    }
    return false;
  }

  //give error message for invalid email, needs DOM element of error and value of email
  function errorMessageEmail(email, error) {
    if (email === "") {
      error.textContent = Content.errorMessage('req');
      displayErrorMessage(error);
      return true;
    } else if (!validateEmail(email)) {
      error.textContent = Content.errorMessage('valid', text.localize('email address'));
      displayErrorMessage(error);
      return true;
    }
    hideErrorMessage(error);
    return false;
  }

  function passwordNotEmpty(password, error){
    if (!/^.+$/.test(password)) {
      handleError(error, Content.errorMessage('req'));
      return errorCounter++;
    }
    return true;
  }

  function passwordRNotEmpty(rPassword, rError){
    if (!/^.+$/.test(rPassword)) {
      rError.textContent = Content.errorMessage('req');
      displayErrorMessage(rError);
      return errorCounter++;
    }
    return true;
  }

  function passwordMatching(password, rPassword, rError){
    if (password !== rPassword) {
      rError.textContent = Content.localize().textPasswordsNotMatching;
      displayErrorMessage(rError);
      return errorCounter++;
    }
    return true;
  }

  function passwordLength(password, error){
    if (password.length < 6 || password.length > 25) {
      handleError(error, Content.errorMessage('range', '6-25'));
      return errorCounter++;
    }
    return true;
  }

  function passwordValid(password, error){
    if (!/^[ -~]+$/.test(password)) {
      handleError(error, Content.errorMessage('valid', Content.localize().textPassword));
      return errorCounter++;
    }
    return true;
  }

  function passwordStrong(password, error){
    if (testPassword(password)[0] < 33) {
      var tooltipPassword = document.getElementById('tooltip-password');
      tooltipPassword.innerHTML = testPassword(password)[1];
      tooltipPassword.setAttribute('title', text.localize('Try adding 3 or more numbers and 2 or more special characters.'));
      displayErrorMessage(error);
      return errorCounter++;
    }
    return true;
  }

  //give error message for invalid password, needs value of password, repeat of password, and DOM element of error
  function errorMessagePassword(password, rPassword, error, rError) {
    hideErrorMessage(error);
    hideErrorMessage(rError);
    errorCounter = 0;

    if (passwordNotEmpty(password, error) === true){
      passwordLength(password, error);
      passwordValid(password, error);
      passwordStrong(password, error);
      if (passwordRNotEmpty(rPassword, rError) === true){
        passwordMatching(password, rPassword, rError);
      }
    } else {
      passwordRNotEmpty(rPassword, rError);
    }

    if (errorCounter === 0){
      return true;
    }
    return false;
  }

  return {
    displayErrorMessage: displayErrorMessage,
    hideErrorMessage: hideErrorMessage,
    errorMessageEmail: errorMessageEmail,
    errorMessagePassword: errorMessagePassword
  };
}());
