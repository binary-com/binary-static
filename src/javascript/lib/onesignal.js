const Client         = require('./../binary/base/client').Client;
const getLanguage    = require('./../binary/base/language').getLanguage;
const localize       = require('./../binary/base/localize').localize;
const url_for_static = require('./../binary/base/url').url_for_static;

class BinaryOneSignal {
    constructor() {
        if (!isApplicable()) return;
        this.OneSignal = window.OneSignal || [];
        this.options = {
            appId       : '8e2d0514-4c65-424e-b87e-4ffaaa61da21',
            // safari_web_id: 'YOUR_SAFARI_WEB_ID',
            path        : url_for_static('/'),
            autoRegister: true,
            notifyButton: {
                enable: false,
            },
            persistNotification: false,
            welcomeNotification: {
                title  : 'Binary.com',
                message: localize('Thank you for subscribing!'),
            },
            allowLocalhostAsSecureOrigin: true,
        };
        this.configure();
    }

    /*
     * Initializes OneSignal SDK
     * Notes:
     *  - do not call 'init' twice
     *  - 'init' call is required before any function can be used
     *  - log level can be set to 'trace/debug/info/warn/error' or 'silent' to disable all but in production
     *     - refer https://www.npmjs.com/package/loglevel
     */
    configure() {
        this.OneSignal.log.setLevel('silent'); // Disable all error logging
        this.OneSignal.push(() => {
            // Register the worker at root scope, pushed before 'init'
            this.OneSignal.SERVICE_WORKER_PARAM = { scope: url_for_static('/') };
        });
        this.OneSignal.push(['init', this.options]);
    }

    /*
     * Checks if a user has already accepted push notifications,
     * then send the user website language and Binary login_id to OneSignal
     */
    checkSubscription() {
        if (!isApplicable()) return;
        this.OneSignal.push(() => {
            // If we're on an unsupported browser, do nothing
            if (!this.OneSignal.isPushNotificationsSupported()) {
                return;
            }
            this.OneSignal.isPushNotificationsEnabled()
                .then((isPushEnabled) => {
                    if (isPushEnabled) {
                        this.OneSignal.getTags((tags) => {
                            if (tags.language === undefined) {
                                this.OneSignal.sendTag('language', getLanguage().toLowerCase());
                            }
                            if (Client.is_logged_in() && tags.login_id === undefined) {
                                this.OneSignal.sendTag('login_id', Client.get('loginid'));
                            }
                        });
                    }
                });
        });
    }
}

const isApplicable = () => (window.location.hostname === 'www.binary.com' && !/logged_inws/i.test(window.location.pathname));

export default new BinaryOneSignal();
