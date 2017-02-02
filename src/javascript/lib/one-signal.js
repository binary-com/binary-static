const url_for_static = require('../binary/base/url').url_for_static;

const OneSignal = window.OneSignal || [];

const options = {
    appId: '8e2d0514-4c65-424e-b87e-4ffaaa61da21',
    autoRegister: false,
    path: url_for_static('/'),
    persistNotification: false,
    notifyButton: {
        enable: true,
        // displayPredicate: function() {
        //     /* Hide the notify button if the user is subscribed */
        //     return OneSignal.isPushNotificationsEnabled()
        //         .then(function(isPushEnabled) {
        //             return !isPushEnabled;
        //         });
        // },
        text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed to notifications",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You're subscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': "Follow these instructions to allow notifications:"
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
};

OneSignal.push(function() {
    OneSignal.SERVICE_WORKER_PARAM = { scope: url_for_static('/') };
});

/* for debugging */
// OneSignal.push(["getNotificationPermission", function(permission) {
//     console.log("Site Notification Permission:", permission);
// }]);
//
// OneSignal.push(["addListenerForNotificationOpened", function(data) {
//     console.warn("[Page] addListenerForNotificationOpened:", data);
// }]);
//
// OneSignal.push(function() {
//     // attach event listeners
//     OneSignal.on('initialize', function (e) {
//         console.warn('OneSignal initialize event', e);
//     });
//     OneSignal.on('subscriptionChange', function (isSubscribed) {
//         console.log("The user's subscription state is now:", isSubscribed);
//     });
//     OneSignal.on('notificationPermissionChange', function (e) {
//         console.log(e);
//     });
//     OneSignal.on('notificationDismiss', function(e) {
//         console.warn(e);
//     });
//     OneSignal.on('register', function() {
//         OneSignal.getUserId()
//             .then(function(userId) {
//                 console.log(userId);
//             });
//     });
// });

OneSignal.push(function() {
    // OneSignal.log.setLevel('trace'); /* for debugging */
    OneSignal.init(options);
});

module.exports = OneSignal;
