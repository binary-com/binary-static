var ResetPassword = require('./reset_password/reset_password.init').ResetPassword;

var ResetPasswordWS = (function() {
    var init = function() {
        if (page.client.redirect_if_login()) {
            return;
        }
        BinarySocket.init({
            onmessage: ResetPassword.resetPasswordWSHandler,
        });
        ResetPassword.init();
    };

    return {
        init: init,
    };
})();

module.exports = {
    ResetPasswordWS: ResetPasswordWS,
};
