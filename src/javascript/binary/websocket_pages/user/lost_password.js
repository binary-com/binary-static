var LostPassword = require('./lost_password/lost_password.init').LostPassword;
var Client       = require('../../base/client').Client;

var LostPasswordWS = (function() {
    var onLoad = function() {
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

module.exports = {
    LostPasswordWS: LostPasswordWS,
};
