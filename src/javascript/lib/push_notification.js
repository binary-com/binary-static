const Client         = require('../binary/base/client').Client;
const getLanguage    = require('../binary/base/language').getLanguage;
const url_for_static = require('../binary/base/url').url_for_static;
const Pushwoosh      = require('web-push-notifications').Pushwoosh;

const BinaryPushwoosh = (() => {
    const pw = new Pushwoosh();

    let initialised = false;

    const init = () => {
        const hostname = window.location.hostname;
        if (!(hostname.match(/^(www.binary.com|staging.binary.com)$/))) return;

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
            sendTags();
        }
    };

    const sendTags = () => {
        pw.push((api) => {
            api.getTags().then((result) => {
                if (!result.result['Login ID'] || !result.result['Site Language']) {
                    // send login id and site language
                    return api.setTags({
                        'Login ID'     : Client.get('loginid'),
                        'Site Language': getLanguage(),
                    });
                }
                return null;
            });
        });
    };

    return {
        init: init,
    };
})();

module.exports = BinaryPushwoosh;
