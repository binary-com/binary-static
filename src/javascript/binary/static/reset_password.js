pjax_config_page('user/reset_passwordws', function() {
    return {
        onLoad: function() {
            if(page.client.redirect_if_login()) {
                return;
            }
            BinarySocket.init({
                onmessage: ResetPassword.resetPasswordWSHandler
            });
            ResetPassword.init();
        }
    };
});
