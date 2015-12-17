var VerifyEmailData = (function(){
    "use strict";

    function getEmail(email){
        var req = {verify_email: email};

        BinarySocket.send(req);
    }

    return {
        getEmail: getEmail
    };
}());
