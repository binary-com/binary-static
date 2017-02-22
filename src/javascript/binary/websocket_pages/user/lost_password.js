const LostPassword = require('./lost_password/lost_password.init').LostPassword;
const Client       = require('../../base/client').Client;

const LostPasswordWS = (function() {
    const onLoad = function() {
        if (Client.redirect_if_login()) {
            return;
        }
        BinarySocket.init({
            onmessage: LostPassword.lostPasswordWSHandler,
        });
        LostPassword.init();
    };

    return {
        onLoad: onLoad,
    };
})();

module.exports = LostPasswordWS;
