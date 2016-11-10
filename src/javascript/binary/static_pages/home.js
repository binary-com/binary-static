var submit_email = require('../websocket_pages/user/verify_email').submit_email;

var Home = (function() {
    var init = function() {
        if (!page.client.redirect_if_login()) {
            check_login_hide_signup();
            submit_email();
        }
    };
    var check_login_hide_signup = function() {
        if (page.client.is_logged_in) {
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
