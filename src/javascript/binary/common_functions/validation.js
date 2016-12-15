// var testPassword = require('./passwordmeter').testPassword;
var Content      = require('./content').Content;

var Validate = (function() {
    var errorCounter = 0;

  // give DOM element of error to display
    function displayErrorMessage(error) {
        error.setAttribute('style', 'display:block');
    }

  // give DOM element or error to hide
    function hideErrorMessage(error) {
        error.setAttribute('style', 'display:none');
        var errorMessage = $('.error-message-password');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function handleError(error, text) {
        var par = document.createElement('p'),
            re = new RegExp(text),
            allText = '';
        par.className = 'error-message-password';
        var parClass = $('.' + par.className);
        if (parClass.length > 1) {
            for (var i = 0; i < parClass.length; i++) {
                allText += parClass[i].textContent;
            }
            if (!re.test(allText)) {
                par.innerHTML = par.innerHTML + ' ' + text;
            }
        } else {
            par.innerHTML = text;
        }
        error.appendChild(par);
        displayErrorMessage(error);
    }

  // check validity of token
    function validateToken(token) {
        if (token.length === 48) {
            return true;
        }
        return false;
    }

  // give error message for invalid email, needs DOM element of error and value of email
    function errorMessageEmail(email, error) {
        if (email === '') {
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);
            return true;
        } else if (!validateEmail(email)) {
            error.textContent = Content.errorMessage('valid', page.text.localize('email address'));
            displayErrorMessage(error);
            return true;
        }
        hideErrorMessage(error);
        return false;
    }

  // give error message for invalid verification token, needs DOM element of error and value of verification token
    function errorMessageToken(token, error) {
        if (token === '') {
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);
            return true;
        } else if (!validateToken(token)) {
            error.textContent = Content.errorMessage('valid', page.text.localize('verification token'));
            displayErrorMessage(error);
            return true;
        }
        hideErrorMessage(error);
        return false;
    }

    function passwordNotEmpty(password, error) {
        if (!/^.+$/.test(password)) {
            handleError(error, Content.errorMessage('req'));
            return errorCounter++;
        }
        return true;
    }

    function fieldNotEmpty(field, error) {
        if (!/^.+$/.test(field)) {
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);
            return errorCounter++;
        }
        return true;
    }

    function passwordMatching(password, rPassword, rError) {
        if (password !== rPassword) {
            rError.textContent = Content.localize().textPasswordsNotMatching;
            displayErrorMessage(rError);
            return errorCounter++;
        }
        return true;
    }

    function passwordLength(password, error) {
        if (password.length < 6 || password.length > 25) {
            handleError(error, Content.errorMessage('range', '6-25'));
            return errorCounter++;
        }
        return true;
    }

    function passwordChars(password, error) {
        if (/[0-9]+/.test(password) && /[A-Z]+/.test(password) && /[a-z]+/.test(password)) {
            return true;
        }
        handleError(error, page.text.localize('Password should have lower and uppercase letters with numbers.'));
        return errorCounter++;
    }

    function isPasswordValid(password, error) {
        if (!/^[!-~]+$/.test(password)) {
            handleError(error, Content.errorMessage('valid', Content.localize().textPassword));
            return errorCounter++;
        }
        return true;
    }

  /* function passwordStrong(password, error){
    if (testPassword(password)[0] < 20) {
      displayErrorMessage(error);
      return errorCounter++;
    }
    return true;
  }*/

  // give error message for invalid password, needs value of password, repeat of password, and DOM element of error
  /**
   *
   * @param password      password
   * @param rPassword     confirm password
   * @param error         dom to show error for password (not jquery!)
   * @param rError        dom to show error for confirm password (not jquery!)
   * @returns {boolean}
     */
    function errorMessagePassword(password, rPassword, error, rError) {
        hideErrorMessage(error);
        hideErrorMessage(rError);
        errorCounter = 0;

        if (passwordNotEmpty(password, error) === true) {
            passwordLength(password, error);
            passwordChars(password, error);
            isPasswordValid(password, error);
            if (fieldNotEmpty(rPassword, rError) === true) {
                passwordMatching(password, rPassword, rError);
            }
        } else {
            fieldNotEmpty(rPassword, rError);
        }

        if (errorCounter === 0) {
            return true;
        }
        return false;
    }

    function errorMessageResidence(residence, error) {
        hideErrorMessage(error);
        if (residence === '') {
            error.textContent = Content.errorMessage('req');
            displayErrorMessage(error);
            return true;
        }
        return false;
    }

    return {
        displayErrorMessage  : displayErrorMessage,
        hideErrorMessage     : hideErrorMessage,
        errorMessageEmail    : errorMessageEmail,
        errorMessagePassword : errorMessagePassword,
        fieldNotEmpty        : fieldNotEmpty,
        errorMessageResidence: errorMessageResidence,
        errorMessageToken    : errorMessageToken,
    };
})();

function validateEmail(mail) {
    if (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(mail)) {
        return true;
    }
    return false;
}

function passwordValid(password) {
    if (password.length > 25) {
        return false;
    }

    var r = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,25}$/;
    return r.test(password);
}

/**
 * Use this if you want to separate validation logic with UI
 * Use Validate.errorMessagePassword if you want to handle UI with validation together
 * @param password      password
 * @returns {Array}     array of error message, can be empty
 */
function showPasswordError(password) {
    var errMsgs = [];
    if (password.length < 6 || password.length > 25) {
        errMsgs.push(Content.errorMessage('range', '6-25'));
    }

    var hasUpperLowerDigitRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    if (!hasUpperLowerDigitRegex.test(password)) {
        errMsgs.push(page.text.localize('Password should have lower and uppercase letters with numbers.'));
    }

    return errMsgs;
}

module.exports = {
    Validate         : Validate,
    validateEmail    : validateEmail,
    passwordValid    : passwordValid,
    showPasswordError: showPasswordError,
};
