const template = require('../base/utility').template;
const moment   = require('moment');
const dv       = require('../../lib/validation');
const Content  = require('./content');
const localize = require('../base/localize').localize;

const ValidateV2 = (function() {
    const err = function() {
        return Content.errorMessage(...arguments);
    };

    // We don't have access to the localised messages at the init-time
    // of this module. Solution: delay execution with 'unwrappables'.
    // Objects that have an `.unwrap` method.
    //
    // unwrap({unwrap: () => 1}) == 1
    // unwrap(1) == 1
    //
    const unwrap = function(a) {
        return a.unwrap ? a.unwrap() : a;
    };

    const local = function(value) {
        return { unwrap: function() { return localize(value); } };
    };

    const msg = function() {
        const args = [].slice.call(arguments);
        return { unwrap: function() {
            return err(...args.map(unwrap));
        } };
    };

    const check = function(fn, error) {
        return function(value) {
            return fn(value) ?
                dv.ok(value) :
                dv.fail(unwrap(error));
        };
    };

    // TEST THESE
    const validEmail = function(email) {
        const regexp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;
        return regexp.test(email);
    };

    const notEmpty = function(value) {
        return value.length > 0;
    };

    const validPasswordLength = function(value) {
        return value.length >= 6 && value.length <= 25;
    };

    const validPasswordChars = function(value) {
        return /[0-9]+/.test(value) &&
            /[A-Z]+/.test(value) &&
            /[a-z]+/.test(value);
    };

    const noSymbolsInPassword = function(value) {
        return /^[!-~]+$/.test(value);
    };

    const validToken = function(value) {
        return value.length === 48;
    };

    // CAN BE USED IN UI
    const required = check(notEmpty, msg('req'));
    const email    = check(validEmail, msg('valid', local('email address')));
    const token    = check(validToken, msg('valid', local('verification token')));
    const password = function(value) {
        return dv.first(value, [
            password.len,
            password.allowed,
            password.symbols,
        ]);
    };

    password.len     = check(validPasswordLength, msg('range', '6-25'));
    password.allowed = check(validPasswordChars,  local('Password should have lower and uppercase letters with numbers.'));
    password.symbols = check(noSymbolsInPassword, msg('valid', local('password')));

    const regex = function(regexp, allowed) {
        return function(str) {
            return regexp.test(str) ?
                dv.ok(str) :
                dv.fail(err('reg', allowed));
        };
    };

    const lengthRange = function(start, end) {
        const range = template('([_1]-[_2])', [start, end]);
        return function(str) {
            const len = str.length;
            return (len >= start && len <= end) ?
                dv.ok(str) :
                dv.fail(err('range', range));
        };
    };

    const momentFmt = function(format, error) {
        return function(str) {
            const date = moment(str, format, true);
            return date.isValid() ?
                dv.ok(date) :
                dv.fail(error);
        };
    };

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
