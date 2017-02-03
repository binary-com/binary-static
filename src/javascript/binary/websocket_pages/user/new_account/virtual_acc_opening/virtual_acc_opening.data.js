const Content       = require('../../../../common_functions/content').Content;
const TrafficSource = require('../../../../common_functions/traffic_source').TrafficSource;
const ValidateV2    = require('../../../../common_functions/validation_v2').ValidateV2;
const Cookies = require('../../../../../lib/js-cookie');
const dv      = require('../../../../../lib/validation');

const VirtualAccOpeningData = (function() {
    'use strict';

    const newAccount = function(config) {
        const req = {
            new_account_virtual: 1,
            client_password    : config.password,
            residence          : config.residence,
            verification_code  : config.verification_code,
        };

        // Add TrafficSource parameters
        const utm_data = TrafficSource.getData();
        req.utm_source = TrafficSource.getSource(utm_data);
        if (utm_data.utm_medium)   req.utm_medium   = utm_data.utm_medium;
        if (utm_data.utm_campaign) req.utm_campaign = utm_data.utm_campaign;

        if (Cookies.get('affiliate_tracking')) {
            req.affiliate_token = Cookies.getJSON('affiliate_tracking').t;
        }

        if ($('#email_consent:checked').length > 0) {
            req.email_consent = 1;
        } else {
            req.email_consent = 0;
        }

        BinarySocket.send(req);
    };

    const getSchema = function() {
        const V2 = ValidateV2;
        const err = Content.localize().textPasswordsNotMatching;
        const matches = function(value, data) {
            return value === data.password;
        };
        return {
            residence          : [V2.required],
            password           : [V2.password],
            'verification-code': [V2.required, V2.token],
            'r-password'       : [dv.check(matches, err)],
        };
    };

    const handler = function(config) {
        return function(msg) {
            const response = JSON.parse(msg.data);
            if (!response) return false;

            const type  = response.msg_type;
            const error = response.error;

            if (type === 'new_account_virtual' && !error) return config.success(response);
            if (type !== 'error' && !error) return true;

            switch (error.code) {
                case 'InvalidToken':    return config.invalidToken();
                case 'duplicate email': return config.duplicateEmail();
                case 'PasswordError':   return config.passwordError();
                default: return false;
            }
        };
    };

    return {
        newAccount: newAccount,
        getSchema : getSchema,
        handler   : handler,
    };
})();

module.exports = {
    VirtualAccOpeningData: VirtualAccOpeningData,
};
