var VerifyEmailWS = (function(){
    "use strict";

    function emailHandler(error) {
    	error.textContent = Content.localize().textEmailSent;
    	error.setAttribute('style', 'display:block');
    }

    function initPage(email){
        VerifyEmailData.getEmail(email);
    }

    return {
    	emailHandler: emailHandler,
        init: initPage
    };
}());
