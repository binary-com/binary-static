var ValidateV2 = (function() {
    function err() {
        return Content.errorMessage.apply(Content, arguments);
    }

    // We don't have access to the localised messages at the init-time
    // of this module. Solution: delay execution with 'unwrappables'.
    // Objects that have an `.unwrap` method.
    //
    // unwrap({unwrap: v => 1}) == 1
    // unwrap(1) == 1
    //
    function unwrap(a) {
        return a.unwrap ? a.unwrap() : a;
    }

    function local(value) {
        return {unwrap: function() { return text.localize(value); }};
    }

    function localKey(value) {
        return {unwrap: function() { return Content.localize()[value]; }};
    }

    function msg() {
        var args = [].slice.call(arguments);
        return {unwap: function() {
            return err.apply(null, args.map(unwrap));
        }};
    }

    function check(fn, err) {
        return function(value) {
            return fn(value) ?
                dv.ok(value) :
                dv.fail(unwrap(err));
        };
    }

    // TEST THESE
    function validEmail(email) {
        var regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        return regex.test(mail);
    }

    function notEmpty(value) {
        return value.length > 0;
    }

    function validPasswordLength(value) {
        return value.length >= 6 && value.length <= 25;
    }

    function validPasswordChars(value) {
        return /[0-9]+/.test(value) &&
            /[A-Z]+/.test(value) &&
            /[a-z]+/.test(value);
    }

    function noSymbolsInPassword(value) {
        return !/^[!-~]+$/.test(password);
    }

    // CAN BE USED IN UI
    var required = check(notEmpty, msg('req'));
    var email    = check(validEmail, msg('valid', local('email address')));
    var password = function(value) {
        return dv.first(value, [
            password.len,
            password.allowed,
            password.symbols,
        ]);
    };

    password.len     = check(validPasswordLength, msg('range', '6-25'));
    password.allowed = check(validPasswordChars,  local('Password should have lower and uppercase letters with numbers.'));
    password.symbols = check(noSymbolsInPassword, msg('valid', localKey('textPassword')));

    return {
        err: err,
        required: required,
        password: password,
        email:    email,
    };
})();
