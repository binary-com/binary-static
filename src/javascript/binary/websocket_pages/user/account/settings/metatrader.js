var MetaTrader = (function(){
    'use strict';

    var validatePassword = function(password) {
        var errMsg = '';

        if (!/^.+$/.test(password)) {
            errMsg = Content.errorMessage('req');
        } else if (password.length < 6 || password.length > 25) {
            errMsg = Content.errorMessage('range', '6-25');
        } else if (!/[0-9]+/.test(password) || !/[A-Z]+/.test(password) || !/[a-z]+/.test(password)) {
            errMsg = text.localize('Password should have lower and uppercase letters with numbers.');
        } else if (!/^[!-~]+$/.test(password)) {
            errMsg = Content.errorMessage('valid', Content.localize().textPassword);
        }

        return errMsg;
    };

    return {
        validatePassword: validatePassword,
    };
}());
