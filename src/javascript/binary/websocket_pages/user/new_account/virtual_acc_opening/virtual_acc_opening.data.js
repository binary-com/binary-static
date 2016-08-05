var VirtualAccOpeningData = (function(){
    "use strict";

    function getDetails(password, residence, verificationCode){
        var req = {
                    new_account_virtual: 1,
                    client_password: password,
                    residence: residence,
                    verification_code: verificationCode
                };

        // Add AdWords parameters
        // NOTE: following lines can be uncommented (Re-check property names)
        // once these fields added to this ws call
        // var utm_data = AdWords.getData();
        // req.source = utm_data.utm_source || utm_data.referrer || 'direct';
        // if(utm_data.utm_medium)   req.medium   = utm_data.utm_medium;
        // if(utm_data.utm_campaign) req.campaign = utm_data.utm_campaign;

        if ($.cookie('affiliate_tracking')) {
            req.affiliate_token = JSON.parse($.cookie('affiliate_tracking')).t;
        }

        BinarySocket.send(req);
    }

    return {
        getDetails: getDetails
    };
}());
