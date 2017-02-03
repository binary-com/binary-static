const ResetPassword = require('./reset_password/reset_password.init').ResetPassword;
const Client        = require('../../base/client').Client;

const ResetPasswordWS = (function() {
    const init = function() {
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
