const Client         = require('../binary/base/client');
const getLanguage    = require('../binary/base/language').get;
const urlForStatic   = require('../binary/base/url').urlForStatic;
const Pushwoosh      = require('web-push-notifications').Pushwoosh;

const BinaryPushwoosh = (() => {
    const pw = new Pushwoosh();

    let initialised = false;

    const init = () => {
        if (!/^(www|staging)\.binary\.com$/.test(window.location.hostname)) return;
        
        if (!initialised) {
            pw.push(['init', {
                logLevel                : 'none', // or debug
                applicationCode         : 'D04E6-FA474',
                safariWebsitePushID     : 'web.com.binary',
                defaultNotificationTitle: 'Binary.com',
                defaultNotificationImage: 'https://style.binary.com/images/logo/logomark.png',
                serviceWorkerUrl        : urlForStatic('/') + 'pushwoosh-service-worker-light.js',
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
            }).catch(e => {
                return; // do nothing
            });
        });
    };

    return {
        init: init,
    };
})();

module.exports = BinaryPushwoosh;
