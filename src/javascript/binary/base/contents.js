const localize = require('./localize').localize;
const Client   = require('./client').Client;
const Login    = require('./login').Login;

const Contents = (function() {
    const on_load = function() {
        Client.activate_by_client_type();
        update_content_class();
        init_draggable();
    };

    const on_unload = function() {
        const $unbind_later = $('.unbind_later');
        if ($unbind_later.length > 0) {
            $unbind_later.off();
        }
    };

    const update_content_class = function() {
        // This is required for our css to work.
        $('#content').removeClass()
                     .addClass($('#content_class').text());
    };

    const init_draggable = function() {
        $('.draggable').draggable();
    };

    const show_login_if_logout = function(shouldReplacePageContents) {
        const client_is_logged_in = Client.is_logged_in();
        if (!client_is_logged_in && shouldReplacePageContents) {
            $('#content').find(' > .container').addClass('center-text')
                .html($('<p/>', {
                    class: 'notice-msg',
                    html : localize('Please [_1] to view this page',
                        ['<a class="login_link" href="javascript:;">' + localize('login') + '</a>']),
                }));
            $('.login_link').click(function() { Login.redirect_to_login(); });
        }
        return !client_is_logged_in;
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
