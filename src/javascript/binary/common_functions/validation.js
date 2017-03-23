const Content  = require('./content');
const localize = require('../base/localize').localize;
const elementTextContent = require('../common_functions/common_functions').elementTextContent;
const elementInnerHtml = require('../common_functions/common_functions').elementInnerHtml;

const Validate = (function() {
    let errorCounter = 0;

  // give DOM element of error to display
    const displayErrorMessage = function(error) {
        error.setAttribute('style', 'display:block');
    };

  // give DOM element or error to hide
    const hideErrorMessage = function(error) {
        error.setAttribute('style', 'display:none');
        const errorMessage = $('.error-message-password');
        if (errorMessage) {
            errorMessage.remove();
        }
    };

    const handleError = function(error, message) {
        const par = document.createElement('p'),
            re = new RegExp(message);
        let allText = '';
        par.className = 'error-message-password';
        const parClass = $('.' + par.className);
        if (parClass.length > 1) {
            for (let i = 0; i < parClass.length; i++) {
                allText += parClass[i].textContent;
            }
            if (!re.test(allText)) {
                elementInnerHtml(par, par.innerHTML + ' ' + message);
            }
        } else {
            elementInnerHtml(par, message);
        }
        error.appendChild(par);
        displayErrorMessage(error);
    };

  // check validity of token
    const validateToken = function(token) {
        return (token.length === 48);
    };

  // give error message for invalid email, needs DOM element of error and value of email
    const errorMessageEmail = function(email, error) {
        if (email === '') {
            elementTextContent(error, Content.errorMessage('req'));
            displayErrorMessage(error);
            return true;
        } else if (!validateEmail(email)) {
            elementTextContent(error, Content.errorMessage('valid', localize('email address')));
            displayErrorMessage(error);
            return true;
        }
        hideErrorMessage(error);
        return false;
    };

  // give error message for invalid verification token, needs DOM element of error and value of verification token
    const errorMessageToken = function(token, error) {
        if (token === '') {
            elementTextContent(error, Content.errorMessage('req'));
            displayErrorMessage(error);
            return true;
        } else if (!validateToken(token)) {
            elementTextContent(error, Content.errorMessage('valid', localize('verification token')));
            displayErrorMessage(error);
            return true;
        }
        hideErrorMessage(error);
        return false;
    };

    const passwordNotEmpty = function(password, error) {
        if (!/^.+$/.test(password)) {
            handleError(error, Content.errorMessage('req'));
            return errorCounter++;
        }
        return true;
    };

    const fieldNotEmpty = function(field, error) {
        if (!/^.+$/.test(field)) {
            elementTextContent(error, Content.errorMessage('req'));
            displayErrorMessage(error);
            return errorCounter++;
        }
        return true;
    };

    const passwordMatching = function(password, rPassword, rError) {
        if (password !== rPassword) {
            elementTextContent(rError, localize('The two passwords that you entered do not match.'));
            displayErrorMessage(rError);
            return errorCounter++;
        }
        return true;
    };

    const passwordLength = function(password, error) {
        if (password.length < 6 || password.length > 25) {
            handleError(error, Content.errorMessage('range', '6-25'));
            return errorCounter++;
        }
        return true;
    };

    const passwordChars = function(password, error) {
        if (/[0-9]+/.test(password) && /[A-Z]+/.test(password) && /[a-z]+/.test(password)) {
            return true;
        }
        handleError(error, localize('Password should have lower and uppercase letters with numbers.'));
        return errorCounter++;
    };

    const isPasswordValid = function(password, error) {
        if (!/^[!-~]+$/.test(password)) {
            handleError(error, Content.errorMessage('valid', localize('password')));
            return errorCounter++;
        }
        return true;
    };

  // give error message for invalid password, needs value of password, repeat of password, and DOM element of error
  /**
   *
   * @param password      password
   * @param rPassword     confirm password
   * @param error         dom to show error for password (not jquery!)
   * @param rError        dom to show error for confirm password (not jquery!)
   * @returns {boolean}
     */
    const errorMessagePassword = function(password, rPassword, error, rError) {
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
        return (errorCounter === 0);
    };

    const errorMessageResidence = function(residence, error) {
        hideErrorMessage(error);
        if (residence === '') {
            elementTextContent(error, Content.errorMessage('req'));
            displayErrorMessage(error);
            return true;
        }
        return false;
    };

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
    return (/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/.test(mail));
}

function passwordValid(password) {
    if (password.length > 25) {
        return false;
    }

    const r = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,25}$/;
    return r.test(password);
}

/**
 * Use this if you want to separate validation logic with UI
 * Use Validate.errorMessagePassword if you want to handle UI with validation together
 * @param password      password
 * @returns {Array}     array of error message, can be empty
 */
function showPasswordError(password) {
    const errMsgs = [];
    if (password.length < 6 || password.length > 25) {
        errMsgs.push(Content.errorMessage('range', '6-25'));
    }

    const hasUpperLowerDigitRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    if (!hasUpperLowerDigitRegex.test(password)) {
        errMsgs.push(localize('Password should have lower and uppercase letters with numbers.'));
    }

    return errMsgs;
}

module.exports = {
    Validate         : Validate,
    validateEmail    : validateEmail,
    passwordValid    : passwordValid,
    showPasswordError: showPasswordError,
};
