const Content  = require('../binary/common_functions/content').Content;
const localize = require('../binary/base/localize').localize;
const Client   = require('../binary/base/client').Client;

const CashierJP = (function() {
    function init(action) {
        Content.populate();
        if (Client.get('values_set')) {
            const $container = $('#japan_cashier_container');
            if (Client.get('is_virtual')) {
                $container.addClass('center-text notice-msg').removeClass('invisible')
                .text(Content.localize().featureNotRelevantToVirtual);
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
                    const response = JSON.parse(msg.data);
                    if (response && response.msg_type === 'authorize') {
                        CashierJP.init(action);
                    }
                },
            });
        }
    }
    function set_name_id() {
        if (/deposit-jp/.test(window.location.pathname)) {
            $('#name_id').text((Client.get('loginid') || 'JP12345') + ' ' + (Client.get('first_name') || 'Joe Bloggs'));
        }
    }
    function set_email_id() {
        if (/withdraw-jp/.test(window.location.pathname)) {
            $('#id123-control22598118').val(Client.get('loginid'));
            $('#id123-control22598060').val(Client.get('email'));
        }
    }
    function error_handler() {
        $('.error-msg').remove();
        const $id = $('#id123-control22598145');
        const withdrawal_amount = $id.val();
        if (!/^([1-9][0-9]{0,5}|1000000)$/.test(withdrawal_amount)) {
            $id.parent().append('<p class="error-msg">' + Content.errorMessage('number_should_between', '¥1 - ¥1,000,000') + '</p>');
            return false;
        } else if (parseInt(Client.get('balance')) < withdrawal_amount) {
            $id.parent().append('<p class="error-msg">' + localize('Insufficient balance.') + '</p>');
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
