const url_for_static = require('../binary/base/url').url_for_static;
const Client         = require('../binary/base/client').Client;
const getLanguage    = require('../binary/base/language').getLanguage;
const localize       = require('../binary/base/localize').localize;

const OneSignal = window.OneSignal || [];

const options = {
    appId: '8e2d0514-4c65-424e-b87e-4ffaaa61da21',
    autoRegister: true,
    path: url_for_static('/'),
    persistNotification: false,
    notifyButton: {
        enable: false,
    },
    welcomeNotification: {
        title  : 'Binary.com',
        message: localize('Thank you for subscribing!'),
    },
    allowLocalhostAsSecureOrigin: true,
};

OneSignal.push(function() {
    OneSignal.SERVICE_WORKER_PARAM = { scope: url_for_static('/') };
});

function prompt() {
    OneSignal.push(function() {
        // If we're on an unsupported browser, do nothing
        if (!OneSignal.isPushNotificationsSupported()) {
            return;
        }
        OneSignal.isPushNotificationsEnabled()
            .then(function(isPushEnabled) {
                if (isPushEnabled && Client.is_logged_in()) {
                    // If user is subscribed and is logged in, send login_id to onesignal
                    OneSignal.getTags(function (tags) {
                        if (tags.login_id === undefined) {
                            const id = Client.get('loginid');
                            OneSignal.sendTags({
                                login_id: id,
                                language: getLanguage().toLowerCase()
                            });
                        }
                    });
                }
            });
    });
}

OneSignal.push(function() {
    OneSignal.init(options);
});

module.exports = {
    OneSignal,
    prompt: prompt,
};
