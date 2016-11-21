var Content             = require('../../../../common_functions/content').Content;
var ValidAccountOpening = require('../../../../common_functions/valid_account_opening').ValidAccountOpening;
var Validate            = require('../../../../common_functions/validation').Validate;
var RealAccOpeningData = require('./real_acc_opening.data').RealAccOpeningData;

var RealAccOpeningUI = (function(){
  "use strict";

  function checkValidity(){
    window.accountErrorCounter = 0;

    var letters = Content.localize().textLetters,
        numbers = Content.localize().textNumbers,
        space   = Content.localize().textSpace,
        hyphen  = Content.localize().textHyphen,
        period  = Content.localize().textPeriod,
        apost   = Content.localize().textApost;

    var elementObj = {
        title     : document.getElementById('title'),
        fname     : document.getElementById('fname'),
        lname     : document.getElementById('lname'),
        dobdd     : document.getElementById('dobdd'),
        dobmm     : document.getElementById('dobmm'),
        dobyy     : document.getElementById('dobyy'),
        residence : document.getElementById('residence-disabled'),
        address1  : document.getElementById('address1'),
        address2  : document.getElementById('address2'),
        town      : document.getElementById('address-town'),
        state     : document.getElementById('address-state'),
        postcode  : document.getElementById('address-postcode'),
        tel       : document.getElementById('tel'),
        question  : document.getElementById('secret-question'),
        answer    : document.getElementById('secret-answer'),
        tnc       : document.getElementById('tnc')
    };

    var errorObj = {
        title     : document.getElementById('error-title'),
        fname     : document.getElementById('error-fname'),
        lname     : document.getElementById('error-lname'),
        dobdd     : document.getElementById('error-birthdate'),
        dobmm     : document.getElementById('error-birthdate'),
        dobyy     : document.getElementById('error-birthdate'),
        residence : document.getElementById('error-residence'),
        address1  : document.getElementById('error-address1'),
        address2  : document.getElementById('error-address2'),
        town      : document.getElementById('error-town'),
        state     : document.getElementById('error-state'),
        postcode  : document.getElementById('error-postcode'),
        tel       : document.getElementById('error-tel'),
        question  : document.getElementById('error-question'),
        answer    : document.getElementById('error-answer'),
        tnc       : document.getElementById('error-tnc')
    };

    var key;
    for (key in errorObj) {
      if (errorObj[key].offsetParent !== null) {
        errorObj[key].setAttribute('style', 'display:none');
      }
    }

    ValidAccountOpening.checkFname(elementObj['fname'], errorObj['fname']);
    ValidAccountOpening.checkLname(elementObj['lname'], errorObj['lname']);
    ValidAccountOpening.checkDate(elementObj['dobdd'], elementObj['dobmm'], elementObj['dobyy'], errorObj['dobdd']);
    ValidAccountOpening.checkPostcode(elementObj['postcode'], errorObj['postcode']);

    if (elementObj['residence'].value === 'gb' && /^$/.test((elementObj['postcode'].value).trim())){
      elementObj['postcode'].innerHTML = Content.errorMessage('req');
      Validate.displayErrorMessage(elementObj['postcode']);
      window.accountErrorCounter++;
    }

    ValidAccountOpening.checkTel(elementObj['tel'], errorObj['tel']);
    ValidAccountOpening.checkAnswer(elementObj['answer'], errorObj['answer']);
    ValidAccountOpening.checkCity(elementObj['town'], errorObj['town']);

    for (key in elementObj){
      if (elementObj[key].offsetParent !== null && key !== 'address2' && key !== 'postcode' && key !== 'state') {
        if (/^$/.test((elementObj[key].value).trim()) && elementObj[key].type !== 'checkbox'){
          errorObj[key].innerHTML = Content.errorMessage('req');
          Validate.displayErrorMessage(errorObj[key]);
          window.accountErrorCounter++;
        }
        if (elementObj[key].type === 'checkbox' && !elementObj[key].checked){
          errorObj[key].innerHTML = Content.errorMessage('req');
          Validate.displayErrorMessage(errorObj[key]);
          window.accountErrorCounter++;
        }
      }
    }

    if (window.accountErrorCounter === 0) {
      $('#btn_submit').attr('disabled','disabled');
      RealAccOpeningData.getRealAcc(elementObj);
      for (key in errorObj) {
        if (errorObj[key].offsetParent !== null) {
          errorObj[key].setAttribute('style', 'display:none');
        }
      }
      return 1;
    }
    return 0;
  }

  return {
    checkValidity: checkValidity
  };
})();

module.exports = {
    RealAccOpeningUI: RealAccOpeningUI,
};
