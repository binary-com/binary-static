var TrafficSource = require('../../../../common_functions/traffic_source').TrafficSource;

var VirtualAccOpeningData = (function(){
    "use strict";

    function newAccount(config) {
        var req = {
            new_account_virtual: 1,
            client_password: config.password,
            residence:       config.residence,
            verification_code: config.verification_code
        };

        // Add TrafficSource parameters
        var utm_data = TrafficSource.getData();
        req.utm_source = TrafficSource.getSource(utm_data);
        if(utm_data.utm_medium)   req.utm_medium   = utm_data.utm_medium;
        if(utm_data.utm_campaign) req.utm_campaign = utm_data.utm_campaign;

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }

        if ($('#email_consent:checked').length > 0) {
            req.email_consent = 1;
        } else {
            req.email_consent = 0;
        }

        BinarySocket.send(req);
    }

    function getSchema() {
        var V2 = ValidateV2;
        var err = Content.localize().textPasswordsNotMatching;
        function matches(value, data) {
            return value === data.password;
        }
        return {
            residence: [V2.required],
            password:  [V2.password],
            'verification-code': [V2.required, V2.token],
            'r-password': [dv.check(matches, err)],
        };
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

module.exports = {
    VirtualAccOpeningData: VirtualAccOpeningData,
};
