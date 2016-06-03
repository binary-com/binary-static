var Cashier = (function() {
    "use strict";

    var show_error = function(error) {
      $('.withdraw').parent().addClass('button-disabled')
                             .removeAttr('href');
      $('.notice-msg').html(error)
                      .parent().removeClass('invisible');
    };

    var lock_withdrawal = function(withdrawal_locked) {
      if (withdrawal_locked === 'locked') {
        show_error(text.localize('Withdrawal is locked, please [_1] for more information.')
                       .replace('[_1]', '<a href="' + page.url.url_for('/contact') + '">' +
                                        text.localize('contact us') + '</a>'));
      }
    };

    return {
        lock_withdrawal: lock_withdrawal
    };
}());

pjax_config_page("/cashier", function(){
    return {
        onLoad: function() {
          if (!/\/cashier\.html/.test(window.location.pathname) || !page.client.is_logged_in) {
            return;
          } else if (sessionStorage.getItem('withdrawal_locked') === 'locked') {
            Cashier.lock_withdrawal('locked');
          } else if (!sessionStorage.getItem('withdrawal_locked')) {
            BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"Cashier"}});
          }
        }
    };
});

pjax_config_page("/cashier/payment_methods", function(){
    return {
        onLoad: function() {
          if (!page.client.is_logged_in || page.client.is_virtual()) {
            return;
          } else if (sessionStorage.getItem('withdrawal_locked') === 'locked') {
            Cashier.lock_withdrawal('locked');
          } else if (!sessionStorage.getItem('withdrawal_locked')) {
            BinarySocket.send({"get_account_status": "1", "passthrough":{"dispatch_to":"Cashier"}});
          }
        }
    };
});
