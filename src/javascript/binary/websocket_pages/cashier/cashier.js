var Cashier = (function() {
    "use strict";

    var lock_withdrawal = function(withdrawal_locked) {
      if (withdrawal_locked === 'locked') {
        $.each($('.withdraw'), function(){
          var $a = $(this).parent();
          // use replaceWith, to disable previously catched pjax event
          $a.replaceWith($('<a/>', {class: $a.attr('class').replace('pjaxload') + ' button-disabled', html: $a.html()}));
        });
        $('.notice-msg').removeClass('invisible').parent().removeClass('invisible');
      }
    };

    var check_withdrawal_locked = function() {
      if (TUser.get().is_virtual || page.client.is_virtual()) return;
      if (sessionStorage.getItem('withdrawal_locked') === 'locked') {
        Cashier.lock_withdrawal('locked');
      } else if (!sessionStorage.getItem('withdrawal_locked')) {
        BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"Cashier"}});
      }
    };

    var check_virtual_top_up = function() {
        if (TUser.get().is_virtual || page.client.is_virtual()) {
            if ((TUser.get().residence !== 'jp' && TUser.get().balance < 1000) || (TUser.get().residence === 'jp' && TUser.get().balance < 100000)) {
                $('#VRT_topup_link').removeClass('button-disabled');
            }
        }
    };

    var check_authenticate = function(status) {
        if(status[0] === 'unwelcome'){
            $('#authenticate_button').removeClass('invisible');
        }
    };

    return {
        lock_withdrawal: lock_withdrawal,
        check_withdrawal_locked: check_withdrawal_locked,
        check_virtual_top_up: check_virtual_top_up,
        check_authenticate: check_authenticate
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
            if (japanese_client()) {
                window.location.href = page.url.url_for('/');
            }
            if (!page.client.is_logged_in || page.client.is_virtual()) {
                return;
            } else {
                Cashier.check_withdrawal_locked();
            }
        }
    };
});
