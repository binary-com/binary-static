var VerifyEmail = require('../websocket_pages/user/verify_email').VerifyEmail;
var Client = require('../base/client').Client;

var Home = (function() {
    var init = function() {
        if (!Client.redirect_if_login()) {
            check_login_hide_signup();
            VerifyEmail();
        }
    };
    var check_login_hide_signup = function() {
        if (Client.get_value('is_logged_in')) {
            $('#verify-email-form').remove();
            $('.break').attr('style', 'margin-bottom:1em');
        }
    };
    return {
        init: init,
    };
})();

module.exports = {
    Home: Home,
};
