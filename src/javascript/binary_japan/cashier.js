var Content = require('../binary/common_functions/content').Content;
var objectNotEmpty = require('../binary/base/utility').objectNotEmpty;
var localize = require('../binary/base/localize').localize;

var CashierJP = (function() {
    function init(action) {
        if (objectNotEmpty(TUser.get())) {
            var $container = $('#japan_cashier_container');
            if (page.client.is_virtual()) {
                $container.addClass('center-text').removeClass('invisible')
                    .html($('<p/>', { class: 'notice-msg', html: localize('This feature is not relevant to virtual-money accounts.') }));
                return;
            }
            $container.removeClass('invisible');
            if (action === 'deposit') {
                set_name_id();
            } else if (action === 'withdraw') {
                set_email_id();
                Content.populate();
            }
        } else {
            BinarySocket.init({
                onmessage: function(msg) {
                    var response = JSON.parse(msg.data);
                    if (response && response.msg_type === 'authorize') {
                        CashierJP.init(action);
                    }
                },
            });
        }
    }
    function set_name_id() {
        if (/deposit-jp/.test(window.location.pathname)) {
            $('#name_id').text((page.user.loginid || 'JP12345') + ' ' + (page.user.first_name || 'Joe Bloggs'));
        }
    }
    function set_email_id() {
        if (/withdraw-jp/.test(window.location.pathname)) {
            $('#id123-control22598118').val(page.client.loginid);
            $('#id123-control22598060').val(TUser.get().email);
        }
    }
    function error_handler() {
        $('.error-msg').remove();
        var withdrawal_amount = $('#id123-control22598145').val();
        if (!/^([1-9][0-9]{0,5}|1000000)$/.test(withdrawal_amount)) {
            $('#id123-control22598145').parent().append('<p class="error-msg">' + Content.errorMessage('number_should_between', '¥1 - ¥1,000,000') + '</p>');
            return false;
        } else if (parseInt(TUser.get().balance) < withdrawal_amount) {
            $('#id123-control22598145').parent().append('<p class="error-msg">' + localize('Insufficient balance.') + '</p>');
            return false;
        }
        return true;
    }
    return {
        init         : init,
        set_name_id  : set_name_id,
        set_email_id : set_email_id,
        error_handler: error_handler,
    };
})();

module.exports = {
    CashierJP: CashierJP,
};
