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

    var validateName = function(name) {
        var errMsg = '';

        if (!/^.+$/.test(name)) {
            errMsg = Content.errorMessage('req');
        } else if (name.length < 2 || name.length > 30) {
            errMsg = Content.errorMessage('range', '2-30');
        } else if (!/^[a-zA-Z\s-.']+$/.test(name)) {
            var letters = Content.localize().textLetters,
                space   = Content.localize().textSpace,
                hyphen  = Content.localize().textHyphen,
                period  = Content.localize().textPeriod,
                apost   = Content.localize().textApost;
            errMsg = Content.errorMessage('reg', [letters, space, hyphen, period, apost]);
        }

        return errMsg;
    };

    var validateAmount = function(amount) {
        var errMsg = '';

        if (!/^.+$/.test(amount)) {
            errMsg = Content.errorMessage('req');
        } else if(!(/^\d+(\.\d+)?$/).test(amount) || !$.isNumeric(amount)) {
            errMsg = Content.errorMessage('reg', [numbers]);
        }

        return errMsg;
    };

    return {
        validatePassword: validatePassword,
        validateName    : validateName,
        validateAmount  : validateAmount,
    };
}());
