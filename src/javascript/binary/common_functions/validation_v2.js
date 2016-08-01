var ValidateV2 = (function() {

    // Helper function to preserve context
    function localize(t) {
        return text.localize(t);
    }

    // Since we don't have access to Content.errorMessage
    // when this module is created we have to lazily get
    // it. Examples:
    //      check(isRequired,  'req')
    //      check(emailAddress, 'valid', 'email address')
    function check() {
        var args = [].slice.call(arguments);
        var fn   = args.shift();
        var key  = args.shift();

        return function(value) {
            return fn(value) ?
                dv.ok(value) :
                dv.fail(Content.errorMessage.apply(
                    Content,
                    [key].concat(args.map(localize))
                ));
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

    // CAN BE USED IN UI
    function err() {
        return Content.errorMessage.apply(Content, arguments);
    }

    var isRequired   = check(notEmpty,   'req');
    var emailAddress = check(validEmail, 'valid', 'email address');


    return {
        isRequired:   isRequired,
        emailAddress: emailAddress,
    };
})();
