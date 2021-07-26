const Url        = require('../../../javascript/_common/url.js');
const Client     = require('../../app/base/client');
const BinaryPjax = require('../../app/base/binary_pjax');

const DeactivatedAccount = (() => {
    const onLoad = () => {
        const redirect_home = Url.urlFor('home');
        const redirect_trading = Url.urlFor('trading');
        setTimeout(() => {
            if (Client.isLoggedIn()) {
                BinaryPjax.load(redirect_trading);
            } else {
                BinaryPjax.load(redirect_home);
            }
            
        }, 5000);
    };

    return {
        onLoad,
    };
})();

module.exports = DeactivatedAccount;
