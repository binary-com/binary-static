var FinancialAccOpeningUI = (function(){
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
        title                    : document.getElementById('title'),
        fname                    : document.getElementById('fname'),
        lname                    : document.getElementById('lname'),
        dobdd                    : document.getElementById('dobdd'),
        dobmm                    : document.getElementById('dobmm'),
        dobyy                    : document.getElementById('dobyy'),
        residence                : document.getElementById('residence-disabled'),
        address1                 : document.getElementById('address1'),
        address2                 : document.getElementById('address2'),
        town                     : document.getElementById('address-town'),
        state                    : document.getElementById('address-state'),
        postcode                 : document.getElementById('address-postcode'),
        tel                      : document.getElementById('tel'),
        question                 : document.getElementById('secret-question'),
        answer                   : document.getElementById('secret-answer'),
        tnc                      : document.getElementById('tnc'),
        forexExperience          : document.getElementById('forex-trading-experience'),
        forexFrequency           : document.getElementById('forex-trading-frequency'),
        indicesExperience        : document.getElementById('indices-trading-experience'),
        indicesFrequency         : document.getElementById('indices-trading-frequency'),
        commoditiesExperience    : document.getElementById('commodities-trading-experience'),
        commoditiesFrequency     : document.getElementById('commodities-trading-frequency'),
        stocksExperience         : document.getElementById('stocks-trading-experience'),
        stocksFrequency          : document.getElementById('stocks-trading-frequency'),
        binaryExperience         : document.getElementById('other-derivatives-trading-experience'),
        binaryFrequency          : document.getElementById('other-derivatives-trading-frequency'),
        otherExperience          : document.getElementById('other-instruments-trading-experience'),
        otherFrequency           : document.getElementById('other-instruments-trading-frequency'),
        employment               : document.getElementById('employment-industry'),
        education                : document.getElementById('education-level'),
        incomeSource             : document.getElementById('income-source'),
        income                   : document.getElementById('net-income'),
        netWorth                 : document.getElementById('estimated-worth')
    };

    var errorObj = {
        title                    : document.getElementById('error-title'),
        fname                    : document.getElementById('error-fname'),
        lname                    : document.getElementById('error-lname'),
        dobdd                    : document.getElementById('error-birthdate'),
        dobmm                    : document.getElementById('error-birthdate'),
        dobyy                    : document.getElementById('error-birthdate'),
        residence                : document.getElementById('error-residence'),
        address1                 : document.getElementById('error-address1'),
        address2                 : document.getElementById('error-address2'),
        town                     : document.getElementById('error-town'),
        state                    : document.getElementById('error-state'),
        postcode                 : document.getElementById('error-postcode'),
        tel                      : document.getElementById('error-tel'),
        question                 : document.getElementById('error-question'),
        answer                   : document.getElementById('error-answer'),
        tnc                      : document.getElementById('error-tnc'),
        forexExperience          : document.getElementById('error-forex-trading-experience'),
        forexFrequency           : document.getElementById('error-forex-trading-frequency'),
        indicesExperience        : document.getElementById('error-indices-trading-experience'),
        indicesFrequency         : document.getElementById('error-indices-trading-frequency'),
        commoditiesExperience    : document.getElementById('error-commodities-trading-experience'),
        commoditiesFrequency     : document.getElementById('error-commodities-trading-frequency'),
        stocksExperience         : document.getElementById('error-stocks-trading-experience'),
        stocksFrequency          : document.getElementById('error-stocks-trading-frequency'),
        binaryExperience         : document.getElementById('error-other-derivatives-trading-experience'),
        binaryFrequency          : document.getElementById('error-other-derivatives-trading-frequency'),
        otherExperience          : document.getElementById('error-other-instruments-trading-experience'),
        otherFrequency           : document.getElementById('error-other-instruments-trading-frequency'),
        employment               : document.getElementById('error-employment-industry'),
        education                : document.getElementById('error-education-level'),
        incomeSource             : document.getElementById('error-income-source'),
        income                   : document.getElementById('error-net-income'),
        netWorth                 : document.getElementById('error-estimated-worth')
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

    if (elementObj['residence'].value === 'gb' && /^$/.test(Trim(elementObj['postcode'].value))){
      errorPostcode.innerHTML = Content.errorMessage('req');
      Validate.displayErrorMessage(errorPostcode);
      window.accountErrorCounter++;
    }

    ValidAccountOpening.checkTel(elementObj['tel'], errorObj['tel']);
    if (elementObj['answer'].offsetParent !== null) {
      ValidAccountOpening.checkAnswer(elementObj['answer'], errorObj['answer']);
    }

    for (key in elementObj){
      if (elementObj[key].offsetParent !== null && key !== 'address2' && key !== 'postcode' && key !== 'state') {
        if (/^$/.test(Trim(elementObj[key].value)) && elementObj[key].type !== 'checkbox'){
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
      FinancialAccOpeningData.getRealAcc(elementObj);
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
