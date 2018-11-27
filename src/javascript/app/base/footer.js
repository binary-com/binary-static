const BinarySocket = require('./socket');
const Client       = require('../base/client');
const isEuCountry  = require('../common/country_base').isEuCountry;
const State        = require('../../_common/storage').State;
const LocalStore   = require('../../_common/storage').LocalStore;

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
    
    const displayNotification = (message) => {
        const last_closed_time = (LocalStore.get('status_notification_close_time') || 0);
        const time_difference = Math.abs(Date.now() - last_closed_time);
        const required_period = 30 * 60 * 1000;

        if (time_difference > required_period || message !== LocalStore.get('status_notification_message')) {
            const $status_message_text = $('#status_notification_text');
            const $close_icon = $('#status_notification_close');
            const $status_notification = $('#status_notification');

            $status_notification.css('display', 'flex');
            $status_message_text.html(message);
            $close_icon
                .off('click')
                .on('click', () => {
                    $status_notification.slideUp(200);
                    LocalStore.set('status_notification_close_time', Date.now());
                });
            LocalStore.set('status_notification_message', message);
        }
    };

    return {
        onLoad,
        clearNotification,
        displayNotification,
    };
})();

module.exports = Footer;
