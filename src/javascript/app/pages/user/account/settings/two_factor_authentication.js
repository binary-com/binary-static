const TwoFactorAuthentication = (() => {
    // two factor auth logic here
    // loader
    const onLoad = () => {
        // initialize form
        init();
    };

    const init = () => {
        // ws - getStatus
        // enabled state: show form
        // disabled state:
        // 1. get key
        // show signup + form
        // ws - generateKey
        // 2. make QR
        initQR('key');
    };

    const initQR = (key) => {
        console.log(key);
        handler();
        // create QR code from key
    };

    const handler = () => {
        // handle submit of the form
        // 1. error - show error
        // 2. enabled - show success + initialize enabled state (?)
        // 3. disabled - show success + initialize disabled state (?)
    };

    return {
        onLoad,
    };
})();

module.exports = TwoFactorAuthentication;
