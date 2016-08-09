var VirtualAccOpeningData = (function(){
    "use strict";

    function newAccount(config) {
        var req = {
            new_account_virtual: 1,
            client_password:     config.password,
            residence:           config.residence,
            verification_code:   config.verification_code,
        };

        var affiliateCookie = $.cookie('affiliate_tracking');
        if (affiliateCookie) {
            req.affiliate_token = JSON.parse(affiliateCookie).t;
        }

        BinarySocket.send(req);
    }

    function getSchema() {
        var V2 = ValidateV2;
        var err = Content.localize().textPasswordsNotMatching;
        function matches(value, data) {
            return value === data.password;
        }
        return validate_object(data, {
            residence: [V2.required],
            password:  [V2.password],
            'verification-code': [V2.required, V2.token],
            'r-password': [dv.check(matches, err)],
        });
    }

    function handler(config) {
        return function(msg) {
            var response = JSON.parse(msg.data);
            if (!response) return;

            var type  = response.msg_type;
            var error = response.error;

            if (type === 'new_account_virtual' && !error) return config.success(response);
            if (type !== 'error' && !error) return;

            switch (error.code) {
                case 'InvalidToken':    return config.invalidToken(response);
                case 'duplicate email': return config.duplicateEmail(response);
                case 'PasswordError':   return config.passwordError(response);
                default: return;
            }
        };
    }

    return {
        newAccount: newAccount,
        getSchema:  getSchema,
        handler:    handler,
    };
}());
