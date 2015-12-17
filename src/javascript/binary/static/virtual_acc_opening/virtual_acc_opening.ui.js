var VirtualAccOpeningUI = (function(){
    "use strict";

    function setLabel(){

        var labels = document.getElementsByTagName('LABEL');
        for (var i = 0; i < labels.length; i++) {
            if (labels[i].htmlFor !== '') {
                var elem = document.getElementById(labels[i].htmlFor);
                if (elem)
                    elem.label = labels[i];         
            }
        }

        var details = document.getElementById('details'),
            email = document.getElementById('email'),
            btn_submit = document.getElementById('btn_submit'),
            residence = document.getElementById('residence'),
            password = document.getElementById('password'),
            rPassword = document.getElementById('r-password');

        details.textContent = StringUtil.toTitleCase(Content.localize().textDetails);
        email.label.innerHTML = StringUtil.toTitleCase(Content.localize().textEmailAddress);
        password.label.innerHTML = StringUtil.toTitleCase(Content.localize().textPassword);
        rPassword.label.innerHTML = StringUtil.toTitleCase(Content.localize().textRepeatPassword);
        residence.label.innerHTML = StringUtil.toTitleCase(Content.localize().textResidence);
        btn_submit.textContent = StringUtil.toTitleCase(Content.localize().textCreateNewAccount);
    }

    function checkPassword(password, rPassword){
        var errorPassword = document.getElementById('error-password'),
            errorRPassword = document.getElementById('error-r-password');

        return Validate.errorMessagePassword(password, rPassword, errorPassword, errorRPassword);
    }

    return {
        setLabel: setLabel,
        checkPassword: checkPassword
    };
}());
