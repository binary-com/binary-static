var VirtualAccOpeningData = (function(){
    "use strict";

    function getDetails(email, password, residence){
        var verificationCookie = $.cookie('verify_token');
        var req = {
                    new_account_virtual: 1,
                    email: email,
                    client_password: password,
                    residence: residence,
                    verification_code: verificationCookie
                };

        if ($.cookie('affiliate_tracking')) {
            req.affiliate_token = JSON.parse($.cookie('affiliate_tracking')).t;
        }

        BinarySocket.send(req);
        if (verificationCookie) {
          $.removeCookie(verificationCookie, {path: '/', domain: '.' + document.domain.split('.').slice(-2).join('.')});
        }
    }

    return {
        getDetails: getDetails
    };
}());
