var CashierJP = (function() {
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
        $('.err-msg').remove();
        if (!/^([1-9][0-9]{0,5}|1000000)$/.test($('#id123-control22598145').val())) {
            $('#id123-control22598145').parent().append('<p class="err-msg">' + Content.errorMessage('number_should_between', '¥1 - ¥1,000,000') + '</p>');
            return false;
        }
        return true;
    }
    return {
        set_name_id: set_name_id,
        set_email_id: set_email_id,
        error_handler: error_handler
    };
})();

module.exports = {
    CashierJP: CashierJP,
};
