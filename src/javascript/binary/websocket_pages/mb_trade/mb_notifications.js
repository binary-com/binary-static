/*
 * Notifications manages various notification messages
 *
 */

var MBNotifications = (function() {
    'use strict';

    /*
     * options: Object {
     *     text       : {string}  message text to display
     *     uid        : {string}  unique id to prevent duplicating the same message and also used to hide the message
     *     dismissible: {boolean} dismissible messages can be hidden by client
     * }
     */
    var showErrorMessage = function(options) {
        var $note_wrapper = getContainer();
        if (!options.uid || $note_wrapper.find('#' + options.uid).length === 0) {
            var $message = $('<div class="notice-msg center-text' + (options.dismissible ? ' dismissible' : '') + '"' +
                (options.uid ? ' id="' + options.uid + '"' : '') + '>' + options.text +
                    (options.dismissible ? '<div class="notification-dismiss">x</div>' : '') +
                '</div>');
            if (options.dismissible) {
                $message.click(function() { dismissMessage(this); });
            }
            $note_wrapper.prepend($message);
        } else {
            var $current_message = $note_wrapper.find('#' + options.uid + ' .notice-msg');
            if ($current_message.html() !== options.text) $current_message.html(options.text);
        }
        $.scrollTo($note_wrapper, 500, { offset: -5 });
        hideSpinnerShowTrading();
    };

    var hideErrorMessage = function(uid) {
        if (uid) {
            getContainer().find('#' + uid).remove();
        }
    };

    var dismissMessage = function(obj) {
        $(obj).remove();
    };

    var getContainer = function() {
        return $('#notifications_wrapper');
    };

    var hideSpinnerShowTrading = function() {
        $('.barspinner').addClass('invisible');
        $('.mb-trading-wrapper').removeClass('invisible');
    };

    return {
        show: showErrorMessage,
        hide: hideErrorMessage,

        hideSpinnerShowTrading: hideSpinnerShowTrading,
    };
})();

module.exports = {
    MBNotifications: MBNotifications,
};
