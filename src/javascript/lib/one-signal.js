const url_for_static = require('../binary/base/url').url_for_static;

const OneSignal = window.OneSignal || [];

const options = {
    appId: '8e2d0514-4c65-424e-b87e-4ffaaa61da21',
    autoRegister: false,
    path: url_for_static('/'),
    persistNotification: false,
    notifyButton: {
        enable: false,
    },
    welcomeNotification: {
        "title": "Binary.com",
        "message": "Thank you for subscribing!",
    },
    allowLocalhostAsSecureOrigin: true,
    promptOptions: {
        /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
        /* actionMessage limited to 90 characters */
        actionMessage: "Binary.com would like to send you push notifications.",
        /* acceptButtonText limited to 15 characters */
        acceptButtonText: "ALLOW",
        /* cancelButtonText limited to 15 characters */
        cancelButtonText: "NO THANKS",
    }
};

OneSignal.push(function() {
    OneSignal.SERVICE_WORKER_PARAM = { scope: url_for_static('/') };
});

OneSignal.push(function() {
    OneSignal.init(options);
});

module.exports = OneSignal;
