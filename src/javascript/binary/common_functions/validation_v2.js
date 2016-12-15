var template = require('../base/utility').template;
var moment   = require('moment');
var dv       = require('../../lib/validation');
var Content  = require('./content').Content;

var ValidateV2 = (function() {
    function err() {
        return Content.errorMessage(...arguments);
    }

    // We don't have access to the localised messages at the init-time
    // of this module. Solution: delay execution with 'unwrappables'.
    // Objects that have an `.unwrap` method.
    //
    // unwrap({unwrap: () => 1}) == 1
    // unwrap(1) == 1
    //
    function unwrap(a) {
        return a.unwrap ? a.unwrap() : a;
    }

    function local(value) {
        return { unwrap: function() { return page.text.localize(value); } };
    }

    function localKey(value) {
        return { unwrap: function() { return Content.localize()[value]; } };
    }

    function msg() {
        var args = [].slice.call(arguments);
        return { unwrap: function() {
            return err(...args.map(unwrap));
        } };
    }

    function check(fn, error) {
        return function(value) {
            return fn(value) ?
                dv.ok(value) :
                dv.fail(unwrap(error));
        };
    }

    // TEST THESE
    function validEmail(email) {
        var regexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        return regexp.test(email);
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
        return /^[!-~]+$/.test(value);
    }

    function validToken(value) {
        return value.length === 48;
    }

    // CAN BE USED IN UI
    var required = check(notEmpty, msg('req'));
    var email    = check(validEmail, msg('valid', local('email address')));
    var token    = check(validToken, msg('valid', local('verification token')));
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

    function regex(regexp, allowed) {
        return function(str) {
            return regexp.test(str) ?
                dv.ok(str) :
                dv.fail(err('reg', allowed));
        };
    }

    function lengthRange(start, end) {
        var range = template('([_1]-[_2])', [start, end]);
        return function(str) {
            var len = str.length;
            return (len >= start && len <= end) ?
                dv.ok(str) :
                dv.fail(err('range', range));
        };
    }

    function momentFmt(format, error) {
        return function(str) {
            var date = moment(str, format, true);
            return date.isValid() ?
                dv.ok(date) :
                dv.fail(error);
        };
    }

    return {
        err        : err,
        momentFmt  : momentFmt,
        required   : required,
        password   : password,
        email      : email,
        token      : token,
        regex      : regex,
        lengthRange: lengthRange,
    };
})();

module.exports = {
    ValidateV2: ValidateV2,
};
