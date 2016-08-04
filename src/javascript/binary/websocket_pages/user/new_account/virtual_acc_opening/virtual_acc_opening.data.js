var VirtualAccOpeningData = (function(){
    "use strict";

    function getDetails(config) {
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

    return {
        getDetails: getDetails
    };
}());
