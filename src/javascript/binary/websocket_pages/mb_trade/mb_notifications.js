var MBPrice = require('./mb_price').MBPrice;

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
            $note_wrapper.prepend('<div class="notice-msg center-text' + (options.dismissible ? ' dismissible' : '') + '"' +
                (options.dismissible ? ' onclick="MBNotifications.dismiss(this)"' : '') +
                (options.uid ? ' id="' + options.uid + '"' : '') + '>' + options.text +
                    (options.dismissible ? '<div class="notification-dismiss">x</div>' : '') +
                '</div>');
        }
        $.scrollTo($note_wrapper, 500, {offset: -5});
        MBPrice.hideSpinnerShowTrading();
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

    return {
        show    : showErrorMessage,
        hide    : hideErrorMessage,
        dismiss : dismissMessage,
    };
})();

module.exports = {
    MBNotifications: MBNotifications,
};
