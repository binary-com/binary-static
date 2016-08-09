var VirtualAccOpeningData = (function(){
    "use strict";

    function getDetails(password, residence, verificationCode){
        var req = {
                    new_account_virtual: 1,
                    client_password: password,
                    residence: residence,
                    verification_code: verificationCode
                };

        // Add TrafficSource parameters
        // NOTE: following lines can be uncommented (Re-check property names)
        // once these fields added to this ws call
        // var utm_data = TrafficSource.getData();
        // req.source = TrafficSource.getSource(utm_data);
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
