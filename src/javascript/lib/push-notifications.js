const url_for_static = require('../binary/base/url').url_for_static;

const OneSignal = window.OneSignal || [];

OneSignal.push(function() {
    OneSignal.SERVICE_WORKER_PARAM = { scope: url_for_static('/js/onesignal/') };
});

OneSignal.push(["getNotificationPermission", function(permission) {
    console.log("Site Notification Permission:", permission);
}]);

OneSignal.push(function() {
    // attach event listeners
    OneSignal.on('initialize', function (e) {
        console.warn('OneSignal initialize event', e);
    });
    OneSignal.on('subscriptionChange', function (isSubscribed) {
        console.log("The user's subscription state is now:", isSubscribed);
    });
    OneSignal.on('notificationPermissionChange', function (e) {
        console.log(e);
    });
    OneSignal.on('notificationDismiss', function(e) {
        console.warn(e);
    });
    OneSignal.on('register', function() {
        OneSignal.getUserId()
            .then(function(userId) {
                console.log(userId);
            });
    });
});

OneSignal.push(["init", {
    appId: "8e2d0514-4c65-424e-b87e-4ffaaa61da21",
    autoRegister: false,
    path: url_for_static('/js/onesignal/'),
    persistNotification: false,
    notifyButton: {
        enable: true,
        displayPredicate: function() {
            return OneSignal.isPushNotificationsEnabled()
                .then(function(isPushEnabled) {
                    console.log(isPushEnabled);
                    /* The user is subscribed, so we want to return "false" to hide the notify button */
                    return !isPushEnabled;
                });
        },
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
        /* Example notification title */
        exampleNotificationTitle: 'Example notification',
        /* Example notification message */
        exampleNotificationMessage: 'This is an example notification',
        /* Text below example notification, limited to 50 characters */
        exampleNotificationCaption: 'You can unsubscribe anytime',
        /* acceptButtonText limited to 15 characters */
        acceptButtonText: "ALLOW",
        /* cancelButtonText limited to 15 characters */
        cancelButtonText: "NO THANKS",
    }
}]);

module.exports = OneSignal;
