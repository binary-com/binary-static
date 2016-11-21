var LostPassword = require('./lost_password/lost_password.init').LostPassword;

var LostPasswordWS = (function() {
    var onLoad = function() {
        if(page.client.redirect_if_login()) {
            return;
        }
        BinarySocket.init({
            onmessage: LostPassword.lostPasswordWSHandler
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
