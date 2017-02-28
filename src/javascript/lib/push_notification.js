const Client         = require('../binary/base/client').Client;
const url_for_static = require('../binary/base/url').url_for_static;
const Pushwoosh      = require('web-push-notifications').Pushwoosh;

const BinaryPushWoosh = (() => {
    const pw = new Pushwoosh();

    const init = () => {
        pw.push(['init', {
            logLevel                : 'info', // or debug
            applicationCode         : 'D04E6-FA474',
            safariWebsitePushID     : 'web.com.binary',
            defaultNotificationTitle: 'Binary.com',
            defaultNotificationImage: 'https://style.binary.com/images/logo/logomark.png',
            serviceWorkerUrl        : url_for_static('/') + 'pushwoosh-service-worker-light.js',
        }]);
    };

    const sendTags = () => {
        pw.push((api) => {
            api.getTags().then((result) => {
                if (!result.result['Login ID']) { // send login id
                    return api.setTags({ 'Login ID': Client.get('loginid') }).then((r) => {
                        console.log('setTags result', r);
                    });
                }
                return null;
            }).catch((e) => {
                console.log('error', e);
            });
        });
    };

    return {
        init    : init,
        sendTags: sendTags,
    };
})();

module.exports = BinaryPushWoosh;
