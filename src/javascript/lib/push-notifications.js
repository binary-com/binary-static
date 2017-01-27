var OneSignal = window.OneSignal || [];
OneSignal.push(["init", {
    appId: "8e2d0514-4c65-424e-b87e-4ffaaa61da21",
    autoRegister: true,
    notifyButton: {
        enable: false /* Set to false to hide */
    },
    welcomeNotification: {
        disable: true
    },
    promptOptions: {
        /* These prompt options values configure both the HTTP prompt and the HTTP popup. */
        /* actionMessage limited to 90 characters */
        actionMessage: "We'd like to show you notifications for the latest news and updates.",
        /* acceptButtonText limited to 15 characters */
        acceptButtonText: "ALLOW",
        /* cancelButtonText limited to 15 characters */
        cancelButtonText: "NO THANKS",
    },
    httpPermissionRequest: {
        modalTitle: 'Thanks for subscribing',
        modalMessage: "You're now subscribed to notifications. You can unsubscribe at any time.",
        modalButtonText: 'Close'
        /* ... */
    }
}]);