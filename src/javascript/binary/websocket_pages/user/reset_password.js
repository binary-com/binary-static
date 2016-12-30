var ResetPassword = require('./reset_password/reset_password.init').ResetPassword;
var Client        = require('../../base/client').Client;

var ResetPasswordWS = (function() {
    var init = function() {
        if (Client.redirect_if_login()) {
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
