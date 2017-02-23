const LostPassword = require('./lost_password/lost_password.init').LostPassword;

const LostPasswordWS = (function() {
    const onLoad = function() {
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
