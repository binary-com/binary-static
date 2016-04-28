pjax_config_page('user/reset_passwordws', function() {
    return {
        onLoad: function() {
            BinarySocket.init({
                onmessage: ResetPassword.resetPasswordWSHandler
            });
            ResetPassword.init();
        }
    };
});
