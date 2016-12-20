var localize = require('./localize').localize;
var Client   = require('./client').Client;
var Login    = require('./login').Login;

var Contents = (function() {
    var on_load = function() {
        Client.activate_by_client_type();
        update_content_class();
        init_draggable();
    };

    var on_unload = function() {
        if ($('.unbind_later').length > 0) {
            $('.unbind_later').off();
        }
    };

    var update_content_class = function() {
        // This is required for our css to work.
        $('#content').removeClass();
        $('#content').addClass($('#content_class').html());
    };

    var init_draggable = function() {
        $('.draggable').draggable();
    };

    var show_login_if_logout = function(shouldReplacePageContents) {
        if (!Client.get_value('is_logged_in') && shouldReplacePageContents) {
            $('#content > .container').addClass('center-text')
                .html($('<p/>', {
                    class: 'notice-msg',
                    html : localize('Please [_1] to view this page',
                        ['<a class="login_link" href="javascript:;">' + localize('login') + '</a>']),
                }));
            $('.login_link').click(function() { Login.redirect_to_login(); });
        }
        return !Client.get_value('is_logged_in');
    };

    return {
        on_load  : on_load,
        on_unload: on_unload,

        show_login_if_logout: show_login_if_logout,
    };
})();

module.exports = {
    Contents: Contents,
};
