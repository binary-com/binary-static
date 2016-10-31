var Cashier = (function() {
    "use strict";

    var lock_cashier = function(withdrawal_locked, lock_type) {
      if (withdrawal_locked === 'locked') {
        $.each($('.' + lock_type), function(){
            replace_with_disabled_button($(this).parent());
        });
      }
    };

    var check_locked = function() {
        if (TUser.get().is_virtual || page.client.is_virtual()) return;
        if (page.client_status_detected('cashier_locked')) {
            lock_cashier('locked', 'deposit, .withdraw');
        }
        else if (page.client_status_detected('withdrawal_locked')) {
            lock_cashier('locked', 'withdraw');
        }
        else if (page.client_status_detected('unwelcome')) {
            lock_cashier('locked', 'deposit');
        }
        else if (sessionStorage.getItem('client_status') === null) {
            BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"Cashier"}});
        }
    };

    var check_virtual_top_up = function() {
        if (TUser.get().is_virtual || page.client.is_virtual()) {
            if ((TUser.get().currency !== 'JPY' && TUser.get().balance > 1000) ||
                (TUser.get().currency === 'JPY' && TUser.get().balance > 100000)) {
                replace_with_disabled_button('#VRT_topup_link');
            }
        }
    };

    var replace_with_disabled_button = function(elementToReplace) {
        var $a = $(elementToReplace);
        if ($a.length === 0) return;
        // use replaceWith, to disable previously caught pjax event
        $a.replaceWith($('<a/>', {class: $a.attr('class').replace('pjaxload') + ' button-disabled', html: $a.html()}));
    };

    return {
        check_locked: check_locked,
        check_virtual_top_up: check_virtual_top_up
    };
}());

module.exports = {
    Cashier: Cashier,
};
