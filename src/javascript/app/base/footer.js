const Cookies      = require('js-cookie');
const BinarySocket = require('./socket');
const Client       = require('../base/client');
const isEuCountry  = require('../common/country_base').isEuCountry;
const LocalStore   = require('../../_common/storage').LocalStore;
const State        = require('../../_common/storage').State;

const Footer = (() => {
    const onLoad = () => {
        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            // show CFD warning to logged in maltainvest clients or
            // logged in virtual clients with maltainvest financial landing company or
            // logged out clients with EU IP address
            if (Client.isLoggedIn()) {
                showWarning((Client.get('landing_company_shortcode') === 'maltainvest' ||
                    (Client.get('is_virtual') && State.getResponse('landing_company.financial_company.shortcode') === 'maltainvest')));
            } else {
                showWarning(isEuCountry());
            }
        });
    };

    const showWarning = (should_show_warning) => {
        $('#footer-regulatory .eu-only').setVisibility(should_show_warning);
    };

    const clearNotification = () => {
        const $status_notification = $('#status_notification');
        $status_notification.slideUp(200);
    };

    const clearDialogMessage = () => {
        const $dialog_notification = $('#dialog_notification');
        $dialog_notification.slideUp(200);
    };

    const displayDialogMessage = () => {
        BinarySocket.wait('time').then((response) => {
            const $dialog_notification = $('#dialog_notification');
            const $dialog_notification_accept = $('#dialog_notification_accept');
            $dialog_notification.css('display', 'flex');
            $dialog_notification_accept
                .off('click')
                .on('click', () => {
                    $dialog_notification.slideUp(200);
                    Cookies.set('CookieConsent', response.time);
                });
        });
    };
    
    const displayNotification = (message) => {
        BinarySocket.wait('time').then((response) => {
            const notification_storage = LocalStore.getObject('status_notification');
            const time_difference = (parseInt(response.time) - (parseInt(notification_storage.close_time) || 0));
            const required_difference = 30 * 60;
            
            if (time_difference > required_difference || notification_storage.message !== message) {
                const $status_message_text = $('#status_notification_text');
                const $close_icon = $('#status_notification_close');
                const $status_notification = $('#status_notification');

                $status_notification.css('display', 'flex');
                $status_message_text.html(message);
                $close_icon
                    .off('click')
                    .on('click', () => {
                        $status_notification.slideUp(200);
                        notification_storage.message = message;
                        notification_storage.close_time = response.time;
                        LocalStore.setObject('status_notification', notification_storage);
                    });
            }
        });
    };

    return {
        onLoad,
        clearNotification,
        displayNotification,
        displayDialogMessage,
        clearDialogMessage,
    };
})();

module.exports = Footer;
