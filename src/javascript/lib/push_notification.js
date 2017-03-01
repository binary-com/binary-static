const Client         = require('../binary/base/client').Client;
const url_for_static = require('../binary/base/url').url_for_static;
const Pushwoosh      = require('web-push-notifications').Pushwoosh;

const BinaryPushwoosh = (() => {
    const pw = new Pushwoosh();

    let initialised = false;

    const init = () => {
        if (!initialised) {
            pw.push(['init', {
                logLevel                : 'none', // or debug
                applicationCode         : 'D04E6-FA474',
                safariWebsitePushID     : 'web.com.binary',
                defaultNotificationTitle: 'Binary.com',
                defaultNotificationImage: 'https://style.binary.com/images/logo/logomark.png',
                serviceWorkerUrl        : url_for_static('/') + 'pushwoosh-service-worker-light.js',
            }]);
            initialised = true;
        }
    };

    const sendTags = () => {
        if (initialised) {
            pw.push((api) => {
                api.getTags().then((result) => {
                    if (!result.result['Login ID']) { // send login id
                        return api.setTags({ 'Login ID': Client.get('loginid') });
                    }
                    return null;
                });
            });
        }
    };

    return {
        init    : init,
        sendTags: sendTags,
    };
})();

module.exports = BinaryPushwoosh;
