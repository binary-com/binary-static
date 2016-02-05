var RealAccOpeningUI = (function(){
  "use strict";

  function setValues(){
    var dobdd    = document.getElementById('dobdd'),
        dobmm    = document.getElementById('dobmm'),
        dobyy    = document.getElementById('dobyy'),
        state    = document.getElementById('address-state');

    generateBirthDate(dobdd, dobmm, dobyy);
    generateState(state);
  }

  function showError(opt){
    $('#real-form').remove();
    var error = document.getElementsByClassName('notice-msg')[0];
    if (opt === 'duplicate') {
      error.innerHTML = text.localize("Sorry, you seem to already have a real money account with us. Perhaps you have used a different email address when you registered it. For legal reasons we are not allowed to open multiple real money accounts per person. If you do not remember your account with us, please") + " " + "<a href='" + page.url.url_for('contact') + "'>" + text.localize("contact us") + "</a>";
    } else {
      error.innerHTML = Content.localize().opt;
    }
    error.parentNode.parentNode.parentNode.setAttribute('style', 'display:block');
  }

  function hideAllErrors(allErrors) {
    for (i = 0; i < allErrors.length; i++) {
      allErrors[i].setAttribute('style', 'display:none');
    }
  }

  function checkValidity(){
    var errorCounter = 0;

    var letters = Content.localize().textLetters,
        numbers = Content.localize().textNumbers,
        space   = Content.localize().textSpace,
        hyphen  = Content.localize().textHyphen,
        period  = Content.localize().textPeriod,
        apost   = Content.localize().textApost;

    var title     = document.getElementById('title'),
        fname     = document.getElementById('fname'),
        lname     = document.getElementById('lname'),
        dobdd     = document.getElementById('dobdd'),
        dobmm     = document.getElementById('dobmm'),
        dobyy     = document.getElementById('dobyy'),
        residence = document.getElementById('residence-disabled'),
        address1  = document.getElementById('address1'),
        address2  = document.getElementById('address2'),
        town      = document.getElementById('address-town'),
        state     = document.getElementById('address-state'),
        postcode  = document.getElementById('address-postcode'),
        tel       = document.getElementById('tel'),
        question  = document.getElementById('secret-question'),
        answer    = document.getElementById('secret-answer'),
        tnc       = document.getElementById('tnc');

    var arr = [
                title.value,
                Trim(fname.value),
                Trim(lname.value),
                dobyy.value + '-' + dobmm.value + '-' + dobdd.value,
                page.client.residence,
                Trim(address1.value),
                Trim(address2.value),
                Trim(town.value),
                Trim(state.value),
                Trim(postcode.value),
                Trim(tel.value),
                question.value,
                Trim(answer.value)
            ];

    var errorTitle     = document.getElementById('error-title'),
        errorFname     = document.getElementById('error-fname'),
        errorLname     = document.getElementById('error-lname'),
        errorBirthdate = document.getElementById('error-birthdate'),
        errorResidence = document.getElementById('error-residence'),
        errorAddress1  = document.getElementById('error-address1'),
        errorAddress2  = document.getElementById('error-address2'),
        errorTown      = document.getElementById('error-town'),
        errorState     = document.getElementById('error-state'),
        errorPostcode  = document.getElementById('error-postcode'),
        errorTel       = document.getElementById('error-tel'),
        errorQuestion  = document.getElementById('error-question'),
        errorAnswer    = document.getElementById('error-answer'),
        errorTnc       = document.getElementById('error-tnc');

    var allErrors = [
                        errorTitle,
                        errorFname,
                        errorLname,
                        errorBirthdate,
                        errorResidence,
                        errorAddress1,
                        errorAddress2,
                        errorTown,
                        errorState,
                        errorPostcode,
                        errorTel,
                        errorQuestion,
                        errorAnswer,
                        errorTnc
                    ];

    hideAllErrors(allErrors);

    if (Trim(fname.value).length < 2) {
      errorFname.innerHTML = Content.errorMessage('min', '2');
      Validate.displayErrorMessage(errorFname);
      errorCounter++;
    } else if (!/^[a-zA-Z\s-.']+$/.test(fname.value)){
      errorFname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost, ' ']);
      Validate.displayErrorMessage(errorFname);
      errorCounter++;
    }

    if (Trim(lname.value).length < 2) {
      errorLname.innerHTML = Content.errorMessage('min', '2');
      Validate.displayErrorMessage(errorLname);
      errorCounter++;
    } else if (!/^[a-zA-Z\s-.']+$/.test(lname.value)){
      errorLname.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost, ' ']);
      Validate.displayErrorMessage(errorLname);
      errorCounter++;
    }

    if (!isValidDate(dobdd.value, dobmm.value, dobyy.value) || dobdd.value === '' || dobmm.value === '' || dobyy.value === '') {
      errorBirthdate.innerHTML = Content.localize().textErrorBirthdate;
      Validate.displayErrorMessage(errorBirthdate);
      errorCounter++;
    }

    if (!/^[a-zA-Z\d\s-.']+$/.test(address1.value)){
      errorAddress1.innerHTML = Content.errorMessage('reg', [letters, numbers, space, hyphen, period, apost, ' ']);
      Validate.displayErrorMessage(errorAddress1);
      errorCounter++;
    }

    if (address2.value !== ""){
      if (!/^[a-zA-Z\d\s-.']+$/.test(address2.value)){
        errorAddress2.innerHTML = Content.errorMessage('reg', [letters, numbers, space, hyphen, period, apost, ' ']);
        Validate.displayErrorMessage(errorAddress2);
        errorCounter++;
      }
    }

    if (!/^[a-zA-Z\s-.']+$/.test(town.value)){
      errorTown.innerHTML = Content.errorMessage('reg', [letters, space, hyphen, period, apost, ' ']);
      Validate.displayErrorMessage(errorTown);
      errorCounter++;
    }

    if(state.offsetParent !== null && state.value === '') {
      errorState.innerHTML = Content.errorMessage('req');
      Validate.displayErrorMessage(errorState);
      errorCounter++;
    }

    if (postcode.value !== '' && !/^[a-zA-Z\d-]+$/.test(postcode.value)){
      errorPostcode.innerHTML = Content.errorMessage('reg', [letters, numbers, hyphen, ' ']);
      Validate.displayErrorMessage(errorPostcode);
      errorCounter++;
    }

    if (residence.value === 'gb' && /^$/.test(Trim(postcode.value))){
      errorPostcode.innerHTML = Content.errorMessage('req');
      Validate.displayErrorMessage(errorPostcode);
      errorCounter++;
    }

    if (tel.value.replace(/\+| /g,'').length < 6) {
      errorTel.innerHTML = Content.errorMessage('min', 6);
      Validate.displayErrorMessage(errorTel);
      errorCounter++;
    } else if (!/^\+?[\d-\s]+$/.test(tel.value)){
      errorTel.innerHTML = Content.errorMessage('reg', [numbers, space, hyphen, ' ']);
      Validate.displayErrorMessage(errorTel);
      errorCounter++;
    }

    if (answer.value.length < 4) {
      errorAnswer.innerHTML = Content.errorMessage('min', 4);
      Validate.displayErrorMessage(errorAnswer);
      errorCounter++;
    }

    if (!tnc.checked){
      errorTnc.innerHTML = Content.errorMessage('req');
      Validate.displayErrorMessage(errorTnc);
      errorCounter++;
    }

    for (i = 0; i < arr.length; i++){
      if (/^$/.test(Trim(arr[i])) && i !== 6 && i !== 8 && i !== 9){
        allErrors[i].innerHTML = Content.errorMessage('req');
        Validate.displayErrorMessage(allErrors[i]);
        errorCounter++;
      }
    }

    if (errorCounter === 0) {
      RealAccOpeningData.getRealAcc(arr);
      hideAllErrors(allErrors);
      return 1;
    }

    return 0;
  }

  return {
    setValues: setValues,
    showError: showError,
    checkValidity: checkValidity
  };
})();
