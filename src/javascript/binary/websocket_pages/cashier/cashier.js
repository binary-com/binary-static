var Cashier = (function() {
    "use strict";

    var lock_withdrawal = function(withdrawal_locked) {
      if (withdrawal_locked === 'locked') {
        $.each($('.withdraw'), function(){
          $a = $(this).parent();
          // use replaceWith, to disable previously catched pjax event
          $a.replaceWith($('<a/>', {class: $a.attr('class').replace('pjaxload') + ' button-disabled', html: $a.html()}));
        });
        $('.notice-msg').removeClass('invisible').parent().removeClass('invisible');
      }
    };

    var check_withdrawal_locked = function() {
      if (sessionStorage.getItem('withdrawal_locked') === 'locked') {
        Cashier.lock_withdrawal('locked');
      } else if (!sessionStorage.getItem('withdrawal_locked')) {
        BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"Cashier"}});
      }
    };

    return {
        lock_withdrawal: lock_withdrawal,
        check_withdrawal_locked: check_withdrawal_locked
    };
}());

pjax_config_page("/cashier", function(){
    return {
        onLoad: function() {
          if (!/\/cashier\.html/.test(window.location.pathname) || !page.client.is_logged_in) {
            return;
          } else {
            Cashier.check_withdrawal_locked();
          }
        }
    };
});

pjax_config_page("/cashier/payment_methods", function(){
    return {
        onLoad: function() {
          if (!page.client.is_logged_in || page.client.is_virtual()) {
            return;
          } else {
            Cashier.check_withdrawal_locked();
          }
        }
    };
});
