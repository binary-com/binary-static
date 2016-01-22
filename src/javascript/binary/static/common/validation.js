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

  function fieldNotEmpty(field, error){
    if (!/^.+$/.test(field)) {
      error.textContent = Content.errorMessage('req');
      displayErrorMessage(error);
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

  function passwordChars(password, error){
    if (/[0-9]+/.test(password) && /[a-zA-Z]+/.test(password)) {
      return true;
    }
    handleError(error, text.localize('Password should have letters and numbers.'));
    return errorCounter++;
  }

  function passwordValid(password, error){
    if (!/^[!-~]+$/.test(password)) {
      handleError(error, Content.errorMessage('valid', Content.localize().textPassword));
      return errorCounter++;
    }
    return true;
  }

  function passwordStrong(password, error){
    var tooltipPassword = document.getElementById('tooltip-password');
    if (testPassword(password)[0] < 20) {
      tooltipPassword.innerHTML = testPassword(password)[1];
      if (/[0-9]+/.test(password) && !/[a-zA-Z]+/.test(password)){
        tooltipPassword.setAttribute('title', text.localize('Try adding more letters.') + ' ' + Content.errorMessage('pass', testPassword(password)[0]));
      } else if (!/[0-9]+/.test(password) && /[a-zA-Z]+/.test(password)) {
        tooltipPassword.setAttribute('title', text.localize('Try adding more numbers.') + ' ' + Content.errorMessage('pass', testPassword(password)[0]));
      } else {
        tooltipPassword.setAttribute('title', text.localize('Try adding more letters or numbers.') + ' ' + Content.errorMessage('pass', testPassword(password)[0]));
      }
      tooltipPassword.setAttribute('style', 'display:inline-block');
      displayErrorMessage(error);
      return errorCounter++;
    }
    tooltipPassword.setAttribute('style', 'display:none');
    return true;
  }

  //give error message for invalid password, needs value of password, repeat of password, and DOM element of error
  function errorMessagePassword(password, rPassword, error, rError) {
    hideErrorMessage(error);
    hideErrorMessage(rError);
    errorCounter = 0;

    if (passwordNotEmpty(password, error) === true){
      passwordLength(password, error);
      passwordChars(password, error);
      passwordValid(password, error);
      passwordStrong(password, error);
      if (fieldNotEmpty(rPassword, rError) === true){
        passwordMatching(password, rPassword, rError);
      }
    } else {
      fieldNotEmpty(rPassword, rError);
    }

    if (errorCounter === 0){
      return true;
    }
    return false;
  }

  function errorMessageResidence(residence, error) {
    hideErrorMessage(error);
    if (residence === ""){
      error.textContent = Content.errorMessage('req');
      displayErrorMessage(error);
      return true;
    }
    return false;
  }

  return {
    displayErrorMessage: displayErrorMessage,
    hideErrorMessage: hideErrorMessage,
    errorMessageEmail: errorMessageEmail,
    errorMessagePassword: errorMessagePassword,
    fieldNotEmpty: fieldNotEmpty,
    errorMessageResidence: errorMessageResidence
  };
}());
